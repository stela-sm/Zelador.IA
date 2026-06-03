
import { Resend } from "resend";
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const STATUS_LABELS = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
};

import { Resend } from "resend";

const resend = new Resend("re_xxxxxxxxx");


const enviarEmailStatus = async ({ email, nome, protocolo, status }) => {
  try {
    await resend.emails.send({
      from: "Zelador.IA <stelamontenegro>",
      to: email,
      subject: `Atualização do seu chamado ${protocolo}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #15803d;">🏙️ Zelador.IA</h2>
          <p>Olá, <strong>${nome}</strong>!</p>
          <p>Seu chamado foi atualizado:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Protocolo:</strong> ${protocolo}</p>
            <p><strong>Novo status:</strong> ${STATUS_LABELS[status]}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Obrigado por usar o Zelador.IA!</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
  }
};

module.exports = { enviarEmailStatus };
