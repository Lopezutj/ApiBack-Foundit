const { model } = require('mongoose');
const dbClient = require('../config/dbClient'); // importar el cliente de la base de datos
const bcrypt = require('bcrypt'); // importar bcrypt para hashear contraseñas

class UserModel{
    
    async create(user){
        const coleccionUsers = dbClient.db.collection('users'); //acceder a la colección de usuarios en la base de datos
        //hashear la contraseña del usuario antes de guardarlo
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10); // hashear la contraseña con un salt de 10 rondas
        }

        /* const result = await coleccionUsers.insertOne(user); //insertar un nuevo usuario en la colección */
        return await coleccionUsers.insertOne(user); // insertar un nuevo usuario en la colección y devolver el resultado
    }

    async getAll(){
        const coleccionUsers = dbClient.db.collection('users'); // acceder a la colección de usuarios en la base de datos
        return await coleccionUsers.find().toArray(); // obtener todos los usuarios de la colección y devolverlos como un array
    }

    async findById(id){
        const coleccionUsers = dbClient.db.collection('users'); // acceder a la colección de usuarios en la base de datos
        return await coleccionUsers.findOne({ _id: id }); // buscar un usuario por su ID y devolverlo
    }
}

module.exports = new UserModel(); // exportar una instancia del modelo de usuario