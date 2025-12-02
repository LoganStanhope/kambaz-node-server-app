import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
    const dao = CoursesDao(db);
    const findAllCourses = async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    }
    const findCoursesForEnrolledUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = await enrollmentsDao.findCoursesForUser(userId);
        res.json(courses);
    };

    const findCoursesCreatedByUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = await dao.findCoursesByCreator(userId);
        res.json(courses);
    };


    const enrollmentsDao = EnrollmentsDao(db);
    const createCourse = async (req, res) => {
        try {
            console.log("Request body:", req.body);
            const currentUser = req.session["currentUser"];
            console.log("Current user from session:", currentUser);

            if (!currentUser) return res.sendStatus(401);

            const newCourse = await dao.createCourse({
                ...req.body,
                createdBy: currentUser._id
            });
            console.log("Created course:", newCourse);

            await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (err) {
            console.error("Error creating course:", err);
            res.status(500).json({error: err.message});
        }
    };
    const deleteCourse = async (req, res) => {
        try {
            const {courseId} = req.params;
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            const course = await dao.findCourseById(courseId);
            if (!course) {
                res.status(404).json({message: "Course not found"});
                return;
            }
            // Only creator can delete
            if (course.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
                res.status(403).json({message: "Only the course creator can delete this course"});
                return;
            }
            await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
            const status = await dao.deleteCourse(courseId);
            res.send(status);
        } catch (err) {
            console.error("Error deleting course:", err);
            res.status(500).json({error: err.message});
        }
    }
    const updateCourse = async (req, res) => {
        try {
            const {courseId} = req.params;
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            const course = await dao.findCourseById(courseId);
            if (!course) {
                res.status(404).json({message: "Course not found"});
                return;
            }
            // Only creator can update
            if (course.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
                res.status(403).json({message: "Only the course creator can edit this course"});
                return;
            }
            const courseUpdates = req.body;
            const status = await dao.updateCourse(courseId, courseUpdates);
            res.send(status);
        } catch (err) {
            console.error("Error updating course:", err);
            res.status(500).json({error: err.message});
        }
    }
    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
    };
    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.send(status);
    };
    const findUsersForCourse = async (req, res) => {
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    }
    app.get("/api/courses/:cid/users", findUsersForCourse);

    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

    app.put("/api/courses/:courseId", updateCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.get("/api/users/:userId/courses/created", findCoursesCreatedByUser);
    app.get("/api/courses", findAllCourses);
}