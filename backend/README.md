# Recuperação de senha

**RF** - Requisitos funcionais

  - O usuário deve poder recuperar sua senha informando o seu e-mail;
  - O usuário deve receber um e-mail com instruções de recuperação de senha;
  - O usuário deve poder resetar sua senha;

**RNF** -  Requisitos não funcionais

  - Utilizar Mailtrap para testar envios em ambiente de dev;
  - Utilizar o Amazon SES para envios em produção;
  - O envio de e-mails deve acontecer em segundo plano (background job);

**RN** - Regra de negocio

  - O link enviado por email para resetar senha, deve expirar em 2h;
  - O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF** - Requisitos funcionais

  - O usuário deve poder atualizar o nome, email, senha;

**RN** - Regra de negocio

  - O usuário não pode alterar seu email para um email já utilizado;
  - Para atualizar sua senha, o usuário deve informar a senha antiga;
  - Para atualizar sua senha, o usuário precisa confirmar a sua senha;

# Painel do prestador

**RF** - Requisitos funcionais

  - O usuário deve poder listar seu agendamentos de um dia específico;
  - O prestador deve receber uma notificação sempre que houver um novo agendamento;
  - O prestador deve poder visualizar as notificações não lidas;


**RNF** -  Requisitos não funcionais

  - Os agendamentos do prestador no dia devem ser armazenados em cache;
  - As notificações do prestador devem ser armazenadas no MongoDB;
  - As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN** - Regra de negocio

  - A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;



# Agendamento de serviços

**RF** - Requisitos funcionais

  - O usuário deve poder listar todos prestadores de serviço cadastrados;
  - O usuário deve poder listar os dias de um mês com pelo menos um horário disponivel de um prestador;
  - O usuário deve poder listar horários disponivel em um dia especifico de prestador;
  - O usuário deve poder realizar um novo agendamento com um prestador;

**RNF** -  Requisitos não funcionais

  - A listagem de prestadores deve ser armazenada em cache;

**RN** - Regra de negocio

  - Cada agendamento deve durar 1h exatament;
  - Os agendamentos devem estar disponíveis entre 8h ás 18h (Primeiro ás 8h, último ás 17h);
  - O usuário não pode agendar em um hórario já ocupado;
  - O usuário não pode agendar em um horário que já passou;
  - O usuário não pode agendar serviços consigo memso;
