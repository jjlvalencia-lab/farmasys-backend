# FarmaSys — Backend

API REST desarrollada con **NestJS** y **PostgreSQL** para el sistema de gestión de inventario FarmaSys.

## 🛠️ Tecnologías

- NestJS
- TypeORM
- PostgreSQL
- JWT (autenticación)
- Bcrypt (encriptación de contraseñas)

## ⚙️ Requisitos previos

- Node.js v18+
- PostgreSQL 14+
- npm

## 🚀 Instalación

1. Clona el repositorio:
```bash
   git clone https://github.com/jjlvalencia-lab/farmasys-backend.git
   cd farmasys-backend
```

2. Instala dependencias:
```bash
   npm install
```

3. Crea la base de datos en PostgreSQL:
```sql
   CREATE DATABASE farmasys_db;
```

4. Configura las variables de entorno — crea un archivo `.env` en la raíz:
```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu_contraseña
   DB_NAME=farmasys_db
   JWT_SECRET=tu_clave_secreta
```

5. Inicia el servidor:
```bash
   npm run start:dev
```

El servidor corre en `http://localhost:3000`

## 📋 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/register | Registrar usuario |
| POST | /auth/login | Iniciar sesión |
| GET | /productos | Listar productos |
| POST | /productos | Crear producto |
| PUT | /productos/:id | Editar producto |
| DELETE | /productos/:id | Eliminar producto |
| GET | /productos/analisis | Análisis de inventario |
| GET | /productos/rotacion | Rotación de productos |
| GET | /ventas | Listar ventas |
| POST | /ventas | Registrar venta |
| GET | /ventas/fecha?fecha=YYYY-MM-DD | Ventas por fecha |
| GET | /ventas/cierre?fecha=YYYY-MM-DD | Cierre de caja |

## 👥 Roles de usuario

- **admin** — acceso completo al sistema
- **empleado** — puede ver inventario y registrar ventas

## 📁 Estructura del proyecto

```
src/
├── auth/          # Autenticación y roles
├── productos/     # Gestión de inventario
└── ventas/        # Punto de venta y reportes
```