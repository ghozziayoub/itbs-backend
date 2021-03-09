const express = require('express')

const Product = require('./../models/product')

const app = express()

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Product Controller")
})

app.post('/add', async (req, res) => {

    try {
        let data = req.body

        let product = new Product({
            name: data.name,
            price: data.price,
            imageUrl: data.imageUrl,
            description: data.description,
            category_id: data.category_id
        })

        await product.save()

        res.status(201).send({ message: "product Added !" })

    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/all', async (req, res) => {
    try {
        let products = await Product.find()
        res.status(200).send(products)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        let product = await Product.findOneAndDelete({ _id: req.params.id })

        if (!product) {
            res.status(404).send({ message: "NOT FOUND !" })
        } else {
            res.status(200).send({ message: "product Deleted" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = app
