---
name: sync-docs
allowed-tools: Read, Write, Bash(find:*), Bash(cat:*), Bash(mkdir:*), Bash(ls:*), Bash(git diff:*), Bash(git log:*), Bash(git status:*)
description: Sincroniza y actualiza toda la documentación del proyecto DRB Agency - CLAUDE.md, /docs, skills, memory, agents y rules
argument-hint: [full | quick | section:<nombre>]
---

# 🔄 DRB Agency — Sync Docs

Eres el documentador maestro del proyecto DRB Agency. Tu trabajo es analizar el estado actual del código y actualizar TODA la documentación del proyecto para que cualquier instancia de Claude (Code, chat, agentes) tenga contexto completo y actualizado.

## Contexto actual del proyecto
- Estado git: !`git status --short`
- Rama: !`git branch --show-current`
- Últimos 10 commits: !`git log --oneline -10`
- Estructura de carpetas principales: !`ls -la`

## Modo de ejecución

Según el argumento recibido ($ARGUMENTS):
- **`full`** (o sin argumento): Actualiza TODO — escaneo completo del proyecto
- **`quick`**: Solo actualiza lo que cambió desde el último commit
- **`section:<nombre>`**: Actualiza solo una sección específica (claude, docs, skills, memory, agents, rules)

## Archivos a mantener sincronizados

### 1. CLAUDE.md (raíz del proyecto)
**Propósito**: Memoria del proyecto para Claude Code
**Ubicación**: `./CLAUDE.md`

Debe contener siempre:
- Stack técnico actual (Next.js, Supabase, Tailwind, Stripe)
- Principios de arquitectura (Zero Supabase Access, etc.)
- Estructura de carpetas del proyecto con descripción breve de cada una
- Convenciones de código (naming, imports, componentes)
- Colores corporativos (#1CABB0 turquesa, #D4F24D lime)
- Flujos de negocio clave (booking 4 pasos, pagos, landing pages)
- Comandos útiles (dev, build, deploy)
- Estado actual: qué está funcionando, qué está en progreso, qué falta
- Integraciones activas (Stripe, Google Calendar, Meta API, Claude API)
- Variables de entorno necesarias (sin valores, solo nombres)

### 2. /docs (documentación técnica)
**Propósito**: Documentación detallada por dominio
**Ubicación**: `./docs/`

Estructura esperada:
```
docs/
├── ARCHITECTURE.md      # Arquitectura general, diagramas, decisiones
├── BOOKING-FLOW.md      # Flujo de reservas de 4 pasos detallado
├── DATABASE.md           # Schema de Supabase, tablas, relaciones, RLS
├── PAYMENTS.md           # Integración Stripe, flujos de pago, webhooks
├── LANDING-PAGES.md      # Sistema de templates, personalización por agencia
├── AI-FEATURES.md        # Features de IA: generación, chatbot, itinerarios
├── API-ROUTES.md         # Endpoints del API, parámetros, respuestas
├── DEPLOY.md             # Workflow VS Code → GitHub → Vercel
├── INTEGRATIONS.md       # Google Calendar, Meta API, TikTok
├── MULTI-LANGUAGE.md     # Sistema i18n: ES, EN, AR (RTL)
└── CHANGELOG.md          # Historial de cambios significativos
```

### 3. Skills de Claude Code
**Propósito**: Habilidades reutilizables específicas de DRB
**Ubicación**: `.claude/skills/`

Skills a mantener:
```
.claude/skills/
├── drb-component/SKILL.md    # Crear componentes UI con estilo DRB
├── drb-landing/SKILL.md      # Generar landing pages para agencias
├── drb-booking/SKILL.md      # Trabajar con el flujo de reservas
├── drb-api/SKILL.md          # Crear/modificar API routes
└── drb-database/SKILL.md     # Queries y migraciones Supabase
```

### 4. Memory
**Propósito**: Contexto persistente entre sesiones
**Ubicación**: `~/.claude/projects/<project-hash>/memory/MEMORY.md`

Debe reflejar:
- Decisiones de diseño recientes
- Bugs conocidos y workarounds
- Features completadas vs pendientes del sprint
- Preferencias del desarrollador (Sami)

### 5. Agents (subagentes)
**Propósito**: Agentes especializados para tareas complejas
**Ubicación**: `.claude/agents/`

Agentes a mantener:
```
.claude/agents/
├── reviewer.md       # Revisa código con contexto DRB
├── designer.md       # Genera UI/UX con el design system DRB
├── tester.md         # Testea flujos críticos (booking, pagos)
└── deployer.md       # Gestiona deploy y verificación
```

### 6. Rules
**Propósito**: Reglas que Claude Code SIEMPRE debe seguir
**Ubicación**: `.claude/rules/`

Rules a mantener:
```
.claude/rules/
├── code-style.md         # Convenciones de código obligatorias
├── supabase-access.md    # NUNCA acceso directo a Supabase (Zero Access)
├── brand-colors.md       # Siempre usar colores corporativos
├── spanish-first.md      # Comentarios y UI en español por defecto
└── security.md           # Reglas de seguridad para Stripe y auth
```

## Proceso de sincronización

### Paso 1: Escanear
Analiza el código fuente actual del proyecto:
- Lee los archivos principales: `package.json`, `next.config.*`, `tailwind.config.*`
- Escanea la estructura de carpetas: `app/`, `components/`, `lib/`, `utils/`, `public/`
- Identifica rutas API: `app/api/`
- Revisa el schema de base de datos si existe
- Detecta integraciones (Stripe, Supabase client, API calls)
- Lee los `git diff` recientes para detectar cambios

### Paso 2: Comparar
Para cada archivo de documentación:
- Si existe → léelo y compara con el estado actual del código
- Si no existe → créalo desde cero
- Identifica discrepancias (docs desactualizadas, features nuevas no documentadas)

### Paso 3: Actualizar
Para cada archivo que necesite cambios:
- Muestra un resumen de qué va a cambiar y por qué
- Pide confirmación antes de escribir (excepto en modo `full` donde actualiza todo)
- Escribe los cambios manteniendo el formato y estilo existente
- Añade timestamp de última actualización al final de cada archivo

### Paso 4: Reportar
Al finalizar, muestra un resumen:
```
📋 Sync Report — DRB Agency
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Actualizados: [lista]
🆕 Creados: [lista]  
⏭️ Sin cambios: [lista]
⚠️ Requieren revisión manual: [lista]
━━━━━━━━━━━━━━━━━━━━━━━━━━
Última sync: [fecha y hora]
```

## Reglas importantes

1. **No inventar**: Solo documenta lo que realmente existe en el código. Si no puedes verificar algo, márcalo con `<!-- TODO: verificar -->`
2. **Mantener formato**: Si un archivo ya existe, respeta su estructura y solo actualiza el contenido
3. **Español primero**: Toda la documentación en español excepto código y términos técnicos
4. **Ser conciso**: La documentación debe ser útil, no verbosa. Prioriza ejemplos sobre explicaciones largas
5. **Timestamps**: Añade `> Última actualización: YYYY-MM-DD HH:MM` al final de cada archivo modificado
6. **Git friendly**: Los cambios deben ser fáciles de revisar en un diff
