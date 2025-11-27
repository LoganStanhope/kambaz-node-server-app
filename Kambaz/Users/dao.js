import model from "./model.js";

export default function UsersDao() {
    const createUser = (user) => {} // implemented later
    const findAllUsers = () => model.find();
    const findUserById = (userId) => model.findById(userId);
    const findUserByUsername = (username) => model.findOne({username: username});
    const findUserByCredentials = (username, password) => {
        console.log("username and password :", username, password);
        console.log("Executing query:", model.findOne({ username, password }).toString());
        const result = model.findOne({username, password});
        console.log(result);
    }
    const updateUser = (userId, user) => model.updateOne({_id: userId}, {$set: user});
    const deleteUser = (userId) => model.deleteOne({_id: userId});
    return {
        createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, updateUser, deleteUser
    };
}
