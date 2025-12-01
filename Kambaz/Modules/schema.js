import mongoose from "mongoose";
const schema = new mongoose.Schema(
    {
        _id: String,
        name: String,
        description: String,
        Course: String,
        lessons: [{ _id: String, name: String, description: String, module: String }],
    }
);
export default schema;

