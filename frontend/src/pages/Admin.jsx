import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarChamados, atualizarStatus, deletarChamado } from '../services/api'

const STATUS_CORES = {
  aberto: 'bg-red-100 text-red-700',
  em_andamento: 'bg-yellow-100 text-yellow-700',
  resolvido: 'bg-green-100 text-green-700',
}

const STATUS_LABELS = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  resolvido: 'Resolvido',
}

export default function Admin() {
  const navigate = useNavigate()
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [imagemAberta, setImagemAberta] = useState(null)

  const buscarChamados = useCallback(async () => {
    try {
      const data = await listarChamados()
      if (Array.isArray(data)) {
        setChamados(data)
      } else if (data?.error) {
        console.error('Erro ao buscar chamados:', data.error)
        setChamados([])
      } else {
        console.error('Resposta inesperada:', data)
        setChamados([])
      }
    } catch (err) {
      console.error('Erro:', err)
      setChamados([])
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    // evita warning por chamada direta sincronamente no body do effect
    void (async () => {
      await buscarChamados()
    })()
  }, [buscarChamados])

  const mudarStatus = async (id, status) => {
    await atualizarStatus(id, status)
    buscarChamados()
  }

  const excluir = async (id) => {
    if (!confirm('Deseja excluir este chamado?')) return
    await deletarChamado(id)
    buscarChamados()
  }

  if (carregando)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Carregando chamados...
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-green-700 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Zelador.IA</h1>
        <button
          onClick={() => {
  localStorage.removeItem('adminAuth')
  navigate('/admin/login')
}}
          className="text-sm underline opacity-80 hover:opacity-100"
        >
          Logout
        </button>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Painel Admin</h2>
            <span className="text-sm text-gray-500">{chamados.length} chamados</span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {['aberto', 'em_andamento', 'resolvido'].map((s) => (
              <div key={s} className="bg-white rounded-2xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm">{STATUS_LABELS[s]}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {chamados.filter((c) => c.status === s).length}
                </p>
              </div>
            ))}
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm min-w-[1100px]">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">Protocolo</th>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Telefone</th>
                  <th className="p-4 text-left">E-mail</th>
                  <th className="p-4 text-left">Categoria</th>
                  <th className="p-4 text-left">Descrição</th>
                  <th className="p-4 text-left">Foto</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chamados.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs text-gray-600">{c.protocolo}</td>
                    <td className="p-4 font-medium">{c.nome}</td>
                    <td className="p-4 text-gray-500">{c.telefone}</td>
                    <td className="p-4 text-gray-500">{c.email}</td>
                    <td className="p-4 text-gray-500">{c.categoria || '-'}</td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">{c.descricao}</td>
                    <td className="p-4">
                      {c.imagem_url ? (
                        <img
                          src={c.imagem_url}
                          alt="foto"
                          className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:opacity-80"
                          onClick={() => setImagemAberta(c.imagem_url)}
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_CORES[c.status] || ''
                        }`}
                      >
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <select
                          value={c.status}
                          onChange={(e) => mudarStatus(c.id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="aberto">Aberto</option>
                          <option value="em_andamento">Em andamento</option>
                          <option value="resolvido">Resolvido</option>
                        </select>
                        <button
                          onClick={() => excluir(c.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {chamados.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                Nenhum chamado registrado ainda.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal imagem */}
      {imagemAberta && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImagemAberta(null)}
        >
          <img src={imagemAberta} className="max-w-lg max-h-screen rounded-2xl" />
        </div>
      )}
    </div>
  )
}

