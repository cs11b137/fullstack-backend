const mongooese = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongooese.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3
    },
    name: {
        type: String
    },
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [{
        type: mongooese.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.passwordHash;
        delete ret.__v;

        return ret;
    }
});

module.exports = mongooese.model('User', userSchema);