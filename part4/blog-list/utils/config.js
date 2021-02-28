require('dotenv').config();

const POST = process.env.POST;

const MONGODB_URL = process.env.MONGODB_URL;

module.exports = {
    POST,
    MONGODB_URL
};