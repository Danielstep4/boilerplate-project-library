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
    bookId: { type: String, required: true },
    comment: { type: String, required: true },
    created_on: { type: Date, default: Date.now }
  })

  const Book = mongoose.model('Books', bookSchema);
  const Comment = mongoose.model('Comments', commentSchema);
  // Function to get comments
  const commentsById = async (id) => {
        let commentcount = 0;
        let comments = []
        await Comment.find({ bookId: id }, (err, bookComments) => {
          if(err) return console.log(err)
          if(bookComments.length) {
            commentcount = bookComments.length
            comments = bookComments.map(comment => {
              return comment.comment
            })
          }
        })
        return {
          comments,
          commentcount
        }
  }
  const bookById = async(id) => {
    const result = await Book.findById(id).then(async book => {
          let { comments, commentcount } = await commentsById(id)
          let myBook = {
            comments,
            _id: book._id,
            title: book.title,
            commentcount
          }
          return myBook
    }).catch(err => {
      console.log(err)
    })
    return result
  }
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
        if(err) return console.log(err)
        books = books.map(book => {
          let id = book._id
          let { comments, commentcount } = commentsById(id)
          return {
            comments,
            _id: book._id,
            title: book.title,
            commentcount
          }
        })
        res.json(books)
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
      Book.deleteMany({}, err => {
        if(err) return console.log(err)

        console.log('complete delete successful')
        res.send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const result = await bookById(bookid)
      if(!result) {
        res.send('no book exists')
      }else {
        res.json(result)
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      const newComment = new Comment({
        bookId: bookid,
        comment
      }).save(err => {
        if(err) return console.log(err)
        console.log('Comment has been saved')
      })
      const result = await bookById(bookid)
      if(!result) {
        res.send('no book exists')
      }else {
        res.json(result)
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
