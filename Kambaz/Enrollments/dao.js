import model from './model.js'

export default function EnrollmentsDao(db) {
    const { enrollments } = db;

    async function enrollUserInCourse(userId, courseId) {
        const id = `${userId}-${courseId}`;  // deterministic ID
        const existing = await model.findById(id);
        if (existing) return existing;       // prevents duplicate

        return model.create({
            _id: id,
            user: userId,
            course: courseId,
            enrollmentDate: new Date(),
        });
    }

    async function unenrollUserFromCourse(userId, courseId) {
        return model.deleteOne({ user: userId, course: courseId });
    }

    async function findEnrollmentsByUser(userId) {
        const enrollments = await model
            .find({ user: userId })
            .populate("course");
        return enrollments.map((e) => e.course);
    }

    async function findUsersForCourse(courseId) {
        const enrollments = await model
            .find({ course: courseId })
            .populate("user");
        return enrollments.map((e) => e.user);
    }
    async function findCoursesForUser(userId) {
        const enrollments = await model.find({ user: userId }).populate("course");
        return enrollments.map((enrollment) => enrollment.course);
    }
    async function unenrollAllUsersFromCourse(courseId) {
        return model.deleteMany({ course: courseId });
    }
    return {
        findUsersForCourse,
        enrollUserInCourse,
        unenrollUserFromCourse,
        findEnrollmentsByUser,
        findCoursesForUser,
        unenrollAllUsersFromCourse
    };
}