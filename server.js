import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import DataSchema from "./DataSchema.js";

const DataModel = mongoose.model("DataModel", DataSchema);

//Call dotenv config object
dotenv.config();

//Instantiate express object/function to the constant server
const server = express();
server.use(json());

const PORT = process.env.SERVER_PORT;

mongoose.connect("mongodb+srv://resyahr:BTOQV5tvdBzD9tTf@cluster0.hf3ulc8.mongodb.net?retryWrites=true").then(() => {
  server.listen(PORT, (_, __) => {
    console.log(`Alive on port ${PORT} and connected to Database`);
  });
})
.catch ((err) => {
    console.log(err)
});

server.get("/authors", async (_, res) => {
  try {
    const authors = await DataModel.find();
    res.status(200).json(authors);
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Upps! an error on our side" });
  }
});

server.get("/author/:id", async (req, res) => {
  try {
    const author = await DataModel.findById(req.params.id);
    if (!author) {
      return res
        .status(404)
        .json({ message: `Not author found by id: ${req.params.id}` });
    }
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ message: "Internal server error " });
  }
});

server.post("/authors", async (req, res) => {
  try {
    const newAuthor = new DataModel(req.body);
    await newAuthor.save();
    res.status(200).json({ message: "Author Created succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `Could not create author error: ${err}` });
  }
});

server.put("/author/:id", async (req, res) => {
  try {
    const author = await DataModel.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found, cannot edit" });
    } else {
      author.name = req.body.name;
      author.surname = req.body.surname;
      author.email = req.body.email;
      author.dateOfBirth = req.body.dateOfBirth;
      await author.save();
      res.status(200).json({ message: "Author updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err}` });
  }
});

server.delete("/author/:id", async (req, res) => {
  try {
    const author = await DataModel.deleteOne({ _id: req.params.id });
    if (!author) {
      return res.status(404).json(`Not author found by id: ${req.params.id}`);
    }

    res.json({ message: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err}` });
  }
});

server.delete("/allAuthors", async (req, res) => {
  try {
    const { deletedCount } = await DataModel.deleteMany();
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Not authors found" });
    }
    res.status(200).json({message: `Deleted ${deletedCount} authors succesfully`})
  } catch (err) {
    res.status(500).json({ message: `Internal server error ${err}` });
  }
});