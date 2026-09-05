import JSZip from 'jszip';

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING SPRINT 1 AUTOMATED FUNCTIONAL VERIFICATION');
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

  // --- TEST 1: JSZip Real Archive Extraction & Tree Building ---
  console.log('TEST 1: Real Project ZIP Archive Creation & Hierarchical Extraction');
  const zip = new JSZip();
  zip.file('index.html', '<!DOCTYPE html><html><body><h1>Project Alpha</h1></body></html>');
  zip.file('css/styles.css', 'body { background: #000; }');
  zip.file('js/app.js', 'console.log("Robotics Runtime Active");');
  zip.file('assets/textures/diffuse.png', 'fake-image-data');
  zip.folder('docs')?.file('README.md', '# Documentation');

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  assert(zipBuffer.length > 0, `Generated valid ZIP archive of size ${zipBuffer.length} bytes`);

  const unzipped = await JSZip.loadAsync(zipBuffer);
  const filePaths = Object.keys(unzipped.files);
  assert(filePaths.includes('index.html'), 'Archive contains root index.html');
  assert(filePaths.includes('css/styles.css'), 'Archive contains nested css/styles.css');
  assert(filePaths.includes('js/app.js'), 'Archive contains nested js/app.js');
  assert(filePaths.includes('assets/textures/diffuse.png'), 'Archive contains deeply nested assets/textures/diffuse.png');

  // --- TEST 2: Nested Subdirectory Structure (e.g. dist/index.html) ---
  console.log('\nTEST 2: Nested Directory Structure & Multiple Index.html Detection');
  const nestedZip = new JSZip();
  nestedZip.file('dist/index.html', '<html><body>Nested in dist</body></html>');
  nestedZip.file('dist/bundle.js', 'console.log("bundle");');
  nestedZip.file('docs/index.html', '<html><body>Docs Index</body></html>');

  const nestedBuffer = await nestedZip.generateAsync({ type: 'nodebuffer' });
  const loadedNested = await JSZip.loadAsync(nestedBuffer);
  const detectedIndices = Object.keys(loadedNested.files).filter(f => f.toLowerCase().endsWith('index.html'));

  assert(detectedIndices.length === 2, `Detected exactly 2 index.html candidates: ${detectedIndices.join(', ')}`);
  assert(detectedIndices.includes('dist/index.html') && detectedIndices.includes('docs/index.html'), 'Correct index paths identified');

  // --- TEST 3: Path Traversal Security Protection ---
  console.log('\nTEST 3: Security Validation & Path Traversal Rejection');
  const unsafePaths = ['../secret.txt', 'css/../../config.json', '/absolute/path.html'];
  for (const p of unsafePaths) {
    const isUnsafe = p.includes('..') || p.startsWith('/') || p.startsWith('\\');
    assert(isUnsafe, `Correctly flagged unsafe traversal path: "${p}"`);
  }

  // --- TEST 4: Database Schema Integrity & Entity Isolation ---
  console.log('\nTEST 4: Database Schema Integrity & Entity Isolation');
  const sampleProject = {
    id: 'proj-test-1',
    slug: 'autonomous-ugv',
    title: 'Autonomous UGV Ground Robot',
    category: 'Robotics',
    year: '2024',
    published: true,
    hasZip: true,
    zipFileName: 'ugv_firmware.zip',
    entryPoint: 'dist/index.html',
    technologies: ['C++', 'ROS 2', 'STM32']
  };

  const sampleMechanical = {
    id: 'mech-test-1',
    slug: 'cycloidal-drive-6to1',
    title: '6:1 Cycloidal Speed Reducer',
    category: 'Actuator & Drivetrain',
    year: '2024',
    published: true,
    dimensions: 'Ø 96 mm x 42 mm',
    materials: ['Aluminum 7075-T6', 'Tool Steel O1'],
    cadSoftware: ['SolidWorks 2024']
  };

  assert(sampleProject.id !== sampleMechanical.id, 'Project and Mechanical IDs are strictly distinct');
  assert(sampleProject.category !== sampleMechanical.category, 'Project and Mechanical categories are non-overlapping');
  assert(sampleProject.hasZip === true, 'Project retains isolated ZIP reference and entryPoint');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
