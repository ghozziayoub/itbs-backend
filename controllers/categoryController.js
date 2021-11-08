const express = require('express')

const Category = require('./../models/category')

const isAdmin = require('./../middleware/auth')

const app = express()

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Salarie Controller")
})

app.post('/add', isAdmin, async (req, res) => {

    try {
        let data = req.body

        let category = new Category({
            name: data.name
        })

        await category.save()

        res.status(201).send({ message: "category Added !" })

    } catch (error) {
        res.status(400).send(error)
    }
})

app.put('/update', isAdmin, async (req, res) => {

    try {

        let category = await Category.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name })

        if (!category) {
            res.status(404).send({ message: "NOT FOUND !" })
        } else {
            res.status(200).send({ message: "category updated" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/all', async (req, res) => {
    try {
        let categorys = await Category.find()
        res.status(200).send(categorys)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/delete/:id', isAdmin, async (req, res) => {
    try {
        let category = await Category.findOneAndDelete({ _id: req.params.id })

        if (!category) {
            res.status(404).send({ message: "NOT FOUND !" })
        } else {
            res.status(200).send({ message: "category Deleted" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/one/:id', isAdmin, async (req, res) => {
    try {
        let category = await Category.findOne({ _id: req.params.id })

        if (!category) {
            res.status(404).send({ message: "NOT FOUND !" })
        } else {
            res.status(200).send(category)
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = app