const express = require('express')
const db = require('../data/db.js')

const router = express.Router()

//gets

router.get('/', (req,res) => {
  console.log(req.query)
  db.find(req.query)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(error => {
    res.status(500).json({
      error: "The posts information could not be retrieved."
    })
  })
})


module.exports = router