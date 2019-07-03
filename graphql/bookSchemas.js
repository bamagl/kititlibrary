var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var BookModel = require('../models/Book');
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;

var bc=new GraphQLObjectType({
  name:'bookcopy',
  fields:function(){
    return{
      _id:{
        type:GraphQLString
      },
      status:{
        type:GraphQLString
      }
    }
  }
})

var bci=new GraphQLInputObjectType({
  name:'bookcopyinput',
  fields:function(){
    return{
      _id:{
        type: GraphQLID
      },
      status:{
        type:GraphQLString
      }
    }
  }
})



var bookType = new GraphQLObjectType({
  name: 'book',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      isbn: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      author: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      published_year: {
        type: GraphQLInt
      },
      publisher: {
        type: GraphQLString
      },
      updated_date: {
        type: GraphQLDate
      },
      bookcopy:{
        type:GraphQLList(bc)
      },
      qty:{
        type:GraphQLInt
      }
    }
  }
});



  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      console.log("function")
      return {
        books:{
          type: new GraphQLList(bookType),
          args:{
            filter:{
              type: GraphQLString
            }

          },
          resolve: function (root, params,context) {
           // const books = BookModel.find().exec()
           console.log(params.filter)
           const books=BookModel.find({$or:[{title:{ $regex: '.*' + params.filter + '.*', $options: 'i' }},{author:{ $regex: '.*' + params.filter + '.*', $options: 'i' }}]}).exec()
           console.log(books) 
           if (!books) {
              throw new Error('Error')
            }
            return books
          }
        },
        book: {
          type: bookType,
          args: {
            id: {
              name: '_id',
              type: GraphQLString
            }
          },
          resolve: function (root, params,context) {
            console.log(context)
            const bookDetails = BookModel.findById(params.id).exec()
            if (!bookDetails) {
              throw new Error('Error')
            }
            return bookDetails
          }
        }
      }
    }
  });


  var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
      
        addBook: {
          type: bookType,
          args: {
            isbn: {
              type: new GraphQLNonNull(GraphQLString)
            },
            title: {
              type: new GraphQLNonNull(GraphQLString)
            },
            author: {
              type: new GraphQLNonNull(GraphQLString)
            },
            description: {
              type: new GraphQLNonNull(GraphQLString)
            },
            published_year: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            publisher: {
              type: new GraphQLNonNull(GraphQLString)
            },         
            bookcopy:{
              type: new GraphQLList(bci)
            },       
            qty:{
              type:new GraphQLNonNull(GraphQLInt)
            }

          },
          resolve: function (root, params,context) {
            const bookModel = new BookModel(params);
            console.log(params);
            const newBook = bookModel.save();
            if (!newBook) {
              throw new Error('Error');
            }
            return newBook
          }
        },
        updateBook: {
          type: bookType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLString)
            },
            isbn: {
              type: new GraphQLNonNull(GraphQLString)
            },
            title: {
              type: new GraphQLNonNull(GraphQLString)
            },
            author: {
              type: new GraphQLNonNull(GraphQLString)
            },
            description: {
              type: new GraphQLNonNull(GraphQLString)
            },
            published_year: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            publisher: {
              type: new GraphQLNonNull(GraphQLString)
            },
        
            bookcopy:{
              type: new GraphQLList(bci)
            },          
            qty:{
              type:new GraphQLNonNull(GraphQLInt)
            }
          },
          resolve(root, params) {
            return BookModel.findByIdAndUpdate(params.id, { isbn: params.isbn, title: params.title, author: params.author, description: params.description, published_year: params.published_year, publisher: params.publisher, updated_date: new Date() }, function (err) {
              if (err) return next(err);
            });
          }
        },
        removeBook: {
          type: bookType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            const remBook = BookModel.findByIdAndRemove(params.id).exec();
            if (!remBook) {
              throw new Error('Error')
            }
            return remBook;
          }
        }
      }
    }
  });


  module.exports = new GraphQLSchema({query: queryType, mutation: mutation});