import express from "express";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
import Plant from "../models/Plant";

const plantRouter = express.Router();

// call within try/catch to catch and log any errors
const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// // get all plants
// plantRouter.get("/plants", async (req, res) => {
//   try {
//     const client = await getClient();
//     const cursor = client.db().collection<Plant>("plants").find();
//     const results = await cursor.toArray();
//     res.json(results);
//   } catch (err) {
//     errorResponse(err, res);
//   }
// });

// get plants by userID
plantRouter.get("/plants/:googleId", async (req, res) => {
  const googleId = req.params.googleId;
  try {
    const client = await getClient();
    const plant = await client
      .db()
      .collection<Plant>("plants")
      .find({ googleId })
      .toArray();
    if (plant) {
      res.json(plant);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// get plants by plant ID
plantRouter.get("/plants/:googleId/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const plant = await client.db().collection<Plant>("plants").findOne({ id });
    if (plant) {
      res.json(plant);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// create new plant
plantRouter.post("/plants", async (req, res) => {
  const plant = req.body as Plant;
  try {
    const client = await getClient();
    await client.db().collection<Plant>("plants").insertOne(plant);
    res.status(201).json(plant);
  } catch (err) {
    errorResponse(err, res);
  }
});

// delete plant by ID
plantRouter.delete("/plants/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Plant>("plants")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Not Found" });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// replace / update plant by ID
plantRouter.put("/plants/:id", async (req, res) => {
  const id = req.params.id;
  const data: Plant = req.body;
  delete data._id; // remove _id from body so we only have one.
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Plant>("plants")
      .replaceOne({ _id: new ObjectId(id) }, data);
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "Not Found" });
    } else {
      data._id = new ObjectId(id);
      res.json(data);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default plantRouter;
