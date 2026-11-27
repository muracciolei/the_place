#!/usr/bin/env bash
# Publica dist/ en la rama gh-pages (fuente real de GitHub Pages).
# Uso: npm run deploy            -> usa el remote 'origin' (credenciales del usuario)
#      npm run deploy -- <url>   -> usa otra URL, p. ej. git@github.com:muracciolei/the_place.git
set -euo pipefail

REMOTE="${1:-origin}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$ROOT"
npm run build

git clone --quiet "$REMOTE" "$TMP/repo"
cd "$TMP/repo"
git checkout --orphan gh-pages --quiet
git rm -rf --quiet .
cp -a "$ROOT/dist/." .
git add -A
git -c user.name='OpenCode Agent' -c user.email='agent@opencode.local' \
  commit --quiet -m 'Deploy THE PLACE static build'
git push --force --quiet "$REMOTE" gh-pages:gh-pages
echo "Publicado en gh-pages -> https://muracciolei.github.io/the_place/"
