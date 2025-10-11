# Configuración de URLs en Supabase

## Problema
El email de verificación redirige a `localhost` en lugar de tu dominio de Vercel.

## Solución

### 1. Ve a Supabase Dashboard
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Authentication** → **URL Configuration**

### 2. Configura estas URLs:

#### Site URL (URL del sitio):
```
https://tu-app.vercel.app
```
**Ejemplo:** `https://finance-tracker-abc123.vercel.app`

#### Redirect URLs (URLs de redirección):
Añade AMBAS URLs (una por línea):
```
https://tu-app.vercel.app/auth/callback
https://tu-app.vercel.app/**
```

### 3. Guarda los cambios

### 4. URLs Importantes:

- **Production URL**: Tu dominio de Vercel (https://tu-app.vercel.app)
- **Callback URL**: `https://tu-app.vercel.app/auth/callback`
- **Redirect after signup**: `/dashboard`

## ¿Cómo encontrar tu URL de Vercel?

1. Ve a https://vercel.com/dashboard
2. Abre tu proyecto "Finance"
3. Copia la URL del dominio (termina en `.vercel.app`)

## Verificar que funciona:

1. Cierra sesión completamente
2. Regístrate con un nuevo email
3. Ve a tu correo y haz clic en "Confirm Email"
4. Deberías ser redirigido a `https://tu-app.vercel.app/dashboard`

## Notas:
- Debes usar la URL de PRODUCCIÓN (Vercel), no localhost
- Los cambios pueden tardar 1-2 minutos en aplicarse
- Si cambias el dominio de Vercel, actualiza estas URLs

