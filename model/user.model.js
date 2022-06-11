const database = require("../storage")
//aca en el modelo tengo que piner la conexcion a mongoose para poner los metodos que van a actualizar la based ed datos
const userModel = {
    create: (user) => {
        database.users.push(user)
        return true;
    },
    findById: (id) =>{
        return database.users.find(user => user.id === id)
    },
    deleteById: (id) => {
        database.users.filter(user => user.id !== id)
    },
    updateById: (id, user) => {
        let userToUpdate = database.users.find(user => user.id === id);
        userToUpdate.name = user.name;
        userToUpdate.password = user.password;
        return userToUpdate;
    },
    getAllUsers: () => {
        const users = database.users;
        return users;
    },
    getUserByEmail: (email) => {
        return database.users.find(user => user.email === email)
    }

}

module.exports = userModel;