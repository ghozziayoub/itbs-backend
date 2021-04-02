// Imports
const express = require('express');
const cors = require('cors')

// Database
require('./db/config')

// Controllers
const userController = require('./controllers/userController')
const categoryController = require('./controllers/categoryController')
const productController = require('./controllers/productController')

// Initial Config
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(express.static('./assets/users'))
app.use(express.static('./assets/products'))

app.use('/user', userController)
app.use('/category', categoryController)
app.use('/product', productController)

// Initial API
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the server !')
})

// Server
//app.listen(port, () => console.log(`Listening on port ${port}`));

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('mymessage', (msg) => {
        console.log('message: ' + msg.message);
        io.emit('my broadcast', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Server
http.listen(port, () => console.log(`Listening on port ${port}`));