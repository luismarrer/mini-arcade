# Configuración de Supabase

Este documento describe cómo configurar Supabase para el proyecto Mini Arcade.

## 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta si no tienes una
2. Crea un nuevo proyecto
3. Guarda la URL del proyecto y la clave anónima (anon key)

## 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y actualiza las variables:

```bash
cp .env.example .env
```

Edita `.env` y agrega tus credenciales:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

## 3. Configurar la base de datos

### 3.1 Crear la tabla de perfiles

Ve al SQL Editor en tu proyecto de Supabase y ejecuta el siguiente SQL:

```sql
-- Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nick TEXT NOT NULL UNIQUE,
  avatar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsqueda rápida por nick
CREATE INDEX profiles_nick_idx ON profiles(nick);

-- Crear índice para búsqueda por user_id
CREATE INDEX profiles_user_id_idx ON profiles(user_id);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver todos los perfiles
CREATE POLICY "Los perfiles son visibles para todos"
  ON profiles FOR SELECT
  USING (true);

-- Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Los usuarios pueden crear su perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Configurar autenticación

1. Ve a **Authentication > Providers** en tu panel de Supabase
2. Asegúrate de que el proveedor de **Email** esté habilitado
3. En **Authentication > Settings**:
   - Configura el **Site URL** (ej: `http://localhost:4321` para desarrollo)
   - Agrega **Redirect URLs** si es necesario (ej: `http://localhost:4321/**`)
   - Opcionalmente, deshabilita la confirmación de email para desarrollo:
     - Ve a **Authentication > Email Templates**
     - Desactiva "Enable email confirmations" si quieres registro instantáneo en desarrollo

### 3.3 Políticas de seguridad opcionales

Para evitar que usuarios creen múltiples perfiles, puedes agregar esta función:

```sql
-- Función para verificar que un usuario solo tenga un perfil
CREATE OR REPLACE FUNCTION check_user_has_no_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM profiles WHERE user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'El usuario ya tiene un perfil';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar antes de insertar
CREATE TRIGGER check_user_profile_before_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_user_has_no_profile();
```

## 4. Probar la integración

1. Inicia el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

2. Ve a la página de registro (`/signup`)

3. Crea un usuario de prueba con:
   - Nick único (3-15 caracteres, solo letras y números)
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Selecciona un avatar

4. Verifica en el panel de Supabase:
   - **Authentication > Users**: deberías ver el usuario creado
   - **Table Editor > profiles**: deberías ver el perfil con el nick y avatar

## 5. Avatares disponibles

Los avatares disponibles son:

- batman
- superman
- wonder-woman
- the-flash
- green-lantern
- supergirl
- cyborg
- catwoman

Las imágenes de los avatares están en `src/images/memory/avatars/` y `public/images/memory/avatars/`.

## 6. Próximos pasos

Una vez configurado Supabase, puedes:

- Agregar autenticación de inicio de sesión
- Guardar puntuaciones de juegos
- Crear un sistema de ranking
- Implementar perfiles de usuario editables
- Agregar más datos al perfil (estadísticas, juegos favoritos, etc.)

## Troubleshooting

### Error: "Missing Supabase environment variables"

- Asegúrate de que el archivo `.env` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar el `.env`

### Error: "User already registered"

- El email ya está registrado en Supabase Auth
- Intenta con otro email o elimina el usuario desde el panel de Supabase

### Error: "Este nick ya está en uso"

- El nick debe ser único
- Elige otro nick para el nuevo usuario

### Error: "duplicate key value violates unique constraint"

- Esto puede ocurrir si intentas crear múltiples perfiles para el mismo usuario
- Verifica que no haya triggers o políticas que lo permitan
