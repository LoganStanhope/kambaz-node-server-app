import QuizzesDao from "./dao.js";
export default function QuizzesRoutes(app) {
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
}
