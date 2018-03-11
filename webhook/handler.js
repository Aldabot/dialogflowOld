'use strict';

console.log("Starting 01");
var express = require("express");
const mysql = require('mysql');
const Promise = require('bluebird');
Promise.promisifyAll(require("mysql/lib/Connection").prototype); // Promisfy MySQL callback-hell
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
// dotenv.config(); // load .env configs
console.log("Starting 02");
// reserve 10 MySQL connections in pool
// when this lambda starts we will no PERMANENTLY have 10 open Connections which
// by a so called MySQL POOL. E.g. if all 10 connections are busy, then this lambda
// will automatically wait until it gets a free space to execute its queries
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB
});


exports.index = (event, context, callback) => {
    // terminate directly after we respond
    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Printing input event");

    console.log(event);

    console.log(JSON.stringify(event, null, 4));

    console.log(JSON.stringify(event.body, null, 4));

    console.log(JSON.parse(event.body));

    console.log("Input event printed");

    var speech = "This is a sample response from your webhook!"

    const response = {
        "statusCode": 200,
        "body": JSON.stringify({
            speech: speech,
            displayText: speech,
            message: 'Success'}),
        "isBase64Encoded": false
    };

    // console.log(response.body);

    callback(null,response);

    let sql = "SELECT * FROM persons";
    query(pool, sql, []).then((person) => {
        console.log(JSON.stringify(person, null, 4));
        // see RESPONSE HELPERS, just returns HTTP STATUS: 200
        // when calling the callback we terminate execution!
        // meaning any remaining (not fulfilled promise) will be cancelled!!!
        respondOK(callback);
    }).catch((error) => {
        console.log(JSON.stringify(error, null, 4));
        respondError(callback);
    });

};

////////////////////////////////////////////////////////////////////////////////
// DATABASE
// To execute a query (like SELECT or INSERT) you have to follow these steps:
// 1. Get a connection from the pool, see "getConnection(pool)"
// 2. Use the connection to perform a query, see query(pool, sql, values)
// Many caveats!!!
// Firstly everything is asynchronous so you have to use Promises, which are now
// part of the javascript standard see:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// but shortly: Promise is an object, which has a .then and a .catch function
// so e.g if you want to query the database you getConnection and THEN query(pool, sql, values).
// Both above functions return a PROMISE. The promise has 3 STATES: inProcess, Sucessfull, Failed
// e.g. (not our implementation, fictional functions!!)
// getAConnections(pool).then((connection) => {
//   this part will be executed as soon as the promise is "fulfilled" and successful
//   because getConnection(pool) returns a connection, we can use it to build and
//   return another promise
//   return query(connection, someSQL);
// }).then((sqlResult) => {
//   exectued when the query is successful, this is called chaining promised
//   do stuff with the query result
// }).catch((error) => {
//   this block will be exectuted if ANY OF THE PREVIOUS promises in the promise
//   chain fail. When a promise fails it normaly THROWS and error, which is then
//   returned to the error function and can be logged best like:
//   console.log(JSON.stringify(error, null, 4)); // JSON.stringify transforms the object to a STRING but in a human readable form, not one line shit
// });
//
// TO NOTE:
// - in the getConnect function we use a function from bluebird '.disposer()'
// the disposer is responsible to free up the connection after it has been used
// if we dont free up the space we could make 10 queries :D and that's it because
// the pool connections would been marked "busy". Other way would be to manually
// close the connection after every query, but Bluebird is safer and handy
// - query(pool, sql, values): you have to learn to use the node/mysql API
// you could write SQL like "SELECT * FROM PERSONS WHERE psid = " + 1234 + ";"
// but thats shit. You can also write "SELECT * FROM PERSONS WHERE psid = ?;"
// and let node/mysql pass the variables in. You can even pass whole objects:
// "INSERT INTO PERSON SET ?" passing {psid: 123, session_id: "1a2"}
// see: https://github.com/mysqljs/mysql#escaping-query-values
////////////////////////////////////////////////////////////////////////////////

const getConnection = (pool) => {
    return pool.getConnectionAsync().disposer((connection) => {
        connection.release();
    });
};

const query = (pool, sql, values) => {
    return Promise.using(getConnection(pool), (connection) => {
        return connection.queryAsync(sql, values);
    });
};

////////////////////////////////////////////////////////////////////////////////
// LAMBDA PROXY RESPONSE HELPERS
// API Gateways integrates the Lambda function as a so caled "proxy integration"
// The problem is that one has to respond in a very defined way otherways API-
// Gateway does not know how to handle the lambda response and just returns an
// HTTP: 500 internal error.
// see Documentation:
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
////////////////////////////////////////////////////////////////////////////////

const respondOK = (callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            speech: speech,
            displayText: speech,
            message: 'Success',
        })
    };
    console.log(body);
    callback(null, response);
};
const respondError = (callback) => {
    const response = {
        statusCode: 500,
        body: JSON.stringify({
            message: 'Failure',
        })
    };

    callback(null, response);
}