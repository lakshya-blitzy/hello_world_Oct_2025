/**
 * @fileoverview Simple HTTP server that responds with "Hello, World!" to all requests.
 * This module creates a basic Node.js HTTP server listening on localhost port 3000.
 * It serves as a minimal example of Node.js HTTP server implementation and is used
 * for backprop integration testing.
 * 
 * @author hxu
 * @version 1.0.0
 * @requires http
 */

const http = require('http');

/**
 * Server hostname binding address. The server will listen on this IP address.
 * Using '127.0.0.1' binds to localhost IPv4, making the server accessible only
 * from the local machine. For production, consider '0.0.0.0' to accept external connections.
 * 
 * @constant {string}
 * @default
 */
const hostname = '127.0.0.1';

/**
 * Server port number for HTTP connections. The server will listen on this port.
 * Port 3000 is commonly used for Node.js development servers. Can be overridden
 * using the PORT environment variable for deployment flexibility.
 * 
 * @constant {number}
 * @default
 */
const port = 3000;

/**
 * HTTP request handler callback function. Processes all incoming HTTP requests
 * and sends a plain text "Hello, World!" response. This handler ignores the
 * request method and path, responding identically to all requests.
 * 
 * @function requestHandler
 * @param {http.IncomingMessage} req - The HTTP request object containing request details
 * @param {http.ServerResponse} res - The HTTP response object used to send the response
 * @returns {void}
 * 
 * @example
 * // Responds to any HTTP request with:
 * // Status: 200 OK
 * // Content-Type: text/plain
 * // Body: Hello, World!
 */
function requestHandler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
}

/**
 * Creates and returns an HTTP server instance with the request handler.
 * 
 * @function createServer
 * @returns {http.Server} HTTP server instance
 */
function createServerInstance() {
  return http.createServer(requestHandler);
}

// Export for testing
module.exports = {
  hostname,
  port,
  requestHandler,
  createServer: createServerInstance
};

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  const server = createServerInstance();
  
  /**
   * Server startup callback function. Executed once the server successfully starts
   * listening on the specified hostname and port. Logs a confirmation message to
   * the console indicating the server is ready to accept connections.
   * 
   * @callback serverStartCallback
   * @returns {void}
   */
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}
