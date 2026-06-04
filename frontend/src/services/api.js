const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const VITE_ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

console.log("Admin Secret exists:", !!VITE_ADMIN_SECRET);

const handleResponse = async (res) => {
  try {
    const data = await res.json();
    if (!res.ok) {
      console.error("API Error:", res.status, data);
      return { error: data.error || "Erro ao processar requisição" };
    }
    return data;
  } catch (err) {
    console.error("Response parsing error:", err);
    return { error: err.message };
  }
};

export const criarChamado = async (dados) => {
  try {
    const res = await fetch(`${VITE_API_URL}/api/chamados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao criar chamado:", err);
    return { error: err.message };
  }
};

export const uploadImagem = async (file) => {
  try {
    console.log("Iniciando upload de:", file.name, file.size, "bytes");
    const form = new FormData();
    form.append("imagem", file);

    console.log("Enviando para:", `${VITE_API_URL}/api/upload`);
    const res = await fetch(`${VITE_API_URL}/api/upload`, {
      method: "POST",
      body: form,
    });

    console.log("Upload response status:", res.status);
    const data = await handleResponse(res);
    console.log("Upload response data:", data);
    return data;
  } catch (err) {
    console.error("Erro ao fazer upload:", err);
    return { error: err.message };
  }
};

export const listarChamados = async () => {
  try {
    console.log("Fetching from:", `${VITE_API_URL}/api/chamados`);
    const res = await fetch(`${VITE_API_URL}/api/chamados`, {
      headers: { "x-admin-secret": VITE_ADMIN_SECRET },
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao listar chamados:", err);
    return { error: err.message };
  }
};

export const atualizarStatus = async (id, status) => {
  try {
    const res = await fetch(`${VITE_API_URL}/api/chamados/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": VITE_ADMIN_SECRET,
      },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    return { error: err.message };
  }
};

export const deletarChamado = async (id) => {
  try {
    const res = await fetch(`${VITE_API_URL}/api/chamados/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": VITE_ADMIN_SECRET },
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao deletar chamado:", err);
    return { error: err.message };
  }
};
