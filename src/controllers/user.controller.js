const User = require('../models/User'); // Importar el modelo de usuario
const bcrypt = require('bcrypt'); // Importar bcrypt para el hash de contraseñas


//consultar todos los usuarios
exports.getAllOpertiveUsers = async (req,res)=>{
    try{
        const user = await User.find(); // Buscar todos los usuarios en la base de datos
        if(user.length === 0){ // Verificar si hay usuarios
            return res.status(404).json({message: 'No se encontraron usuarios'}); // Si no hay usuarios, devolver un error 404
        }
        res.status(200).json(user); // Devolver los usuarios encontrados
    }catch(error){
        console.error(error); // Imprimir el error en la consola
        res.status(500).json({message: 'Error al obtener los usuarios'}); // Devolver un error 500 si ocurre un problema
    }
}

//registrar un nuevo usuario
exports.registerUser = async (req,res)=>{
    try {
        const { username, email, password } = req.body; // Extraer los datos del cuerpo de la solicitud
    
        // Verificar si el usuario ya existe
        const exiteUser = await User.findOne({ email });
        if (exiteUser) {
            // Si el usuario ya existe, devolver un error
        return res.status(400).json({ message: 'El usuario ya existe' });
        }
    
        // Crear un nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña
        const newUser = new User({
        username,
        email,
        password: hashedPassword
        });
    
        // Guardar el usuario en la base de datos
        await newUser.save();
        
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}
