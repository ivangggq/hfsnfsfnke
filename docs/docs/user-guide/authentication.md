# Autenticación en EasyCert

## Proceso de Registro de Usuario

### Creación de una Nueva Cuenta

1. Navega a la página de registro
2. Completa el formulario de registro:
   - Ingresa tu nombre
   - Proporciona una dirección de correo electrónico válida
   - Crea una contraseña segura

!!! nota "Requisitos de Contraseña"
    Tu contraseña debe:
    
    - Tener al menos 8 caracteres
    - Contener al menos una letra mayúscula
    - Incluir al menos un número
    - Tener al menos un carácter especial

## Procedimientos de Inicio de Sesión

### Inicio de Sesión Estándar

1. Ingresa la dirección de correo electrónico registrada
2. Introduce tu contraseña
3. Haz clic en el botón "Iniciar Sesión"

### Recuperación de Contraseña

- Haz clic en el enlace "Olvidé mi contraseña"
- Ingresa tu dirección de correo electrónico registrada
- Sigue las instrucciones de restablecimiento de contraseña enviadas a tu correo

## Métodos de Autenticación

### Autenticación Principal

- Inicio de sesión basado en correo electrónico y contraseña
- Gestión de sesiones segura mediante JWT (JSON Web Token)

### Características de Seguridad Avanzadas

- Autenticación de dos factores opcional
- Bloqueo de cuenta después de múltiples intentos fallidos de inicio de sesión
- Mecanismo seguro de restablecimiento de contraseña

## Mejores Prácticas de Seguridad

!!! advertencia "Protege Tu Cuenta"
    - Utiliza una contraseña única para EasyCert
    - Activa la autenticación de dos factores
    - Nunca compartas tus credenciales de inicio de sesión
    - Actualiza tu contraseña regularmente
    - Cierra sesión en computadoras compartidas o públicas

## Resolución de Problemas de Inicio de Sesión

### Problemas Comunes

- Correo electrónico o contraseña incorrectos
- Cuenta bloqueada temporalmente
- Problemas de compatibilidad con el navegador

!!! consejo "¿Necesitas Ayuda?"
    Si encuentras problemas persistentes de inicio de sesión, contacta a nuestro equipo de soporte en soporte@easycert.com

## Consideraciones de Seguridad

- **Cifrado de Contraseñas**: Utilizamos Argon2 para hash de contraseñas
- **Protección contra Ataques**:
  - Prevención de ataques de fuerza bruta
  - Límite de intentos de inicio de sesión
  - Bloqueo temporal de cuentas
- **Gestión de Tokens**:
  - Tokens JWT con caducidad de 24 horas
  - Rotación de tokens
  - Invalidación de tokens en cierre de sesión

## Preguntas Frecuentes

### ¿Qué hago si no recibo el correo de verificación?

- Revisa tu carpeta de spam
- Solicita un nuevo correo de verificación
- Contacta al soporte si el problema persiste

### ¿Cómo puedo cambiar mi contraseña?

- Inicia sesión en tu cuenta
- Navega a la sección de configuración de perfil
- Selecciona "Cambiar Contraseña"

### ¿Qué hacer si mi cuenta está bloqueada?

- Espera 30 minutos
- Contacta al soporte si el bloqueo persiste

**Última actualización**: Marzo 2025