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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};