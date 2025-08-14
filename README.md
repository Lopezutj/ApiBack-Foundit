
# 🔎 FOUND_IT API

Una API RESTful construida con Node.js y Express que facilita la comunicación entre el backend en Laravel y el frontend en Angular, conectando directamente con una base de datos MongoDB.

---

## 🚀 Tecnologías utilizadas

- 🟩 **Node.js**
- ⚙️ **Express.js**
- � **MongoDB**
- 🔐 **JWT para autenticación**

---

## 📦 Instalación

```bash
# Clonar el repositorio
https://github.com/Lopezutj/ApiBack-Foundit.git

# Entrar al directorio del proyecto
cd found_it_api

# Instalar dependencias
npm install

# Crear archivo .env con tus variables (ejemplo incluido)
cp .env.example .env

# Ejecutar el servidor
npm run dev / npm start
```

### Dependencias

Instala las dependencias principales del proyecto (npm install ya las instalará desde package.json, pero aquí están explícitas):

```powershell
# Instalar dependencias de producción
npm install express cors mongoose jsonwebtoken dotenv morgan ejs cookie-parser http-errors debug body-parser mongodb bcrypt bcryptjs

# Herramientas de desarrollo
npm install -D nodemon
```

Sugerencia de scripts en package.json (opcional):

```json
{
	"scripts": {
		"start": "node ./bin/www",
		"dev": "nodemon ./bin/www"
	}
}
```

### Requisitos

- Node.js ≥ 16.20 (recomendado 18 LTS o superior)
- npm ≥ 9 (o pnpm/yarn si prefieres)

Puedes verificar tus versiones con:

```powershell
node -v
npm -v
```

### Archivo .env de ejemplo

Crea un archivo `.env` en la raíz del proyecto con al menos estas variables:

```env
# Puerto de la app Express
PORT=3000

# Conexión a MongoDB (elige uno de los dos ejemplos)
# Local
MONGO_URI=mongodb://127.0.0.1:27017/foundit
# Atlas (remoto)
# MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>/<db>?retryWrites=true&w=majority

# Clave para firmar/verificar tokens JWT
JWT_SECRET=un_super_secreto_largo_y_aleatorio
```

---

## 📚 Endpoints URL

Lista rápida de endpoints solicitados y los adicionales disponibles según las rutas del proyecto.

### 🔐 Autenticación

- POST http://98.71.33.93:3000/login — Para loguear un usuario

### 👤 Usuarios (solo ADMIN)

- POST http://98.71.33.93:3000/users — Crear usuarios
- GET http://98.71.33.93:3000/users — Obtiene usuarios registrados
- GET http://98.71.33.93:3000/users/name/:name — Obtiene usuarios por nombre
- GET http://98.71.33.93:3000/users/id/:id — Obtiene usuario por ID
- PUT http://98.71.33.93:3000/users/id/:id — Actualiza usuarios
- DELETE http://98.71.33.93:3000/users/:id — Elimina usuarios (ruta real en código)

### 🏢 Almacenes

- POST http://98.71.33.93:3000/almacenes — Crea un nuevo almacén (solo admin; toma el id del token logueado)
- PUT http://98.71.33.93:3000/almacenes/:id — Agrega un almacén al usuario por ID (ruta real en código)
- GET http://98.71.33.93:3000/almacenes/all — Obtiene todos los almacenes (todos)
- GET http://98.71.33.93:3000/almacenes/name/:name — Obtiene almacenes por nombre
- PUT http://98.71.33.93:3000/almacenes/id/:id — Actualiza almacenes por ID (solo admin)
- DELETE http://98.71.33.93:3000/almacenes/id/:id — Elimina almacenes por ID (solo admin)

### 🗄️ Estantes

- POST http://98.71.33.93:3000/estantes/:id — Crea estantes en almacenes por ID del usuario operador (solo admin)
- GET http://98.71.33.93:3000/estantes/all — Obtiene los estantes de los almacenes (todos)

### 📦 Materiales

- POST http://98.71.33.93:3000/materiales — Agrega los materiales al estante (todos)
- GET http://98.71.33.93:3000/materiales/all — Obtiene todos los materiales
- GET http://98.71.33.93:3000/materiales/allWEB — Obtiene todos los materiales (vista web)
- GET http://98.71.33.93:3000/materiales/name/:name — Busca materiales por nombre
- PUT http://98.71.33.93:3000/materiales/:id — Actualiza un material por ID
- DELETE http://98.71.33.93:3000/materiales/:id — Elimina un material

### 🧠 Dispositivos / IoT (ESP32 y Panel Web)

Montadas en raíz según `src/app.js` (app.use('/', deviceRoute)).

- POST http://98.71.33.93:3000/api/dht — ESP32 → Node.js (envía y guarda datos de temperatura/humedad)
- GET  http://98.71.33.93:3000/api/led/status — ESP32/Web ← Node.js (lee estado actual del LED)
- GET  http://98.71.33.93:3000/api/servo/status — ESP32/Web ← Node.js (lee posición actual del servo)
- POST http://98.71.33.93:3000/api/led/control — Web → Node.js (cambia estado del LED)
- POST http://98.71.33.93:3000/api/servo/control — Web → Node.js (cambia posición del servo)
- GET  http://98.71.33.93:3000/api/dht — Web ← Node.js (consulta últimos datos DHT)
- POST http://98.71.33.93:3000/ — Crear dispositivo/material en estante (requiere token; según DispositivoController.create)

Notas:
- En el código actual, la ruta para eliminar usuarios es `DELETE /users/:id` (no `/users/id/:id`).
- Algunas rutas de almacenes usan `/:id` directamente; se documenta arriba la ruta real.

---

## 🔧 Notas importantes

- Autenticación: excepto login, añade `Authorization: Bearer <token>`.
- Permisos: `admin` acceso completo; `operador` acceso limitado.
- Estructura: almacenes, estantes, dispositivos y materiales anidados en el documento de usuario.

---

## 🚀 Estado del proyecto

✅ Autenticación JWT  
✅ CRUD de Usuarios  
✅ CRUD de Almacenes  
✅ CRUD de Estantes  
✅ CRUD de Materiales  
✅ Validaciones de permisos  
✅ Manejo de errores

## Licencia
Todos los derechos reservados

## ❓Autores
Proyecto Desarrollado Con Fines Educativos En La "UTJ" Universidad Tecnologica de Jalisco (Team) SIXTH MIND
