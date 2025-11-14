import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
    const dao = CoursesDao(db);
    const findAllCourses = (req, res) => {
        const courses = dao.findAllCourses();
        res.send(courses);
    }
    const findCoursesForEnrolledUser = (req, res) => {
        let {userId} = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = dao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };
    const enrollmentsDao = EnrollmentsDao(db);
    const createCourse = (req, res) => {
        try {
            console.log("Request body:", req.body);
            const currentUser = req.session["currentUser"];
            console.log("Current user from session:", currentUser);

            if (!currentUser) return res.sendStatus(401);

            const newCourse = dao.createCourse(req.body);
            console.log("Created course:", newCourse);

            enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (err) {
            console.error("Error creating course:", err);
            res.status(500).json({error: err.message});
        }
    };
    const deleteCourse = (req, res) => {
        const {courseId} = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status);
    }
    const updateCourse = (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    }
    app.put("/api/courses/:courseId", updateCourse);

    app.delete("/api/courses/:courseId", deleteCourse);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.get("/api/courses", findAllCourses);
}