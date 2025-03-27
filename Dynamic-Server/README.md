# Dynamic-Server

A secure Node.js backend server with user authentication and role-based access control.

## Features

- User authentication (login/signup)
- Role-based access control (Admin/User)
- JWT-based authentication
- Password encryption
- Token blacklisting for secure logout
- Input validation
- MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/kaifmanzar26MAR/DynamicServer
    cd DynamicServer\Dynamic-Server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following variables gien my config data:
    ```env
    PORT = 3000
    BASE_DOMAIN = http://localhost:
    DB_CONNECTION_STRING = mongodb+srv://kaifmanzar321:kaifmanzar321@cluster0.jwafr9a.mongodb.net
    JWT_SECRET = thisisthejwttesstsectreatforthetestassessment@nervspaksBy_md_kaifManzar
    ```

4. Start the server:
    ```bash
    node server.js
    ```
    Or, for development with auto-reload:
    ```bash
    npm install nodemon -g
    nodemon server.js
    ```

## API Endpoints

#### DemoRoutes as per the given example
### Authentication
- `POST /signup` - Register a new user
```
    {
        "firstname": "string",
        "lastname": "string",
        "email": "string", 
        "password": "string",
        "role": "string"
    }

```
- `POST /login` - User login
```
    {
        "email": "string", 
        "password": "string"
    }

```
- `POST /logout` - User logout

- `GET /user` - Get current user details
- `Authentication Bearer`

### Admin Routes
- `GET /admin` - Get admin profile (requires admin role)
- `Authentication Bearer`

## Environment Variables

- `PORT`: Server port number
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

