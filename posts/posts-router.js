const express = require('express')
const db = require('../data/db.js')

const router = express.Router()

//gets

router.get('/', (req,res) => {
  console.log(req.query)
  db.find(req.query)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(error => {
    res.status(500).json({
      error: "The posts information could not be retrieved."
    })
  })
})

router.get('/:id', (req,res) => {
  db.findById(req.params.id)
  .then(post => {
    post ? res.status(200).json(post) : res.status(404).json({
      message: "The post with the specified ID does not exist."
    })
  })
  .catch(error => {
    res.status(500).json({error: "The post information could not be retrieved."})
  })
})

router.get('/:id/comments', (req,res) => {
  db.findPostComments(req.params.id)
  .then(comments => {
    comments ? res.status(200).json(comments) : res.status(404).json({message: "The post with the specified ID does not exist."})
  })
  .catch(error => {
    res.status(500).json({error: "The comments information could not be retrieved."})
  })
})

module.exports = router