require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Data = require('./models/dataModel');
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    try {
        return res.sendFile(__dirname + '/index.html');
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

app.get('/:key', async (req, res) => {
    try {
        const key = req.params.key;
        const data = await Data.findOneAndUpdate(
            { key },
            { $inc: { value: 1 } },
            { upsert: true, projection: { _id: 0, key: 1, value: 1 }, new: true }
        );

        return res.status(200).json({
            key: data.key,
            value: data.value,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

app.listen(PORT, () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("Connected to MongoDB!");
            })
            .catch((error) => {
                console.error("Error while connecting to MongoDB: " + error.message);
            })
        console.log(`PORT WORKING http://localhost:${PORT}`);
    } catch (error) {
        console.error(error);
        return false;
    }
});
