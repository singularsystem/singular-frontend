#!/bin/sh
set -e

# Req 1.3, 1.4: Guard de boot do Frontend para NEXT_PUBLIC_API_URL
API_URL_TRIMMED=$(echo "${NEXT_PUBLIC_API_URL}" | tr -d '[:space:]')

if [ -z "${API_URL_TRIMMED}" ]; then
  echo "[FATAL] Variável de ambiente obrigatória NEXT_PUBLIC_API_URL ausente, vazia ou inválida." >&2
  echo "[FATAL] A aplicação não pode inicializar sem o endereço da API da Singular System." >&2
  exit 1
fi

echo "[INFO] Inicializando Frontend com NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"
exec node server.js
