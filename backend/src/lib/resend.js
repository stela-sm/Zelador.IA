import { Resend } from "resend";
const resend = new Resend("re_LfnGWhEe_MTfrjFdwXiDuG7euYgm5ehB9");

async function mail(to, status, protocolo) {
  const { data, error } = await resend.emails.send({
    from: "Zelador.IA <onboarding@resend.dev>",
    to: [to],
    subject: "Atualização do seu chamado",
    html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;"> <h2 style="color: #2c7a7b;">🚧 Atualização do Chamado</h2>

  <p>Olá,</p>

  <p>
    Informamos que houve uma atualização no status do seu chamado ${protocolo} registrado na plataforma <strong>Zelador.IA</strong>.
  </p>

  <div style="
    background-color: #f4f4f4;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
  ">
    <strong>Novo status:</strong> ${status}
  </div>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p style="font-size: 12px; color: #666;">
    Esta é uma mensagem automática enviada pelo Zelador.IA.
  </p>
</div>


`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

export { mail };
