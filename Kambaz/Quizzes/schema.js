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
        course: { type: String, required: true },

        name: { type: String, required: true },
        description: { type: String, default: "" },

        quizType: { type: String, default: "Graded Quiz" },
        assignmentGroup: { type: String, default: "Quizzes" },

        shuffleAnswers: { type: String, default: "Yes" },
        timeLimit: { type: Number, default: 20 },
        multipleAttempts: { type: String, default: "No" },
        howManyAttempts: { type: Number, default: 1 },

        showCorrectAnswers: { type: String, default: "No" },
        accessCode: { type: String, default: "" },

        oneQuestionAtATime: { type: String, default: "Yes" },
        webcamRequired: { type: String, default: "No" },
        lockQuestionsAfterAnswering: { type: String, default: "No" },

        available_date: { type: String, default: "" },
        available_until: { type: String, default: "" },
        due_date: { type: String, default: "" },

        points: { type: Number, default: 0 },
        num_questions: { type: Number, default: 0 },
        questions: [QuestionSchema],

        student_scores: { type: Object, default: {} },
        published: { type: Boolean, default: false },
    },
    { collection: "quizzes" }
);
export default schema;