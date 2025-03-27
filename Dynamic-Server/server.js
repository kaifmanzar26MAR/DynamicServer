const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const { authMiddleware, adminMiddleware } = require("./middlewares/auth.middleware.js");
const { logRequestMiddleware } = require("./middlewares/log.middleware.js");
const { userLogin, getCurrentAdmin, userSignup, userSignOut, notFound, getCurrentUser } = require("./controllers/user.controller.js");
const { home, about, blogs } = require("./controllers/page.controller.js");
const DBconnect = require("./DB/database");


//*configure .env file
dotenv.config();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//*this function will generate the server on the basis of config parameters
function generateServer(config) {
  //*getting the node form the config
  const nodes = config.nodes;

  //*creating a middleware object to take map of the node id with the respective middleware
  const middleware = {};

  //*Iterating through each node one by one
  nodes.forEach((node) => {
    //*destructuring the data from the node
    let { properties, id, source, target } = node;

   

    //*handling the middleware case
    if (properties.type === "middleware") {
      //*setup the cors policies
      if (properties.allowed_origins) {
        const corsOptions = { origin: properties.allowed_origins };
        app.use(cors(corsOptions));
      }

      //*mapping the user auth middleware with its respective id
      if (properties.auth_required) {
        (Array.isArray(target) ? target : [target]).forEach((ele_id) => {
          if (!middleware[ele_id]) {
            middleware[ele_id] = [];
          }
          middleware[ele_id].push(authMiddleware);
        });
      }

      //*mapping the admin auth middleware with its respective id
      if (properties.admin_required) {
       
        (Array.isArray(target) ? target : [target]).forEach((ele_id) => {
          if (!middleware[ele_id]) {
            middleware[ele_id] = [];
          }
          middleware[ele_id].push(adminMiddleware);
        });
      }

      //*mapping the logging middleware
      if (properties.log_requests) {
        
        (Array.isArray(target) ? target : [target]).forEach((ele_id) => {
          if (!middleware[ele_id]) {
            middleware[ele_id] = [];
          }
          middleware[ele_id].push(logRequestMiddleware);
        });
      }
    }

    //*handling the routes
    if (properties.endpoint && properties.method) {
      //*validating the presence of the endpoint and the method
      const endpoint = properties.endpoint;
      const method = properties.method.toLowerCase();

      // Middleware application
      const applyMiddleware = (nodeId) => {
        //* Creating and empty middleware
        let handler = (req, res, next) => next(); 
        if (middleware[nodeId]) {
          //*updating the empty middleware as per the config data with Ensuring the middleware array is unique
          handler = [...new Set(middleware[nodeId])];
        }
        return handler; //*return the middleware
      };

      let routeHandler = '';

      //*this is only for the given format else where it will go in the default route
      //!I have try to make them functional by taking the route just for a working demo
      switch (endpoint) {
        case '/user':
          routeHandler = getCurrentUser;
          if(!middleware[id]){
            middleware[id] = [];
          }
          middleware[id].push(authMiddleware);
          break;
        case '/admin':
          routeHandler = getCurrentAdmin;
          if(!middleware[id]){
            middleware[id] = [];
          }
          middleware[id].push(adminMiddleware);
          break;
        case '/login':
          routeHandler = userLogin;
          break;
        case '/signup':
          routeHandler = userSignup;
          break;
        case '/signout':
          routeHandler = userSignOut;
          break;
        case '/home':
          routeHandler = home;
          break;
        case '/about':
          routeHandler = about;
          break;
        case '/blogs':
          routeHandler = blogs;
          break;
      
        default:
          routeHandler = (req, res)=>{
            return res.send(`${node.name} accessed successfully`);
          };
          break;
      }
      
      //*define the route
      app[method](endpoint, applyMiddleware(id), routeHandler);
      console.log({method, endpoint, middleware_name : applyMiddleware(id), routeHandler});
    }
  });
}

app.get('/', (req, res)=>{
  return res.json({
    "name" : "MD Kaif Manzar",
    "email" : "kaifmanzar321@gmail.com"
  });
})

//*Parsing the config data
const config = JSON.parse(fs.readFileSync("config.json"));

//* Generate the server
generateServer(config);

const PORT = process.env.PORT;
const BASE_DOMAIN = process.env.BASE_DOMAIN;

//*connecting the db
DBconnect();

//* Handle all anonymous requests and log them
app.use((req, res, next) => {
  console.log(`Anonymous request received: ${req.method} ${req.originalUrl}`);
  notFound(req, res, next);
});

//*listen the server on port
app.listen(PORT, () => {
  console.log(`Server is running on  ${BASE_DOMAIN + PORT}`);
});
