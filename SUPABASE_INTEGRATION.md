# Integración con Supabase - Mini Arcade

## ✅ Archivos Creados

### Configuración

- `.env` - Variables de entorno con credenciales de Supabase
- `.env.example` - Plantilla de variables de entorno
- `src/lib/supabase.ts` - Cliente de Supabase configurado
- `src/types/database.ts` - Tipos TypeScript para la base de datos

### Autenticación y Perfiles

- `src/lib/auth.ts` - Funciones auxiliares de autenticación
- `src/components/sections/FormClient.tsx` - Componente de registro (modificado)
- `src/components/sections/LoginClient.tsx` - Componente de inicio de sesión
- `src/pages/login.astro` - Página de login

### Documentación

- `SUPABASE_SETUP.md` - Guía completa de configuración

## 📋 Funcionalidades Implementadas

### Sistema de Registro

- ✅ Registro con email y password
- ✅ Validación de nick único (3-15 caracteres)
- ✅ Selección de avatar de 8 opciones
- ✅ Validación de formularios
- ✅ Mensajes de error y éxito
- ✅ Redirección automática tras registro

### Sistema de Login

- ✅ Inicio de sesión con email y password
- ✅ Gestión de sesiones con Supabase Auth
- ✅ Mensajes de error
- ✅ Enlaces entre login y registro

### Base de Datos

- ✅ Tabla `profiles` con relación a `auth.users`
- ✅ Nick único por usuario
- ✅ Avatar personalizable
- ✅ Timestamps automáticos (created_at, updated_at)
- ✅ Row Level Security (RLS) configurado

## 🚀 Próximos Pasos

Para comenzar a usar Supabase:

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Copia la URL y la clave anónima

2. **Configurar variables de entorno**

   ```bash
   # Edita el archivo .env
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu-clave-anonima
   ```

3. **Configurar la base de datos**
   - Sigue las instrucciones en `SUPABASE_SETUP.md`
   - Ejecuta el SQL proporcionado en tu proyecto de Supabase
   - Configura las políticas de seguridad

4. **Iniciar el servidor**

   ```bash
   pnpm dev
   ```

5. **Probar el registro**
   - Ve a `/signup`
   - Crea un usuario de prueba
   - Verifica en Supabase que se creó correctamente

## 📚 Estructura de Datos

### Tabla: profiles

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key a auth.users)
- nick: TEXT (UNIQUE, NOT NULL)
- avatar: TEXT (NOT NULL)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Avatares Disponibles

- batman
- superman
- wonder-woman
- the-flash
- green-lantern
- supergirl
- cyborg
- catwoman

## 🔐 Seguridad

- ✅ Variables de entorno en `.gitignore`
- ✅ Row Level Security habilitado
- ✅ Validación de nicks únicos
- ✅ Autenticación con Supabase Auth
- ✅ Políticas de base de datos configuradas

## 🛠️ Funciones Auxiliares

El archivo `src/lib/auth.ts` incluye funciones útiles:

```typescript
// Obtener usuario actual
getCurrentUser(): Promise<User | null>

// Obtener perfil actual
getCurrentProfile(): Promise<Profile | null>

// Verificar disponibilidad de nick
isNickAvailable(nick: string): Promise<boolean>

// Iniciar sesión
signIn(email: string, password: string)

// Cerrar sesión
signOut(): Promise<void>

// Actualizar perfil
updateProfile(userId: string, updates: ProfileUpdate)
```

## 📝 Notas Importantes

1. Las variables de entorno deben tener el prefijo `PUBLIC_` para ser accesibles en el cliente
2. El nick debe cumplir el patrón: `[a-zA-Z][a-zA-Z0-9]{2,14}`
3. La contraseña debe tener al menos 6 caracteres
4. Cada usuario puede tener solo un perfil
5. El email debe ser único en Supabase Auth

## 🔄 Próximas Mejoras Sugeridas

- [ ] Página de perfil de usuario
- [ ] Sistema de puntuaciones/ranking
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Edición de perfil (cambiar avatar/nick)
- [ ] Historial de juegos
- [ ] Estadísticas de usuario
- [ ] Sistema de logros/badges
