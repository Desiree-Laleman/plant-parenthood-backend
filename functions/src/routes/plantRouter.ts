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

// get user plants by userID to display their plants
plantRouter.get("/users/:googleId/plants", async (req, res) => {
  try {
    const googleId = req.params.googleId;
    const client = await getClient();
    const plants = await client
      .db()
      .collection<Plant>("plants")
      .find({ googleId })
      .toArray();
    if (plants) {
      res.status(200).json(plants);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// get a plant by plant ID to list info about that plant
plantRouter.get("/users/:googleId/plants/:id", async (req, res) => {
  try {
    const googleId = req.params.googleId;
    const _id = new ObjectId(req.params.id);
    const client = await getClient();
    const plant = await client
      .db()
      .collection<Plant>("plants")
      .findOne({ googleId, _id });
    if (plant) {
      res.status(200).json(plant);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// create new plant and adds it to plant collection
plantRouter.post("/users/plants", async (req, res) => {
  try {
    const plant = req.body as Plant;
    const client = await getClient();
    await client.db().collection<Plant>("plants").insertOne(plant);
    res.status(201).json(plant);
  } catch (err) {
    errorResponse(err, res);
  }
});

// replace / update plant by ID only updates plant nickname and photo
plantRouter.put("/users/:googleId/plants/:id", async (req, res) => {
  const googleId: string = req.params.googleId;
  const _id: ObjectId = new ObjectId(req.params.id);
  const updatedPlant: Plant = req.body;
  delete updatedPlant._id; // remove _id from body so we only have one.
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Plant>("plants")
      .replaceOne({ googleId, _id }, updatedPlant);
    if (result.modifiedCount) {
      res.status(200).json(updatedPlant);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// delete plant by new object ID
plantRouter.delete("/users/:googleId/plants/:id", async (req, res) => {
  try {
    const googleId = req.params.googleId;
    const _id = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<Plant>("plants")
      .deleteOne({ googleId, _id });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default plantRouter;
