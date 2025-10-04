# 🎓 Sistema de Gestión Escolar (CRUD Escolar)

Sistema completo de gestión escolar desarrollado con Laravel 12 y React, que permite administrar alumnos, materias y profesores, así como las relaciones entre ellos.

## 📋 Descripción

Sistema CRUD para gestión escolar que permite:
- ✅ Dar de alta alumnos, materias y profesores
- ✅ Relacionar alumnos con materias
- ✅ Relacionar profesores con materias
- ✅ Sistema de autenticación


## 🚀 Tecnologías

### Backend
- **Laravel 12** - Framework PHP
- **Laravel Fortify** - Autenticación
- **Inertia.js** - Stack moderno para SPAs
- **PostgreSQL** - Base de datos
- **Laravel Wayfinder** - Generación de rutas

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **Radix UI** - Componentes accesibles
- **Vite** - Build tool

## 📦 Requisitos Previos

- PHP >= 8.2
- Composer
- Node.js >= 18
- npm o yarn
- PostgreSQL o MySQL

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlexisSM377/Prueba-Tecnica.git
cd crud-escolar
```

### 2. Instalar dependencias de PHP

```bash
composer install
```

### 3. Instalar dependencias de Node.js

```bash
npm install
```

### 4. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Generar key de aplicación
php artisan key:generate
```

### 5. Configurar base de datos

Edita el archivo `.env` y configura tu base de datos:

```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=crud-escolar
DB_USERNAME=postgres
DB_PASSWORD=
```

### 6. Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```

### 7. Compilar assets

```bash
# Desarrollo
npm run dev

# Producción
npm run build
```

### 8. Iniciar servidor

```bash
php artisan serve
```

La aplicación estará disponible en `http://localhost:8000`

## 🎯 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo Vite
npm run build        # Build de producción
npm run build:ssr    # Build con SSR
npm run lint         # Ejecutar ESLint
npm run format       # Formatear código con Prettier
npm run types        # Verificar tipos TypeScript
```

### Backend
```bash
php artisan serve    # Iniciar servidor Laravel
php artisan migrate  # Ejecutar migraciones
php artisan db:seed  # Ejecutar seeders
```

### Todo en uno
```bash
npm run dev:all      # Servidor PHP + Queue + Vite simultáneamente
```

## 📁 Estructura del Proyecto

```
crud-escolar/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Controladores
│   │   ├── Middleware/      # Middlewares
│   │   └── Requests/        # Form Requests
│   ├── Models/              # Modelos Eloquent
│   │   ├── User.php
│   │   ├── Role.php
│   │   └── Materia.php
│   └── Providers/           # Service Providers
├── database/
│   ├── migrations/          # Migraciones
│   └── seeders/            # Seeders
├── resources/
│   ├── js/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas Inertia
│   │   ├── layouts/        # Layouts
│   │   └── types/          # Tipos TypeScript
│   └── css/
│       └── app.css         # Estilos globales
├── routes/
│   ├── web.php            # Rutas web
│   ├── auth.php           # Rutas de autenticación
│   ├── admin.php          # Rutas de administración
│   └── settings.php       # Rutas de configuración
└── public/                # Archivos públicos
```

## 🗄️ Modelos y Relaciones

### User (Usuario)
- Puede ser: Profesor o Alumno (definido por `role_id`)
- Los alumnos se relacionan con materias (many-to-many)
- Los profesores se relacionan con materias (many-to-many)

### Materia
- Tiene nombre y descripción
- Se relaciona con alumnos (many-to-many)
- Se relaciona con profesores (many-to-many)

### Role (Rol)
- Define los roles del sistema (Profesor, Alumno)
- Se relaciona con usuarios (one-to-many)


## 🧪 Testing

```bash
# Ejecutar tests
php artisan test

# Con cobertura
php artisan test --coverage
```



## 👤 Autor

**Alexis SM**
- GitHub: [@AlexisSM377](https://github.com/AlexisSM377)

