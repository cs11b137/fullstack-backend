require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

morgan.token('req-content', req => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-content'));

app.use(cors());

app.use(express.static('build'));

app.use(express.json());

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
});

app.get('/info', (req, res) => {
    Person.find({})
        .then(result => {
            res.send(`
                <p>Phonebook has info for ${result.length} people</p>
                <p>${new Date()}</p>
            `);
        });
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).end();
            }
        }).catch(error => {
            next(error);
        });
});

app.delete('/api/persons/:id', (req, res, next) => {	
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => {
            next(error);
        });
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        });
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        });
    }

    const person = new Person({
        ...body
    });

    person.save().then(result => {
        res.json(result);
    }).catch(error => {
        console.log(error);
        next(error);
    });
});

app.put('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true, runValidators: true })
        .then(result => {
            res.json(result);
        })
        .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.log(error.message);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malfformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});