
export const generateRetentionMessage = async (clientName: string, lastSession: string | undefined) => {
  const messages = [
    \`Olá \${clientName}, tudo bem? Percebi que faz um tempo que não nos vemos. A saúde da sua comunicação é muito importante! Vamos agendar um retorno para avaliarmos sua evolução? Abraços, Fga. Kezya Rodrigues.\`,
    \`Oi \${clientName}! Como você tem estado? Estou passando para lembrar da importância de manter a continuidade no seu tratamento fonoaudiológico. Que tal marcarmos uma consulta para essa semana? Aguardo seu retorno! Att, Kezya Rodrigues.\`,
    \`Olá \${clientName}, espero que esteja tudo ótimo! Senti sua falta nas últimas semanas. Para garantir que continuemos progredindo, seria ideal retomarmos suas sessões. Me avise qual horário fica melhor para você! Um abraço, Fga. Kezya.\`,
    \`Oi \${clientName}, tudo bom? Estou revisando os prontuários e notei seu afastamento. Gostaria de saber se está tudo bem e me colocar à disposição para retomarmos seu acompanhamento. A constância é chave para os resultados! Beijos, Kezya Rodrigues.\`
  ];
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const generateConfirmationMessage = async (clientName: string, date: string, time: string, meetLink: string) => {
  return \`Olá \${clientName}, sua consulta com a Fga. Kezya Rodrigues está confirmada para \${date} às \${time}. Link da sala virtual: \${meetLink}. Por favor, entre 5 minutos antes. Até lá!\`;
};
