const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.POST, () => {
    logger.info(`Server running on port ${config.POST}`);
});