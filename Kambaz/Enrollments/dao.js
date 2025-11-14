import {v4 as uuidv4} from "uuid";

export default function EnrollmentsDao(db) {
    const {enrollments} = db;
    function enrollUserInCourse(userId, courseId) {
        const exists = enrollments.find(e => e.user === userId && e.course === courseId);
        if (!exists) {
            const newEnrollment = {_id: uuidv4(), user: userId, course: courseId};
            enrollments.push(newEnrollment);
            return newEnrollment;
        }
        return null;
    }

    function unenrollUserFromCourse(userId, courseId) {
        const before = enrollments.length;
        db.enrollments = enrollments.filter(e => !(e.user === userId && e.course === courseId));
        return db.enrollments.length < before;
    }

    function findEnrollmentsByUser(userId) {
        return enrollments.filter(e => e.user === userId);
    }

    return {enrollUserInCourse, unenrollUserFromCourse, findEnrollmentsByUser};
}