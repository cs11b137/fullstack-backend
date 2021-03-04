const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user');
    res.json(blogs);
});

blogRouter.post('/', async (req, res) => {
    const body = req.body;
    const token = req.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token && !decodedToken.id) {
        return res.status(401).json({
            error: 'token misssing or invalid'
        });
    }

    if (!body.title) {
        return res.status(400).send({
            error: 'title must be required'
        });
    }

    if (!body.url) {
        return res.status(400).send({
            error: 'url must be required'
        });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
        ...body,
        user: user.id
    });
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    res.json(savedBlog);
});

blogRouter.delete('/:id', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!req.token && !decodedToken.id) {
        return res.status(401).json({
            error: 'token misssing or invalid'
        });
    }

    const blog = await Blog.findById(req.params.id);
    const user = await User.findById(decodedToken.id);

    if (blog.user.toString() !== user.id.toString()) {
        return res.status(403).send({
            error: 'permission denied'
        });
    }

    await Blog.findByIdAndRemove(req.params.id);
    user.blogs = user.blogs.filter(b => b.id !== blog.id);
    await user.save();

    res.status(204).end();
});

blogRouter.put('/:id', async (req, res) => {
    const result = await Blog.findByIdAndUpdate(req.params.id, {
        likes: req.body.likes
    }, {
        new: true
    });
    res.json(result);
});

module.exports = blogRouter;