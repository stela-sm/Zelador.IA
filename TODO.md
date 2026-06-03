# TODO - Ajuste de URL de imagem no Admin

## Step 1
- [x] Identificar de onde vem `imagem_url` no backend (upload controller).
- [x] Confirmar que hoje está usando `getPublicUrl` (URL pública) em vez de URL assinada.

## Step 2
- [x] Atualizar `backend/src/controllers/upload.controller.js` para retornar **Signed URL** usando `createSignedUrl`.


## Step 3
- [x] Garantir que o admin continue renderizando `c.imagem_url` diretamente (sem mudanças). 


## Step 4
- [ ] Testar: fazer upload e conferir se a URL retornada bate com o formato `/storage/v1/object/sign/...?...token=...`.


