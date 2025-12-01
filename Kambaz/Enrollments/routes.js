import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);
    const findEnrollments = async (req, res) => {
        const {userId} = req.params;
        const enrollments = await dao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    };
    app.get("/api/dashboard/:userId", findEnrollments);
    const enrollInCourse = async (req, res) => {
        const {userId, courseId} = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({error: "Missing userId or courseId"});
        }
        const enrollment = await dao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    };
    app.post("/api/dashboard", enrollInCourse);
    const unenrollFromCourse = async (req, res) => {
        const {userId, courseId} = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({error: "Missing userId or courseId"});
        }
        const status = await dao.unenrollUserFromCourse(userId, courseId);
        res.json({success: status});
    };
    app.delete("/api/dashboard", unenrollFromCourse);

    app.get("/api/dashboard/current", async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        const courses = await dao.findEnrollmentsByUser(currentUser._id);
        res.json(courses);
    });
}
