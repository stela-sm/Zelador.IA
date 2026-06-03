import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarChamado, uploadImagem } from '../services/api'

const ETAPAS = ['nome', 'telefone', 'email', 'descricao', 'imagem', 'confirmacao']

const MENSAGENS_BOT = {
  nome: 'Olá! 👋 Qual é o seu nome?',
  telefone: 'Qual é o seu telefone?',
  email: 'Qual é o seu email? (para receber atualizações)',
  descricao: 'Descreva o problema que você encontrou:',
  imagem: 'Quer enviar uma foto do problema? (opcional)',
  confirmacao: 'Perfeito! Estamos registrando seu chamado...'
}

export default function Chat() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState('nome')
  const [mensagens, setMensagens] = useState([
    { de: 'bot', texto: MENSAGENS_BOT['nome'] }
  ])
  const [input, setInput] = useState('')
  const [dados, setDados] = useState({})
  const [protocolo, setProtocolo] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const adicionarMensagem = (de, texto) => {
    setMensagens(prev => [...prev, { de, texto }])
  }

  const proximaEtapa = (etapaAtual) => {
    const index = ETAPAS.indexOf(etapaAtual)
    return ETAPAS[index + 1]
  }

  const enviarMensagem = async () => {
    if (!input.trim()) return

    adicionarMensagem('user', input)
    const novosDados = { ...dados, [etapa]: input }
    setDados(novosDados)
    setInput('')

    const proxima = proximaEtapa(etapa)
    setEtapa(proxima)
    adicionarMensagem('bot', MENSAGENS_BOT[proxima])

    if (proxima === 'confirmacao') {
      await finalizar(novosDados)
    }
  }

  const pularImagem = async () => {
    adicionarMensagem('user', 'Sem foto')
    const proxima = proximaEtapa(etapa)
    setEtapa(proxima)
    adicionarMensagem('bot', MENSAGENS_BOT[proxima])
    await finalizar(dados)
  }

  const enviarImagem = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    adicionarMensagem('user', '📷 Foto enviada!')
    setCarregando(true)

    const { url } = await uploadImagem(file)
    const novosDados = { ...dados, imagem_url: url }
    setDados(novosDados)

    const proxima = proximaEtapa(etapa)
    setEtapa(proxima)
    adicionarMensagem('bot', MENSAGENS_BOT[proxima])
    await finalizar(novosDados)
  }

  const finalizar = async (dadosFinais) => {
  setCarregando(true)
  const res = await criarChamado({
    nome: dadosFinais.nome,
    telefone: dadosFinais.telefone,
    email: dadosFinais.email,
    descricao: dadosFinais.descricao,
    imagem_url: dadosFinais.imagem_url || null
  })
  setProtocolo(res.protocolo)
  adicionarMensagem('bot', `✅ Chamado registrado! Seu protocolo é: *${res.protocolo}*`)
  setCarregando(false)
}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') enviarMensagem()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md flex flex-col h-[600px]">

        {/* Header */}
        <div className="bg-green-700 text-white p-4 rounded-t-2xl">
          <h1 className="font-bold text-lg">🏙️ Zelador.IA</h1>
          <p className="text-green-200 text-sm">Reporte problemas da sua cidade</p>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {mensagens.map((msg, i) => (
            <div key={i} className={`flex ${msg.de === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                msg.de === 'user'
                  ? 'bg-green-700 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {msg.texto}
              </div>
            </div>
          ))}
          {carregando && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl text-sm text-gray-500">
                Aguarde...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {!protocolo ? (
          <div className="p-4 border-t flex gap-2">
            {etapa === 'imagem' ? (
              <div className="flex gap-2 w-full">
                <label className="flex-1 bg-green-700 text-white text-center py-2 rounded-xl cursor-pointer text-sm">
                  📷 Enviar foto
                  <input type="file" accept="image/*" className="hidden" onChange={enviarImagem} />
                </label>
                <button
                  onClick={pularImagem}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm"
                >
                  Pular
                </button>
              </div>
            ) : (
              <>
                <input
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-700"
                  placeholder="Digite aqui..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={etapa === 'confirmacao'}
                />
                <button
                  onClick={enviarMensagem}
                  className="bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Enviar
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 border-t flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-green-700 text-white py-2 rounded-xl font-medium hover:bg-green-800"
            >
              Voltar para Home
            </button>
            <button
              onClick={() => {
                setEtapa('nome')
                setMensagens([{ de: 'bot', texto: MENSAGENS_BOT['nome'] }])
                setInput('')
                setDados({})
                setProtocolo(null)
              }}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl font-medium hover:bg-gray-50"
            >
              Novo Chamado
            </button>
          </div>
        )}
      </div>
    </div>
  )
}