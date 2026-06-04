# TODO

- [x] Convert backend to ES Modules (set `backend/package.json` to `"type":"module"`).

- [ ] Convert backend runtime files to ESM:
  - [x] `backend/index.js`
  - [x] `backend/src/app.js`
  - [x] all routes/controllers/models/libs/middleware under `backend/src/**`

- [x] Fix `backend/src/lib/mailer.js` (duplicate imports + hardcoded key) while converting to ESM.

- [x] Fix `backend/src/controllers/upload.controller.js` (remove `uploadError` undefined usage) while converting to ESM.

- [ ] Smoke test endpoints after conversion.



