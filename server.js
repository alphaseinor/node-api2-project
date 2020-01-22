const express = require('express')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
  res.send(`
    <h2></h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

module.exports = server