/**
 * Guard de boot do Frontend para NEXT_PUBLIC_API_URL (Req 1.3, 1.4).
 */
function validateApiUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return {
      valid: false,
      error: 'Variável de ambiente obrigatória NEXT_PUBLIC_API_URL ausente, vazia ou composta apenas de espaços.'
    };
  }
  return { valid: true, url: url.trim() };
}

if (require.main === module) {
  const result = validateApiUrl(process.env.NEXT_PUBLIC_API_URL);
  if (!result.valid) {
    console.error(`[FATAL] ${result.error}`);
    process.exit(1);
  }
  console.log(`[INFO] NEXT_PUBLIC_API_URL validada com sucesso: ${result.url}`);
  require('./server.js');
}

module.exports = { validateApiUrl };
