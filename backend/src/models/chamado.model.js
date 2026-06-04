import supabase from "../lib/supabase.js";

const ChamadoModel = {
  criar: async (dados) => {
    try {
      const { data, error } = await supabase
        .from("chamados")
        .insert(dados)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      console.error("Exception ao criar:", err.message);
      return { data: null, error: { message: err.message } };
    }
  },

  listar: async () => {
    try {
      const { data, error } = await supabase
        .from("chamados")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Dados recebidos do Supabase:", data);

      if (error) return { data: [], error: null };
      return { data: data || [], error: null };
    } catch (err) {
      console.error("Exception ao listar:", err.message);
      return { data: [], error: null };
    }
  },

  buscarPorId: async (id) => {
    try {
      const { data, error } = await supabase
        .from("chamados")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return { data: null, error };
      return { data, error };
    } catch (err) {
      console.error("Exception ao buscar por ID:", err.message);
      return { data: null, error: { message: err.message } };
    }
  },

  atualizarStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from("chamados")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) return { data: null, error };
      return { data, error };
    } catch (err) {
      console.error("Exception ao atualizar status:", err.message);
      return { data: null, error: { message: err.message } };
    }
  },

  deletar: async (id) => {
    try {
      const { error } = await supabase.from("chamados").delete().eq("id", id);
      return { error };
    } catch (err) {
      console.error("Exception ao deletar:", err.message);
      return { error: { message: err.message } };
    }
  },
};

export default ChamadoModel;
