import mongoose from "mongoose";

const replItSchema = new mongoose.Schema({
  replId: String,
  language: String,
});

const ReplIt = mongoose.model("replId", replItSchema);

export default ReplIt;
