require("dotenv").config();
const express = require("express");
const db = require("./db");
const Book = require("./Book");
const app = express();
app.use(express.json());
app.post("/api/books", async (req, res) => {
    try{
        if(!req.body.title || !req.body.title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const book= new Book(req.body);
        await book.save();

        res.status(201).json(book);

    } catch (err) {
    console.log(err);

    res.status(500).json({
        message: "Error adding book",
        error: err.message
    });
}
});

app.get("/api/books", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        if(
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1
        ){
            return res.status(400).json({
                message: "Page and limit must be positive integers"
            });
        }

        const skip = (page - 1) * limit;
        const books = await Book.find()
            .skip(skip)
            .limit(limit);
        const total = await Book.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            books: books
        });

    } catch (err) {
        res.status(500).json({
            message: "Error getting books"
        });
    }
});

app.patch("/api/books/:id", async (req, res) => {
    try {
        if (typeof req.body.availability !== "boolean") {
            return res.status(400).json({
                message: "Availability must be true or false"
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { availability: req.body.availability },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (err) {
        res.status(400).json({
            message: "Invalid book ID or request"
        });
    }
});

db.then(() => {
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
});