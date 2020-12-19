const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./../models/user')

const app = express()

app.get('/', (req, res) => {
    res.status(200).send("Welcome to User Controller")
})


app.post('/register', async (req, res) => {

    try {
        let data = req.body

        let user = new User({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
        })

        await user.save()

        res.status(201).send({ message: "user Added !" })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/login', async (req, res) => {

    try {
        let data = req.body

        let user = await User.findOne({ login: data.login })

        if (!user) {
            res.status(404).send({ message: "NOT FOUND !" })
        } else {

            let compare = bcrypt.compareSync(data.password, user.password)

            if (!compare) {
                res.status(404).send({ message: "NOT FOUND !" })
            } else {
                let token = jwt.sign({ role: 'user', id: user._id }, "SEKRITOU")

                res.status(200).send({ token })
            }
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/all', async (req, res) => {
    try {
        let users = await User.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = app