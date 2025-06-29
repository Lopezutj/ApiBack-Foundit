const jwt = require('jsonwebtoken');

// Middleware para autenticar JWT
function autentificaJWT(req, res, next) {
    const token = req.headers['authorization']; // Obtener el token del encabezado Authorization

    if (!token) { // Verificar si el token está presente
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificar el token usando la clave secreta con methodo verify de jwt y async callback
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

module.exports = autentificaJWT; // Exportar el middleware para usarlo en otros archivos