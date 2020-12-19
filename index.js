// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

// Database
require('./db/config')

// Controllers
const userController = require('./controllers/userController')
const categoryController = require('./controllers/categoryController')

// Initial Config
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json())

app.use('/user', userController)
app.use('/category', categoryController)

// Initial API
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the server !')
})

// Server
app.listen(port, () => console.log(`Listening on port ${port}`));