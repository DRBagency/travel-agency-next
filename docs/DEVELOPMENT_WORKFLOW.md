# Development Workflow

> **Última actualización:** 10 Febrero 2026

## 🔄 Flujo de Desarrollo Estándar

### Herramientas en uso:
- **IDE:** VS Code
- **AI Assistant:** Claude Code (integrado en VS Code)
- **Version Control:** Git + GitHub
- **Deployment:** Vercel (auto-deploy desde main)
- **Database:** Supabase (PostgreSQL)
- **Testing:** Stripe CLI (webhooks locales)

## 📝 Workflow: Nueva Feature

### 1️⃣ Planificación
- Definir alcance de la feature
- Identificar tablas/APIs necesarias
- Decidir dónde va la UI (owner/admin)
- Revisar si afecta billing/pagos

### 2️⃣ Base de Datos (si aplica)

**A. Crear migración:**
touch supabase/migrations/20260210120000_add_feature_name.sql

**B. Escribir SQL con RLS, índices y triggers**

**C. Ejecutar:**
supabase db push

### 3️⃣ Backend (Server Actions / API Routes)

**Crear funciones helper y server actions**

### 4️⃣ Frontend (UI)

**Implementar CRUD completo:**
- ✅ Formulario de creación
- ✅ Lista/tabla de items
- ✅ Botón de edición
- ✅ Botón de eliminación
- ✅ Validaciones
- ✅ Loading states
- ✅ Error handling

### 5️⃣ Testing

**Checklist:**
- [ ] Crear item
- [ ] Editar item
- [ ] Eliminar item
- [ ] Validaciones funcionan
- [ ] Errores se muestran bien
- [ ] Loading states visibles
- [ ] Responsive (mobile/desktop)

### 6️⃣ Commit & Deploy

git add .
git commit -m "feat: add feature name with CRUD"
git push origin main

### 7️⃣ Documentación

**Actualizar:**
- DATABASE_SCHEMA.md
- CURRENT_STATE.md

## 🔧 Comandos Útiles

### Supabase:
supabase db push
supabase migration list
supabase db logs

### Stripe:
stripe login
stripe listen --forward-to localhost:3000/api/stripe/billing/webhook
stripe trigger customer.subscription.created

### Git:
git status
git log --oneline -10
git push origin main

## 📋 Checklist Pre-Deploy

- [ ] Build funciona local (`npm run build`)
- [ ] No hay errores de TypeScript
- [ ] Migraciones aplicadas en Supabase
- [ ] Environment variables configuradas en Vercel
- [ ] Testing manual hecho
- [ ] Documentación actualizada
- [ ] Commit message descriptivo
