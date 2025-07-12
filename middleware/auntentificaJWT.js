const jwt = require('jsonwebtoken');

// Middleware para autenticar JWT
function autentificaJWT(req, res, next) {
    const authHeader = req.headers['authorization']; // Obtener el encabezado Authorization completo

    if (!authHeader) { // Verificar si el encabezado está presente
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Extraer solo el token, removiendo "Bearer "
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    // Verificar el token usando la clave secreta con methodo verify de jwt y async callback
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.usuario = user; // usamor 'usuario' para coincidir con el controlador
        next();
    });
}

module.exports = autentificaJWT; // Exportar el middleware para usarlo en otros archivos