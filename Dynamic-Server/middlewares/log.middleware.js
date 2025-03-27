//*log creating middleware
module.exports.logRequestMiddleware = (req, res, next) => {
    console.log("creating log...");
    next();
  };