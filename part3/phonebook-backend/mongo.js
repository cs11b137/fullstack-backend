const mongoose = require('mongoose');

// if (process.argv.length < 3) {
// 	console.log('Please provide the password as an argument: node mongo.js <password>');
// 	process.exit(1);
// }

const password = process.argv[2];
const URL = 'mongodb://localhost:27017/phonebook';

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
	name: String,
	number: String
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
	name: process.argv[2],
	number: process.argv[3]
});

// person.save().then(result => {
// 	console.log(`added ${result.name} number ${result.number} to phonebook`);
// 	mongoose.connection.close();
// });

Person.find({}).then(result => {
	console.log('phonebook:');
	result.forEach(r => console.log(`${r.name} ${r.number}`));
	mongoose.connection.close();
});