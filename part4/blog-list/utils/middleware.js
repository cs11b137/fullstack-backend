const logger = require('./logger');

const unknownEndpoint = (request, response) => {
    return response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    logger.info(error.message);

    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }

    next(error);
};

module.exports = {
    unknownEndpoint,
    errorHandler
};