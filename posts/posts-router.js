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
    post[0].id !== null ? res.status(200).json(post) : res.status(404).json({
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

//posts

router.post('/', (req,res) => {
  if(req.body.title == undefined || req.body.contents == undefined){
    res.status(400).json({errorMessage: "Please provide title and contents for the post."})
  }else{
    db.insert(req.body)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "There was an error while saving the post to the database"})
    })
  }
})

router.post('/:id/comments', (req, res) => {
  const commentBody = {...req.body, post_id: req.params.id}
  console.log(commentBody)
  
  if(commentBody.text !== null){
    
    db.findById(req.params.id)
    .then(post => {
      if(post[0].id !== null){ 
        db.insertComment(commentBody)
        .then(comment => {
          res.status(201).json(comment)
        })
        .catch(error => {
          res.status(500).json({error: "There was an error while saving the comment to the database"})
        })
      } else {
        res.status(404).json({
        message: "The post with the specified ID does not exist."
      })}
    })
    .catch(error => {
      res.status(500).json({error: "The post information could not be retrieved."})
    })
  } else {
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
  }
})

router.delete('/:id', (req, res) => {
  db.findById(req.params.id)
  .then(post => {
    if(post[0].id !== null){
      db.remove(req.params.id)
      .then(deleted => {
        if(deleted > 0){
          res.status(200).json(post)
        }else{
          res.status(500).json({ error: "The post could not be removed" })
        }
      })
    }else{
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  .catch(error => {

  })
})

router.put('/:id', (req, res) => {
  const changes = req.body
  if(changes.title !== undefined || changes.contents !== undefined){
    db.findById(req.params.id)
    .then(post => {
      if(post[0].id !== null){
        db.update(req.params.id, changes)
        .then(updated => {
          db.findById(req.params.id)
            .then(res.status(200).json(post))
            .catch(err => console.log(err))
        })
        .catch(err => {
          res.status(500).json({ error: "The post information could not be modified." })
        })
      }else{
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(error => {

    })
  } else {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
})

module.exports = router