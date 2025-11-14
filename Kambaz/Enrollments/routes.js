import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);
    const findEnrollments = (req, res) => {
        const {userId} = req.params;
        const enrollments = dao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    };
    app.get("/api/dashboard/:userId", findEnrollments);
    const enrollInCourse = (req, res) => {
        const {userId, courseId} = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({error: "Missing userId or courseId"});
        }
        const enrollment = dao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    };
    app.post("/api/dashboard", enrollInCourse);
    const unenrollFromCourse = (req, res) => {
        const {userId, courseId} = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({error: "Missing userId or courseId"});
        }
        const status = dao.unenrollUserFromCourse(userId, courseId);
        res.json({success: status});
    };
    app.delete("/api/dashboard", unenrollFromCourse);
}
