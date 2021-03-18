const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const { Book, Author, User } = require('./models')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

mongoose.connect('mongodb://localhost:27017/graphql-backend', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('mongoDB connected')
})
.catch((e) => {
    console.log('connect failed: ', e)
})

const typeDefs = gql`
    type Book {
        title: String!
        published: Int!
        author: String!
        id: ID!
        genres: [String!]!
    }

    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(
            author: String
            genre: String
        ): [Book]
        allAuthors: [Author]
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            genres: [String]
        ): Book
        addAuthor(
            name: String!
            born: Int
        ): Author
        editAuthor(
            name: String!
            born: Int
        ): Author
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }

    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }
      
    type Token {
        value: String!
    }
`

const resolvers = {
    Query: {
        bookCount: () => Book.collection.countDocuments(),

        authorCount: () => Author.collection.countDocuments(),

        allBooks: (root, args) => {
            if (args.author && !args.genre) {
                return Book.find({ author: args.author })
            }
            if (args.genre && !args.author) {
                return Book.find({ genres: [ args.genre ] })
            }
            if (args.genre && args.author) {
                return Book.find({ author: args.author, genres: [ args.genre ] })
            }

            return Book.find({})
        },

        allAuthors: () => Author.find({}),

        me: (root, args, context) => {
            return context.currentUser
        }
    },

    Author: {
        bookCount: async (root) => {
            const books = await Book.find({})
            let count = 0;
            for (let i = 0; i < books.length; i++) {
                if (root.name === books[i].author) {
                    count++
                }
            }
            return count
        }
    },

    Mutation: {
        addBook: async (root, args, context) => {
            const book = new Book({ ...args })
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new Error("not authenticated")
            }

            try {
                await book.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }

            return book
        },

        addAuthor: async (root, args, context) => {
            const author = new Author({ ...args })
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new Error("not authenticated")
            } 

            try {
                await author.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }

            return author
        },

        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name })
            
            if (!author) {
                return null
            }

            author.born = args.born

            try {
                await author.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return author
        },

        createUser: (root, args) => {
            const user = new User({ username: args.username })

            return user.save()
            .catch(error => {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            })
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if ( !user || args.password !== 'secred' ) {
                throw new UserInputError("wrong credentials")
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, JWT_SECRET) }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
