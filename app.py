"""
Simple HTTP server that responds with "Hello, World!" to all requests.
This module creates a basic Flask HTTP server listening on localhost port 3000.
It serves as a minimal example of Python Flask server implementation and provides
functionality identical to the Node.js server.js implementation.

Author: hxu
Version: 1.0.0
Requires: Flask
"""

from flask import Flask, Response

# Server hostname binding address. The server will listen on this IP address.
# Using '127.0.0.1' binds to localhost IPv4, making the server accessible only
# from the local machine. For production, consider '0.0.0.0' to accept external connections.
HOSTNAME = '127.0.0.1'

# Server port number for HTTP connections. The server will listen on this port.
# Port 3000 is commonly used for development servers. Can be overridden
# using the PORT environment variable for deployment flexibility.
PORT = 3000

# Create Flask application instance
app = Flask(__name__)


@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])
def hello_world(path=''):
    """
    HTTP request handler function. Processes all incoming HTTP requests
    and sends a plain text "Hello, World!" response. This handler ignores the
    request method and path, responding identically to all requests.
    
    Args:
        path (str): The request path (ignored, all paths get same response)
    
    Returns:
        Response: Flask Response object with status 200, text/plain content type,
                  and body "Hello, World!\\n"
    
    Example:
        Responds to any HTTP request with:
        Status: 200 OK
        Content-Type: text/plain
        Body: Hello, World!
    """
    return Response(
        'Hello, World!\n',
        status=200,
        mimetype='text/plain'
    )


if __name__ == '__main__':
    """
    Server startup entry point. Executed when the script is run directly.
    Starts the Flask development server on the specified hostname and port.
    Prints a confirmation message to the console indicating the server is
    ready to accept connections.
    """
    print(f'Server running at http://{HOSTNAME}:{PORT}/')
    # Run Flask server with exact same behavior as Node.js version
    # use_reloader=False prevents double startup message
    # threaded=True allows concurrent requests
    app.run(host=HOSTNAME, port=PORT, debug=False, use_reloader=False, threaded=True)
