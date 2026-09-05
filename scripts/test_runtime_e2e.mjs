import http from 'http';

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
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
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

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING LOCAL EXPRESS RUNTIME END-TO-END VERIFICATION');
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

  try {
    // 1. Health check test
    console.log('TEST 1: Runtime Server Health Check');
    const health = await fetchUrl('http://localhost:5000/health');
    assert(health.status === 200, `Health check returned HTTP 200`);
    const healthBody = JSON.parse(health.body);
    assert(healthBody.status === 'ok', `Health status is "ok"`);

    // 2. RE-Sensor IQ HTML serving test
    console.log('\nTEST 2: RE-Sensor IQ Real Project HTML Serving');
    const htmlRes = await fetchUrl('http://localhost:5000/runtime/re-sensor-iq/landing/index.html');
    assert(htmlRes.status === 200, `GET /runtime/re-sensor-iq/landing/index.html returned HTTP 200`);
    assert(htmlRes.headers['content-type']?.includes('text/html'), `Content-Type is text/html (received: ${htmlRes.headers['content-type']})`);
    assert(htmlRes.body.includes('RE-Sensor IQ'), `Body contains "RE-Sensor IQ"`);
    assert(htmlRes.body.includes('waveform-canvas'), `Body contains telemetry canvas element`);

    // 3. RE-Sensor IQ CSS asset test
    console.log('\nTEST 3: Static Asset Serving (CSS)');
    const cssRes = await fetchUrl('http://localhost:5000/runtime/re-sensor-iq/landing/css/style.css');
    assert(cssRes.status === 200, `GET /runtime/re-sensor-iq/landing/css/style.css returned HTTP 200`);
    assert(cssRes.headers['content-type']?.includes('text/css'), `Content-Type is text/css (received: ${cssRes.headers['content-type']})`);
    assert(cssRes.body.includes('dashboard-container'), `CSS contains dashboard layout classes`);

    // 4. RE-Sensor IQ JS asset test
    console.log('\nTEST 4: Static Asset Serving (JavaScript)');
    const jsRes = await fetchUrl('http://localhost:5000/runtime/re-sensor-iq/landing/js/app.js');
    assert(jsRes.status === 200, `GET /runtime/re-sensor-iq/landing/js/app.js returned HTTP 200`);
    assert(jsRes.headers['content-type']?.includes('application/javascript'), `Content-Type is application/javascript (received: ${jsRes.headers['content-type']})`);
    assert(jsRes.body.includes('waveform-canvas'), `JS contains telemetry animation script`);

    // 5. Path traversal security test
    console.log('\nTEST 5: Path Traversal Attack Mitigation');
    const traversal1 = await fetchUrl('http://localhost:5000/runtime/re-sensor-iq/../../package.json');
    assert(traversal1.status === 403 || traversal1.status === 404, `Traversal ../../package.json blocked with status ${traversal1.status}`);

    const traversal2 = await fetchUrl('http://localhost:5000/runtime/re-sensor-iq/..%2F..%2Fpackage.json');
    assert(traversal2.status === 403 || traversal2.status === 404, `Encoded traversal ..%2F..%2F blocked with status ${traversal2.status}`);

    // 6. Non-existent project 404 test
    console.log('\nTEST 6: Non-Existent Project / Missing File Handling');
    const missingProj = await fetchUrl('http://localhost:5000/runtime/non-existent-proj/index.html');
    assert(missingProj.status === 404, `Missing project returned HTTP 404`);

    const missingFile = await fetchUrl('http://localhost:5000/runtime/re-sensor-iq/landing/non_existent.js');
    assert(missingFile.status === 404, `Missing file returned HTTP 404`);

    // 7. Dynamic project sync API test
    console.log('\nTEST 7: Dynamic Project Sync & Lifecycle API');
    const syncRes = await fetchUrl('http://localhost:5000/api/runtime/sync/temp-e2e-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: {
          'index.html': '<!DOCTYPE html><html><body><h1>Dynamic E2E Test App</h1></body></html>',
          'assets/app.json': '{"test": true, "version": "1.0.0"}',
        }
      })
    });
    assert(syncRes.status === 200, `POST /api/runtime/sync/temp-e2e-test returned HTTP 200`);

    const tempApp = await fetchUrl('http://localhost:5000/runtime/temp-e2e-test/index.html');
    assert(tempApp.status === 200, `GET /runtime/temp-e2e-test/index.html returned HTTP 200`);
    assert(tempApp.body.includes('Dynamic E2E Test App'), `Dynamic app HTML rendered accurately`);

    // Cleanup dynamic test project
    const delRes = await fetchUrl('http://localhost:5000/api/runtime/temp-e2e-test', { method: 'DELETE' });
    assert(delRes.status === 200, `DELETE /api/runtime/temp-e2e-test returned HTTP 200`);

    const afterDel = await fetchUrl('http://localhost:5000/runtime/temp-e2e-test/index.html');
    assert(afterDel.status === 404, `Deleted project correctly returns HTTP 404`);

    // 8. Project isolation test
    console.log('\nTEST 8: Project Isolation Verification');
    const isoTest = await fetchUrl('http://localhost:5000/runtime/quadruped-dynamic-robot/landing/index.html');
    assert(isoTest.status === 404, `quadruped-dynamic-robot does not share re-sensor-iq's landing/ path`);

    console.log('\n====================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

runTests();
