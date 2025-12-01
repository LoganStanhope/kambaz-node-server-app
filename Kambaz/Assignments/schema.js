import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
        _id: { type: String, required: true },
        title: { type: String, required: true },
        course: { type: String, required: true },
        description: String,
        points: Number,
        due_date: Date,
        available_date: Date,
        available_until: Date
}, { collection: "assignments" });

export default assignmentSchema;
