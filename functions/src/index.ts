import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import plantRouter from "./routes/plantRouter";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", plantRouter);
export const api = functions.https.onRequest(app);
