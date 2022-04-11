require('dotenv').config();
const Server = require('./models/server');

const server = new Server();



server.listen('Escuchando en el puerto:', process.env.PORT);



