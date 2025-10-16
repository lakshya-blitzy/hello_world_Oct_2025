/**
 * @fileOverview Minimal HTTP server for backprop integration testing
 * 
 * This module implements a simple HTTP server using Node.js built-in modules.
 * It serves as a test project for backprop integration, providing a basic
 * endpoint that responds with "Hello, World!" to all incoming requests.
 * 
 * Design Philosophy:
 * - Uses only Node.js built-in modules (no external dependencies)
 * - Single-file architecture for simplicity and portability
 * - Responds to all HTTP methods and paths uniformly
 * - Suitable for smoke testing, health checks, and integration verification
 * 
 * @author hxu
 * @requires http - Node.js built-in HTTP module for creating HTTP server
 */

// Use Node.js built-in 'http' module instead of frameworks like Express
// This keeps the server minimal, lightweight, and dependency-free
const http = require('http');

/**
 * Server hostname/IP address for binding
 * 
 * @constant {string}
 * @default '127.0.0.1'
 * 
 * Using '127.0.0.1' (loopback address) ensures the server only accepts
 * connections from the local machine, providing security by preventing
 * external network access. For network-accessible servers, use '0.0.0.0'
 * to bind to all available network interfaces.
 * 
 * Customization: Override with process.env.HOST environment variable
 */
const hostname = '127.0.0.1';

/**
 * Server port number for listening
 * 
 * @constant {number}
 * @default 3000
 * 
 * Port 3000 is a common choice for Node.js development servers.
 * Valid port range: 1-65535 (ports below 1024 require elevated privileges)
 * 
 * Customization: Override with process.env.PORT environment variable
 */
const port = 3000;

/**
 * HTTP server instance
 * 
 * Creates an HTTP server that handles all incoming requests with a simple
 * request handler function. The server responds to ALL HTTP methods (GET,
 * POST, PUT, DELETE, etc.) and ALL URL paths with the same response.
 * 
 * Request Handler:
 * @callback requestHandler
 * @param {http.IncomingMessage} req - Incoming HTTP request object containing:
 *   - req.method: HTTP method (GET, POST, etc.)
 *   - req.url: Request URL path
 *   - req.headers: Request headers object
 * @param {http.ServerResponse} res - HTTP response object for sending responses:
 *   - res.statusCode: Set HTTP status code
 *   - res.setHeader(): Set response headers
 *   - res.end(): Send response body and complete the response
 * 
 * Current Behavior:
 * - Accepts all HTTP methods without distinction
 * - Responds to all URL paths identically
 * - Ignores request headers, body, and query parameters
 * - Returns fixed "Hello, World!" response with 200 OK status
 */
const server = http.createServer((req, res) => {
  // Set HTTP 200 OK status - indicates successful request processing
  res.statusCode = 200;
  
  // Set Content-Type to text/plain for unformatted text response
  // Browser will display response as plain text, not HTML
  res.setHeader('Content-Type', 'text/plain');
  
  // Send response body "Hello, World!" with newline and end the response
  // res.end() finalizes the response and sends it to the client
  res.end('Hello, World!\n');
});

/**
 * Start the HTTP server and bind to specified hostname and port
 * 
 * The listen() method:
 * 1. Binds the server to the specified hostname (127.0.0.1) and port (3000)
 * 2. Begins listening for incoming HTTP connections
 * 3. Executes the callback function when server successfully starts
 * 4. Keeps the Node.js process running until explicitly terminated (Ctrl+C)
 * 
 * @callback startupHandler
 * @returns {void}
 * 
 * The startup message confirms the server is ready to accept connections
 * and provides the URL for accessing the server.
 */
server.listen(port, hostname, () => {
  // Log confirmation message with full server URL
  // This helps verify the server started successfully and shows how to access it
  console.log(`Server running at http://${hostname}:${port}/`);
});
