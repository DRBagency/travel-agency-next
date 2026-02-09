-- ============================================================================
-- LIMPIEZA Y RECREACIÓN: Sistema de emails de billing
-- ============================================================================

-- Eliminar las tablas existentes si tienen problemas
DROP TABLE IF EXISTS billing_email_templates CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;

-- Eliminar funciones y triggers si existen
DROP FUNCTION IF EXISTS update_platform_settings_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_billing_email_templates_updated_at() CASCADE;

-- ============================================================================
-- RECREAR TABLA 1: platform_settings
-- ============================================================================

CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_logo_url TEXT,
  billing_email_from TEXT,
  billing_footer_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restricción: Solo permitir 1 fila (singleton pattern)
CREATE UNIQUE INDEX platform_settings_singleton_idx
  ON platform_settings ((id IS NOT NULL));

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_settings_updated_at();

-- Comentarios
COMMENT ON TABLE platform_settings IS 'Configuración global de la plataforma (singleton)';
COMMENT ON COLUMN platform_settings.billing_logo_url IS 'URL del logo para emails de billing';
COMMENT ON COLUMN platform_settings.billing_email_from IS 'Remitente para emails de billing';
COMMENT ON COLUMN platform_settings.billing_footer_text IS 'Texto del footer en emails de billing';

-- ============================================================================
-- RECREAR TABLA 2: billing_email_templates
-- ============================================================================

CREATE TABLE billing_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  subject TEXT,
  html_body TEXT,
  cta_text TEXT,
  cta_url TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT billing_email_templates_tipo_check
    CHECK (tipo IN ('bienvenida', 'cambio_plan', 'cancelacion'))
);

-- Índice único: Solo 1 template por tipo
CREATE UNIQUE INDEX billing_email_templates_tipo_unique_idx
  ON billing_email_templates (tipo);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_billing_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_billing_email_templates_updated_at
  BEFORE UPDATE ON billing_email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_billing_email_templates_updated_at();

-- Comentarios
COMMENT ON TABLE billing_email_templates IS 'Templates de emails para eventos de billing';
COMMENT ON COLUMN billing_email_templates.tipo IS 'Tipo de email: bienvenida, cambio_plan, cancelacion';
COMMENT ON COLUMN billing_email_templates.subject IS 'Asunto del email';
COMMENT ON COLUMN billing_email_templates.html_body IS 'Cuerpo HTML con tokens';
COMMENT ON COLUMN billing_email_templates.cta_text IS 'Texto del botón CTA';
COMMENT ON COLUMN billing_email_templates.cta_url IS 'URL del botón CTA';
COMMENT ON COLUMN billing_email_templates.activo IS 'Indica si el template está activo';

-- ============================================================================
-- INSERTAR DATOS INICIALES
-- ============================================================================

-- Fila inicial en platform_settings
INSERT INTO platform_settings (
  billing_logo_url,
  billing_email_from,
  billing_footer_text
) VALUES (
  'https://via.placeholder.com/200x60?text=DRB+Agency',
  'DRB Agency <billing@drb.agency>',
  '© 2026 DRB Agency. Todos los derechos reservados.'
);

-- Templates iniciales de billing
INSERT INTO billing_email_templates (tipo, subject, html_body, cta_text, cta_url, activo) VALUES
('bienvenida',
  '🎉 ¡Bienvenido a {{planName}}!',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 20px;">¡Bienvenido, {{clientName}}! 🎉</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
      Gracias por unirte a <strong>{{planName}}</strong>. Estamos emocionados de tenerte con nosotros.
    </p>
    <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <h3 style="margin-top: 0; color: #2d3748; font-size: 18px;">Tu plan incluye:</h3>
      <ul style="color: #4a5568; line-height: 1.8;">
        <li>Gestión completa de reservas</li>
        <li>Email templates personalizados</li>
        <li>Panel de administración dedicado</li>
        <li>Pagos con Stripe Connect</li>
      </ul>
    </div>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px;">
      Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
    </p>
  </div>',
  'Ir a mi panel',
  '{{adminUrl}}',
  true
),
('cambio_plan',
  '🔄 Plan actualizado a {{newPlanName}}',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 20px;">Plan actualizado con éxito 🔄</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
      Hola {{clientName}},
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
      Tu suscripción ha sido actualizada de <strong>{{oldPlanName}}</strong> a <strong>{{newPlanName}}</strong>.
    </p>
    <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <h3 style="margin-top: 0; color: #2d3748; font-size: 18px;">✅ Cambios aplicados:</h3>
      <p style="color: #4a5568; line-height: 1.8; margin: 10px 0;">
        • Plan: <strong>{{newPlanName}}</strong><br>
        • Comisión: <strong>{{newCommission}}%</strong><br>
        • Fecha de cambio: <strong>{{changeDate}}</strong>
      </p>
    </div>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px;">
      Los cambios son efectivos inmediatamente. Puedes ver todos los detalles en tu panel de administración.
    </p>
  </div>',
  'Ver mi panel',
  '{{adminUrl}}',
  true
),
('cancelacion',
  '😢 Confirmación de cancelación',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 20px;">Lamentamos verte partir 😢</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
      Hola {{clientName}},
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
      Tu suscripción al plan <strong>{{planName}}</strong> ha sido cancelada exitosamente.
    </p>
    <div style="background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <h3 style="margin-top: 0; color: #2d3748; font-size: 18px;">📅 Detalles de la cancelación:</h3>
      <p style="color: #4a5568; line-height: 1.8; margin: 10px 0;">
        • Plan cancelado: <strong>{{planName}}</strong><br>
        • Fecha de cancelación: <strong>{{cancellationDate}}</strong><br>
        • Acceso hasta: <strong>{{endDate}}</strong>
      </p>
    </div>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
      Seguirás teniendo acceso a tu cuenta hasta el final del período de facturación actual.
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px;">
      Si cambias de opinión o necesitas ayuda, no dudes en contactarnos. ¡Estaremos encantados de ayudarte!
    </p>
  </div>',
  'Contactar soporte',
  'mailto:{{supportEmail}}',
  true
);

-- ============================================================================
-- RLS Y PERMISOS
-- ============================================================================

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access to platform_settings"
  ON platform_settings FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role full access to billing_email_templates"
  ON billing_email_templates FOR ALL
  USING (auth.role() = 'service_role');
