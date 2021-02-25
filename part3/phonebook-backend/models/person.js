const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
    console.log('connected to MongoDB');
})
.catch(error => {
    console.log('error connecting to MongoDB', error);
});

const personSchema = new mongoose.Schema({
	name: String,
	number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Person', personSchema);