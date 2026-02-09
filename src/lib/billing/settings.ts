import { supabaseAdmin } from "@/lib/supabase-server";

// ============================================================================
// TYPES
// ============================================================================

export interface PlatformSettings {
  id: string;
  billing_logo_url: string | null;
  billing_email_from: string | null;
  billing_footer_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillingTemplate {
  id: string;
  tipo: "bienvenida" | "cambio_plan" | "cancelacion";
  subject: string | null;
  html_body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export type BillingTemplateType = BillingTemplate["tipo"];

// ============================================================================
// PLATFORM SETTINGS FUNCTIONS
// ============================================================================

/**
 * Obtiene la configuración global de la plataforma para emails de billing.
 * Solo existe 1 fila (singleton pattern).
 */
export async function getPlatformSettings(): Promise<PlatformSettings | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("platform_settings")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching platform settings:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Exception in getPlatformSettings:", error);
    return null;
  }
}

/**
 * Actualiza la configuración global de la plataforma.
 * El campo updated_at se actualiza automáticamente mediante trigger.
 */
export async function updatePlatformSettings(data: {
  billing_logo_url?: string | null;
  billing_email_from?: string | null;
  billing_footer_text?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Primero obtener la única fila para conocer su ID
    const existing = await getPlatformSettings();

    if (!existing) {
      return {
        success: false,
        error: "Platform settings not found. Please run migrations first.",
      };
    }

    const { error } = await supabaseAdmin
      .from("platform_settings")
      .update(data)
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating platform settings:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Exception in updatePlatformSettings:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

// ============================================================================
// BILLING TEMPLATES FUNCTIONS
// ============================================================================

/**
 * Obtiene un template de billing específico por tipo.
 * Solo retorna si el template está activo.
 */
export async function getBillingTemplate(
  tipo: BillingTemplateType
): Promise<BillingTemplate | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("billing_email_templates")
      .select("*")
      .eq("tipo", tipo)
      .eq("activo", true)
      .single();

    if (error) {
      // Error 406 significa que no se encontró ninguna fila
      if (error.code === "PGRST116") {
        console.warn(`No active billing template found for tipo: ${tipo}`);
        return null;
      }
      console.error(`Error fetching billing template (${tipo}):`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Exception in getBillingTemplate (${tipo}):`, error);
    return null;
  }
}

/**
 * Obtiene todos los templates de billing (activos e inactivos).
 * Útil para el panel de administración.
 */
export async function getAllBillingTemplates(): Promise<BillingTemplate[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("billing_email_templates")
      .select("*")
      .order("tipo", { ascending: true });

    if (error) {
      console.error("Error fetching all billing templates:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception in getAllBillingTemplates:", error);
    return [];
  }
}

/**
 * Actualiza un template de billing específico.
 * El campo updated_at se actualiza automáticamente mediante trigger.
 */
export async function updateBillingTemplate(
  tipo: BillingTemplateType,
  data: {
    subject?: string | null;
    html_body?: string | null;
    cta_text?: string | null;
    cta_url?: string | null;
    activo?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from("billing_email_templates")
      .update(data)
      .eq("tipo", tipo);

    if (error) {
      console.error(`Error updating billing template (${tipo}):`, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Exception in updateBillingTemplate (${tipo}):`, error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Verifica si las tablas de billing están correctamente configuradas.
 * Útil para health checks o debugging.
 */
export async function checkBillingSetup(): Promise<{
  platformSettings: boolean;
  templates: { bienvenida: boolean; cambio_plan: boolean; cancelacion: boolean };
}> {
  const settings = await getPlatformSettings();
  const templates = await getAllBillingTemplates();

  const templatesByType = templates.reduce(
    (acc, t) => {
      acc[t.tipo] = true;
      return acc;
    },
    {} as Record<string, boolean>
  );

  return {
    platformSettings: Boolean(settings),
    templates: {
      bienvenida: Boolean(templatesByType.bienvenida),
      cambio_plan: Boolean(templatesByType.cambio_plan),
      cancelacion: Boolean(templatesByType.cancelacion),
    },
  };
}
