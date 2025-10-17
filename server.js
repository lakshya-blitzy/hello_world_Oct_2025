/**
 * @fileoverview Minimal HTTP server that responds with "Hello, World!" to all requests.
 * This module creates a simple HTTP server using Node.js built-in http module. The server
 * binds to localhost (127.0.0.1) on port 3000 and responds to all incoming HTTP requests
 * with a plain text "Hello, World!" message.
 * 
 * @module server
 * @requires http
 * @author Blitzy Platform
 * @version 1.0.0
 * 
 * @example
 * // Start the server
 * node server.js
 * // Server will output: Server running at http://127.0.0.1:3000/
 * // Access via browser or curl: curl http://127.0.0.1:3000
 */

const http = require('http');

/**
 * Hostname for the HTTP server binding.
 * 
 * Set to '127.0.0.1' (localhost/loopback interface) for security, which means the server
 * only accepts connections from the local machine. This prevents external network access
 * and is suitable for local development and testing.
 * 
 * Security Implications:
 * - Loopback-only binding: Server is NOT accessible from other machines on the network
 * - Protection against unauthorized external access during development
 * - Ideal for development environments and local testing scenarios
 * 
 * Production Considerations:
 * - For production deployments requiring network access, change to '0.0.0.0' to bind to all network interfaces
 * - Consider using environment variables: process.env.HOST || '127.0.0.1'
 * - Ensure proper firewall and security configurations when exposing to networks
 * 
 * @constant {string}
 * @default '127.0.0.1'
 */
const hostname = '127.0.0.1';

/**
 * TCP port number for the HTTP server to listen on.
 * 
 * Port 3000 is commonly used for Node.js development servers as it:
 * - Falls in the user port range (1024-49151), avoiding privilege requirements
 * - Is high enough to avoid conflicts with system services
 * - Is a conventional choice in Node.js community and tutorials
 * - Does not require administrator/root privileges to bind
 * 
 * Customization Options:
 * - Change this value directly to use a different port
 * - Use environment variables: process.env.PORT || 3000
 * - Common alternatives: 8000, 8080, 5000
 * 
 * Port Conflict Resolution:
 * - If port 3000 is already in use, the server will fail to start with EADDRINUSE error
 * - Solution: Change to an available port or stop the conflicting process
 * - Check port availability: lsof -i :3000 (Unix) or netstat -ano | findstr :3000 (Windows)
 * 
 * @constant {number}
 * @default 3000
 */
const port = 3000;

/**
 * HTTP request handler callback that processes all incoming requests.
 * 
 * This callback function is invoked by the HTTP server for every incoming request,
 * regardless of the HTTP method (GET, POST, PUT, etc.) or URL path. It implements
 * a simple response pattern that always returns the same "Hello, World!" message.
 * 
 * Request Processing Flow:
 * 1. Server receives incoming HTTP request and invokes this callback
 * 2. Sets HTTP status code to 200 (OK) indicating successful request processing
 * 3. Configures Content-Type header as 'text/plain' to specify response format
 * 4. Sends response body "Hello, World!\n" to the client
 * 5. Terminates the connection with res.end()
 * 
 * Response Details:
 * - Status Code: 200 (OK) - Standard success response
 * - Content-Type: text/plain - Indicates plain text response (not HTML, JSON, etc.)
 * - Body: "Hello, World!\n" - Simple greeting message with newline
 * 
 * @callback RequestHandler
 * @param {http.IncomingMessage} req - The incoming HTTP request object containing request 
 *                                      method, URL, headers, and body. Not used in this 
 *                                      simple implementation but available for routing and 
 *                                      request processing.
 * @param {http.ServerResponse} res - The HTTP response object used to send status code, 
 *                                     headers, and response body back to the client.
 * @returns {void} This callback does not return a value; it communicates with the client 
 *                 through the response object's methods.
 */
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

/**
 * Server startup callback that executes when the server successfully starts listening.
 * 
 * This callback is invoked once the HTTP server has successfully bound to the specified
 * hostname and port and is ready to accept incoming connections. It provides confirmation
 * to the developer that the server started correctly and displays the full URL for accessing
 * the server.
 * 
 * Execution Context:
 * - Called asynchronously after server.listen() successfully binds to the port
 * - Only executes if no errors occur during server startup (e.g., port already in use)
 * - Runs once during server initialization, not for each request
 * 
 * Console Output Purpose:
 * - Confirms server is running and ready to accept connections
 * - Provides the exact URL (http://127.0.0.1:3000/) for testing and access
 * - Helpful for development workflow and debugging
 * 
 * @callback ServerStartCallback
 * @returns {void} This callback does not return a value; it performs a side effect 
 *                 (console logging) to notify the developer of successful server startup.
 */
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
