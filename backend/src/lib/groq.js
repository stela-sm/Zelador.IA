import Groq from "groq-sdk";
import "dotenv/config";
console.log("Groq API Key exists:", !!process.env.GROQ_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const classificarProblema = async (descricao) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Você é um classificador de problemas urbanos.
        Classifique o problema em UMA dessas categorias exatas:
        buraco_na_via, poste_apagado, vazamento, lixo_acumulado, arvore_caida, outros
        Responda APENAS com a categoria, sem mais nada.`,
      },
      {
        role: "user",
        content: descricao,
      },
    ],
    max_tokens: 20,
  });

  return completion.choices[0].message.content.trim();
};
