const express = require('express');
const {Blog} = require('./models.js');
const mongoose = require('mongoose');
const app = express();

mongoose.Promise = global.Promise

app.get('/posts', (req, res) => {
  Blog
  .find()
  .then(blogs => {
    res.json({
      blogs: blogs.map(
        (blog) => blog.serialize())
    })
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'})
  })
})

app.get('posts/:id', (req, res) => {
  Blog
    .findById(req.params.id)
    .then(blog => res.json(restaurant.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
});

app.post('/posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Blog
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      created: req.body.created
    })
    .then(blog => res.status(201).json(blog.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
})

app.put('/posts/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id` + `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).json({message: message})
  }

  const toUpdate = {};
  const updateableFields = ['title', 'author', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Blog
    .findByIdAndUpdate(req.params.id, { $set: toUpdate})
    .then(blog => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/blog/:id', (req, res) => {
  Blog
    .findByIdAndRemove(req.params.id)
    .then(blog => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.listen(8080, () => {
  console.log('Server is running')
})
