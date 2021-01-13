/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose')
module.exports = function (app) {
  //DB Configuration
  mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error'));

  const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    created_on: { type: Date, default: Date.now }
  });

  const commentSchema = mongoose.Schema({
    comment: { type: String, required: true },
    bookId: { type: String, required: true },
    created_on: { type: Date, default: Date.now }
  })

  const Book = mongoose.model('Books', bookSchema);
  const Comment = mongoose.model('Comments', commentSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let commentcount;
        Comment.find({ bookId: book._id }, (err, comments) => {
          if(err) return console.log(err)
          if(!comments.length) commentcount = 0;
          else commentcount = comments.length
        })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      const newBook = new Book({
        title
      }).save((err,book) => {
        if(err){
          res.send('missing required field title')
          return console.error(err)
        }
        console.log('New book has been saved!')
        res.json({
          _id: book._id,
          title: book.title,
        })
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
