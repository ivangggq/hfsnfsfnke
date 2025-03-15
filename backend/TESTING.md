# Guía de Pruebas - EasyCert Backend

Esta guía proporciona instrucciones para probar las funcionalidades principales del backend de EasyCert, incluidas las nuevas características de plantillas de seguridad e inferencia IA.

## Requisitos Previos

1. Backend y base de datos en ejecución (usando Docker Compose o instalación local)
2. Postman, Insomnia, o cualquier cliente HTTP para realizar las solicitudes
3. Token JWT válido obtenido tras iniciar sesión

## 1. Flujo Completo de Prueba

### Registro e Inicio de Sesión

1. **Registro de usuario**

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Usuario",
  "lastName": "Prueba",
  "email": "usuario@prueba.com",
  "password": "Password123!"
}
```

2. **Inicio de sesión**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@prueba.com",
  "password": "Password123!"
}
```

Guarda el token JWT recibido (`accessToken`) para usarlo en las siguientes solicitudes.

### Plantillas de Seguridad

3. **Ver plantillas predeterminadas**

```http
GET /api/security-templates?default=true
Authorization: Bearer [JWT_TOKEN]
```

Deberías recibir un listado de las plantillas predefinidas por industria. Anota el ID de una de ellas para el siguiente paso.

4. **Ver detalles de una plantilla**

```http
GET /api/security-templates/[ID_PLANTILLA]
Authorization: Bearer [JWT_TOKEN]
```

### Empresas con Plantillas

5. **Crear empresa usando una plantilla**

```http
POST /api/companies
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "name": "Mi Empresa de Prueba",
  "industry": "Tecnología",
  "description": "Empresa para probar la aplicación",
  "securityTemplateId": "ID_DE_LA_PLANTILLA"
}
```

6. **Ver la empresa creada**

```http
GET /api/companies
Authorization: Bearer [JWT_TOKEN]
```

Verifica que la información de seguridad se haya aplicado correctamente. Anota el ID de la empresa.

### Generación de Documentos con Inferencia IA

7. **Generar Evaluación de Riesgos**

```http
POST /api/documents
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "name": "Evaluación de Riesgos",
  "type": "risk_assessment",
  "description": "Evaluación de riesgos basada en IA",
  "companyId": "ID_DE_LA_EMPRESA",
  "parameters": {}
}
```

8. **Listar documentos de la empresa**

```http
GET /api/documents?companyId=ID_DE_LA_EMPRESA
Authorization: Bearer [JWT_TOKEN]
```

9. **Descargar el documento generado**

```http
GET /api/documents/[ID_DOCUMENTO]/download
Authorization: Bearer [JWT_TOKEN]
```

## 2. Prueba de la Integración de Plantillas

### Actualizar empresa con nueva plantilla

```http
PUT /api/companies/[ID_EMPRESA]
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "securityTemplateId": "ID_DE_OTRA_PLANTILLA"
}
```

Verifica que los elementos de la plantilla se hayan añadido a la información de seguridad existente sin eliminar los datos previos.

## 3. Prueba del Sistema de Inferencia

1. **Personaliza la información de seguridad**

```http
PUT /api/companies/[ID_EMPRESA]
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "securityInfo": {
    "informationAssets": ["Base de datos de clientes", "Código fuente", "Credenciales de acceso"],
    "threats": ["Acceso no autorizado", "Malware", "Fuga de información"],
    "vulnerabilities": ["Contraseñas débiles", "Software desactualizado", "Falta de cifrado"],
    "existingMeasures": ["Antivirus", "Firewall", "Copias de seguridad"]
  }
}
```

2. **Genera nuevamente una Evaluación de Riesgos**

```http
POST /api/documents
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "name": "Evaluación de Riesgos Personalizada",
  "type": "risk_assessment",
  "description": "Evaluación con datos personalizados",
  "companyId": "ID_DE_LA_EMPRESA",
  "parameters": {}
}
```

3. **Descarga y revisa el documento**

Verifica que el documento contenga escenarios de riesgo coherentes con la información de seguridad personalizada.

## 4. Prueba de Errores y Casos Límite

### Intenta usar una plantilla inexistente

```http
POST /api/companies
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "name": "Empresa con Plantilla Inválida",
  "securityTemplateId": "00000000-0000-0000-0000-000000000000"
}
```

### Genera un documento con información de seguridad vacía

```http
PUT /api/companies/[ID_EMPRESA]
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "securityInfo": {
    "informationAssets": [],
    "threats": [],
    "vulnerabilities": [],
    "existingMeasures": []
  }
}
```

Luego intenta generar una evaluación de riesgos y verifica que el sistema maneje correctamente el caso de falta de información.

## 5. Extensión y Personalización (Para Desarrolladores)

### Añadir una plantilla personalizada

```http
POST /api/security-templates
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]

{
  "name": "Mi Plantilla Personalizada",
  "industry": "Mi Industria",
  "description": "Una plantilla personalizada para mi tipo de negocio",
  "template": {
    "informationAssets": ["Activo 1", "Activo 2", "Activo 3"],
    "threats": ["Amenaza 1", "Amenaza 2", "Amenaza 3"],
    "vulnerabilities": ["Vulnerabilidad 1", "Vulnerabilidad 2", "Vulnerabilidad 3"],
    "existingMeasures": ["Medida 1", "Medida 2", "Medida 3"]
  },
  "isDefault": false
}
```

Nota: Esta operación requiere permisos de administrador. Si usas una cuenta de usuario normal, debería recibir un error de autorización.

## Resolución de Problemas

- **Error 401**: Verifica que estás incluyendo el token JWT correcto y que no ha expirado
- **Error 403**: No tienes permiso para acceder al recurso (verificar roles)
- **Error 404**: El recurso no existe (verificar IDs)
- **Error 500**: Error interno del servidor (revisar logs)

Para ver los logs detallados del servidor, ejecuta:

```bash
docker logs easycert-backend
```

o si estás ejecutando localmente:

```bash
npm run start:dev
```