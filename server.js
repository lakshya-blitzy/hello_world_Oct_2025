const http = require('http');

// FIX #5: Use environment variables for configuration with fallback defaults
// This enables deployment flexibility and follows 12-factor app methodology
const hostname = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

// FIX #3: Extract request handler to separate function for better error handling
// This enables wrapping in try-catch and comprehensive input validation
const requestHandler = (req, res) => {
  try {
    // FIX #3: Input validation - Check for valid HTTP method to prevent invalid method attacks
    // HTTP RFC 7231 defines standard methods; rejecting others prevents potential exploits
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    if (!validMethods.includes(req.method)) {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Method Not Allowed\n');
      return;
    }

    // FIX #3: Input validation - Check for excessively long URLs to prevent DoS attacks
    // HTTP RFC 2616 recommends servers support URLs up to 2048 characters
    if (req.url && req.url.length > 2048) {
      res.statusCode = 414;
      res.setHeader('Content-Type', 'text/plain');
      res.end('URI Too Long\n');
      return;
    }

    // FIX #3: Input validation - Reject requests with path traversal patterns for security
    // Path traversal attacks use ../ or ..\ to access files outside intended directory
    if (req.url && (req.url.includes('../') || req.url.includes('..\\') )) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad Request: Invalid URL pattern\n');
      return;
    }

    // Normal request processing - unchanged functionality
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  } catch (error) {
    // FIX #1: Error handling - Catch any unexpected errors in request processing
    // Prevents process crash from runtime exceptions
    console.error('Error processing request:', error.message);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Internal Server Error\n');
    }
  }
};

// Create server with error-handling request handler
const server = http.createServer(requestHandler);

// FIX #1: Error handling - Listen for server-level errors (EADDRINUSE, EACCES, etc.)
// These errors occur during server.listen() and would crash process without handler
server.on('error', (error) => {
  console.error('Server error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  } else if (error.code === 'EACCES') {
    console.error(`Permission denied to bind to port ${port}`);
    process.exit(1);
  } else {
    console.error('Unexpected server error, exiting...');
    process.exit(1);
  }
});

// FIX #4: Resource cleanup - Listen for client connection errors
// Properly close sockets on malformed requests to prevent resource leaks
server.on('clientError', (err, socket) => {
  console.error('Client error:', err.message);
  // Only write to socket if it's still writable and not destroyed
  if (socket.writable && !socket.destroyed) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }
});

// FIX #2: Graceful shutdown - Handle SIGTERM signal from container orchestration
// SIGTERM is sent by Docker/Kubernetes before killing container
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    // FIX #4: Resource cleanup - Place for closing database connections, file handles, etc.
    process.exit(0);
  });

  // Force shutdown after timeout if graceful shutdown takes too long
  // Prevents hanging indefinitely on stuck connections
  setTimeout(() => {
    console.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, 10000); // 10 second timeout
});

// FIX #2: Graceful shutdown - Handle SIGINT signal from user (Ctrl+C)
// Ensures proper cleanup when manually stopping server
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    // FIX #4: Resource cleanup - Close any open resources here
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, 10000);
});

// FIX #1: Error handling - Handle uncaught exceptions
// Catches runtime errors that escape try-catch blocks
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Perform cleanup and exit gracefully
  server.close(() => {
    console.error('Server closed due to uncaught exception');
    process.exit(1);
  });
  // Force exit if server doesn't close in time
  setTimeout(() => process.exit(1), 5000);
});

// FIX #1: Error handling - Handle unhandled promise rejections
// Catches promise rejections without .catch() handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  // In production, you might want to close the server
  // For now, we just log the error
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Export server for testing purposes
// Enables programmatic control and automated testing
module.exports = server;
