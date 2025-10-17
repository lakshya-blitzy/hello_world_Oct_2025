const http = require('http');
const net = require('net');

// Test configuration - use different port to avoid conflicts
const TEST_PORT = 3001;
const TEST_HOST = '127.0.0.1';

// Track test results
let testsPassed = 0;
let testsFailed = 0;

console.log('Starting server.js test suite...\n');

// Helper function to make HTTP requests
function makeRequest(options, callback) {
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      callback(null, {
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      });
    });
  });
  
  req.on('error', (err) => {
    callback(err);
  });
  
  return req;
}

// Helper function to make raw socket requests
function makeRawRequest(data, callback) {
  const socket = new net.Socket();
  let response = '';
  
  socket.connect(TEST_PORT, TEST_HOST, () => {
    socket.write(data);
  });
  
  socket.on('data', (chunk) => {
    response += chunk.toString();
  });
  
  socket.on('close', () => {
    callback(null, response);
  });
  
  socket.on('error', (err) => {
    callback(err, response);
  });
  
  // Add timeout to prevent hanging
  setTimeout(() => {
    socket.destroy();
    if (response) {
      callback(null, response);
    } else {
      callback(new Error('Socket timeout'));
    }
  }, 2000);
}

// Start server for testing
process.env.PORT = TEST_PORT;
process.env.HOST = TEST_HOST;

// Load the server module
const server = require('./server.js');

// Wait for server to start
setTimeout(() => {
  runTests();
}, 1000);

function runTests() {
  // Test 1: Normal GET request
  console.log('Test 1: Normal GET request');
  const options1 = {
    hostname: TEST_HOST,
    port: TEST_PORT,
    path: '/',
    method: 'GET'
  };
  
  makeRequest(options1, (err, res) => {
    if (err) {
      console.log(`  ❌ FAILED: ${err.message}`);
      testsFailed++;
      runTest2();
      return;
    }
    
    if (res.statusCode === 200 && res.body === 'Hello, World!\n') {
      console.log('  ✅ PASSED: Status 200, correct response\n');
      testsPassed++;
    } else {
      console.log(`  ❌ FAILED: Expected status 200 with "Hello, World!" but got ${res.statusCode} with "${res.body}"\n`);
      testsFailed++;
    }
    runTest2();
  }).end();
}

function runTest2() {
  // Test 2: Invalid HTTP method (clientError handling)
  console.log('Test 2: Invalid HTTP method (clientError handling)');
  
  // Send a malformed HTTP request with invalid method
  const invalidRequest = 'INVALID / HTTP/1.1\r\nHost: localhost\r\n\r\n';
  
  makeRawRequest(invalidRequest, (err, response) => {
    if (err && err.message === 'Socket timeout') {
      console.log('  ❌ FAILED: Socket timeout - clientError handler may not be working\n');
      testsFailed++;
      runTest3();
      return;
    }
    
    // Check if response contains "400 Bad Request" from clientError handler
    if (response.includes('400 Bad Request')) {
      console.log('  ✅ PASSED: clientError handler properly handled invalid method\n');
      testsPassed++;
    } else {
      console.log(`  ❌ FAILED: Expected 400 Bad Request response, got: ${response.substring(0, 50)}\n`);
      testsFailed++;
    }
    runTest3();
  });
}

function runTest3() {
  // Test 3: URL too long (2048+ characters)
  console.log('Test 3: URL too long (2048+ characters)');
  
  const longPath = '/' + 'a'.repeat(2100);
  const options3 = {
    hostname: TEST_HOST,
    port: TEST_PORT,
    path: longPath,
    method: 'GET'
  };
  
  makeRequest(options3, (err, res) => {
    if (err) {
      console.log(`  ❌ FAILED: ${err.message}\n`);
      testsFailed++;
      runTest4();
      return;
    }
    
    if (res.statusCode === 414 && res.body.includes('URI Too Long')) {
      console.log('  ✅ PASSED: Status 414 URI Too Long\n');
      testsPassed++;
    } else {
      console.log(`  ❌ FAILED: Expected status 414 but got ${res.statusCode}\n`);
      testsFailed++;
    }
    runTest4();
  }).end();
}

function runTest4() {
  // Test 4: Path traversal attempt
  console.log('Test 4: Path traversal attempt');
  
  const options4 = {
    hostname: TEST_HOST,
    port: TEST_PORT,
    path: '/../etc/passwd',
    method: 'GET'
  };
  
  makeRequest(options4, (err, res) => {
    if (err) {
      console.log(`  ❌ FAILED: ${err.message}\n`);
      testsFailed++;
      runTest5();
      return;
    }
    
    if (res.statusCode === 400 && res.body.includes('Bad Request')) {
      console.log('  ✅ PASSED: Status 400 Bad Request for path traversal\n');
      testsPassed++;
    } else {
      console.log(`  ❌ FAILED: Expected status 400 but got ${res.statusCode}\n`);
      testsFailed++;
    }
    runTest5();
  }).end();
}

function runTest5() {
  // Test 5: Valid POST request
  console.log('Test 5: Valid POST request');
  
  const options5 = {
    hostname: TEST_HOST,
    port: TEST_PORT,
    path: '/',
    method: 'POST'
  };
  
  makeRequest(options5, (err, res) => {
    if (err) {
      console.log(`  ❌ FAILED: ${err.message}\n`);
      testsFailed++;
      runTest6();
      return;
    }
    
    if (res.statusCode === 200 && res.body === 'Hello, World!\n') {
      console.log('  ✅ PASSED: Status 200 for POST request\n');
      testsPassed++;
    } else {
      console.log(`  ❌ FAILED: Expected status 200 but got ${res.statusCode}\n`);
      testsFailed++;
    }
    runTest6();
  }).end();
}

function runTest6() {
  // Test 6: Valid PUT request
  console.log('Test 6: Valid PUT request');
  
  const options6 = {
    hostname: TEST_HOST,
    port: TEST_PORT,
    path: '/',
    method: 'PUT'
  };
  
  makeRequest(options6, (err, res) => {
    if (err) {
      console.log(`  ❌ FAILED: ${err.message}\n`);
      testsFailed++;
      finishTests();
      return;
    }
    
    if (res.statusCode === 200 && res.body === 'Hello, World!\n') {
      console.log('  ✅ PASSED: Status 200 for PUT request\n');
      testsPassed++;
    } else {
      console.log(`  ❌ FAILED: Expected status 200 but got ${res.statusCode}\n`);
      testsFailed++;
    }
    finishTests();
  }).end();
}

function finishTests() {
  console.log('==================================================');
  console.log(`Tests passed: ${testsPassed}`);
  console.log(`Tests failed: ${testsFailed}`);
  console.log('==================================================\n');
  
  // Close server and exit
  server.close(() => {
    console.log('Test server closed');
    process.exit(testsFailed > 0 ? 1 : 0);
  });
  
  // Force exit after timeout if server doesn't close
  setTimeout(() => {
    console.log('Forcing test exit...');
    process.exit(testsFailed > 0 ? 1 : 0);
  }, 2000);
}
