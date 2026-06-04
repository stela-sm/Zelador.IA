import ChamadoModel from "../models/chamado.model.js";
import { classificarProblema } from "../lib/groq.js";
import { mail } from "../lib/resend.js";

const gerarProtocolo = () => {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ZEL-${ano}${mes}${dia}-${random}`;
};

const ChamadoController = {
  criar: async (req, res) => {
    try {
      const {
        nome,
        telefone,
        email,
        descricao,
        imagem_url,
        latitude,
        longitude,
      } = req.body;

      console.log("imagem_url recebida:", imagem_url);

      if (!nome || !telefone || !descricao) {
        return res
          .status(400)
          .json({ error: "Nome, telefone e descrição são obrigatórios" });
      }

      const protocolo = gerarProtocolo();
      const categoria = await classificarProblema(descricao);

      const { data, error } = await ChamadoModel.criar({
        protocolo,
        nome,
        telefone,
        email,
        descricao,
        categoria,
        imagem_url,
        latitude,
        longitude,
      });

      if (error) return res.status(500).json({ error: error.message });

      mail(email, "Criado", protocolo).catch((err) => {
        console.error("Erro ao enviar email:", err);
      });

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  listar: async (req, res) => {
    try {
      console.log("Iniciando listar chamados...");
      const { data } = await ChamadoModel.listar();
      console.log("Enviando", data?.length || 0, "chamados");
      return res.json(data || []);
    } catch (err) {
      console.error("Exception na listagem:", err);
      return res.json([]);
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await ChamadoModel.buscarPorId(id);

      if (error)
        return res.status(404).json({ error: "Chamado não encontrado" });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const statusValidos = ["aberto", "em_andamento", "resolvido"];
      if (!statusValidos.includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const { data, error } = await ChamadoModel.atualizarStatus(id, status);
      if (error) return res.status(500).json({ error: error.message });

      mail(data.email, status, data.protocolo).catch((err) => {
        console.error("Erro ao enviar email:", data);
      });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await ChamadoModel.deletar(id);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ message: "Chamado deletado com sucesso" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

export default ChamadoController;
