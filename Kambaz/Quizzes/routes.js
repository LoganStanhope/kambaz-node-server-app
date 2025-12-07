import QuizzesDao from "./dao.js";
export default function QuizzesRoutes(app, db) {
    const dao = QuizzesDao();

    // Get all quizzes for a course
    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quizzes = await dao.findQuizzes(courseId);
        res.json(quizzes);
    });

    // Get single quiz
    app.get("/api/courses/:courseId/quizzes/:quizId", async (req, res) => {
        const { courseId, quizId } = req.params;
        const quiz = await dao.findQuiz(courseId, quizId);
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });
        res.json(quiz);
    });

    // Create a quiz
    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quizData = req.body;
        const newQuiz = await dao.createQuiz(courseId, quizData);
        res.json(newQuiz);
    });

    // Update a quiz
    app.put("/api/courses/:courseId/quizzes/:quizId", async (req, res) => {
        const { courseId, quizId } = req.params;
        const updatedQuiz = await dao.updateQuiz(courseId, quizId, req.body);
        if (!updatedQuiz) return res.status(404).json({ error: "Quiz not found" });
        res.json(updatedQuiz);
    });

    // Delete a quiz
    app.delete("/api/courses/:courseId/quizzes/:quizId", async (req, res) => {
        const { courseId, quizId } = req.params;
        const status = await dao.deleteQuiz(courseId, quizId);
        res.json(status);
    });

    // Get all questions for a quiz
    app.get("/api/courses/:courseId/quizzes/:quizId/questions", async (req, res) => {
        const { courseId, quizId } = req.params;
        const questions = await dao.findQuestions(courseId, quizId);
        if (!questions) return res.status(404).json({ error: "Quiz not found" });
        res.json(questions);
    });

    // Create a question in a quiz
    app.post("/api/courses/:courseId/quizzes/:quizId/questions", async (req, res) => {
        const { courseId, quizId } = req.params;
        const newQuestion = await dao.createQuestion(courseId, quizId, req.body);
        res.json(newQuestion);
    });

    // Update a question in a quiz
    app.put("/api/courses/:courseId/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { courseId, quizId, questionId } = req.params;
        const updatedQuestion = await dao.updateQuestion(courseId, quizId, questionId, req.body);
        if (!updatedQuestion) return res.status(404).json({ error: "Question not found" });
        res.json(updatedQuestion);
    });

    // Submit quiz attempt (student taking quiz)
    app.post("/api/courses/:courseId/quizzes/:quizId/attempts", async (req, res) => {
        const { courseId, quizId } = req.params;
        const { studentId, answers } = req.body;
        
        if (!studentId || !answers) {
            return res.status(400).json({ error: "studentId and answers are required" });
        }

        const attempt = await dao.submitQuizAttempt(courseId, quizId, studentId, answers);
        if (!attempt) return res.status(404).json({ error: "Quiz not found" });
        res.json(attempt);
    });

    // Get student's last attempt
    app.get("/api/courses/:courseId/quizzes/:quizId/attempts/:studentId", async (req, res) => {
        const { courseId, quizId, studentId } = req.params;
        const attempt = await dao.getStudentAttempt(courseId, quizId, studentId);
        if (!attempt) return res.status(404).json({ error: "No attempt found" });
        res.json(attempt);
    });

    // Check if student can take quiz
    app.get("/api/courses/:courseId/quizzes/:quizId/can-take/:studentId", async (req, res) => {
        const { courseId, quizId, studentId } = req.params;
        const result = await dao.canStudentTakeQuiz(courseId, quizId, studentId);
        res.json(result);
    });

    // Get student attempt count
    app.get("/api/courses/:courseId/quizzes/:quizId/attempt-count/:studentId", async (req, res) => {
        const { courseId, quizId, studentId } = req.params;
        const count = await dao.getStudentAttemptCount(courseId, quizId, studentId);
        res.json({ count });
    });
}
