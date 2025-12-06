import mongoose from "mongoose";

const ChoiceSchema = new mongoose.Schema({
  _id: String,
  text: String,
  isCorrect: Boolean
});

const QuestionSchema = new mongoose.Schema({
    questionId: String,
    // MCQ, TFQ, FIBQ
    type: String,
    title: String,
    points: Number,
    questionHtml: String,
    choices: [ChoiceSchema],    
    correctAnswer: mongoose.Schema.Types.Mixed 
});

const schema = new mongoose.Schema(
    {
    _id: String,
    course: String,
    name: String,
    published: Boolean,
    available_date: String,
    available_until: String,
    due_date: String,
    points: Number,
    num_questions: Number,
    questions: [QuestionSchema],
    student_scores: Object
}, { collection: "quizzes" });
export default schema;