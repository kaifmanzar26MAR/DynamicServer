# Server Generator

## Overview

The **Server Generator** is a tool designed to help developers quickly generate a server based on a predefined configuration. It simplifies the process of setting up routes, middleware, and other server components by using a JSON-based configuration file.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher)
- **npm** or **yarn** (for package management)
- A valid `server_config.json` file (see example below)

## Setup Instructions

Follow these steps to set up and run the Server Generator:

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/kaifmanzar26MAR/Server-Generator
```

### 2. Configure `server_config.json`

Update the `server_config.json` file to define your server's structure. Below is a sample configuration:

```json
{
    "nodes": [
        {
            "id": "1",
            "name": "Start",
            "source": null,
            "target": "2",
            "properties": { "type": "entry" }
        },
        {
            "id": "2",
            "name": "CORS Middleware",
            "source": "1",
            "target": "3",
            "properties": { "type": "middleware", "allowed_origins": ["*"] }
        },
        {
            "id": "3",
            "name": "Auth Middleware",
            "source": "2",
            "target": ["4", "5", "6", "7"],
            "properties": { "type": "middleware", "auth_required": true }
        },
        {
            "id": "4",
            "name": "Login Route",
            "source": "3",
            "target": "8",
            "properties": { "endpoint": "/login", "method": "POST" }
        },
        {
            "id": "5",
            "name": "Signup Route",
            "source": "3",
            "target": "9",
            "properties": { "endpoint": "/signup", "method": "POST" }
        },
        {
            "id": "6",
            "name": "Signout Route",
            "source": "3",
            "target": "10",
            "properties": { "endpoint": "/signout", "method": "POST" }
        },
        {
            "id": "7",
            "name": "Admin Auth Middleware",
            "source": "3",
            "target": "9",
            "properties": { "type": "middleware", "admin_required": true }
        },
        {
            "id": "8",
            "name": "User Route",
            "source": "4",
            "target": "12",
            "properties": { "endpoint": "/user", "method": "GET" }
        },
        {
            "id": "9",
            "name": "Admin Route",
            "source": "7",
            "target": "13",
            "properties": { "endpoint": "/admin", "method": "GET" }
        },
        {
            "id": "10",
            "name": "Logging Middleware",
            "source": "5",
            "target": ["12", "13", "14"],
            "properties": { "type": "middleware", "log_requests": true }
        },
        {
            "id": "11",
            "name": "Home Page",
            "source": "2",
            "target": "14",
            "properties": {
                "endpoint": "/home",
                "method": "GET",
                "auth_required": false
            }
        },
        {
            "id": "12",
            "name": "About Page",
            "source": "2",
            "target": "14",
            "properties": {
                "endpoint": "/about",
                "method": "GET",
                "auth_required": false
            }
        },
        {
            "id": "13",
            "name": "News Page",
            "source": "2",
            "target": "14",
            "properties": {
                "endpoint": "/news",
                "method": "GET",
                "auth_required": false
            }
        },
        {
            "id": "14",
            "name": "Blogs Page",
            "source": "2",
            "target": "15",
            "properties": {
                "endpoint": "/blogs",
                "method": "GET",
                "auth_required": false
            }
        },
        {
            "id": "15",
            "name": "Response Dispatcher",
            "source": ["10", "11", "12", "13", "14"],
            "target": "16",
            "properties": { "type": "dispatcher" }
        },
        {
            "id": "16",
            "name": "End",
            "source": "15",
            "target": null,
            "properties": { "type": "exit" }
        }
    ]
}
```

### 3. Run the Script

Execute the script to generate the server:

```bash
node script.js
```

### 4. Start the Server

Follow the instructions displayed in the console output after running the script to start the server.

## Features

- **Dynamic Middleware and Routes**: Easily configure middleware and routes using the JSON file.
- **Customizable**: Modify the configuration to suit your application's requirements.

## Troubleshooting

- Ensure that `server_config.json` is properly formatted and contains all required fields.
- Verify that Node.js and npm/yarn are installed and up-to-date.
- Check the console output for any error messages during script execution.


## Contact

For questions or support, please contact [Kaif Manzar](mailto:kaifmanzar321@gamil.com).
