const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

let persons = [
	{
		"name": "Arto Hellas",
		"number": "0000-1222-2323",
		"id": 1
	},
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": 2
	},
	{
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": 3
	},
	{
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	}
];

morgan.token('req-content', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-content'));

app.use(express.json());

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.get('/info', (req, res) => {
	res.send(`
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date()}</p>
	`);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find(p => p.id === id);

	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter(p => p.id !== id);

	res.status(204).end();
});

app.post('/api/persons', (req, res) => {
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

	if (persons.map(p => p.name).includes(body.name)) {
		return res.status(400).json({
			error: 'name must be unique'
		});
	}

	const person = {
		...body,
		id: Math.floor(Math.random() * 1000),
	};

	persons = persons.concat(person);
	res.json(person);
});

app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});