# 🔎 FOUND_IT API

Una API RESTful construida con Node.js y Express que facilita la comunicación entre el backend en Laravel y el frontend en Angular, conectando directamente con una base de datos MongoDB.

---

## 🚀 Tecnologías utilizadas

- 🟩 **Node.js**
- ⚙️ **Express.js**
- 🍃 **MongoDB**
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

---

## 📚 Endpoints de la API

A continuación se muestran los endpoints disponibles y ejemplos de cómo interactuar con ellos:

### 🔐 Autenticación

**POST** `http://localhost:3000/login`

**Descripción:** Para loguear un usuario.

**Permisos:** Todos los usuarios.

**Ejemplo de uso:**

```http
POST http://localhost:3000/login
Content-Type: application/json

{
    "email": "example@correo.com",
    "password": "123456"
}
```

---

### 👤 Gestión de Usuarios

**POST** `http://localhost:3000/users`

**Descripción:** Crea nuevos usuarios.

**Permisos:** Solo usuarios tipo admin.

**Ejemplo de uso:**

```http
POST http://localhost:3000/users
Content-Type: application/json
Authorization: Bearer <token>

{
    "name": "test",
    "apellido": "Demo",
    "email": "example@correo.com",
    "password": "123456",
    "tipo": "admin"
}
```

**GET** `http://localhost:3000/users`

**Descripción:** Obtiene todos los usuarios registrados.

**Permisos:** Solo usuarios tipo admin.

**GET** `http://localhost:3000/users/name/:name`

**Descripción:** Obtiene usuarios por nombre.

**Permisos:** Solo usuarios tipo admin.

**PUT** `http://localhost:3000/users/id/:id`

**Descripción:** Actualiza la información de un usuario.

**Permisos:** Solo usuarios tipo admin.

**DELETE** `http://localhost:3000/users/id/:id`

**Descripción:** Elimina un usuario.

**Permisos:** Solo usuarios tipo admin.

---

### 🏢 Gestión de Almacenes

**POST** `http://localhost:3000/almacenes`

**Descripción:** Crea un nuevo almacén.

**Permisos:** Solo usuarios tipo admin.

**Ejemplo de uso:**

```http
POST http://localhost:3000/almacenes
Content-Type: application/json
Authorization: Bearer <token>

{
    "name": "Almacén Central",
    "direccion": "Av. José María Morelos #123, Col. Centro"
}
```

**GET** `http://localhost:3000/almacenes/all`

**Descripción:** Obtiene todos los almacenes.

**Permisos:** Todos los usuarios.

**GET** `http://localhost:3000/almacenes/id/:id`

**Descripción:** Obtiene un almacén por su ID.

**Permisos:** Todos los usuarios.

**GET** `http://localhost:3000/almacenes/name/:name`

**Descripción:** Obtiene almacenes por nombre.

**Permisos:** Todos los usuarios.

**PUT** `http://localhost:3000/almacenes/id/:id`

**Descripción:** Actualiza la información de un almacén por su ID.

**Permisos:** Solo usuarios tipo admin.

**DELETE** `http://localhost:3000/almacenes/:id`

**Descripción:** Elimina un almacén por su ID.

**Permisos:** Solo usuarios tipo admin.

---

### 🗄️ Gestión de Estantes

**POST** `http://localhost:3000/estantes`

**Descripción:** Crea estantes dentro de los almacenes.

**Permisos:** Solo usuarios tipo admin.

**Ejemplo de uso:**

```http
POST http://localhost:3000/estantes
Content-Type: application/json
Authorization: Bearer <token>

{
    "name": "Estante A1",
    "nameDispositivo": "ESP32 De roberto",
    "ip": "192.168.45.1",
    "almacenId": "60d5ec49f1a2c8001c8e4b00"
}
```

**GET** `http://localhost:3000/estantes/all`

**Descripción:** Obtiene todos los estantes de todos los almacenes.

**Permisos:** Todos los usuarios.

**PUT** `http://localhost:3000/estantes/id/:id`

**Descripción:** Actualiza la información de un estante por su ID.

**Permisos:** Solo usuarios tipo admin.

**DELETE** `http://localhost:3000/estantes/:id`

**Descripción:** Elimina un estante por su ID.

**Permisos:** Solo usuarios tipo admin.

---

### 📦 Gestión de Materiales

**POST** `http://localhost:3000/materiales`

**Descripción:** Agrega materiales a un estante específico.

**Permisos:** Todos los usuarios.

**Ejemplo de uso:**

```http
POST http://localhost:3000/materiales
Content-Type: application/json
Authorization: Bearer <token>

{
    "celda": 1,
    "materiales": {
        "name": "Tornillos M6",
        "description": "Tornillos de acero inoxidable",
        "cantidad": 50,
        "ubicacion": "Pasillo A-3",
        "movimientos": ["entrada"]
    }
}
```

**GET** `http://localhost:3000/materiales/all`

**Descripción:** Obtiene todos los materiales.

**Permisos:** Todos los usuarios.

**PUT** `http://localhost:3000/materiales/id/:id`

**Descripción:** Actualiza la información de un material.

**Permisos:** Todos los usuarios.

**DELETE** `http://localhost:3000/materiales/:id`

**Descripción:** Elimina un material.

**Permisos:** Solo usuarios tipo admin.

---

## 🔧 Notas importantes

- **Autenticación:** Todos los endpoints (excepto login) requieren un token JWT válido en el header `Authorization: Bearer <token>`.
- **Permisos:** Los usuarios tipo `admin` tienen acceso completo, mientras que los `operadores` tienen acceso limitado.
- **Estructura de datos:** Los almacenes, estantes y materiales están organizados de forma jerárquica y embebida en los documentos de usuario.

---

## 🚀 Estado del proyecto

✅ Autenticación JWT  
✅ CRUD de Usuarios  
✅ CRUD de Almacenes  
✅ CRUD de Estantes  
✅ CRUD de Materiales  
✅ Validaciones de permisos  
✅ Manejo de errores  
