# Spanish First

## Comunicación
- El usuario (Sami) se comunica en español
- Responder en español para explicaciones
- Código y commit messages en inglés

## UI
- `es.json` es la fuente de verdad para i18n
- Todo string visible al usuario debe estar en el sistema i18n
- NUNCA hardcodear textos en español en componentes — usar `t('key')`

## Documentación
- Documentación del proyecto en español (excepto código y términos técnicos)
- Commit messages en inglés, concisos, estilo conventional commits

## i18n Obligatorio
- SIEMPRE añadir keys en los 3 archivos: `messages/es.json`, `messages/en.json`, `messages/ar.json`
- Nunca crear una página sin i18n completo
