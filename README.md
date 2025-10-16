# hao-backprop-test

![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

A minimal HTTP server built with Node.js for backprop integration testing. This project demonstrates a lightweight, zero-dependency web server implementation using only Node.js built-in modules.

## Features

- **Zero Dependencies**: Uses only Node.js built-in `http` module
- **Minimal Footprint**: Single-file implementation (14 lines of code)
- **Simple HTTP Server**: Basic request/response handling
- **Instant Setup**: No external packages required
- **Educational**: Clear, straightforward code perfect for learning
- **Integration Testing**: Designed for backprop system integration validation

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 14.0.0 or higher (tested with v22.20.0)
- **npm**: Comes bundled with Node.js
- **Operating System**: Linux, macOS, or Windows

**Verify Node.js Installation:**

```bash
node --version
npm --version
```

## Installation

1. **Clone the Repository**

```bash
git clone <repository-url>
cd hao-backprop-test
```

2. **Install Dependencies** (Optional - no external dependencies required)

```bash
npm install
```

This command sets up the project but won't install any packages since the project uses only Node.js built-ins.

3. **Verify Installation**

```bash
node server.js
```

You should see: `Server running at http://127.0.0.1:3000/`

## Quick Start

### Starting the Server

**Option 1: Using Node.js directly**

```bash
node server.js
```

**Option 2: Using npm script** (if configured in package.json)

```bash
npm start
```

### Expected Output

```
Server running at http://127.0.0.1:3000/
```

### Testing the Server

**Using curl:**

```bash
curl http://127.0.0.1:3000/
```

**Expected Response:**

```
Hello, World!
```

**Using a Web Browser:**

Open your browser and navigate to `http://127.0.0.1:3000/`

### Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Usage

### Making HTTP Requests

The server responds to all HTTP requests on all paths with the same response.

**GET Request:**

```bash
curl http://127.0.0.1:3000/
# Output: Hello, World!
```

**POST Request:**

```bash
curl -X POST http://127.0.0.1:3000/any-path
# Output: Hello, World!
```

**Testing with Different Paths:**

```bash
curl http://127.0.0.1:3000/test
curl http://127.0.0.1:3000/api/users
curl http://127.0.0.1:3000/some/nested/path
# All return: Hello, World!
```

### Viewing Response Headers

```bash
curl -i http://127.0.0.1:3000/
```

**Expected Output:**

```
HTTP/1.1 200 OK
Content-Type: text/plain
Date: <current-date>
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 14

Hello, World!
```

## API Reference

### Endpoint

**URL:** `http://127.0.0.1:3000/`

**Note:** The server responds to ALL paths (e.g., `/`, `/test`, `/api/data`) with the same response.

### Supported HTTP Methods

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `PATCH`
- `OPTIONS`
- `HEAD`
- All other HTTP methods

**Note:** All methods return the same response. Request bodies, headers (except Host), and query parameters are ignored.

### Request Format

**Headers:** None required (all headers are ignored except Host for routing)

**Body:** Not processed (can send any content, will be ignored)

**Query Parameters:** Not processed (any query params are ignored)

### Response Format

**Status Code:** `200 OK`

**Content-Type:** `text/plain`

**Body:**

```
Hello, World!
```

### Example Requests

**1. Basic GET Request**

```bash
curl http://127.0.0.1:3000/
```

**Response:**

```
Hello, World!
```

**2. POST Request with Body**

```bash
curl -X POST http://127.0.0.1:3000/ \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Response:**

```
Hello, World!
```

**3. Request with Query Parameters**

```bash
curl http://127.0.0.1:3000/?name=test&value=123
```

**Response:**

```
Hello, World!
```

## Configuration

### Default Configuration

The server uses the following default configuration:

- **Hostname:** `127.0.0.1` (loopback/localhost only)
- **Port:** `3000`

### Customizing Configuration

#### Method 1: Environment Variables

You can customize the server's hostname and port using environment variables:

```bash
# Set custom port
PORT=8080 node server.js

# Set custom hostname (to allow network access)
HOST=0.0.0.0 PORT=8080 node server.js
```

**Note:** To use environment variables, modify `server.js` to read from `process.env`:

```javascript
const hostname = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;
```

#### Method 2: Direct Code Modification

Edit `server.js` and change the values:

```javascript
const hostname = '0.0.0.0';  // Listen on all network interfaces
const port = 8080;           // Use port 8080
```

### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `hostname` | `127.0.0.1` | IP address to bind the server. Use `127.0.0.1` for local-only access, `0.0.0.0` for network access |
| `port` | `3000` | Port number (1-65535). Ports below 1024 require elevated privileges |

### Security Considerations

- **Loopback Binding:** By default, the server binds to `127.0.0.1`, making it accessible only from the local machine
- **Network Binding:** Setting hostname to `0.0.0.0` exposes the server to the network - use with caution
- **No Authentication:** This server has no authentication or authorization mechanisms
- **Production Use:** This server is intended for testing only, not production environments

## Architecture

### Design Overview

This project implements a minimal HTTP server using Node.js's built-in `http` module. The design philosophy emphasizes simplicity and clarity over features.

**Design Principles:**

- **Simplicity First**: Single-file implementation with minimal abstraction
- **No External Dependencies**: Uses only Node.js standard library
- **Educational Value**: Code structure optimized for learning and understanding
- **Testing Focus**: Built specifically for backprop integration validation

### Technology Stack

- **Runtime:** Node.js (v14+)
- **HTTP Module:** Node.js built-in `http` module
- **Language:** JavaScript (ES6+)

**Why `http` Module Instead of Express/Fastify/Koa?**

- **Zero Dependencies**: No external packages to install or update
- **Minimal Overhead**: Direct access to HTTP functionality
- **Learning Opportunity**: Understand HTTP fundamentals without framework abstraction
- **Testing Requirements**: Sufficient for integration testing scenarios

### Request Flow

```
1. Client → HTTP Request → Server (port 3000)
2. Server → Request Handler Callback
3. Handler → Set Status Code (200)
4. Handler → Set Content-Type Header (text/plain)
5. Handler → Send Response Body (Hello, World!)
6. Server → Response → Client
```

### Code Structure

The `server.js` file contains four main components:

**1. Module Import**

```javascript
const http = require('http');
```

Imports Node.js's built-in HTTP module.

**2. Configuration Constants**

```javascript
const hostname = '127.0.0.1';
const port = 3000;
```

Defines server binding address and port.

**3. Server Creation with Request Handler**

```javascript
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});
```

Creates an HTTP server with a request handler that:
- Sets HTTP 200 OK status
- Sets Content-Type to text/plain
- Sends "Hello, World!" as response body

**4. Server Initialization**

```javascript
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Starts the server listening on the specified hostname and port.

### Limitations

This minimal server intentionally omits many production features:

- **No Routing**: All paths return the same response
- **No Middleware**: No request processing pipeline
- **No Error Handling**: Errors will crash the server
- **No Request Parsing**: Bodies, query params, and most headers are ignored
- **Single-Threaded**: No clustering or load balancing
- **No Logging**: Only startup message is logged
- **No Security Features**: No HTTPS, authentication, or rate limiting

## Deployment

### Local Development

**Standard Execution:**

```bash
node server.js
```

**With Auto-Reload** (using nodemon):

```bash
# Install nodemon globally or as dev dependency
npm install -g nodemon

# Run with auto-reload
nodemon server.js
```

### Production Deployment

#### Process Management with PM2

**Install PM2:**

```bash
npm install -g pm2
```

**Start Server with PM2:**

```bash
pm2 start server.js --name "backprop-test-server"
```

**PM2 Management Commands:**

```bash
# View running processes
pm2 list

# View logs
pm2 logs backprop-test-server

# Restart server
pm2 restart backprop-test-server

# Stop server
pm2 stop backprop-test-server

# Configure auto-start on boot
pm2 startup
pm2 save
```

#### Using systemd (Linux)

**Create systemd service file:** `/etc/systemd/system/backprop-test.service`

```ini
[Unit]
Description=Backprop Test HTTP Server
After=network.target

[Service]
Type=simple
User=<your-user>
WorkingDirectory=/path/to/hao-backprop-test
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**Enable and start service:**

```bash
sudo systemctl enable backprop-test
sudo systemctl start backprop-test
sudo systemctl status backprop-test
```

#### Reverse Proxy with Nginx

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Cloud Platform Deployment

#### Heroku

**1. Create Procfile:**

```
web: node server.js
```

**2. Deploy:**

```bash
heroku create
git push heroku main
heroku open
```

**Note:** Modify `server.js` to use `process.env.PORT`:

```javascript
const port = process.env.PORT || 3000;
```

#### AWS EC2

**1. Launch EC2 Instance** (Amazon Linux 2 or Ubuntu)

**2. Install Node.js:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**3. Deploy Application:**

```bash
git clone <repository-url>
cd hao-backprop-test
node server.js
```

**4. Use PM2 for process management** (see Process Management section)

#### Google Cloud Platform (Cloud Run)

**1. Create Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
```

**2. Build and Deploy:**

```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/backprop-test
gcloud run deploy --image gcr.io/PROJECT-ID/backprop-test --platform managed
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy application files
COPY server.js ./

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
```

**Build and Run:**

```bash
# Build image
docker build -t backprop-test-server .

# Run container
docker run -p 3000:3000 -d backprop-test-server

# View logs
docker logs <container-id>
```

**Docker Compose** (`docker-compose.yml`):

```yaml
version: '3.8'
services:
  server:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
```

**Run with Docker Compose:**

```bash
docker-compose up -d
```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error Message:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**Option A - Find and kill the process using port 3000:**

```bash
# On Linux/macOS
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option B - Use a different port:**

```bash
# Modify server.js to use port 3001
const port = 3001;
```

#### Issue 2: Permission Denied (EACCES)

**Error Message:**

```
Error: listen EACCES: permission denied 0.0.0.0:80
```

**Cause:** Ports below 1024 require elevated privileges on Unix-like systems.

**Solution:**

**Option A - Use a port above 1024:**

```javascript
const port = 3000;  // or 8080, 8000, etc.
```

**Option B - Run with elevated privileges (not recommended):**

```bash
sudo node server.js
```

**Option C - Use port forwarding:**

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
```

#### Issue 3: Cannot Access Server from Other Machines

**Symptom:** Server works on `localhost` but not from other devices on the network.

**Cause:** Server is bound to `127.0.0.1` (loopback only).

**Solution:** Change hostname to `0.0.0.0` to listen on all network interfaces:

```javascript
const hostname = '0.0.0.0';
```

**Then access using your machine's IP address:**

```bash
curl http://<your-ip-address>:3000/
```

#### Issue 4: Node.js Not Found

**Error Message:**

```
node: command not found
```

**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/) or use a version manager:

```bash
# Using nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Issue 5: Server Crashes Without Error Message

**Possible Causes:**
- Uncaught exceptions
- Port already in use
- Invalid hostname

**Solution:** Add error handling to `server.js`:

```javascript
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
```

## Development

### Project Scripts

**Current Scripts** (from `package.json`):

```bash
# Run tests (currently placeholder)
npm test
```

**Recommended Scripts** (add to `package.json`):

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test.js"
  }
}
```

### Code Modifications

#### Adding Routes

To add basic routing, modify the request handler:

```javascript
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  if (req.url === '/') {
    res.end('Hello, World!\n');
  } else if (req.url === '/about') {
    res.end('About Page\n');
  } else {
    res.statusCode = 404;
    res.end('Not Found\n');
  }
});
```

#### Handling Different HTTP Methods

```javascript
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end('GET request received\n');
  } else if (req.method === 'POST') {
    res.statusCode = 201;
    res.end('POST request received\n');
  } else {
    res.statusCode = 405;
    res.end('Method Not Allowed\n');
  }
});
```

#### Adding JSON Responses

```javascript
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  
  const response = {
    message: 'Hello, World!',
    timestamp: new Date().toISOString()
  };
  
  res.end(JSON.stringify(response));
});
```

### Debugging

#### Using Node.js Debugger

```bash
node inspect server.js
```

**Debugger Commands:**

- `c` - Continue execution
- `n` - Step to next line
- `s` - Step into function
- `o` - Step out of function
- `repl` - Enter REPL mode

#### VS Code Debugging

**Create `.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server.js"
    }
  ]
}
```

Press `F5` to start debugging in VS Code.

### Running Tests

**Manual Testing:**

```bash
# Start server
node server.js

# In another terminal, test endpoints
curl http://127.0.0.1:3000/
curl -X POST http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/
```

**Automated Testing** (example with Node.js http client):

Create `test.js`:

```javascript
const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    console.log('Status Code:', res.statusCode);
    
    if (data === 'Hello, World!\n' && res.statusCode === 200) {
      console.log('✓ Test passed');
      process.exit(0);
    } else {
      console.log('✗ Test failed');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('✗ Test failed:', error);
  process.exit(1);
});

req.end();
```

## Contributing

We welcome contributions to improve this project! Here's how you can contribute:

### Reporting Issues

If you encounter bugs or have feature suggestions:

1. Check if the issue already exists in the issue tracker
2. Create a new issue with a descriptive title
3. Include:
   - Node.js version
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages or logs

### Contributing Code

**Fork and Branch Workflow:**

1. **Fork the repository** on GitHub

2. **Clone your fork:**

```bash
git clone https://github.com/your-username/hao-backprop-test.git
cd hao-backprop-test
```

3. **Create a feature branch:**

```bash
git checkout -b feature/your-feature-name
```

4. **Make your changes** and commit:

```bash
git add .
git commit -m "Description of your changes"
```

5. **Push to your fork:**

```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request** on GitHub

### Code Style Guidelines

- Use consistent indentation (2 spaces)
- Follow existing code formatting
- Add comments for complex logic
- Keep code simple and readable
- Test your changes before submitting

### Testing Requirements

Before submitting a pull request:

1. Verify the server starts without errors
2. Test basic HTTP requests (GET, POST)
3. Ensure no existing functionality is broken
4. Add tests for new features if applicable

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 hxu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Author & Acknowledgments

**Author:** hxu

**Project Purpose:** This minimal HTTP server was created for backprop integration testing, serving as a lightweight test fixture to validate system integration points without the overhead of complex server frameworks.

**Acknowledgments:**

- Built with Node.js built-in modules
- Inspired by the need for simple, reliable integration testing tools
- Thanks to the Node.js community for comprehensive documentation

---

**Project Repository:** [hao-backprop-test](https://github.com/your-repo-url)

**Issues & Support:** [GitHub Issues](https://github.com/your-repo-url/issues)

**Last Updated:** 2024