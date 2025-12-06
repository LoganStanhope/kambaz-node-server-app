import model from "../Quizzes/model.js";
import { v4 as uuidv4 } from "uuid";
export default function QuizzesDao() {

    async function findQuizzes(courseId) {
        return await model.find({ course: courseId });
    }

    async function findQuiz(courseId, quizId) {
        return await model.findOne({ _id: quizId, course: courseId });
    }

    async function createQuiz(courseId, quiz) {
        return await model.create({
            ...quiz,
            _id: quiz._id || uuidv4(),
            course: courseId,
            student_scores: {}
        });
    }

    async function updateQuiz(courseId, quizId, updates) {
        return await model.findOneAndUpdate({ _id: quizId, course: courseId }, updates, { new: true });
    }

    async function deleteQuiz(courseId, quizId) {
        return await model.deleteOne({ _id: quizId, course: courseId });
    }

    async function findQuestions(courseId, quizId) {
        const quiz = await model.findOne({ _id: quizId, course: courseId });
        return quiz.questions;
    }
    
    async function createQuestion(courseId, quizId, questionData) {
        const quiz = await model.findOne({ _id: quizId, course: courseId });
        quiz.questions.push({
            questionId: uuidv4(),
            type: questionData.type || "MCQ",
            title: questionData.title || "",
            points: questionData.points || 0,
            questionHtml: questionData.questionHtml || "",
            choices: questionData.choices || [],
            correctAnswer: questionData.correctAnswer || null
        });
        
        quiz.num_questions = quiz.questions.length;
        quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await quiz.save();
        return quiz.questions[quiz.questions.length - 1];
    }

    
    async function updateQuestion(courseId, quizId, questionId, updates) {
        const quiz = await model.findOne({ _id: quizId, course: courseId });
        const question = quiz.questions.find(q => q.questionId === questionId);
        
        Object.assign(question, updates);
        quiz.num_questions = quiz.questions.length;
        quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);

        await quiz.save();
        return question;
    }

    return { findQuizzes, findQuiz, createQuiz, updateQuiz, deleteQuiz, findQuestions, createQuestion, updateQuestion };
}