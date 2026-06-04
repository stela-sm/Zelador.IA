import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold text-sky-950">
          Zelador.IA
        </h1>

        <button
          onClick={() => navigate("/admin/login")}
          className="text-green-700 font-medium hover:underline"
        >
          Painel Admin
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
       <img
  src={logo}
  alt="Zelador.IA"
  className="mb-8"
  style={{ width: "120px" }}
/>

        <h2 className="text-5xl font-bold text-sky-950 max-w-3xl leading-tight">
          Sua cidade melhor começa com um registro
        </h2>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Informe buracos, postes apagados, vazamentos e outros problemas
          urbanos através de um chatbot inteligente.
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="mt-8 bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition"
        >
          Registrar Problema
        </button>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-8 mt-14">
          <div>
            <h3 className="text-3xl font-bold text-green-700">24h</h3>
            <p className="text-gray-500 text-sm">Resposta rápida</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-green-700">100%</h3>
            <p className="text-gray-500 text-sm">Digital</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-green-700">IA</h3>
            <p className="text-gray-500 text-sm">Atendimento inteligente</p>
          </div>
        </div>
      </main>

      

     
    </div>
  );
}