import UsersDao from "./dao.js";
export default function UserRoutes(app) {
    const dao = UsersDao();
    const createUser =  async (req, res) => {
        try {
            const newUser = await dao.createUser(req.body);
            res.json(newUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    const deleteUser = async (req, res) => {
        try {
            const status = await dao.deleteUser(req.params.userId);
            res.json(status);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    const findAllUsers = async (req, res) => {
        try {
            const users = await dao.findAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    const findUserById = async (req, res) => {
        try {
            const user = await dao.findUserById(req.params.userId);
            if (!user) {
                res.sendStatus(404);
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    const updateUser = async (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = await dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                {message: "Username already in use"});
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session.currentUser = currentUser;
        res.json(currentUser);

    };
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const profile = async (req, res) => {
        const currentUser = req.session.currentUser;
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    const signin = async (req, res) => {
        const {username, password} = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session.currentUser = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({message:  "Unable to login. Try again later." });
        }
    };
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
