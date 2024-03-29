require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Data = require("./models/dataModel");

const PORT = process.env.PORT;
const hostedUrl = process.env.hostedUrl;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.sendFile(__dirname + "/index.html");
    }

    const data = await Data.findOneAndUpdate(
      {
        key,
      },
      {
        $inc: {
          value: 1,
        },
      },
      {
        upsert: true,
        projection: {
          _id: 0,
          key: 1,
          value: 1,
        },
        new: true,
      },
    );

    return res.render("visitors", {
      viewCount: data.value,
      hostedUrl: hostedUrl,
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
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Connected to MongoDB!");
      })
      .catch((error) => {
        console.error("Error while connecting to MongoDB: " + error.message);
      });
    console.log(`PORT WORKING http://localhost:${PORT}`);
  } catch (error) {
    console.error(error);
    return false;
  }
});
