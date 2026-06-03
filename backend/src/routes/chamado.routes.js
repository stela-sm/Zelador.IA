const express = require('express')
const router = express.Router()
const ChamadoController = require('../controllers/chamado.controller')
const auth = require('../middleware/auth')

router.post('/', ChamadoController.criar)
router.get('/', auth, ChamadoController.listar)
router.get('/:id', auth, ChamadoController.buscarPorId)
router.patch('/:id/status', auth, ChamadoController.atualizarStatus)
router.delete('/:id', auth, ChamadoController.deletar)

module.exports = router