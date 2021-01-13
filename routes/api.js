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
  
  const Library = mongoose.model('Library', bookSchema);
  const Comment = mongoose.model('Comment', commentSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
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
