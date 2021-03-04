const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.post('/', async (req, res)=> {
    const body = req.body;

    if (body.password.length < 3) {
        return res.status(400).send({
            error: 'length of password must be more than three'
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
});

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs');
    res.json(users);
});

module.exports = userRouter;