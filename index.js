import express from 'express'
import mongoose from "mongoose";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING)
    .then(() => {
        console.log("MongoDB connected!");
        console.log("Connected DB:", mongoose.connection.name); // prints the DB name
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
console.log("Mongoose connection state:", mongoose.connection.readyState);

const app = express()
app.use(cors({
        credentials: true,
        origin: process.env.CLIENT_URL || "http://localhost:3000",
    })
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,      // important in localhost
        sameSite: "lax",
    }
};

if (process.env.NODE_ENV !== "production") {
    sessionOptions.cookie = {
        sameSite: "lax",
        secure: false
    };
} else {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.SERVER_URL
    };
}
app.use(session(sessionOptions));
app.use(express.json());
Lab5(app);
Hello(app)
UserRoutes(app);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
app.listen(process.env.PORT || 4000)