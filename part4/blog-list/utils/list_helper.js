/* eslint-disable no-unused-vars */
const _ = require('lodash');

const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const allLikes = blogs.map(b => b.likes).reduce((acc, cur) => acc + cur);

    return allLikes;
};

const favoriteBlog = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes);

    delete sortedBlogs[blogs.length - 1]._id;
    delete sortedBlogs[blogs.length - 1].__v;
    delete sortedBlogs[blogs.length - 1].url;

    return sortedBlogs[blogs.length - 1];
};

const mostBlogs = (blogs) => {
    const authors = blogs.map(b => b.author);
    const result = _.values(_.groupBy(authors)).map(a => {
        return {
            author: a[0],
            blogs: a.length
        };
    });
    
    return result[result.length - 1];
};

const mostLikes = (blogs) => {};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};