# Verificación automática de traducciones

El comando `npm run i18n:check` (definido en `exentax-web/package.json`)
ejecuta dos pasos sobre los bundles de traducción ubicados en
`exentax-web/client/src/i18n/locales/`:

1. `tsx scripts/generate-i18n-types.ts` — regenera el tipado a partir del
   bundle español (idioma fuente).
2. `tsx scripts/validate-i18n.ts` — comprueba que los seis idiomas
   (`es`, `en`, `fr`, `de`, `pt`, `ca`) tengan exactamente las mismas
   claves y, en el caso de los arrays, la misma forma interna.

Si el comando falla, significa que algún idioma quedó desincronizado y
es necesario actualizarlo antes de mergear.

## Ejecución automática

### CI (GitHub Actions)

El workflow [`.github/workflows/i18n-check.yml`](../../.github/workflows/i18n-check.yml)
se ejecuta en cada `push` y `pull_request` contra `main`. Hace
`npm ci` dentro de `exentax-web/` y corre `npm run i18n:check`. Si el
script termina con código distinto de 0, GitHub bloquea el merge.

Para hacerlo obligatorio en pull requests, marca el job **"Validate
translation bundles"** como required check en
*Settings → Branches → Branch protection rules* del repositorio.

### Pre-commit local (opcional)

Para recibir feedback antes de commitear cambios en los locales, instala
el hook opt-in:

```bash
cd exentax-web
bash scripts/install-git-hooks.sh
```

El hook solo se dispara cuando el commit toca archivos dentro de
`exentax-web/client/src/i18n/locales/`. Para desactivarlo basta con
borrar `.git/hooks/pre-commit`.

## Uso manual

```bash
cd exentax-web
npm run i18n:check
```
