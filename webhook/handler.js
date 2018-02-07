'use strict';

import dotenv from 'dotenv';
import mysql from 'mysql';
import Promise from 'bluebird';
Promise.promisifyAll(require("mysql/lib/Connection").prototype); // Promisfy MySQL callback-hell
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
dotenv.config(); // load .env configs

console.log(process.env.RDS_HOST);

// reserve 10 MySQL connections in pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB
});


export const index = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
