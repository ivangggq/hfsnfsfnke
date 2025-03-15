# EasyCert

EasyCert es una plataforma SaaS (Software as a Service) diseñada para ayudar a empresas a obtener la certificación ISO 27001 de manera sencilla y rápida. La aplicación permite a los usuarios ingresar información básica sobre su empresa y genera automáticamente los documentos necesarios para cumplir con los requisitos de la certificación ISO 27001.

## Tecnologías Utilizadas

### Backend
- **Framework**: NestJS con TypeScript
- **Base de datos**: PostgreSQL con TypeORM como ORM
- **Autenticación**: JWT (JSON Web Tokens) con Passport.js
- **Validación**: class-validator y class-transformer
- **Generación de PDFs**: PDFKit
- **Encriptación**: Argon2 para el hash de contraseñas
- **Logging**: Logger personalizado basado en NestJS Logger
- **IA**: Sistema de inferencia basado en reglas para relaciones de seguridad

### Frontend (en desarrollo)
- **Framework**: React con TypeScript
- **Enrutamiento**: React Router v6
- **Estado**: Context API de React
- **Peticiones HTTP**: Axios
- **Validación de formularios**: React Hook Form
- **Estilos**: TailwindCSS para utilidades CSS

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **backend**: Código del backend (NestJS + TypeScript)
- **frontend**: Código del frontend (React + TypeScript) - En desarrollo

## Requisitos

- Node.js 18 o superior
- Docker y Docker Compose (para desarrollo)
- PostgreSQL 15 o superior

## Configuración para Desarrollo

1. Clonar el repositorio:
```bash
git clone https://github.com/yourusername/easycert.git
cd easycert
```

2. Iniciar con Docker Compose:
```bash
docker-compose up
```

3. La API estará disponible en http://localhost:3000/api

## Características Principales

- **Gestión de Usuarios**: Registro, autenticación y gestión de perfiles.
- **Gestión de Empresas**: Creación y edición de datos de empresas.
- **Plantillas de Seguridad**: Biblioteca de plantillas predefinidas por industria.
- **Generación de Documentos**: Generación automática de documentos ISO 27001 en formato PDF.
- **Inferencia de Relaciones**: Sistema inteligente para inferir relaciones entre activos, amenazas y vulnerabilidades.
- **Dashboard**: Seguimiento del progreso de certificación.

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión

### Usuarios
- `GET /api/users/profile` - Obtener perfil del usuario actual
- `PUT /api/users/profile` - Actualizar perfil del usuario actual

### Empresas
- `POST /api/companies` - Crear nueva empresa (puede usar securityTemplateId para aplicar plantilla)
- `GET /api/companies` - Obtener empresas del usuario
- `GET /api/companies/:id` - Obtener detalles de una empresa
- `PUT /api/companies/:id` - Actualizar una empresa (puede usar securityTemplateId para aplicar plantilla)
- `DELETE /api/companies/:id` - Eliminar una empresa

### Plantillas de Seguridad
- `GET /api/security-templates` - Obtener todas las plantillas de seguridad
- `GET /api/security-templates?default=true` - Obtener plantillas predeterminadas
- `GET /api/security-templates?industry=:industry` - Filtrar plantillas por industria
- `GET /api/security-templates/:id` - Obtener detalles de una plantilla específica
- `POST /api/security-templates` - Crear nueva plantilla (solo admin)
- `PUT /api/security-templates/:id` - Actualizar plantilla (solo admin)
- `DELETE /api/security-templates/:id` - Eliminar plantilla (solo admin)

### Documentos
- `POST /api/documents` - Generar nuevo documento
- `GET /api/documents?companyId=:companyId` - Obtener documentos de una empresa
- `GET /api/documents/:id` - Obtener detalles de un documento
- `GET /api/documents/:id/download` - Descargar un documento
- `DELETE /api/documents/:id` - Eliminar un documento

## Flujo de Uso Típico

1. **Registro e Inicio de Sesión**:
   - Crear una cuenta de usuario
   - Iniciar sesión para obtener token JWT

2. **Crear Empresa**:
   - Proporcionar información básica de la empresa
   - Opcionalmente, seleccionar una plantilla de seguridad predefinida según industria

3. **Personalizar Información de Seguridad**:
   - Editar los activos, amenazas, vulnerabilidades y medidas predefinidas
   - Agregar elementos específicos de la empresa

4. **Generar Documentos**:
   - Seleccionar tipo de documento (Alcance, Política, Evaluación de Riesgos, etc.)
   - El sistema utiliza la información de seguridad y reglas basadas en IA para inferir relaciones
   - Se genera el documento en formato PDF

5. **Revisar y Descargar**:
   - Visualizar el documento generado
   - Realizar ajustes si es necesario (a través de regeneración)
   - Descargar el documento final

## Licencia

Todos los derechos reservados.