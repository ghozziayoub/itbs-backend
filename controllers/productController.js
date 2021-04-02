const fs = require('fs')

const express = require('express')
const multer = require('multer')
const path = require('path')

const Product = require('./../models/product')
const { db } = require('./../models/product')

// stockage
const stockage = multer.diskStorage({
    destination: './assets/products',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

// check file
function check(file, cb) {
    const types = /jpeg|jpg|png|gif/;
    const verifExt = types.test(path.extname(file.originalname).toLowerCase())
    const verifMime = types.test(file.mimetype)

    if (verifExt && verifMime) {
        return cb(null, true)
    }
    else {
        cb('Invalid File Type')
    }

}

// upload 
const upload = multer({
    storage: stockage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        check(file, cb)
    }
})


const app = express()

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Product Controller")
})

app.post('/add', upload.single('image'), async (req, res) => {

    try {
        let data = req.body
        let file = req.file

        let product = new Product({
            name: data.name,
            price: data.price,
            imageUrl: file.filename,
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
