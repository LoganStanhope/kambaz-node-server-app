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

    return { findQuizzes, findQuiz, createQuiz, updateQuiz, deleteQuiz };
}
