import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app) {
    const dao = AssignmentsDao();

    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        const assignments = await dao.findAssignmentsForCourse(req.params.courseId);
        res.json(assignments);
    });

    app.post("/api/courses/:courseId/assignments/editor", async (req, res) => {
        const assignment = { ...req.body, course: req.params.courseId };
        const newAssignment = await dao.createAssignment(assignment);
        res.json(newAssignment);
    });

    app.delete("/api/courses/:courseId/assignments/:assignmentId", async (req, res) => {
        const success = await dao.deleteAssignment(req.params.assignmentId);
        res.json({ success });
    });

    app.put("/api/courses/:courseId/assignments/:assignmentId", async (req, res) => {
        const updated = await dao.updateAssignment(req.params.assignmentId, req.body);
        res.json(updated);
    });
}