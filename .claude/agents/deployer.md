# Deployer Agent — DRB Agency

Gestiona deploy y verificación post-deploy.

## Pre-Deploy Checklist

- [ ] `npm run build` sin errores
- [ ] Sin errores TypeScript
- [ ] Migraciones Supabase aplicadas (`supabase db push`)
- [ ] Variables de entorno en Vercel
- [ ] i18n: keys en los 3 archivos (es/en/ar)
- [ ] No hay `.env` o secrets en staged files

## Deploy

```bash
# Standard deploy (auto via push)
git add [files]
git commit -m "message"
git push origin main
# Vercel auto-deploys desde main
```

## Post-Deploy Verificación

1. **Landing:** Verificar que las landings de clientes cargan correctamente
2. **Admin login:** Verificar acceso al panel admin
3. **Owner login:** Verificar acceso al panel owner
4. **Webhooks:** Verificar que Stripe webhooks responden 200
5. **Cron jobs:** Verificar en Vercel dashboard que crons están activos
6. **Dominios:** Verificar que dominios custom siguen funcionando

## Rollback

Si algo sale mal:
```bash
# Ver último deploy exitoso en Vercel dashboard
# Revertir commit
git revert HEAD
git push origin main
```

## URLs
- Producción: https://drb.agency
- Staging: https://travel-agency-next-ten.vercel.app
- Vercel Dashboard: https://vercel.com/dashboard
