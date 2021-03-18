const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    published: Number,
    genres: [String]
})

const authorSchema = new mongoose.Schema({
    name: String,
    born: Number
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    favoriteGenre: String
})

const Book = mongoose.model('Book', bookSchema)

const Author = mongoose.model('Author', authorSchema)

const User = mongoose.model('User', userSchema)

module.exports = {
    Book,
    Author,
    User
}