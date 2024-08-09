import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const mongoose = require("mongoose");
dotenv.config();
import { copyS3Folder, getAvailableReplit, replIdExist } from "./aws";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/project", async (req, res) => {
  try {
    const { replId, language } = req.body;

    if (!replId) {
      res.status(400).send("Bad request");
      return;
    }

    const repelExist = await replIdExist(replId);

    if (!repelExist) {
      await copyS3Folder(`base/${language}`, `code/${replId}`);
    }

    res.json({ project_created: true, repelExist, replId });
  } catch (error) {
    console.log(error);
  }
});

app.get("/get-available-replit", getAvailableReplit);

async function mongoConnect() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log(`MongoDB connected`);
}

const port = process.env.PORT || 3001;

mongoConnect();
app.listen(port, () => {
  console.log(`listening on *:${port}`);
});
