import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarChamado, uploadImagem } from '../services/api'

const ETAPAS = ['nome', 'telefone', 'email', 'descricao', 'imagem', 'confirmacao']

const MENSAGENS_BOT = {
  nome: 'Olá! 👋 Qual é o seu nome?',
  telefone: 'Qual é o seu telefone?',
  email: 'Qual é o seu email? (para receber atualizações)',
  descricao: 'Descreva o problema que você encontrou:',
  imagem: 'Por favor, nos envie uma foto do problema:',
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
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center p-4">
    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white w-full max-w-md flex flex-col h-[700px] overflow-hidden">

      {/* Header */}
      <div className="bg-green-700 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-700 text-xl">
            🤖
          </div>

          <div>
            <h1 className="font-bold text-lg">
              Zelador.IA
            </h1>

            <p className="text-green-100 text-sm">
              Atendimento automático
            </p>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Registro do chamado</span>
          <span>
            {Math.round(
              (ETAPAS.indexOf(etapa) / (ETAPAS.length - 1)) * 100
            )}
            %
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-500"
            style={{
              width: `${
                (ETAPAS.indexOf(etapa) / (ETAPAS.length - 1)) * 100
              }%`
            }}
          />
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {mensagens.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              msg.de === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >

            {msg.de === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-xs flex-shrink-0">
                🤖
              </div>
            )}

            <div
              className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                msg.de === 'user'
                  ? 'bg-green-700 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
              }`}
            >
              {msg.texto}
            </div>

            {msg.de === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                👤
              </div>
            )}
          </div>
        ))}

        {carregando && (
          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-xs">
              🤖
            </div>

            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm text-sm text-gray-500">
              <span className="animate-pulse">
                Zelador.IA está digitando...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Área inferior */}
      {!protocolo ? (
        <div className="p-4 border-t bg-white">

          {etapa === 'imagem' ? (
            <label className="w-full block bg-green-700 text-white text-center py-3 rounded-full cursor-pointer font-medium hover:bg-green-800 transition">
              📷 Enviar foto

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={enviarImagem}
              />
            </label>
          ) : (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-green-600"
                placeholder="Digite sua resposta..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={etapa === 'confirmacao'}
              />

              <button
                onClick={enviarMensagem}
                className="bg-green-700 text-white px-5 rounded-full hover:bg-green-800 transition"
              >
                ➤
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="border-t bg-white p-4">

          <div className="text-center mb-4">
            <div className="text-5xl mb-2">
              🎉
            </div>

            <h2 className="font-bold text-lg text-gray-800">
              Chamado Registrado
            </h2>

            <p className="text-sm text-gray-500">
              Seu protocolo foi gerado com sucesso.
            </p>

            <p className="mt-2 font-bold text-green-700">
              #{protocolo}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition"
            >
              Home
            </button>

            <button
              onClick={() => {
                setEtapa('nome')
                setMensagens([
                  {
                    de: 'bot',
                    texto: MENSAGENS_BOT.nome
                  }
                ])
                setInput('')
                setDados({})
                setProtocolo(null)
              }}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Novo Chamado
            </button>
          </div>

        </div>
      )}
    </div>
  </div>
)
}