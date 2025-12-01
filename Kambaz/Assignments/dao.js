import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {

    async function createAssignment(assignment) {
        const newAssignment = { ...assignment, _id: uuidv4() };
        const doc = await model.create(newAssignment);
        return doc.toObject();
    }

    async function findAssignmentsForCourse(courseId) {
        const assignments = await model.find({ course: courseId });
        return assignments.map(a => a.toObject());
    }

    async function deleteAssignment(assignmentId) {
        const result = await model.deleteOne({ _id: assignmentId });
        return result.deletedCount > 0;
    }

    async function updateAssignment(assignmentId, assignmentUpdates) {
        const updated = await model.findByIdAndUpdate(
            assignmentId,
            { $set: assignmentUpdates },
            { new: true }
        );
        return updated?.toObject();
    }

    return {
        createAssignment,
        findAssignmentsForCourse,
        deleteAssignment,
        updateAssignment
    };
}