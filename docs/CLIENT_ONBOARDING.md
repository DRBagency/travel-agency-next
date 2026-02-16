# Proceso de Onboarding de Clientes

> **Última actualización:** 10 Febrero 2026
> **Objetivo:** Guía paso a paso para incorporar nuevos clientes

## 🎯 Objetivo del Onboarding

**Meta:** Que el cliente tenga su web publicada y haga su primera reserva en menos de 7 días.

**KPIs de éxito:**
- ✅ Web publicada: Día 3
- ✅ Primera reserva: Día 7
- ✅ Cliente satisfecho: NPS > 8

---

## 📋 FASE 1: PRE-VENTA

### Paso 1.1: Lead llega (Inbound/Outbound)
**Origen posible:**
- Web (formulario de contacto)
- Email directo
- LinkedIn
- Recomendación

**Acción inmediata:**
- [ ] Responder en <2 horas
- [ ] Agendar demo (Calendly)
- [ ] Enviar email de bienvenida

**Template email:**
Asunto: ¡Hola [Nombre]! 👋 Demo de DRB Agency
Hola [Nombre],
Gracias por tu interés en DRB Agency. Me encantaría mostrarte cómo podemos ayudarte a digitalizar tu agencia.
¿Te viene bien [fecha/hora] para una demo de 30 minutos?
Mientras tanto, puedes ver nuestra demo en vivo: [link]
¡Un saludo!
[Tu nombre]

### Paso 1.2: Demo (30 minutos)
**Estructura:**
- Min 0-5: Presentación y contexto del cliente
- Min 5-15: Demo en vivo (mostrar panel admin)
- Min 15-25: Responder preguntas
- Min 25-30: Pricing y próximos pasos

**Script de demo:**
1. "Esto es lo que ve tu cliente cuando entra a tu web..."
2. "Así creas un destino nuevo en 2 minutos..."
3. "Así procesas una reserva con Stripe..."
4. "Tus clientes reciben este email automáticamente..."

**Preguntas clave a hacer:**
- ¿Cuántas reservas haces al mes?
- ¿Tienes web actualmente?
- ¿Cómo gestionas reservas ahora?
- ¿Qué es lo que más te frustra?

### Paso 1.3: Propuesta comercial
**Elementos:**
- Plan recomendado según volumen
- Precio mensual
- Setup fee (si aplica): €0 (promotional)
- Tiempo de implementación: 1 semana
- Soporte incluido

**Enviar propuesta:**
Asunto: Propuesta DRB Agency para [Nombre Agencia]
Hola [Nombre],
Tras nuestra conversación, te propongo lo siguiente:
📦 PLAN: Grow (59€/mes)
✅ Web completa personalizada
✅ Sistema de reservas con Stripe
✅ Emails automáticos
✅ Soporte prioritario
✅ Tarifa: 3% por reserva
🎁 BONUS:

Setup gratuito (valor: 500€)
Primer mes 50% descuento
Onboarding personalizado 1:1

⏱️ TIMELINE:

Día 1: Alta en plataforma
Día 2-3: Personalización web
Día 4-5: Configuración Stripe
Día 6-7: Testing y publicación

¿Te parece bien? Podemos empezar mañana mismo.
[Tu nombre]

---

## 📋 FASE 2: CONTRATACIÓN

### Paso 2.1: Cliente acepta
**Acciones inmediatas:**
- [ ] Enviar contrato (DocuSign o similar)
- [ ] Solicitar datos necesarios
- [ ] Agendar kickoff call

**Datos a solicitar:**
FORMULARIO DE ONBOARDING:
📋 Información básica:

Nombre de la agencia
Dominio deseado (ej: viajesmaría.com)
Email de contacto
Teléfono

🎨 Branding:

Logo (formato PNG, fondo transparente)
Color principal (HEX o descripción)
Eslogan/tagline

📸 Contenido:

5-10 fotos de destinos
Texto "Sobre nosotros" (200 palabras)
3 opiniones/testimonios de clientes

💳 Datos bancarios (para Stripe):

CIF/NIF
Nombre legal de la empresa
Dirección fiscal
Cuenta bancaria (IBAN)


### Paso 2.2: Firma de contrato
**Contrato incluye:**
- Términos de servicio
- Política de cancelación
- SLA de soporte
- Protección de datos (GDPR)

**Una vez firmado:**
- [ ] Crear cliente en panel owner (/owner/clientes)
- [ ] Generar credenciales de acceso
- [ ] Enviar email de bienvenida con accesos

**Template email accesos:**
Asunto: ¡Bienvenido a DRB Agency! 🎉 Tus accesos
Hola [Nombre],
¡Bienvenido a la familia DRB! Aquí tienes tus accesos:
🔐 Panel de administración:
URL: https://[tu-dominio].drb.agency/admin/login
Email: [email]
Contraseña temporal: [contraseña]
📚 Recursos útiles:

Guía de inicio rápido: [link]
Video tutoriales: [link]
Soporte: contact@drb.agency

🗓️ Próximos pasos:

Kickoff call: [fecha/hora]
Configuración Stripe: [fecha]
Publicación web: [fecha estimada]

¡Estamos emocionados de trabajar contigo!
[Tu nombre]

---

## 📋 FASE 3: SETUP TÉCNICO

### Paso 3.1: Kickoff Call (45 minutos)
**Agenda:**
1. Bienvenida y expectativas (5 min)
2. Tour del panel admin (15 min)
3. Configuración de contenido básico (15 min)
4. Próximos pasos y dudas (10 min)

**Durante la call:**
- [ ] Compartir pantalla y mostrar panel
- [ ] Ayudar a editar sección "Hero"
- [ ] Crear primer destino juntos
- [ ] Añadir primera opinión
- [ ] Configurar emails básicos

### Paso 3.2: Personalización de contenido
**Tarea del cliente (con soporte):**
- [ ] Subir logo
- [ ] Configurar colores
- [ ] Escribir textos (hero, nosotros, contacto)
- [ ] Añadir 3-5 destinos
- [ ] Añadir 2-3 opiniones
- [ ] Configurar páginas legales

**Tiempo estimado:** 2-3 horas con soporte

### Paso 3.3: Configuración de Stripe
**Proceso:**
1. Cliente hace onboarding de Stripe Connect desde /admin/stripe
2. Completa verificación de identidad
3. Añade cuenta bancaria
4. Activa suscripción al plan elegido (Start/Grow/Pro)

**Verificación:**
- [ ] Stripe Connect: Estado "Enabled"
- [ ] Suscripción: Activa
- [ ] Plan: Correcto
- [ ] Tarifa: Configurada

### Paso 3.4: Configuración de dominio (si aplica)
**Opciones:**

**Opción A: Subdominio DRB (gratis)**
- URL: `https://viajesmaría.drb.agency`
- Setup: Automático
- Tiempo: Inmediato

**Opción B: Dominio propio (recomendado)**
- URL: `https://viajesmaría.com`
- Setup: Cliente configura DNS
- Tiempo: 24-48h propagación

**Instrucciones DNS:**
Si el cliente tiene dominio propio:

Ir al panel de su proveedor (GoDaddy, Namecheap, etc.)
Añadir registro CNAME:

Host: www
Valor: cname.vercel-dns.com


Esperar 24-48h

Verificar: https://dnschecker.org

---

## 📋 FASE 4: TESTING & PUBLICACIÓN

### Paso 4.1: Testing interno
**Checklist del equipo DRB:**
- [ ] Web se ve correcta en desktop
- [ ] Web se ve correcta en mobile
- [ ] Todos los enlaces funcionan
- [ ] Imágenes se cargan bien
- [ ] Formulario de contacto funciona
- [ ] Formulario de reserva funciona

### Paso 4.2: Testing con cliente
**Testing call (30 min):**
1. Cliente navega su propia web
2. Cliente hace reserva de prueba (tarjeta test)
3. Verificar email de confirmación
4. Verificar panel de reservas
5. Aprobar publicación

**Tarjeta de prueba Stripe:**
Número: 4242 4242 4242 4242
Fecha: Cualquiera futura
CVC: Cualquiera

### Paso 4.3: Go Live 🚀
**Día de publicación:**
- [ ] Cambiar estado a "Publicado" en owner panel
- [ ] Enviar email de celebración
- [ ] Post en redes sociales (con permiso)
- [ ] Solicitar testimonial

**Email de celebración:**
Asunto: 🎉 ¡Tu web está LIVE!
Hola [Nombre],
¡Felicidades! Tu web ya está publicada y lista para recibir reservas:
🌐 Tu web: https://[dominio]
📊 Tu panel: https://[dominio]/admin
Ahora empieza lo bueno:

Comparte tu web en redes sociales
Envíala a tu base de clientes
Actualiza tu firma de email
Añádela a tu Google My Business

Estamos aquí para lo que necesites.
¡A por esas reservas! 💪
[Tu nombre]

---

## 📋 FASE 5: POST-LAUNCH

### Día 1-7: Seguimiento cercano
**Acciones:**
- [ ] Email día 1: "¿Cómo va todo?"
- [ ] Email día 3: "Tip del día: Cómo promocionar tu web"
- [ ] Email día 7: "Checkin semanal"
- [ ] Monitorear reservas en panel owner
- [ ] Resolver dudas rápidamente

### Día 8-30: Acompañamiento
**Objetivo:** Primera reserva real

**Seguimiento:**
- [ ] Call semanal de 15 minutos
- [ ] Compartir mejores prácticas
- [ ] Sugerir mejoras de contenido
- [ ] Celebrar primera reserva

**Cuando llega primera reserva:**
Asunto: 🎊 ¡Tu PRIMERA reserva!
[Nombre], ¡ES OFICIAL!
Acabas de procesar tu primera reserva a través de DRB Agency.
Esto es solo el principio. Sigamos creciendo juntos.
¿Café virtual para celebrar? 😄
[Tu nombre]

### Mes 2-3: Optimización
**Enfoque:** Aumentar conversión

**Acciones:**
- [ ] Revisar analytics
- [ ] Sugerir destinos adicionales
- [ ] Optimizar descripciones
- [ ] Mejorar fotos si es necesario
- [ ] Añadir más opiniones

### Mes 3+: Relación a largo plazo
**Objetivo:** Retención y expansión

**Touchpoints:**
- Email mensual con tips
- Invitación a webinars
- Early access a nuevas features
- Programa de referidos

---

## 🎯 KPIs de Onboarding

### Métricas a trackear:
- **Time to publish:** Días desde firma hasta web live
- **Time to first booking:** Días hasta primera reserva
- **Activation rate:** % que completan setup
- **Onboarding NPS:** Satisfacción proceso
- **60-day retention:** % que sigue activo a 2 meses

### Metas:
- ✅ Time to publish: <7 días
- ✅ Time to first booking: <14 días
- ✅ Activation rate: >90%
- ✅ Onboarding NPS: >8
- ✅ 60-day retention: >85%

---

## 🚨 Problemas Comunes y Soluciones

### Problema: Cliente no completa contenido
**Solución:** Ofrecer servicio de contenido (extra fee o incluido en Pro)

### Problema: Stripe rechaza verificación
**Solución:** Ayudar con documentación, llamada con Stripe support

### Problema: Cliente no entiende panel
**Solución:** Grabación de screen share, video tutoriales

### Problema: Cliente no tiene dominio
**Solución:** Ayudar a comprar (GoDaddy, Namecheap) o usar subdominio DRB

### Problema: Cliente quiere features custom
**Solución:** Evaluar para roadmap o ofrecer desarrollo custom (extra)

---

## 📚 Recursos para Cliente

### Videos tutoriales (a crear):
1. "Cómo editar tu web en 5 minutos"
2. "Cómo añadir un destino nuevo"
3. "Cómo gestionar reservas"
4. "Cómo personalizar emails"
5. "Cómo interpretar tus analytics"

### Documentación:
- Guía de inicio rápido (PDF)
- FAQs
- Troubleshooting común
- Mejores prácticas

### Soporte:
- Email: contact@drb.agency
- Response time: <24h
- Urgencias: WhatsApp (solo clientes Pro)
