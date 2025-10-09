# Recurring Transactions - Ejecución Automática

## 🎯 ¿Qué es esto?

Las **Recurring Transactions** son transacciones que se repiten automáticamente según una frecuencia definida (diario, semanal, mensual, anual).

El sistema automático **crea transacciones reales** sin que tengas que hacerlo manualmente.

---

## 🏗️ Cómo Funciona

### 1. **Crear Recurring Transaction** (Manual)
Vas a `/recurring` y creas una transacción recurrente:
- **Ejemplo**: "Monthly Salary" - $3,000 - Cada 1 de mes

### 2. **Cron Job Ejecuta Automáticamente** (Automático)
- Vercel ejecuta un cron job **cada día a las 00:00 UTC**
- El cron job llama a `/api/cron/process-recurring`
- El sistema busca recurring transactions donde `next_run_at <= NOW()`
- Crea transacciones reales en la tabla `transactions`
- Actualiza `next_run_at` para la próxima ejecución

### 3. **Ves la Transacción** (Automático)
- La nueva transacción aparece en `/transactions`
- No tuviste que hacer nada

---

## ⚙️ Configuración

### Paso 1: Configurar el Secret en Vercel

El cron job está protegido con un token secreto. Necesitas configurar la variable de entorno `CRON_SECRET` en Vercel:

1. **Ve a tu proyecto en Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Settings → Environment Variables**

3. **Agregar nueva variable:**
   - **Key**: `CRON_SECRET`
   - **Value**: Genera un token secreto seguro (puedes usar un UUID o una cadena aleatoria)
   - **Environments**: Marca **Production**, **Preview**, y **Development**

   **Ejemplo de valor seguro:**
   ```
   cron_secret_a1b2c3d4e5f6g7h8i9j0
   ```

4. **Click "Save"**

5. **Redeploy tu aplicación:**
   - Ve a "Deployments"
   - Click en el último deployment
   - Click "⋯" → "Redeploy"
   - **Desactiva** "Use existing Build Cache"
   - Click "Redeploy"

### Paso 2: Verificar que el Cron está Configurado

1. **Ve a Settings → Cron Jobs en Vercel**
2. Deberías ver:
   ```
   Path: /api/cron/process-recurring
   Schedule: 0 0 * * * (Daily at 00:00 UTC)
   Status: Active
   ```

---

## 📅 Frecuencias Soportadas

### Daily (Diario)
- **Interval Value**: Cada N días
- **Ejemplo**: Cada 1 día = Diario

### Weekly (Semanal)
- **Interval Value**: Cada N semanas
- **Day of Week**: Día de la semana (0 = Domingo, 6 = Sábado)
- **Ejemplo**: Cada 1 semana, los lunes

### Monthly (Mensual)
- **Interval Value**: Cada N meses
- **Day of Month**: Día del mes (1-31)
- **Ejemplo**: Cada 1 mes, el día 1

### Yearly (Anual)
- **Interval Value**: Cada N años
- **Day of Month**: Día del mes
- **Ejemplo**: Cada 1 año, el 1 de enero

---

## 🔍 Ejemplos de Uso

### Salario Mensual
```
Description: Monthly Salary
Amount: $3,000
Frequency: Monthly
Interval Value: 1
Day of Month: 1
Category: Salary (income)
```
→ Crea transacción el día 1 de cada mes

### Suscripción Netflix
```
Description: Netflix Subscription
Amount: -$15.99
Frequency: Monthly
Interval Value: 1
Day of Month: 15
Category: Entertainment (expense)
```
→ Crea transacción el día 15 de cada mes

### Ahorro Semanal
```
Description: Weekly Savings
Amount: -$100
Frequency: Weekly
Interval Value: 1
Day of Week: 5 (Friday)
Category: Savings (transfer)
```
→ Crea transacción cada viernes

---

## 🧪 Testing Local

Para probar el cron job localmente:

### 1. Configurar el Secret Local

Agrega a tu `.env.local`:
```bash
CRON_SECRET=cron_secret_a1b2c3d4e5f6g7h8i9j0
```

### 2. Ejecutar el Cron Manualmente

Usando curl:
```bash
curl -X POST http://localhost:3000/api/cron/process-recurring \
  -H "Authorization: Bearer cron_secret_a1b2c3d4e5f6g7h8i9j0"
```

### 3. Verificar el Resultado

Deberías ver en la respuesta:
```json
{
  "success": true,
  "message": "Processed X of Y recurring transactions",
  "processed": 2,
  "results": [
    {
      "recurring_id": "...",
      "success": true,
      "next_run": "2025-03-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2025-02-01T12:00:00.000Z"
}
```

---

## 🛠️ Troubleshooting

### Problema: El cron no se ejecuta

**Solución:**
1. Verifica que `CRON_SECRET` está configurado en Vercel
2. Verifica que el cron job está activo en Settings → Cron Jobs
3. Revisa los logs en Vercel Dashboard → Logs

### Problema: "Unauthorized" en los logs

**Solución:**
- El `CRON_SECRET` no coincide
- Verifica que configuraste la variable correctamente en Vercel

### Problema: No se crean transacciones

**Solución:**
1. Verifica que la recurring transaction tiene `enabled = true`
2. Verifica que `next_run_at` es una fecha pasada
3. Revisa los logs en Vercel para ver errores específicos

---

## 📊 Monitoreo

### Ver Logs del Cron Job

1. **Ve a Vercel Dashboard → Logs**
2. Filtra por:
   - **Path**: `/api/cron/process-recurring`
   - **Method**: `POST`

3. Verás logs como:
   ```
   🚀 Starting recurring transactions processing...
   ✅ Processed recurring transaction abc123: Created transaction and updated next run to 2025-03-01T00:00:00.000Z
   ✅ Recurring transactions processing complete: { processed: 2 }
   ```

### Ver Historial de Ejecuciones

En Settings → Cron Jobs, puedes ver:
- **Last Execution**: Cuándo se ejecutó por última vez
- **Status**: Success / Failed
- **Next Execution**: Cuándo se ejecutará próximamente

---

## 🔐 Seguridad

### ¿Por qué usar CRON_SECRET?

Sin el secret, **cualquiera** podría llamar a tu API y crear transacciones falsas.

El `Authorization: Bearer {CRON_SECRET}` asegura que **solo Vercel** (o tú con el token) puede ejecutar el cron job.

### Mejores Prácticas

1. **Usa un token aleatorio fuerte** (mínimo 32 caracteres)
2. **No compartas el secret** públicamente
3. **Rota el secret periódicamente** (cada 6-12 meses)

---

## 💰 Costos

### Vercel Cron Jobs - Gratis

- **Plan Hobby**: 1 cron job gratis
- **Límites**: Hasta 100 ejecuciones/día
- **Nuestro uso**: 1 ejecución/día = **Gratis**

### Supabase

Las operaciones (insert, update) están dentro del plan gratuito:
- **Plan Free**: 500 MB de base de datos
- **50,000 filas insertadas/mes**
- Asumiendo 10 recurring transactions, son **300 inserts/mes** = **Gratis**

---

## 🚀 Próximos Pasos

1. ✅ **Configurar `CRON_SECRET`** en Vercel
2. ✅ **Crear algunas Recurring Transactions** de prueba
3. ✅ **Esperar al día siguiente** y verificar que se crearon transacciones
4. ✅ **Monitorear logs** en Vercel

---

## 📚 Recursos Adicionales

- **Vercel Cron Jobs Documentation**: https://vercel.com/docs/cron-jobs
- **Cron Expression Syntax**: https://crontab.guru/
- **Supabase RLS Policies**: https://supabase.com/docs/guides/auth/row-level-security

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs** en Vercel Dashboard
2. **Ejecuta el cron manualmente** con curl para probar
3. **Verifica las variables de entorno** en Vercel
4. **Revisa la tabla `recurring_transactions`** en Supabase para confirmar que `enabled = true` y `next_run_at` es correcto

---

¡Listo! Las recurring transactions ahora se ejecutan automáticamente todos los días a las 00:00 UTC. 🎉

