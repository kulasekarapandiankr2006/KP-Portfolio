import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => { chunks.push(chunk); });
      res.on('end', () => {
        const fullBuffer = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: fullBuffer.toString('utf8'),
          rawBuffer: fullBuffer,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runLargeFilesAndScanTests() {
  console.log('====================================================');
  console.log('RUNNING DISK SCANNER & LARGE .EXE STREAMING TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const testSlug = 'e2e-large-disk-app';
  const testProjectDir = path.resolve(__dirname, '..', 'server', 'data', 'storage', 'projects', testSlug, 'extracted');

  try {
    // 1. Setup sample heavy directory on disk
    console.log('TEST 1: Creating on-disk directory with landing page and .EXE binary');
    const landingDir = path.join(testProjectDir, 'landing');
    const downloadsDir = path.join(landingDir, 'downloads');
    fs.mkdirSync(downloadsDir, { recursive: true });

    // Create landing/index.html
    fs.writeFileSync(
      path.join(landingDir, 'index.html'),
      '<!DOCTYPE html><html><body><h1>Desktop App Landing</h1><a href="./downloads/setup.exe">Download EXE</a></body></html>'
    );

    // Create a 10MB test .EXE file
    const exeSize = 10 * 1024 * 1024; // 10MB
    const exeBuffer = Buffer.alloc(exeSize);
    exeBuffer.write('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF', 0);
    exeBuffer.write('E2E-TEST-EXECUTABLE-DATA-CHUNK', 500);
    fs.writeFileSync(path.join(downloadsDir, 'setup.exe'), exeBuffer);

    assert(fs.existsSync(path.join(downloadsDir, 'setup.exe')), `10MB .EXE binary created on disk (${exeSize} bytes)`);

    // 2. Test GET /api/runtime/scan/:projectSlug
    console.log('\nTEST 2: On-Disk Directory Scanner API');
    const scanRes = await fetchUrl(`http://localhost:5000/api/runtime/scan/${testSlug}`);
    assert(scanRes.status === 200, `GET /api/runtime/scan/${testSlug} returned HTTP 200`);
    
    const scanData = JSON.parse(scanRes.body);
    assert(scanData.exists === true, `Scanner returned exists: true`);
    assert(scanData.detectedIndexFiles.includes('landing/index.html'), `Scanner detected "landing/index.html"`);
    assert(scanData.recommendedEntryPoint === 'landing/index.html', `Recommended entry point is "landing/index.html"`);
    assert(scanData.totalFiles === 2, `Detected 2 files total on disk`);
    assert(scanData.totalSize >= exeSize, `Total size includes 10MB .exe (${scanData.totalSize} bytes)`);

    // 3. Test Full .EXE Download Streaming (HTTP 200)
    console.log('\nTEST 3: Full .EXE Binary Download Streaming');
    const exeRes = await fetchUrl(`http://localhost:5000/runtime/${testSlug}/landing/downloads/setup.exe`);
    assert(exeRes.status === 200, `GET setup.exe returned HTTP 200`);
    assert(exeRes.headers['content-type'] === 'application/x-msdownload', `Content-Type is application/x-msdownload`);
    assert(Number(exeRes.headers['content-length']) === exeSize, `Content-Length matches 10MB (${exeRes.headers['content-length']})`);
    assert(exeRes.headers['accept-ranges'] === 'bytes', `Accept-Ranges header is bytes`);
    assert(exeRes.rawBuffer.length === exeSize, `Received full binary buffer of ${exeRes.rawBuffer.length} bytes`);

    // 4. Test Partial Content / Resumable Download with Range Header (HTTP 206)
    console.log('\nTEST 4: Resumable .EXE Download with Range Header (HTTP 206)');
    const rangeRes = await fetchUrl(`http://localhost:5000/runtime/${testSlug}/landing/downloads/setup.exe`, {
      headers: { 'Range': 'bytes=0-1023' }
    });
    assert(rangeRes.status === 206, `Range request returned HTTP 206 Partial Content`);
    assert(rangeRes.headers['content-range'] === `bytes 0-1023/${exeSize}`, `Content-Range header is bytes 0-1023/${exeSize}`);
    assert(Number(rangeRes.headers['content-length']) === 1024, `Chunk length is exactly 1024 bytes`);
    assert(rangeRes.rawBuffer.length === 1024, `Received exactly 1024 bytes`);

    // 5. Test RE-Sensor IQ Seeded .EXE Download
    console.log('\nTEST 5: RE-Sensor IQ Seeded .EXE Application Download');
    const reSensorExe = await fetchUrl('http://localhost:5000/runtime/re-sensor-iq/landing/downloads/RE-Sensor-IQ-Desktop-Setup-v2.4.exe');
    assert(reSensorExe.status === 200, `RE-Sensor IQ .EXE installer returned HTTP 200`);
    assert(reSensorExe.headers['content-type'] === 'application/x-msdownload', `Content-Type is application/x-msdownload`);
    assert(reSensorExe.rawBuffer.length > 1000000, `Received real desktop app binary (${reSensorExe.rawBuffer.length} bytes)`);

    // 6. Cleanup test directory
    fs.rmSync(path.resolve(__dirname, '..', 'server', 'data', 'storage', 'projects', testSlug), { recursive: true, force: true });
    assert(!fs.existsSync(testProjectDir), `Temporary test project cleaned up from disk`);

    console.log('\n====================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runLargeFilesAndScanTests();
