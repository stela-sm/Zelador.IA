
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">🏙️ Zelador.IA</h1>
        <button
          onClick={() => navigate('/admin')}
          className="text-sm underline opacity-80 hover:opacity-100"
        >
          Painel Admin
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Reporte problemas da sua cidade
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Buracos, postes apagados, vazamentos e muito mais. 
          Registre em segundos e acompanhe o status.
        </p>
        <button
          onClick={() => navigate('/chat')}
          className="bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-800 transition"
        >
          Registrar problema
        </button>
      </main>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-16 max-w-4xl mx-auto w-full">
        {[
          { icon: '🕳️', titulo: 'Buraco na via', desc: 'Ruas e calçadas danificadas' },
          { icon: '💡', titulo: 'Poste apagado', desc: 'Iluminação pública com defeito' },
          { icon: '💧', titulo: 'Vazamento', desc: 'Água ou esgoto nas ruas' },
        ].map((item) => (
          <div key={item.titulo} className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-gray-800">{item.titulo}</h3>
            <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      <footer className="text-center text-gray-400 text-sm pb-6">
        Zelador.IA — Zeladoria urbana inteligente
      </footer>
    </div>
  )
}