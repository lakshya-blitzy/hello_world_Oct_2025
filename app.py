"""
Simple HTTP server that responds with "Hello, World!" to all requests.

This module creates a basic Flask HTTP server listening on localhost port 3000.
It serves as a minimal example of Flask HTTP server implementation and is used
for backprop integration testing.

Author: hxu
Version: 1.0.0
Requires: Flask, Werkzeug
"""

from flask import Flask, Response
import os

# Server hostname binding address. The server will listen on this IP address.
# Using '127.0.0.1' binds to localhost IPv4, making the server accessible only
# from the local machine. For production, consider '0.0.0.0' to accept external connections.
HOSTNAME = os.getenv('HOST', '127.0.0.1')

# Server port number for HTTP connections. The server will listen on this port.
# Port 3000 is commonly used for development servers. Can be overridden
# using the PORT environment variable for deployment flexibility.
PORT = int(os.getenv('PORT', 3000))

# Create Flask application instance
app = Flask(__name__)


@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
def hello_world(path):
    """
    HTTP request handler function. Processes all incoming HTTP requests
    and sends a plain text "Hello, World!" response. This handler ignores the
    request method and path, responding identically to all requests.

    Args:
        path (str): The URL path from the request (ignored in processing)

    Returns:
        Response: Flask Response object with status 200, Content-Type text/plain,
                 and body "Hello, World!\\n"

    Example:
        Responds to any HTTP request with:
        Status: 200 OK
        Content-Type: text/plain
        Body: Hello, World!
    """
    return Response('Hello, World!\n', status=200, mimetype='text/plain')


if __name__ == '__main__':
    # Print startup message matching Node.js format for behavioral consistency
    print(f'Server running at http://{HOSTNAME}:{PORT}/')
    # Run Flask development server on configured host and port
    app.run(host=HOSTNAME, port=PORT, debug=True)
