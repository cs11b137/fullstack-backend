const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

blogRouter.post('/', async (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            error: 'title must be required'
        });
    }

    if (!req.body.url) {
        return res.status(400).send({
            error: 'url must be required'
        });
    }

    const blog = new Blog(req.body);

    const result = await blog.save();
    res.json(result);
});

blogRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();

});

blogRouter.put('/:id', async (req, res) => {
    const result = await Blog.findByIdAndUpdate(req.params.id, { likes: req.body.likes }, { new: true });
    res.json(result);
});

module.exports = blogRouter;