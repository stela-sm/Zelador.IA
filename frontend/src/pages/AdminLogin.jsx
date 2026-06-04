import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    if (senha === import.meta.env.VITE_ADMIN_SECRET) {
      localStorage.setItem('adminAuth', 'true')
      navigate('/admin')
    } else {
      setErro('Senha inválida')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login Admin
        </h1>

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />

        {erro && (
          <p className="text-red-500 text-sm mb-4">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-lg"
        >
          Entrar
        </button>
<a
  onClick={() => navigate('/')}
  className="block text-center mt-6 cursor-pointer text-green-700 hover:underline"
>
  Voltar
</a>
      </form>
    </div>
  )
}