const espress = require('express');
const router = espress.Router();
const bcrypt = require('bcryptjs');




router.get('/', (req,res)=>{
    res.json({
        mensaje : 'Api de prueba funcionanda correctamente'
    });
});

router.post('/register',async (req,res)=>{

    const { nombre, email, password } = req.body; 

    if(!nombre || !email || !password){
        return res.status(400).json({
            mensaje: 'Por favor, complete todos los campos parcero'
    
        });
    }

    await bcrypt.hash(password,10,(err, hashpassword)=>{
        if(err){
            return res.status(500).json({
                mensaje: 'Error al hashear la contraseña'
            });
        }else{
            res.status(201).json({
                mensaje: 'Usuario registrado correctamente',
                /* usuario: {
                    nombre,
                    email,
                    password: hashpassword
                } */
            });
        }

    });

});

module.exports= router;