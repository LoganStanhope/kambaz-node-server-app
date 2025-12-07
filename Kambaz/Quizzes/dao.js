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
        // Use $set to ensure all fields are updated, including description and howManyAttempts
        return await model.findOneAndUpdate(
            { _id: quizId, course: courseId }, 
            { $set: updates }, 
            { new: true, runValidators: false }
        );
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

    async function submitQuizAttempt(courseId, quizId, studentId, answers) {
        const quiz = await model.findOne({ _id: quizId, course: courseId });
        if (!quiz) return null;

        // Calculate score
        let totalScore = 0;
        let earnedScore = 0;

        quiz.questions.forEach((question) => {
            totalScore += question.points || 0;
            const userAnswer = answers[question.questionId];

            if (question.type === 'TFQ') {
                if (userAnswer !== null && userAnswer !== undefined) {
                    // Normalize both to boolean for comparison
                    const userBool = userAnswer === true || userAnswer === 'true' || String(userAnswer).toLowerCase() === 'true';
                    const correctBool = question.correctAnswer === true || question.correctAnswer === 'true' || String(question.correctAnswer).toLowerCase() === 'true';
                    if (userBool === correctBool) {
                        earnedScore += question.points || 0;
                    }
                }
            } else if (question.type === 'MCQ') {
                if (userAnswer !== null && userAnswer !== undefined) {
                    const correctChoice = question.choices?.find(c => c.isCorrect);
                    if (correctChoice) {
                        // Compare both by _id and text, with string normalization
                        const userAnswerStr = String(userAnswer).trim();
                        const correctIdStr = String(correctChoice._id || '').trim();
                        const correctTextStr = String(correctChoice.text || '').trim();
                        if (userAnswerStr === correctIdStr || userAnswerStr === correctTextStr || 
                            userAnswer === correctChoice._id || userAnswer === correctChoice.text) {
                            earnedScore += question.points || 0;
                        }
                    }
                }
            } else if (question.type === 'FIBQ') {
                if (userAnswer && typeof question.correctAnswer === 'string') {
                    if (String(userAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase()) {
                        earnedScore += question.points || 0;
                    }
                }
            }
        });

        // Create attempt
        const attempt = {
            attemptId: uuidv4(),
            studentId: studentId,
            submittedAt: new Date(),
            answers: answers,
            score: earnedScore,
            totalPoints: totalScore
        };

        // Initialize student_attempts if it doesn't exist
        if (!quiz.student_attempts) {
            quiz.student_attempts = [];
        }

        // Add attempt
        quiz.student_attempts.push(attempt);

        // Update student_scores with latest attempt
        if (!quiz.student_scores) {
            quiz.student_scores = {};
        }
        quiz.student_scores[studentId] = {
            last_attempt_score: earnedScore,
            last_attempt_date: attempt.submittedAt
        };

        await quiz.save();
        return attempt;
    }

    async function getStudentAttempt(courseId, quizId, studentId) {
        const quiz = await model.findOne({ _id: quizId, course: courseId });
        if (!quiz || !quiz.student_attempts) return null;

        // Get the last attempt for this student
        const studentAttempts = quiz.student_attempts
            .filter(a => a.studentId === studentId)
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        return studentAttempts.length > 0 ? studentAttempts[0] : null;
    }

    async function getStudentAttemptCount(courseId, quizId, studentId) {
        const quiz = await model.findOne({ _id: quizId, course: courseId });
        if (!quiz || !quiz.student_attempts) return 0;

        return quiz.student_attempts.filter(a => a.studentId === studentId).length;
    }

    async function canStudentTakeQuiz(courseId, quizId, studentId) {
        const quiz = await model.findOne({ _id: quizId, course: courseId });
        if (!quiz) return { canTake: false, reason: "Quiz not found" };

        // Check if quiz is published
        if (!quiz.published) {
            return { canTake: false, reason: "Quiz is not published" };
        }

        // Check availability dates
        const now = new Date();
        const availableDate = quiz.available_date ? new Date(quiz.available_date) : null;
        const availableUntil = quiz.available_until ? new Date(quiz.available_until) : null;

        if (availableDate && now < availableDate) {
            return { canTake: false, reason: "Quiz is not available yet" };
        }
        if (availableUntil && now > availableUntil) {
            return { canTake: false, reason: "Quiz is no longer available" };
        }

        // Check multiple attempts setting
        const attemptCount = await getStudentAttemptCount(courseId, quizId, studentId);
        if (quiz.multipleAttempts === 'No') {
            if (attemptCount > 0) {
                return { canTake: false, reason: "Multiple attempts not allowed" };
            }
        } else if (quiz.multipleAttempts === 'Yes' && quiz.howManyAttempts) {
            if (attemptCount >= quiz.howManyAttempts) {
                return { canTake: false, reason: "Maximum attempts reached" };
            }
        }

        return { canTake: true };
    }

    return { 
        findQuizzes, 
        findQuiz, 
        createQuiz, 
        updateQuiz, 
        deleteQuiz, 
        findQuestions, 
        createQuestion, 
        updateQuestion,
        submitQuizAttempt,
        getStudentAttempt,
        getStudentAttemptCount,
        canStudentTakeQuiz
    };
}