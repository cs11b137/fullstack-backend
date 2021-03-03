const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const api = supertest(app);
const blogModel = require('../models/blog');
const initialBlogs = [
    { 
        title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7
    }, 
    { 
        title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5
    }, 
    { 
        title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12
    }
];

beforeEach(async () => {
    await blogModel.deleteMany();
    let blogObj = new blogModel(initialBlogs[0]);
    await blogObj.save();
    blogObj = new blogModel(initialBlogs[1]);
    await blogObj.save();
    blogObj = new blogModel(initialBlogs[2]);
    await blogObj.save();
});

describe('blogs api', () => {
    test('blogs are returned as json', async () => [
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    ]);

    test('return correct blogs amount', async () => {
        const res = await api.get('/api/blogs');
        expect(res.body).toHaveLength(3);
    });

    test('blog contains the property of id', async () => {
        const res = await api.get('/api/blogs');
        expect(res.body[0].id).toBeDefined();
    });

    test('a new blog added to db', async () => {
        const newBlog = {
            title: 'backend api test',
            author: 'wuwj',
            url: 'https://www.google.com/',
            likes: 0
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        const res = await api.get('/api/blogs');
        expect(res.body).toHaveLength(initialBlogs.length + 1);

        const titles = res.body.map(b => b.title);
        expect(titles).toContain('backend api test');
    });

    test('blog-likes property is zero default', async () => {
        const newBlog = {
            title: 'no likes',
            author: 'zeon',
            url: 'https://baidu.com/'
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        const res = await api.get('/api/blogs');
        const found = res.body.find(ele => ele.title === 'no likes');

        expect(found.likes).toBe(0);
    });

    test('if no title or url, will receive 400', async () => {
        const noTitleBlog = {
            title: '',
            author: 'wenj',
            url: 'https://www.qq.com/'
        };
        const noUrlBlog = {
            title: 'no url blog',
            author: 'wwj',
            url: ''
        };

        await api
            .post('/api/blogs')
            .send(noTitleBlog)
            .expect(400);
        await api
            .post('/api/blogs')
            .send(noUrlBlog)
            .expect(400);
    });

    test('success to delete a blog', async () => {
        let res = await api.get('/api/blogs');
        await api.delete(`/api/blogs/${res.body[0].id}`)
            .expect(204);
        
        res = await api.get('/api/blogs');
        expect(res.body).toHaveLength(initialBlogs.length - 1);
    });

    test('success to update a blog with likes', async () => {
        let res = await api.get('/api/blogs');
        await api.put(`/api/blogs/${res.body[0].id}`)
            .send({ likes: 100 })
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });
});

afterAll(() => {
    mongoose.connection.close();
});