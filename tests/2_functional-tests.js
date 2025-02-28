/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
 // OK
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    var bookId;
    suite('POST /api/books with title => create book object/expect book object', function() {
      // OK
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'test'
          })
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.property(res.body, "title")
            assert.equal(res.body.title, 'test')
            assert.property(res.body, "_id")
            bookId = res.body._id 
            done();
          })
      });
      // OK
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.equal(res.text, "missing required field title")
            done();
          })
      });
      
    });

    
    suite('GET /api/books => array of books', function(){
      // OK
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get(`/api/books`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      // OK
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get(`/api/books/${bookId}1`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      // OK
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${bookId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'test');
          assert.property(res.body, '_id');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments, 'comments');
          assert.property(res.body, 'commentcount');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      // OK
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${bookId}`)
        .send({
          bookId: bookId,
          comment: 'test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'test');
          assert.property(res.body, '_id');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments, 'comments');
          assert.equal(res.body.comments[0], 'test');
          assert.property(res.body, 'commentcount');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        // OK
        chai.request(server)
        .post(`/api/books/${bookId}`)
        .send({
          bookId
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        // OK
        chai.request(server)
        .post(`/api/books/${bookId}1`)
        .send({
          bookId: 'id',
          comment: 'test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      // OK
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${bookId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        // OK
        chai.request(server)
        .delete(`/api/books/${bookId}1`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });

    });

  });

});
