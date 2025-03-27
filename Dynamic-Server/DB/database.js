const mongoose = require('mongoose');

function DBconnect() {
  return mongoose.connect(process.env.DB_CONNECTION_STRING).then( ()=>{
    console.log('Connected to database');
  }).catch((err) => {
    console.log('Error connecting to database', err);
  });
}

module.exports = DBconnect;