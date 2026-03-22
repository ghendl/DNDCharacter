# DnD Forge PRO 2024

App estática lista para Netlify con guardado online en Supabase.

## Configuración

1. Creá un proyecto en Supabase.
2. En `SQL Editor`, ejecutá `supabase/schema.sql`.
3. Copiá `env.js.example` como `env.js`.
4. Pegá:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` (Publishable Key)
   - `SITE_URL` con tu dominio de Netlify para que los magic links no redirijan a localhost.
5. En Supabase > Authentication > URL Configuration, poné la misma URL de Netlify en **Site URL** y en **Redirect URLs**.
6. Publicá esta carpeta en Netlify.

## Qué incluye

- Login por magic link
- Guardado online por usuario
- Links públicos de personaje
- Builder por pasos:
  - Identidad
  - Origen
  - Atributos
  - Entrenamiento
  - Combate
  - Magia
  - Progresión
  - Resumen
- 12 clases con resúmenes de progresión
- 10 species de 2024 y Aasimar
- Backgrounds 2024 con ASI y Origin Feat
- Varias subclases por clase
- Skills, tools, armor, weapons, weapon mastery
- Spellcasting summary y spell slots
- Exportar/importar JSON
- Hoja imprimible

## Nota

La app usa los manuales como guía de estructura y resume reglas y rasgos en formato funcional para creación de personajes. No reproduce texto extenso del libro.


## Cambios de esta versión

- Home separada del creador
- Wizard full-screen para creación
- Vista de ficha separada
- Generador random de personaje
- Mejoras mobile y navegación tipo app
