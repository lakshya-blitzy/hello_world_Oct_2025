/**
 * @fileoverview Unit tests for server.js HTTP server implementation.
 * Tests all exported functions, constants, and server behavior.
 * 
 * @author hxu
 * @version 1.0.0
 * @requires server
 */

const http = require('http');
const { hostname, port, requestHandler, createServer } = require('./server');

describe('Server Configuration Constants', () => {
  /**
   * Test suite for hostname constant
   */
  describe('hostname', () => {
    test('should be defined', () => {
      expect(hostname).toBeDefined();
    });

    test('should be a string', () => {
      expect(typeof hostname).toBe('string');
    });

    test('should be localhost IP address', () => {
      expect(hostname).toBe('127.0.0.1');
    });

    test('should be a valid IPv4 address format', () => {
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      expect(hostname).toMatch(ipv4Regex);
    });
  });

  /**
   * Test suite for port constant
   */
  describe('port', () => {
    test('should be defined', () => {
      expect(port).toBeDefined();
    });

    test('should be a number', () => {
      expect(typeof port).toBe('number');
    });

    test('should be 3000', () => {
      expect(port).toBe(3000);
    });

    test('should be within valid port range (1-65535)', () => {
      expect(port).toBeGreaterThanOrEqual(1);
      expect(port).toBeLessThanOrEqual(65535);
    });

    test('should be an integer', () => {
      expect(Number.isInteger(port)).toBe(true);
    });
  });
});

describe('Request Handler Function', () => {
  /**
   * Test suite for requestHandler function
   */
  describe('requestHandler', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
      // Create mock request object
      mockReq = {
        method: 'GET',
        url: '/',
        headers: {}
      };

      // Create mock response object with spy methods
      mockRes = {
        statusCode: null,
        headers: {},
        body: '',
        setHeader: jest.fn((key, value) => {
          mockRes.headers[key] = value;
        }),
        end: jest.fn((data) => {
          mockRes.body = data;
        })
      };
    });

    test('should be defined', () => {
      expect(requestHandler).toBeDefined();
    });

    test('should be a function', () => {
      expect(typeof requestHandler).toBe('function');
    });

    test('should accept two parameters', () => {
      expect(requestHandler.length).toBe(2);
    });

    test('should set response status code to 200', () => {
      requestHandler(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
    });

    test('should set Content-Type header to text/plain', () => {
      requestHandler(mockReq, mockRes);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
      expect(mockRes.headers['Content-Type']).toBe('text/plain');
    });

    test('should end response with "Hello, World!\\n"', () => {
      requestHandler(mockReq, mockRes);
      expect(mockRes.end).toHaveBeenCalledWith('Hello, World!\n');
      expect(mockRes.body).toBe('Hello, World!\n');
    });

    test('should call res.end exactly once', () => {
      requestHandler(mockReq, mockRes);
      expect(mockRes.end).toHaveBeenCalledTimes(1);
    });

    test('should handle GET requests', () => {
      mockReq.method = 'GET';
      requestHandler(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toBe('Hello, World!\n');
    });

    test('should handle POST requests identically', () => {
      mockReq.method = 'POST';
      requestHandler(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toBe('Hello, World!\n');
    });

    test('should handle PUT requests identically', () => {
      mockReq.method = 'PUT';
      requestHandler(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toBe('Hello, World!\n');
    });

    test('should handle DELETE requests identically', () => {
      mockReq.method = 'DELETE';
      requestHandler(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toBe('Hello, World!\n');
    });

    test('should ignore request URL path', () => {
      const paths = ['/', '/test', '/api/users', '/invalid'];
      paths.forEach(path => {
        mockReq.url = path;
        // Reset mock response
        mockRes.statusCode = null;
        mockRes.body = '';
        mockRes.setHeader.mockClear();
        mockRes.end.mockClear();
        
        requestHandler(mockReq, mockRes);
        expect(mockRes.statusCode).toBe(200);
        expect(mockRes.body).toBe('Hello, World!\n');
      });
    });

    test('should not throw errors', () => {
      expect(() => requestHandler(mockReq, mockRes)).not.toThrow();
    });
  });
});

describe('Server Creation Function', () => {
  /**
   * Test suite for createServer function
   */
  describe('createServer', () => {
    test('should be defined', () => {
      expect(createServer).toBeDefined();
    });

    test('should be a function', () => {
      expect(typeof createServer).toBe('function');
    });

    test('should return an http.Server instance', () => {
      const server = createServer();
      expect(server).toBeInstanceOf(http.Server);
    });

    test('should create a server with the request handler', () => {
      const server = createServer();
      // Server should have a listener for 'request' event (the request handler)
      expect(server.listeners('request').length).toBeGreaterThan(0);
    });

    test('should create different server instances on each call', () => {
      const server1 = createServer();
      const server2 = createServer();
      expect(server1).not.toBe(server2);
    });
  });
});

describe('Server Integration Tests', () => {
  /**
   * Integration test suite for the complete server functionality
   */
  let server;
  let testPort;

  beforeAll((done) => {
    // Use a different port for testing to avoid conflicts
    testPort = 3001;
    server = createServer();
    server.listen(testPort, '127.0.0.1', done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('should respond to HTTP GET requests', (done) => {
    http.get(`http://127.0.0.1:${testPort}/`, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('text/plain');

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        expect(data).toBe('Hello, World!\n');
        done();
      });
    });
  });

  test('should respond to requests with any path', (done) => {
    http.get(`http://127.0.0.1:${testPort}/test/path`, (res) => {
      expect(res.statusCode).toBe(200);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        expect(data).toBe('Hello, World!\n');
        done();
      });
    });
  });

  test('should handle multiple concurrent requests', async () => {
    const numRequests = 10;
    const requests = [];

    for (let i = 0; i < numRequests; i++) {
      const promise = new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${testPort}/`, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              body: data
            });
          });
        }).on('error', reject);
      });
      requests.push(promise);
    }

    const responses = await Promise.all(requests);
    
    // All requests should succeed with same response
    responses.forEach(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('Hello, World!\n');
    });
  });

  test('should handle POST requests', (done) => {
    const postData = 'test data';
    const options = {
      hostname: '127.0.0.1',
      port: testPort,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      expect(res.statusCode).toBe(200);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        expect(data).toBe('Hello, World!\n');
        done();
      });
    });

    req.on('error', done);
    req.write(postData);
    req.end();
  });
});

describe('Module Exports', () => {
  /**
   * Test suite for module exports
   */
  test('should export hostname', () => {
    const exported = require('./server');
    expect(exported).toHaveProperty('hostname');
  });

  test('should export port', () => {
    const exported = require('./server');
    expect(exported).toHaveProperty('port');
  });

  test('should export requestHandler', () => {
    const exported = require('./server');
    expect(exported).toHaveProperty('requestHandler');
  });

  test('should export createServer', () => {
    const exported = require('./server');
    expect(exported).toHaveProperty('createServer');
  });

  test('should export exactly 4 properties', () => {
    const exported = require('./server');
    expect(Object.keys(exported).length).toBe(4);
  });
});
