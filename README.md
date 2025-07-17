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



## 📚 Ejemplos de uso de la API

A continuación se muestran ejemplos de cómo interactuar con los principales endpoints de la API:

### 👤 Crear un usuario

```http
POST http://localhost:3000/users
Content-Type: application/json

{
    "name": "test",
    "apellido": "Demo",
    "email": "example@correo.com",
    "password": "123456",
    "tipo": "admin"
}
```

### 🔑 Login de usuario

```http
POST http://localhost:3000/login
Content-Type: application/json
Authorization: <Token generado aquí>

{
    "email": "example@correo.com",
    "password": "123456"
}
```

### 🏢 Crear un almacén (actualizando el usuario)

```http
POST http://localhost:3000/almacenes
Content-Type: application/json

{
    "name": "Almacén",
    "direccion": "Av. José María Morelos #123, Col. Centro"
}
```

### 🗄️ Crear un estante

```http
POST http://localhost:3000/estantes
Content-Type: application/json

{
    "name": "Estante 1",
    "nameDispositivo": "ESP32 De roberto",
    "ip": "192.168.45.1"
}
```

### AGREGAR UN MATERIAL Y LA UBICACION:

```http://localhost:3000/dispositivos
{
  "celda": 1,
  "materiales": {
    "name": "Tornillos M6",
    "description": "Tornillos de plata",
    "cantidad": 50,
    "ubicacion": "Pasillo A-3",
    "movimientos": ["entrada"]
  }
}
```
