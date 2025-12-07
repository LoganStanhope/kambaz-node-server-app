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

const StudentAttemptSchema = new mongoose.Schema({
    attemptId: String,
    studentId: String,
    submittedAt: Date,
    answers: mongoose.Schema.Types.Mixed, // Object mapping questionId to answer
    score: Number,
    totalPoints: Number
}, { _id: false });

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
    student_scores: Object,
    student_attempts: [StudentAttemptSchema], // Array of attempts per student
    description: String, // Quiz description (supports HTML)
    multipleAttempts: String, // "Yes" or "No"
    howManyAttempts: Number, // Number of attempts allowed if multipleAttempts is "Yes"
    quizType: String,
    assignmentGroup: String,
    shuffleAnswers: String,
    timeLimit: Number,
    showCorrectAnswers: String,
    accessCode: String,
    oneQuestionAtATime: String,
    webcamRequired: String,
    lockQuestionsAfterAnswering: String
}, { collection: "quizzes" });
export default schema;