/* =========================================================
   Website Discovery — app logic (English / Português)
   Plain JavaScript, no build step. Data is saved in this
   browser (localStorage) every time you type.
   Answers are stored in a language-neutral way, so you can
   switch EN/PT at any time without losing anything.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Constants ---------- */
  const LS_PROJECTS = 'dsq.projects.v1';
  const LS_SETTINGS = 'dsq.settings.v1';
  const SECTION_COLORS = ['#FF4F8B', '#6C5CE7', '#12B89A', '#FF7A2F', '#2E9BFF', '#FFC23D'];
  const PALETTE = [
    { name: 'Pink', pt: 'Rosa', c: '#FF4F8B' }, { name: 'Violet', pt: 'Violeta', c: '#6C5CE7' }, { name: 'Teal', pt: 'Verde-água', c: '#12B89A' },
    { name: 'Orange', pt: 'Laranja', c: '#FF7A2F' }, { name: 'Sky', pt: 'Azul', c: '#2E9BFF' }, { name: 'Sun', pt: 'Amarelo', c: '#FFC23D' }
  ];
  const YN = ['Yes', 'No', 'Not sure'];
  const YNC = ['Yes', 'No', 'Need to create'];
  const MAX_SITES = 8;
  const MAX_SERVICES = 20;

  /* =========================================================
     TRANSLATIONS
     ========================================================= */
  const STR = {
    en: {
      discovery: 'Discovery', websiteDiscovery: 'Website Discovery', language: 'Language',
      allProjects: 'All projects', newProject: '+ New client project',
      heroTitle: 'Website discovery, one section at a time.',
      heroText: 'Sit down with your client, work through 14 short sections together, then review and export a signed-off project document.',
      savedProjects: 'Saved projects', noProjects: 'No client projects yet',
      noProjectsText: 'Start one before your next meeting. Everything saves automatically in this browser.',
      studioDetails: 'Your studio details', studioDetailsText: 'Shown in the header, the PDF footer and as project manager.',
      studioName: 'Studio name', yourName: 'Your name',
      storageBanner: 'This browser is blocking storage, so answers won’t be kept after you close the page. Export a PDF before leaving.',
      storageErr: 'Couldn’t save to this browser. Storage may be full (large logos use space) or blocked.',
      pctComplete: '{n}% complete', updated: 'Updated {d}', completion: 'Completion',
      open: 'Open', duplicate: 'Duplicate', del: 'Delete', exportPdf: 'Export PDF',
      with: 'with', allSaved: 'All changes saved', saving: 'Saving…', notSaved: 'Not saved',
      editDetails: 'Edit details', resetAnswers: 'Reset answers', review: 'Review',
      sectionOf: 'Section {a} of {b}', yourNotes: 'Your project notes', myNotes: 'My project notes',
      myNotesIntro: 'Just for you. Preferences, promises made, follow-ups and things to investigate.',
      myNotesTag: 'Private to you, included in the PDF',
      myNotesHint: 'Client preferences, things to remember, follow-up questions, ideas, technical considerations, promises made during the meeting, things to investigate.',
      back: 'Back', saveContinue: 'Save & continue', reviewAnswers: 'Review answers',
      goTo: 'Go to {x}: {title}, {p}% done', sectionN: 'section {n}', notesWord: 'notes', sectionNav: 'Section navigation',
      keyQ: 'Key question', finalQ: 'Final question', optional: 'Optional',
      sitesHint: 'Add a link and what they like about it. Aim for 3–5.', checksHint: 'Tick all that apply.',
      addNote: '+ Add note', hideNote: 'Hide note', showNote: 'Show note', noteFor: 'Note for: {q}', notePh: 'Your note on this answer',
      otherSpecify: 'Other — please specify', statusOf: '{it} status',
      service: 'Service', removeService: 'Remove service {n}', addService: '+ Add another service',
      website: 'Website', websiteUrl: 'Website URL', whatLike: 'What do you like about it?', whatTheyLike: 'What they like',
      removeWebsite: 'Remove website {n}', addWebsite: '+ Add another website',
      saved: 'Saved', serviceRemoved: 'Service removed', websiteRemoved: 'Website removed',
      removeServiceQ: 'Remove service {n}?', removeServiceNamed: '“{name}” and its details will be removed.',
      removeServiceUnnamed: 'This service and its details will be removed.', keepIt: 'Keep it', removeServiceBtn: 'Remove service',
      newProjectTitle: 'New client project', editProjectTitle: 'Edit project details',
      newProjectIntro: 'Answers start blank for every new client. You can change these details later.',
      clientName: 'Client name', clientNameErr: 'Add the client’s name.', clientPh: 'e.g. Ana Ruiz',
      businessName: 'Business name', businessErr: 'Add the business name.', businessPh: 'e.g. Studio Pilates',
      projectName: 'Project name', projectPh: 'e.g. Studio Pilates Website',
      projectColour: 'Project colour (used in the app and PDF)', clientLogo: 'Client logo (optional)',
      noLogo: 'No logo', chooseImage: 'Choose image', removeLogo: 'Remove logo', logoPreview: 'Logo preview', logoAlt: '{b} logo',
      logoNotImage: 'Please choose an image file (PNG, JPG, SVG or WebP).', logoReadErr: 'Couldn’t read that file.',
      logoProcErr: 'That image couldn’t be processed.', logoOpenErr: 'That image couldn’t be opened.',
      cancel: 'Cancel', saveDetails: 'Save details', createProject: 'Create project',
      detailsSaved: 'Details saved', projectCreated: 'Project created for {b}', copySuffix: '(copy)', duplicated: 'Duplicated “{p}”',
      deleteQ: 'Delete this project?', deleteText: '“{p}” and all its answers will be removed from this browser. This can’t be undone. Export a PDF first if you need a copy.',
      keepProject: 'Keep project', deleteProject: 'Delete project', projectDeleted: 'Project deleted',
      resetQ: 'Reset all answers?', resetText: 'This clears every answer, service, website and note for “{p}”. Client name, business name, colour and logo stay.',
      answersCleared: 'Answers cleared — ready for a fresh start',
      summaryTitle: '{b} — Discovery summary', completionPct: 'Completion: {n}%', allAnswered: 'Every question answered',
      stillNeed1: '{n} question still needs answers', stillNeedN: '{n} questions still need answers',
      backToQuestions: 'Back to questions', printSave: 'Print / Save as PDF', genPdf: 'Generate PDF', edit: 'Edit', editX: 'Edit {s}',
      notProvided: 'Not provided', noteLbl: 'Note:', notes: 'Notes', projectNotes: 'Project notes',
      warnKeyTitle: 'Some key questions are unanswered', warnTitle: 'A few questions are unanswered',
      warnBody: '{n} {qs} still {need} answers{inc}. They’ll show as “Not provided” in the document.',
      question1: 'question', questionN: 'questions', need1: 'needs', needN: 'need',
      including: ', including {k} key {qs}', andMore: '…and more',
      printAnyway: 'Print anyway', genAnyway: 'Generate anyway', finishAnswering: 'Finish answering',
      docSubtitle: 'Website Discovery & Project Requirements', client: 'Client', business: 'Business', project: 'Project',
      date: 'Date', preparedBy: 'Prepared by', completionVal: '{n}% of questions answered', contents: 'Contents',
      confirmation: 'Project confirmation',
      confirmText: 'By signing, the client confirms the information in this document is accurate and forms the basis of the project scope.',
      sigClient: 'Client name', sigSignature: 'Client signature', sigDate: 'Date', sigPM: 'Project manager',
      question: 'Question', answer: 'Answer', page: 'Page {i} of {n}', footer: '{b} - Website Discovery', fileSlug: 'website-discovery',
      pdfDownloaded: 'PDF downloaded', pdfBuildErr: 'The PDF couldn’t be built. Opening Print instead — choose “Save as PDF”.',
      pdfEngineErr: 'PDF engine didn’t load (are you offline?). Opening Print — choose “Save as PDF”.',
      downloadBlocked: 'Download was blocked. Opening Print instead.', printUnavailable: 'Printing isn’t available here. Use your browser’s Print menu.'
    },
    pt: {
      discovery: 'Briefing', websiteDiscovery: 'Briefing do Site', language: 'Idioma',
      allProjects: 'Todos os projetos', newProject: '+ Novo projeto de cliente',
      heroTitle: 'Briefing de site, uma seção por vez.',
      heroText: 'Sente com o seu cliente, passem juntos pelas 14 seções curtas e depois revise e exporte um documento de projeto para assinatura.',
      savedProjects: 'Projetos salvos', noProjects: 'Nenhum projeto ainda',
      noProjectsText: 'Crie um antes da próxima reunião. Tudo é salvo automaticamente neste navegador.',
      studioDetails: 'Dados do seu estúdio', studioDetailsText: 'Aparecem no cabeçalho, no rodapé do PDF e como gerente do projeto.',
      studioName: 'Nome do estúdio', yourName: 'Seu nome',
      storageBanner: 'Este navegador está bloqueando o armazenamento, então as respostas não ficarão salvas ao fechar a página. Exporte um PDF antes de sair.',
      storageErr: 'Não foi possível salvar neste navegador. O armazenamento pode estar cheio (logos grandes ocupam espaço) ou bloqueado.',
      pctComplete: '{n}% concluído', updated: 'Atualizado em {d}', completion: 'Progresso',
      open: 'Abrir', duplicate: 'Duplicar', del: 'Excluir', exportPdf: 'Exportar PDF',
      with: 'com', allSaved: 'Tudo salvo', saving: 'Salvando…', notSaved: 'Não salvo',
      editDetails: 'Editar dados', resetAnswers: 'Limpar respostas', review: 'Revisar',
      sectionOf: 'Seção {a} de {b}', yourNotes: 'Suas anotações do projeto', myNotes: 'Minhas anotações do projeto',
      myNotesIntro: 'Só para você. Preferências, promessas feitas, pendências e coisas para pesquisar.',
      myNotesTag: 'Só para você, incluído no PDF',
      myNotesHint: 'Preferências do cliente, coisas para lembrar, perguntas de acompanhamento, ideias, questões técnicas, promessas feitas na reunião, coisas para investigar.',
      back: 'Voltar', saveContinue: 'Salvar e continuar', reviewAnswers: 'Revisar respostas',
      goTo: 'Ir para {x}: {title}, {p}% concluído', sectionN: 'seção {n}', notesWord: 'anotações', sectionNav: 'Navegação entre seções',
      keyQ: 'Pergunta-chave', finalQ: 'Pergunta final', optional: 'Opcional',
      sitesHint: 'Adicione o link e o que o cliente gosta nele. O ideal é de 3 a 5.', checksHint: 'Marque todas as opções que se aplicam.',
      addNote: '+ Adicionar nota', hideNote: 'Ocultar nota', showNote: 'Mostrar nota', noteFor: 'Nota sobre: {q}', notePh: 'Sua nota sobre esta resposta',
      otherSpecify: 'Outro — especifique', statusOf: 'Status de {it}',
      service: 'Serviço', removeService: 'Remover serviço {n}', addService: '+ Adicionar outro serviço',
      website: 'Site', websiteUrl: 'URL do site', whatLike: 'O que você gosta nele?', whatTheyLike: 'O que gosta',
      removeWebsite: 'Remover site {n}', addWebsite: '+ Adicionar outro site',
      saved: 'Salvo', serviceRemoved: 'Serviço removido', websiteRemoved: 'Site removido',
      removeServiceQ: 'Remover serviço {n}?', removeServiceNamed: '“{name}” e seus detalhes serão removidos.',
      removeServiceUnnamed: 'Este serviço e seus detalhes serão removidos.', keepIt: 'Manter', removeServiceBtn: 'Remover serviço',
      newProjectTitle: 'Novo projeto de cliente', editProjectTitle: 'Editar dados do projeto',
      newProjectIntro: 'As respostas começam em branco para cada novo cliente. Você pode alterar estes dados depois.',
      clientName: 'Nome do cliente', clientNameErr: 'Informe o nome do cliente.', clientPh: 'ex.: Ana Souza',
      businessName: 'Nome da empresa', businessErr: 'Informe o nome da empresa.', businessPh: 'ex.: Studio Pilates',
      projectName: 'Nome do projeto', projectPh: 'ex.: Site Studio Pilates',
      projectColour: 'Cor do projeto (usada no app e no PDF)', clientLogo: 'Logo do cliente (opcional)',
      noLogo: 'Sem logo', chooseImage: 'Escolher imagem', removeLogo: 'Remover logo', logoPreview: 'Prévia do logo', logoAlt: 'Logo de {b}',
      logoNotImage: 'Escolha um arquivo de imagem (PNG, JPG, SVG ou WebP).', logoReadErr: 'Não foi possível ler esse arquivo.',
      logoProcErr: 'Não foi possível processar essa imagem.', logoOpenErr: 'Não foi possível abrir essa imagem.',
      cancel: 'Cancelar', saveDetails: 'Salvar dados', createProject: 'Criar projeto',
      detailsSaved: 'Dados salvos', projectCreated: 'Projeto criado para {b}', copySuffix: '(cópia)', duplicated: '“{p}” duplicado',
      deleteQ: 'Excluir este projeto?', deleteText: '“{p}” e todas as respostas serão removidos deste navegador. Não dá para desfazer. Exporte um PDF antes se precisar de uma cópia.',
      keepProject: 'Manter projeto', deleteProject: 'Excluir projeto', projectDeleted: 'Projeto excluído',
      resetQ: 'Limpar todas as respostas?', resetText: 'Isso apaga todas as respostas, serviços, sites e notas de “{p}”. O nome do cliente, da empresa, a cor e o logo continuam.',
      answersCleared: 'Respostas apagadas — pronto para recomeçar',
      summaryTitle: '{b} — Resumo do briefing', completionPct: 'Concluído: {n}%', allAnswered: 'Todas as perguntas respondidas',
      stillNeed1: '{n} pergunta ainda sem resposta', stillNeedN: '{n} perguntas ainda sem resposta',
      backToQuestions: 'Voltar às perguntas', printSave: 'Imprimir / Salvar como PDF', genPdf: 'Gerar PDF', edit: 'Editar', editX: 'Editar {s}',
      notProvided: 'Não informado', noteLbl: 'Nota:', notes: 'Notas', projectNotes: 'Anotações do projeto',
      warnKeyTitle: 'Algumas perguntas-chave estão sem resposta', warnTitle: 'Algumas perguntas estão sem resposta',
      warnBody: '{n} {qs} ainda sem resposta{inc}. No documento aparecerão como “Não informado”.',
      question1: 'pergunta', questionN: 'perguntas', need1: '', needN: '',
      including: ', incluindo {k} {qs}-chave', andMore: '…e outras',
      printAnyway: 'Imprimir mesmo assim', genAnyway: 'Gerar mesmo assim', finishAnswering: 'Continuar respondendo',
      docSubtitle: 'Briefing do Site e Requisitos do Projeto', client: 'Cliente', business: 'Empresa', project: 'Projeto',
      date: 'Data', preparedBy: 'Preparado por', completionVal: '{n}% das perguntas respondidas', contents: 'Sumário',
      confirmation: 'Confirmação do projeto',
      confirmText: 'Ao assinar, o cliente confirma que as informações deste documento estão corretas e servem de base para o escopo do projeto.',
      sigClient: 'Nome do cliente', sigSignature: 'Assinatura do cliente', sigDate: 'Data', sigPM: 'Gerente do projeto',
      question: 'Pergunta', answer: 'Resposta', page: 'Página {i} de {n}', footer: '{b} - Briefing do Site', fileSlug: 'briefing-do-site',
      pdfDownloaded: 'PDF baixado', pdfBuildErr: 'Não foi possível gerar o PDF. Abrindo a impressão — escolha “Salvar como PDF”.',
      pdfEngineErr: 'O gerador de PDF não carregou (sem internet?). Abrindo a impressão — escolha “Salvar como PDF”.',
      downloadBlocked: 'O download foi bloqueado. Abrindo a impressão.', printUnavailable: 'A impressão não está disponível aqui. Use o menu Imprimir do navegador.'
    }
  };

  // Option values are stored in English; this maps them for display in Portuguese.
  const OPT_PT = {
    'Yes': 'Sim', 'No': 'Não', 'Not sure': 'Não sei', 'Need to create': 'Precisa criar', 'Client': 'Cliente', 'Both': 'Ambos', 'Other': 'Outro',
    'Get more bookings': 'Mais agendamentos', 'Get more enquiries': 'Mais contatos', 'Sell memberships/classes': 'Vender planos/aulas',
    'Build credibility': 'Gerar credibilidade', 'Provide information': 'Informar o público',
    'Home': 'Início', 'About': 'Sobre', 'Classes': 'Aulas', 'Pricing': 'Preços', 'Schedule': 'Horários', 'Book Now': 'Agendar',
    'Contact': 'Contato', 'FAQ': 'Perguntas frequentes', 'Instructors': 'Instrutores', 'Testimonials': 'Depoimentos', 'Gallery': 'Galeria', 'Blog': 'Blog',
    'Minimal': 'Minimalista', 'Luxury': 'Luxuoso', 'Modern': 'Moderno', 'Warm': 'Acolhedor', 'Elegant': 'Elegante', 'Energetic': 'Energético', 'Natural': 'Natural',
    'Logo': 'Logo', 'Photos': 'Fotos', 'Videos': 'Vídeos', 'Brand files': 'Arquivos da marca', 'Not received': 'Não recebido', 'Received': 'Recebido',
    'Name': 'Nome', 'Email': 'E-mail', 'Phone': 'Telefone', 'Message': 'Mensagem', 'Preferred class': 'Aula de interesse', 'Preferred date': 'Data de preferência',
    'Booking system': 'Sistema de agendamento', 'Online payments': 'Pagamentos online', 'Email marketing': 'E-mail marketing', 'Google Reviews': 'Avaliações do Google',
    'Client’s lawyer': 'Advogado do cliente', 'Studio (template)': 'Estúdio (modelo)',
    'Within 24 hours': 'Em até 24 horas', '2–3 days': '2 a 3 dias', 'Within a week': 'Em até uma semana'
  };

  const SVC_FIELDS = [
    { k: 'name', l: 'Service/class name', pt: 'Nome do serviço/aula', t: 'text', ph: 'e.g. Reformer Beginners', php: 'ex.: Reformer Iniciante' },
    { k: 'who', l: 'Who is it for?', pt: 'Para quem é?', t: 'text' },
    { k: 'desc', l: 'Description', pt: 'Descrição', t: 'textarea', full: true },
    { k: 'length', l: 'Session length', pt: 'Duração da sessão', t: 'text', ph: 'e.g. 50 minutes', php: 'ex.: 50 minutos' },
    { k: 'times', l: 'Available days/times', pt: 'Dias/horários disponíveis', t: 'text', ph: 'e.g. Mon & Wed 18:00', php: 'ex.: Seg e Qua 18h' },
    { k: 'price', l: 'Price', pt: 'Preço', t: 'text' },
    { k: 'packages', l: 'Packages or memberships?', pt: 'Pacotes ou planos?', t: 'text', ph: 'e.g. 10-class pack', php: 'ex.: pacote de 10 aulas' },
    { k: 'booking', l: 'Booking required?', pt: 'Precisa agendar?', t: 'pick', full: true },
    { k: 'know', l: 'Anything clients should know?', pt: 'Algo que os clientes devem saber?', t: 'textarea', full: true }
  ];

  /* ---------- Questionnaire ----------
     l / pt: label in English / Portuguese. ph / php: placeholders. detail / dpt: optional detail field.
     t: text | email | tel | url | date | textarea | yn | ync | choice | who | checks | status | services | websites
     imp: key question (warned about before PDF). opt: optional notes field (not counted in completion).
  */
  const SECTIONS = [
    {
      id: 'basics', title: 'Business basics', tpt: 'Dados básicos da empresa',
      intro: 'The essentials that will appear across the website.', ipt: 'O essencial que vai aparecer em todo o site.',
      q: [
        { k: 'bizName', l: 'What is the exact business name?', pt: 'Qual é o nome exato da empresa?', t: 'text', imp: 1 },
        { k: 'address', l: 'What is the business address?', pt: 'Qual é o endereço da empresa?', t: 'textarea', rows: 2 },
        { k: 'phone', l: 'What phone number should appear on the website?', pt: 'Qual telefone deve aparecer no site?', t: 'tel' },
        { k: 'email', l: 'What email should customers use?', pt: 'Qual e-mail os clientes devem usar?', t: 'email', imp: 1 },
        { k: 'hours', l: 'What are your opening hours?', pt: 'Qual é o horário de funcionamento?', t: 'textarea', rows: 3, ph: 'e.g. Mon–Fri 7:00–21:00, Sat 9:00–14:00', php: 'ex.: Seg–Sex 7h–21h, Sáb 9h–14h' },
        { k: 'social', l: 'What social media accounts should we link?', pt: 'Quais redes sociais devemos colocar no site?', t: 'textarea', rows: 2, ph: 'Instagram, Facebook, TikTok… handles or links', php: 'Instagram, Facebook, TikTok… @ ou links' },
        { k: 'goal', l: 'What is the main goal of the website?', pt: 'Qual é o principal objetivo do site?', t: 'checks', imp: 1, o: ['Get more bookings', 'Get more enquiries', 'Sell memberships/classes', 'Build credibility', 'Provide information', 'Other'] }
      ]
    },
    {
      id: 'about', title: 'About the business', tpt: 'Sobre a empresa',
      intro: 'The story and personality behind the business.', ipt: 'A história e a personalidade por trás do negócio.',
      q: [
        { k: 'about', l: 'Tell us about your business in a few sentences.', pt: 'Conte sobre a sua empresa em poucas frases.', t: 'textarea', rows: 5, imp: 1 },
        { k: 'howLong', l: 'How long have you been operating?', pt: 'Há quanto tempo a empresa existe?', t: 'text' },
        { k: 'different', l: 'What makes your business different?', pt: 'O que diferencia a sua empresa?', t: 'textarea', rows: 4 },
        { k: 'ideal', l: 'Who is your ideal client?', pt: 'Quem é o seu cliente ideal?', t: 'textarea', rows: 4, imp: 1 },
        { k: 'feeling', l: 'What feeling should people have when they visit the website?', pt: 'Que sensação as pessoas devem ter ao visitar o site?', t: 'textarea', rows: 3 }
      ]
    },
    {
      id: 'services', title: 'Services & classes', tpt: 'Serviços e aulas',
      intro: 'Add each class or service separately. Add as many as you need.', ipt: 'Adicione cada aula ou serviço separadamente, quantos precisar.',
      q: [{ k: 'services', l: 'Services & classes offered', pt: 'Serviços e aulas oferecidos', t: 'services', imp: 1 }]
    },
    {
      id: 'booking', title: 'Booking', tpt: 'Agendamento',
      intro: 'How clients book today, and what the website should handle.', ipt: 'Como os clientes agendam hoje e o que o site deve fazer.',
      q: [
        { k: 'howBook', l: 'How do customers currently book?', pt: 'Como os clientes agendam atualmente?', t: 'textarea', rows: 3 },
        { k: 'bookSystem', l: 'What booking system do you use?', pt: 'Qual sistema de agendamento vocês usam?', t: 'text', ph: 'e.g. Square Appointments, Mindbody, none', php: 'ex.: Square Appointments, Mindbody, nenhum' },
        { k: 'bookConnect', l: 'Should the website connect to the booking system?', pt: 'O site deve se conectar ao sistema de agendamento?', t: 'yn' },
        { k: 'payOnline', l: 'Should customers be able to pay online?', pt: 'Os clientes devem poder pagar online?', t: 'yn' },
        { k: 'cancellations', l: 'Do you need cancellations/rescheduling?', pt: 'Vocês precisam de cancelamento/reagendamento?', t: 'yn' },
        { k: 'memberships', l: 'Do you offer memberships?', pt: 'Vocês oferecem planos/mensalidades?', t: 'yn' },
        { k: 'giftCards', l: 'Do you offer gift cards?', pt: 'Vocês oferecem vale-presente?', t: 'yn' }
      ]
    },
    {
      id: 'website', title: 'Website', tpt: 'Site',
      intro: 'Pages to build and websites to take inspiration from.', ipt: 'Páginas a criar e sites de inspiração.',
      q: [
        { k: 'pages', l: 'Which pages do you need?', pt: 'Quais páginas você precisa?', t: 'checks', imp: 1, o: ['Home', 'About', 'Classes', 'Pricing', 'Schedule', 'Book Now', 'Contact', 'FAQ', 'Instructors', 'Testimonials', 'Gallery', 'Blog', 'Other'] },
        { k: 'sites', l: 'Please send 3–5 websites you like.', pt: 'Envie de 3 a 5 sites que você gosta.', t: 'websites' }
      ]
    },
    {
      id: 'branding', title: 'Branding & design', tpt: 'Marca e design',
      intro: 'Logo, colours, fonts and the overall look.', ipt: 'Logo, cores, fontes e o visual geral.',
      q: [
        { k: 'hasLogo', l: 'Do you already have a logo?', pt: 'Você já tem logo?', t: 'yn' },
        { k: 'brandColours', l: 'Do you have brand colours?', pt: 'Você tem cores da marca?', t: 'yn', detail: 'Colours or hex codes (optional)', dpt: 'Cores ou códigos hex (opcional)' },
        { k: 'fonts', l: 'Do you have preferred fonts?', pt: 'Você tem fontes preferidas?', t: 'yn', detail: 'Font names (optional)', dpt: 'Nome das fontes (opcional)' },
        { k: 'guidelines', l: 'Do you have brand guidelines?', pt: 'Você tem um manual da marca?', t: 'yn' },
        { k: 'style', l: 'What style do you want?', pt: 'Que estilo você quer?', t: 'checks', imp: 1, o: ['Minimal', 'Luxury', 'Modern', 'Warm', 'Elegant', 'Energetic', 'Natural', 'Other'] },
        { k: 'noColours', l: 'Are there colours you do NOT want?', pt: 'Há cores que você NÃO quer?', t: 'text' },
        { k: 'styleSites', l: 'Are there websites whose visual style you like?', pt: 'Há sites cujo estilo visual você gosta?', t: 'textarea', rows: 3 },
        { k: 'designNotes', l: 'Additional design notes', pt: 'Observações adicionais de design', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'media', title: 'Photos & videos', tpt: 'Fotos e vídeos',
      intro: 'What visual material exists, and whether we can use it.', ipt: 'Que material visual existe e se podemos usá-lo.',
      q: [
        { k: 'proPhotos', l: 'Do you have professional photos?', pt: 'Você tem fotos profissionais?', t: 'yn' },
        { k: 'studioPhotos', l: 'Do you have studio photos?', pt: 'Você tem fotos do espaço/estúdio?', t: 'yn' },
        { k: 'instructorPhotos', l: 'Do you have instructor photos?', pt: 'Você tem fotos dos instrutores?', t: 'yn' },
        { k: 'classPhotos', l: 'Do you have class photos?', pt: 'Você tem fotos das aulas?', t: 'yn' },
        { k: 'videos', l: 'Do you have videos?', pt: 'Você tem vídeos?', t: 'yn' },
        { k: 'canUse', l: 'Can we use these on the website?', pt: 'Podemos usar esse material no site?', t: 'yn' },
        { k: 'permission', l: 'Do you have permission from people appearing in the photos/videos?', pt: 'Você tem autorização das pessoas que aparecem nas fotos/vídeos?', t: 'yn' },
        { k: 'assets', l: 'Assets status', pt: 'Status dos materiais', t: 'status', items: ['Logo', 'Photos', 'Videos', 'Brand files'] }
      ]
    },
    {
      id: 'content', title: 'Content', tpt: 'Conteúdo',
      intro: 'Who writes and supplies each piece of website content.', ipt: 'Quem escreve e fornece cada parte do conteúdo do site.',
      q: [
        { k: 'whoText', l: 'Who will provide the website text?', pt: 'Quem vai fornecer os textos do site?', t: 'who' },
        { k: 'whoClasses', l: 'Who will provide class descriptions?', pt: 'Quem vai fornecer as descrições das aulas?', t: 'who' },
        { k: 'whoPrices', l: 'Who will provide prices?', pt: 'Quem vai fornecer os preços?', t: 'who' },
        { k: 'whoTestimonials', l: 'Who will provide testimonials?', pt: 'Quem vai fornecer os depoimentos?', t: 'who' },
        { k: 'whoFaqs', l: 'Who will provide FAQs?', pt: 'Quem vai fornecer as perguntas frequentes?', t: 'who' },
        { k: 'writeContent', l: 'Would you like us to write or edit the content?', pt: 'Gostaria que nós escrevêssemos ou revisássemos o conteúdo?', t: 'yn' },
        { k: 'contentNotes', l: 'Content notes', pt: 'Observações sobre o conteúdo', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'contact', title: 'Contact & leads', tpt: 'Contato e leads',
      intro: 'How enquiries reach the business.', ipt: 'Como os pedidos de contato chegam até a empresa.',
      q: [
        { k: 'formFields', l: 'What information should the contact form collect?', pt: 'Quais informações o formulário de contato deve coletar?', t: 'checks', o: ['Name', 'Email', 'Phone', 'Message', 'Preferred class', 'Preferred date', 'Other'] },
        { k: 'sendTo', l: 'Where should enquiries be sent?', pt: 'Para onde os contatos devem ser enviados?', t: 'text', ph: 'Email address(es)', php: 'E-mail(s)' },
        { k: 'whatsapp', l: 'Should the website include WhatsApp?', pt: 'O site deve ter WhatsApp?', t: 'yn', detail: 'WhatsApp number (optional)', dpt: 'Número do WhatsApp (opcional)' },
        { k: 'autoConfirm', l: 'Should customers receive an automatic confirmation message?', pt: 'Os clientes devem receber uma mensagem automática de confirmação?', t: 'yn' },
        { k: 'leadGen', l: 'Do you need any other lead-generation features?', pt: 'Precisa de outros recursos para captar clientes?', t: 'textarea', rows: 3, ph: 'e.g. free trial class sign-up, newsletter pop-up', php: 'ex.: inscrição para aula experimental, pop-up de newsletter' }
      ]
    },
    {
      id: 'technical', title: 'Technical', tpt: 'Parte técnica',
      intro: 'Domain, hosting and the tools already in place.', ipt: 'Domínio, hospedagem e ferramentas que já existem.',
      q: [
        { k: 'ownDomain', l: 'Do you already own the domain?', pt: 'Você já tem o domínio?', t: 'yn', detail: 'Domain name (optional)', dpt: 'Nome do domínio (opcional)' },
        { k: 'registrar', l: 'Where is the domain registered?', pt: 'Onde o domínio está registrado?', t: 'text', ph: 'e.g. GoDaddy, Namecheap, Wix', php: 'ex.: Registro.br, GoDaddy, Wix' },
        { k: 'hosting', l: 'Do you already have hosting?', pt: 'Você já tem hospedagem?', t: 'yn', detail: 'Hosting provider (optional)', dpt: 'Provedor de hospedagem (opcional)' },
        { k: 'existingSite', l: 'Do you have an existing website?', pt: 'Você já tem um site?', t: 'yn', detail: 'Current URL (optional)', dpt: 'URL atual (opcional)' },
        { k: 'analytics', l: 'Do you have Google Analytics?', pt: 'Você tem Google Analytics?', t: 'yn' },
        { k: 'searchConsole', l: 'Do you have Google Search Console?', pt: 'Você tem Google Search Console?', t: 'yn' },
        { k: 'gbpTech', l: 'Do you have Google Business Profile?', pt: 'Você tem Perfil da Empresa no Google?', t: 'yn' },
        { k: 'seoSetup', l: 'Do you need SEO setup?', pt: 'Precisa de configuração de SEO?', t: 'yn' },
        { k: 'cookieConsent', l: 'Do you need cookie consent?', pt: 'Precisa de aviso de consentimento de cookies?', t: 'yn' },
        { k: 'techNotes', l: 'Technical notes', pt: 'Observações técnicas', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'integrations', title: 'Integrations', tpt: 'Integrações',
      intro: 'Tools and services the website should connect to.', ipt: 'Ferramentas e serviços que o site deve conectar.',
      q: [
        { k: 'integrations', l: 'Which integrations do you need?', pt: 'Quais integrações você precisa?', t: 'checks', o: ['Booking system', 'Online payments', 'Google Maps', 'Instagram', 'WhatsApp', 'Email marketing', 'Newsletter', 'CRM', 'Google Analytics', 'Google Reviews', 'Other'] },
        { k: 'intNotes', l: 'Integration notes', pt: 'Observações sobre integrações', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'seo', title: 'SEO', tpt: 'SEO',
      intro: 'Who should find the business on Google, and how.', ipt: 'Quem deve encontrar a empresa no Google, e como.',
      q: [
        { k: 'locations', l: 'Which locations do you want to attract customers from?', pt: 'De quais regiões você quer atrair clientes?', t: 'textarea', rows: 2 },
        { k: 'seoServices', l: 'What services do you want people to find you for?', pt: 'Por quais serviços você quer ser encontrado?', t: 'textarea', rows: 2 },
        { k: 'competitors', l: 'Who are your main competitors?', pt: 'Quem são seus principais concorrentes?', t: 'textarea', rows: 2 },
        { k: 'keywords', l: 'What keywords do you think customers search for?', pt: 'Quais palavras você acha que os clientes pesquisam?', t: 'textarea', rows: 2 },
        { k: 'gbpSeo', l: 'Do you have a Google Business Profile?', pt: 'Você tem Perfil da Empresa no Google?', t: 'yn' },
        { k: 'reviews', l: 'Do you have Google reviews?', pt: 'Você tem avaliações no Google?', t: 'yn' },
        { k: 'seoNotes', l: 'SEO notes', pt: 'Observações de SEO', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'legal', title: 'Legal & policies', tpt: 'Jurídico e políticas',
      intro: 'Policies the website needs to show.', ipt: 'Políticas que o site precisa exibir.',
      q: [
        { k: 'privacy', l: 'Do you have a Privacy Policy?', pt: 'Você tem Política de Privacidade?', t: 'ync' },
        { k: 'cookiePolicy', l: 'Do you have a Cookie Policy?', pt: 'Você tem Política de Cookies?', t: 'ync' },
        { k: 'terms', l: 'Do you have Terms & Conditions?', pt: 'Você tem Termos e Condições?', t: 'ync' },
        { k: 'bookingPolicy', l: 'Do you have a Booking Policy?', pt: 'Você tem Política de Agendamento?', t: 'ync' },
        { k: 'cancelPolicy', l: 'Do you have a Cancellation Policy?', pt: 'Você tem Política de Cancelamento?', t: 'ync' },
        { k: 'refundPolicy', l: 'Do you have a Refund Policy?', pt: 'Você tem Política de Reembolso?', t: 'ync' },
        { k: 'legalText', l: 'Who will provide the legal text?', pt: 'Quem vai fornecer os textos jurídicos?', t: 'choice', o: ['Client', 'Client’s lawyer', 'Studio (template)', 'Not sure'] },
        { k: 'legalNotes', l: 'Legal notes', pt: 'Observações jurídicas', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'project', title: 'Project details', tpt: 'Detalhes do projeto',
      intro: 'Timeline, budget, approvals and life after launch.', ipt: 'Prazo, orçamento, aprovações e o pós-lançamento.',
      q: [
        { k: 'launch', l: 'What is your desired launch date?', pt: 'Qual é a data desejada de lançamento?', t: 'date', imp: 1 },
        { k: 'deadline', l: 'Is there a specific deadline or event?', pt: 'Há algum prazo ou evento específico?', t: 'text' },
        { k: 'approver', l: 'Who will approve the website?', pt: 'Quem vai aprovar o site?', t: 'text', imp: 1 },
        { k: 'feedbackWho', l: 'Who will provide feedback?', pt: 'Quem vai dar o feedback?', t: 'text' },
        { k: 'feedbackSpeed', l: 'How quickly can feedback normally be provided?', pt: 'Com que rapidez o feedback costuma ser dado?', t: 'choice', o: ['Within 24 hours', '2–3 days', 'Within a week', 'Not sure'] },
        { k: 'budget', l: 'What is the project budget?', pt: 'Qual é o orçamento do projeto?', t: 'text', imp: 1 },
        { k: 'outOfScope', l: 'Are there any features that are outside the current scope?', pt: 'Há recursos que estão fora do escopo atual?', t: 'textarea', rows: 3 },
        { k: 'maintenance', l: 'Is maintenance required after launch?', pt: 'Vai precisar de manutenção após o lançamento?', t: 'yn' },
        { k: 'manager', l: 'Who will manage the website after launch?', pt: 'Quem vai gerenciar o site após o lançamento?', t: 'who' },
        { k: 'anythingElse', l: 'Is there anything else you expect the website to do that we haven’t discussed?', pt: 'Há mais alguma coisa que você espera que o site faça e que ainda não conversamos?', t: 'textarea', big: 1, final: 1 }
      ]
    }
  ];
  const NOTES_STEP = SECTIONS.length; // step index 14
  const TOTAL_STEPS = SECTIONS.length + 1;

  /* ---------- Utilities ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const trim = (v) => (typeof v === 'string' ? v.trim() : '');

  /* ---------- Language helpers ---------- */
  const lang = () => (settings.lang === 'pt' ? 'pt' : 'en');
  const isPT = () => lang() === 'pt';
  function t(key, vars) {
    let s = STR[lang()][key];
    if (s == null) s = STR.en[key];
    if (s == null) s = key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  const opt = (o) => (isPT() ? (OPT_PT[o] || o) : o);
  const qL = (q) => (isPT() && q.pt ? q.pt : q.l);
  const qPh = (q) => (isPT() && q.php != null ? q.php : (q.ph || ''));
  const qDetail = (q) => (isPT() && q.dpt ? q.dpt : q.detail);
  const secT = (sec) => (isPT() && sec.tpt ? sec.tpt : sec.title);
  const secI = (sec) => (isPT() && sec.ipt ? sec.ipt : sec.intro);
  const loc = () => (isPT() ? 'pt-BR' : 'en-GB');
  const defaultProjectName = (b) => (isPT() ? `Site ${b}` : `${b} Website`);

  function hexToRgb(hex) {
    const h = String(hex || '#FF4F8B').replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function luminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((v) => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const inkOn = (hex) => (luminance(hex) > 0.42 ? '#1F1A3D' : '#FFFFFF');
  const secColor = (i) => SECTION_COLORS[i % SECTION_COLORS.length];

  function fmtDate(d, long = true) {
    if (!d) return '';
    const dt = typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T12:00:00') : new Date(d);
    if (isNaN(dt)) return String(d);
    return dt.toLocaleDateString(loc(), long ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' });
  }
  const slug = (s) => String(s || 'project').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'project';

  /* ---------- Storage ---------- */
  let storageOK = true;
  function readLS(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { storageOK = false; return fallback; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) {
      storageOK = false;
      toast(t('storageErr'), true);
      return false;
    }
  }

  let settings = Object.assign({ studio: 'Digital Studio Co', manager: 'Lais Zagati', lang: 'en' }, readLS(LS_SETTINGS, {}));
  let projects = readLS(LS_PROJECTS, []);
  if (!Array.isArray(projects)) projects = [];
  projects.forEach(normalize);

  function blankService() { return { name: '', who: '', desc: '', length: '', times: '', price: '', packages: '', booking: '', know: '' }; }
  function blankSite() { return { url: '', like: '' }; }

  function normalize(p) {
    p.a = p.a || {};
    p.qn = p.qn || {};
    p.services = Array.isArray(p.services) && p.services.length ? p.services : [blankService()];
    p.websites = Array.isArray(p.websites) && p.websites.length ? p.websites : [blankSite()];
    p.step = Number.isInteger(p.step) ? Math.min(Math.max(p.step, 0), NOTES_STEP) : 0;
    p.color = p.color || PALETTE[0].c;
    return p;
  }

  function newProject({ clientName, businessName, projectName, color, logo, logoW, logoH }) {
    const now = Date.now();
    return normalize({
      id: uid(), clientName, businessName,
      projectName: projectName || defaultProjectName(businessName),
      color: color || PALETTE[0].c, logo: logo || '', logoW: logoW || 0, logoH: logoH || 0,
      created: now, updated: now, step: 0,
      a: { bizName: businessName }, qn: {}
    });
  }

  function persist() { return writeLS(LS_PROJECTS, projects); }
  const getProject = (id) => projects.find((p) => p.id === id);

  /* ---------- Completion ---------- */
  const counted = (q) => !q.opt && q.t !== 'status';

  function isAnswered(q, p) {
    const v = p.a[q.k];
    switch (q.t) {
      case 'checks': return Array.isArray(v) && v.length > 0;
      case 'services': return p.services.some((s) => trim(s.name));
      case 'websites': return p.websites.some((w) => trim(w.url));
      case 'status': return true;
      default: return trim(v) !== '';
    }
  }

  function sectionStats(i, p) {
    const qs = SECTIONS[i].q.filter(counted);
    const done = qs.filter((q) => isAnswered(q, p)).length;
    return { done, total: qs.length, pct: qs.length ? done / qs.length : 1 };
  }

  function stats(p) {
    let done = 0, total = 0;
    const missing = [];
    SECTIONS.forEach((sec, i) => sec.q.filter(counted).forEach((q) => {
      total++;
      if (isAnswered(q, p)) done++;
      else missing.push({ q, sec: i });
    }));
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0, missing };
  }

  /* ---------- Answer formatting (shared by review, print and PDF) ---------- */
  function whoLabel(v) { return v === 'Studio' ? (settings.studio || 'Studio') : opt(v); }

  function fmtAnswer(q, p) {
    const v = p.a[q.k];
    if (q.t === 'checks') {
      if (!Array.isArray(v) || !v.length) return '';
      return v.map((x) => (x === 'Other' && trim(p.a[q.k + '_o']) ? `${opt('Other')}: ${trim(p.a[q.k + '_o'])}` : opt(x))).join(', ');
    }
    let s = trim(v);
    if (!s) return '';
    if (q.t === 'who') s = whoLabel(s);
    else if (q.t === 'date') s = fmtDate(s);
    else if (q.t === 'yn' || q.t === 'ync' || q.t === 'choice') s = opt(s);
    const d = trim(p.a[q.k + '_d']);
    if (q.detail && d) s += ` — ${d}`;
    return s;
  }

  function reportItem(q, p) {
    const note = trim(p.qn[q.k]) || null;
    if (q.t === 'services') {
      const svcs = p.services.filter((s) => SVC_FIELDS.some((f) => trim(s[f.k])));
      return {
        kind: 'groups', q: qL(q), note,
        groups: svcs.map((s, i) => ({
          title: `${t('service')} ${i + 1}${trim(s.name) ? ': ' + trim(s.name) : ''}`,
          rows: SVC_FIELDS.filter((f) => f.k !== 'name').map((f) => [qL(f), (f.t === 'pick' ? opt(trim(s[f.k])) : trim(s[f.k])) || null])
        }))
      };
    }
    if (q.t === 'websites') {
      const ws = p.websites.filter((w) => trim(w.url) || trim(w.like));
      return {
        kind: 'groups', q: qL(q), note,
        groups: ws.map((w, i) => ({ title: `${t('website')} ${i + 1}`, rows: [['URL', trim(w.url) || null], [t('whatTheyLike'), trim(w.like) || null]] }))
      };
    }
    if (q.t === 'status') {
      const st = p.a[q.k] || {};
      return { kind: 'groups', q: qL(q), note, groups: [{ title: '', rows: q.items.map((it) => [opt(it), opt(st[it] || 'Not received')]) }] };
    }
    return { kind: 'qa', q: qL(q), a: fmtAnswer(q, p) || null, note };
  }

  function report(p) {
    const secs = SECTIONS.map((sec, i) => ({ n: i + 1, title: secT(sec), step: i, items: sec.q.map((q) => reportItem(q, p)) }));
    secs.push({ n: TOTAL_STEPS, title: t('projectNotes'), step: NOTES_STEP, items: [{ kind: 'text', a: trim(p.a.myNotes) || null }] });
    return secs;
  }

  /* ---------- App state ---------- */
  let view = 'home';
  let currentId = null;
  const app = $('#app');

  function current() { return getProject(currentId); }

  function go(v, opts = {}) {
    view = v;
    if (opts.id) currentId = opts.id;
    render();
    window.scrollTo(0, opts.keepScroll ? window.scrollY : 0);
    if (opts.focus) { const el = $(opts.focus); if (el) el.focus({ preventScroll: true }); }
  }

  function render() {
    document.documentElement.lang = isPT() ? 'pt-BR' : 'en';
    $('#brandName').textContent = settings.studio || t('websiteDiscovery');
    $('#brandSub').textContent = t('discovery');
    document.title = t('websiteDiscovery');
    const brand = $('.brand'); if (brand) brand.setAttribute('aria-label', t('allProjects'));
    document.documentElement.style.setProperty('--accent', current() && view !== 'home' ? current().color : '#FF4F8B');
    document.documentElement.style.setProperty('--accent-ink', current() && view !== 'home' ? inkOn(current().color) : '#FFFFFF');
    if (view === 'wizard' && current()) renderWizard();
    else if (view === 'review' && current()) renderReview();
    else { view = 'home'; renderHome(); }
    renderTopbar();
  }

  function renderTopbar() {
    const right = $('#topbarRight');
    const toggle = `<div class="lang-toggle" role="group" aria-label="${esc(t('language'))}">
        <button type="button" data-act="lang" data-v="en" aria-pressed="${!isPT()}" lang="en">EN</button>
        <button type="button" data-act="lang" data-v="pt" aria-pressed="${isPT()}" lang="pt-BR">PT</button>
      </div>`;
    right.innerHTML = toggle + (view === 'home'
      ? `<button type="button" class="btn btn-dark top-new" data-act="new">${esc(t('newProject'))}</button>`
      : `<button type="button" class="btn-ghost" data-act="home">${esc(t('allProjects'))}</button>`);
  }

  function logoHTML(p, cls = '') {
    if (p.logo) return `<span class="logo-box ${cls}"><img src="${p.logo}" alt="${esc(t('logoAlt', { b: p.businessName }))}"></span>`;
    const ini = (p.businessName || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    return `<span class="monogram ${cls}" style="--accent:${p.color};--accent-ink:${inkOn(p.color)}" aria-hidden="true">${esc(ini)}</span>`;
  }

  /* ---------- Home ---------- */
  function renderHome() {
    const list = projects.slice().sort((a, b) => b.updated - a.updated);
    const cards = list.map((p) => {
      const s = stats(p);
      return `
      <article class="pcard" style="--accent:${p.color};--accent-ink:${inkOn(p.color)}">
        <div class="pcard-top">
          ${logoHTML(p)}
          <div>
            <h3>${esc(p.projectName)}</h3>
            <p class="pcard-sub">${esc(p.businessName)}${p.clientName ? ` — ${esc(p.clientName)}` : ''}</p>
          </div>
        </div>
        <div>
          <div class="mini-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.pct}" aria-label="${esc(t('completion'))}"><span style="width:${s.pct}%"></span></div>
          <p class="pcard-meta"><span>${esc(t('pctComplete', { n: s.pct }))}</span><span>${esc(t('updated', { d: fmtDate(p.updated, false) }))}</span></p>
        </div>
        <div class="pcard-actions">
          <button type="button" class="open" data-act="open" data-id="${p.id}">${esc(t('open'))}</button>
          <button type="button" data-act="dup" data-id="${p.id}">${esc(t('duplicate'))}</button>
          <button type="button" class="del" data-act="del" data-id="${p.id}">${esc(t('del'))}</button>
          <button type="button" data-act="pdf" data-id="${p.id}">${esc(t('exportPdf'))}</button>
        </div>
      </article>`;
    }).join('');

    app.innerHTML = `
      ${storageOK ? '' : `<p class="banner">${esc(t('storageBanner'))}</p>`}
      <section class="home-hero">
        <div class="hero-shapes" aria-hidden="true"><span class="s1"></span><span class="s2"></span><span class="s3"></span></div>
        <h1>${esc(t('heroTitle'))}</h1>
        <p>${esc(t('heroText'))}</p>
        <button type="button" class="btn btn-primary btn-lg" data-act="new">${esc(t('newProject'))}</button>
      </section>
      <div class="home-grid">
        <section aria-labelledby="savedTitle">
          <h2 class="block-title" id="savedTitle">${esc(t('savedProjects'))} <span class="count">${projects.length}</span></h2>
          ${list.length ? `<div class="plist">${cards}</div>` : `
            <div class="empty">
              <h3>${esc(t('noProjects'))}</h3>
              <p>${esc(t('noProjectsText'))}</p>
              <button type="button" class="btn btn-dark" data-act="new">${esc(t('newProject'))}</button>
            </div>`}
        </section>
        <aside class="settings-card" aria-labelledby="setTitle">
          <h2 id="setTitle">${esc(t('studioDetails'))}</h2>
          <p class="muted">${esc(t('studioDetailsText'))}</p>
          <label>${esc(t('studioName'))}<input class="field" data-set="studio" value="${esc(settings.studio)}" autocomplete="organization"></label>
          <label>${esc(t('yourName'))}<input class="field" data-set="manager" value="${esc(settings.manager)}" autocomplete="name"></label>
        </aside>
      </div>`;
  }

  /* ---------- Wizard ---------- */
  function segLabel(i, p) {
    const done = i === NOTES_STEP ? (trim(p.a.myNotes) ? 1 : 0) : sectionStats(i, p).pct;
    const title = i === NOTES_STEP ? t('myNotes') : secT(SECTIONS[i]);
    return { done, label: t('goTo', { x: i === NOTES_STEP ? t('notesWord') : t('sectionN', { n: i + 1 }), title, p: Math.round(done * 100) }) };
  }

  function renderWizard() {
    const p = current();
    const step = p.step;
    const isNotes = step === NOTES_STEP;
    const sec = isNotes ? null : SECTIONS[step];
    const color = isNotes ? '#1F1A3D' : secColor(step);
    const s = stats(p);

    const segs = Array.from({ length: TOTAL_STEPS }, (_, i) => {
      const { done, label } = segLabel(i, p);
      return `<button type="button" class="seg ${i === step ? 'current' : ''}" data-act="jump" data-step="${i}"
        style="--c:${i === NOTES_STEP ? '#B9B3D9' : secColor(i)}" aria-label="${esc(label)}" ${i === step ? 'aria-current="step"' : ''}>
        <span class="fill" style="width:${Math.round(done * 100)}%"></span><span class="n">${i === NOTES_STEP ? '✎' : i + 1}</span></button>`;
    }).join('');

    const body = isNotes ? notesHTML(p) : sec.q.map((q) => questionHTML(q, p)).join('');

    app.innerHTML = `
      <div class="wiz" style="--sec:${color};--sec-ink:${inkOn(color)}">
        <div class="wiz-head">
          <div class="client-chip">
            ${logoHTML(p)}
            <div><strong>${esc(p.businessName)} — ${esc(t('websiteDiscovery'))}</strong><span class="muted">${esc(p.projectName)}${p.clientName ? ' ' + esc(t('with')) + ' ' + esc(p.clientName) : ''}</span></div>
          </div>
          <div class="wiz-tools">
            <span class="saved" id="savedState">${esc(t('allSaved'))}</span>
            <button type="button" class="btn-ghost" data-act="edit-details">${esc(t('editDetails'))}</button>
            <button type="button" class="btn-ghost" data-act="reset">${esc(t('resetAnswers'))}</button>
            <button type="button" class="btn-ghost" data-act="review">${esc(t('review'))}</button>
          </div>
        </div>

        <div class="progress-wrap">
          <div class="progress-meta">
            <span>${esc(isNotes ? t('yourNotes') : t('sectionOf', { a: step + 1, b: SECTIONS.length }))}</span>
            <span class="pct" id="pctLabel">${esc(t('pctComplete', { n: s.pct }))}</span>
          </div>
          <div class="segs">${segs}</div>
          <div class="ascii" id="asciiBar" aria-hidden="true">${asciiBar(s.pct)}</div>
        </div>

        <form class="sec-card" id="secForm" novalidate>
          <div class="sec-head">
            <span class="sec-badge" aria-hidden="true">${isNotes ? '✎' : step + 1}</span>
            <div>
              <h1 id="secTitle" tabindex="-1">${esc(isNotes ? t('myNotes') : secT(sec))}</h1>
              <p>${esc(isNotes ? t('myNotesIntro') : secI(sec))}</p>
            </div>
          </div>
          <div class="qs">${body}</div>
        </form>

        <nav class="wiz-nav" aria-label="${esc(t('sectionNav'))}">
          <button type="button" class="btn btn-outline" data-act="back">${esc(step === 0 ? t('allProjects') : t('back'))}</button>
          <button type="button" class="btn btn-primary" data-act="next">${esc(isNotes ? t('reviewAnswers') : t('saveContinue'))}</button>
        </nav>
      </div>`;
  }

  function asciiBar(pct) {
    const n = 20, f = Math.round((pct / 100) * n);
    return '█'.repeat(f) + '░'.repeat(n - f) + ' ' + pct + '%';
  }

  function notesHTML(p) {
    return `<div class="q">
      <label class="q-label" for="f_myNotes">${esc(t('myNotes'))} <span class="opt-tag">${esc(t('myNotesTag'))}</span></label>
      <p class="q-hint">${esc(t('myNotesHint'))}</p>
      <textarea class="field big" id="f_myNotes" data-k="myNotes" rows="14">${esc(p.a.myNotes || '')}</textarea>
    </div>`;
  }

  function optionsFor(q) {
    if (q.t === 'yn') return YN;
    if (q.t === 'ync') return YNC;
    if (q.t === 'who') return ['Client', 'Studio', 'Both'];
    return q.o || [];
  }
  function optionLabel(q, o) { return q.t === 'who' ? whoLabel(o) : opt(o); }

  function questionHTML(q, p) {
    const id = 'f_' + q.k;
    const v = p.a[q.k];
    const lid = 'l_' + q.k;
    const label = qL(q);
    let input = '';
    let labelTag = 'label';

    switch (q.t) {
      case 'text': case 'email': case 'tel': case 'url': case 'date':
        input = `<input class="field" type="${q.t}" id="${id}" data-k="${q.k}" value="${esc(v || '')}" placeholder="${esc(qPh(q))}"${q.t === 'email' ? ' autocomplete="off"' : ''}${q.t === 'date' ? ` lang="${isPT() ? 'pt-BR' : 'en-GB'}"` : ''}>`;
        break;
      case 'textarea':
        input = `<textarea class="field ${q.big ? 'big' : ''}" id="${id}" data-k="${q.k}" rows="${q.rows || 4}" placeholder="${esc(qPh(q))}">${esc(v || '')}</textarea>`;
        break;
      case 'yn': case 'ync': case 'choice': case 'who': {
        labelTag = 'p';
        input = `<div class="pills" role="radiogroup" aria-labelledby="${lid}">` +
          optionsFor(q).map((o) => `<button type="button" class="pill ${v === o ? 'on' : ''}" role="radio" aria-checked="${v === o}" data-pick="${q.k}" data-v="${esc(o)}">${esc(optionLabel(q, o))}</button>`).join('') +
          `</div>`;
        if (q.detail) {
          input += `<input class="field" type="text" data-k="${q.k}_d" aria-label="${esc(qDetail(q))}" placeholder="${esc(qDetail(q))}" value="${esc(p.a[q.k + '_d'] || '')}">`;
        }
        break;
      }
      case 'checks': {
        labelTag = 'p';
        const arr = Array.isArray(v) ? v : [];
        input = `<div class="checks" role="group" aria-labelledby="${lid}">` +
          q.o.map((o) => `<label class="check ${arr.includes(o) ? 'on' : ''}"><input type="checkbox" data-check="${q.k}" value="${esc(o)}" ${arr.includes(o) ? 'checked' : ''}><span class="box" aria-hidden="true">✓</span>${esc(opt(o))}</label>`).join('') +
          `</div>`;
        if (q.o.includes('Other')) {
          input += `<input class="field ${arr.includes('Other') ? '' : 'hidden'}" type="text" data-k="${q.k}_o" data-other="${q.k}" aria-label="${esc(t('otherSpecify'))}" placeholder="${esc(t('otherSpecify'))}" value="${esc(p.a[q.k + '_o'] || '')}">`;
        }
        break;
      }
      case 'status': {
        labelTag = 'p';
        const st = v || {};
        input = `<div class="status-list" role="group" aria-labelledby="${lid}">` + q.items.map((it) => {
          const cur = st[it] || 'Not received';
          return `<div class="status-row"><strong>${esc(opt(it))}</strong><div class="pills" role="radiogroup" aria-label="${esc(t('statusOf', { it: opt(it) }))}">
            <button type="button" class="pill pending ${cur === 'Not received' ? 'on' : ''}" role="radio" aria-checked="${cur === 'Not received'}" data-status="${q.k}" data-item="${esc(it)}" data-v="Not received">${esc(opt('Not received'))}</button>
            <button type="button" class="pill received ${cur === 'Received' ? 'on' : ''}" role="radio" aria-checked="${cur === 'Received'}" data-status="${q.k}" data-item="${esc(it)}" data-v="Received">${esc(opt('Received'))}</button>
          </div></div>`;
        }).join('') + `</div>`;
        break;
      }
      case 'services':
        labelTag = 'p';
        input = servicesHTML(p);
        break;
      case 'websites':
        labelTag = 'p';
        input = sitesHTML(p);
        break;
    }

    const forAttr = labelTag === 'label' ? ` for="${id}"` : '';
    const tag = q.final ? `<span class="key">${esc(t('finalQ'))}</span>` : (q.imp ? `<span class="key">${esc(t('keyQ'))}</span>` : (q.opt ? `<span class="opt-tag">${esc(t('optional'))}</span>` : ''));
    const hint = q.t === 'websites' ? `<p class="q-hint">${esc(t('sitesHint'))}</p>`
      : (q.t === 'checks' ? `<p class="q-hint">${esc(t('checksHint'))}</p>` : '');
    const note = p.qn[q.k] || '';
    const noteBlock = q.opt ? '' : `
      <div class="qnote">
        <button type="button" class="note-toggle" data-note="${q.k}" aria-expanded="${!!note}" aria-controls="n_${q.k}">${esc(note ? t('hideNote') : t('addNote'))}</button>
        <textarea class="field note ${note ? '' : 'hidden'}" id="n_${q.k}" data-qn="${q.k}" rows="2" aria-label="${esc(t('noteFor', { q: label }))}" placeholder="${esc(t('notePh'))}">${esc(note)}</textarea>
      </div>`;

    return `<div class="q" data-q="${q.k}">
      <${labelTag} class="q-label" id="${lid}"${forAttr}>${esc(label)} ${tag}</${labelTag}>
      ${hint}
      ${input}
      ${noteBlock}
    </div>`;
  }

  function servicesHTML(p) {
    const list = p.services;
    return `<div class="repeat" id="svcList">` + list.map((s, i) => `
      <fieldset class="rep-card">
        <legend data-legend="${i}">${esc(t('service'))} ${i + 1}${trim(s.name) ? ': ' + esc(s.name) : ''}</legend>
        <div class="grid2">
          ${SVC_FIELDS.map((f) => {
            const fid = `svc_${i}_${f.k}`;
            if (f.t === 'pick') {
              return `<div class="full"><span class="sub-label" id="${fid}_l">${esc(qL(f))}</span><div class="pills" role="radiogroup" aria-labelledby="${fid}_l">` +
                YN.map((o) => `<button type="button" class="pill ${s[f.k] === o ? 'on' : ''}" role="radio" aria-checked="${s[f.k] === o}" data-svcpick="${i}" data-f="${f.k}" data-v="${o}">${esc(opt(o))}</button>`).join('') +
                `</div></div>`;
            }
            const field = f.t === 'textarea'
              ? `<textarea class="field" id="${fid}" rows="3" data-svc="${i}" data-f="${f.k}">${esc(s[f.k] || '')}</textarea>`
              : `<input class="field" type="text" id="${fid}" data-svc="${i}" data-f="${f.k}" value="${esc(s[f.k] || '')}" placeholder="${esc(qPh(f))}">`;
            return `<div class="${f.full ? 'full' : ''}"><label class="sub-label" for="${fid}">${esc(qL(f))}</label>${field}</div>`;
          }).join('')}
        </div>
        ${list.length > 1 ? `<div class="rep-foot"><button type="button" class="btn-text danger" data-act="del-svc" data-i="${i}">${esc(t('removeService', { n: i + 1 }))}</button></div>` : ''}
      </fieldset>`).join('') +
      `<button type="button" class="btn-add" data-act="add-svc" ${list.length >= MAX_SERVICES ? 'disabled' : ''}>${esc(t('addService'))}</button></div>`;
  }

  function sitesHTML(p) {
    const list = p.websites;
    return `<div class="repeat" id="siteList">` + list.map((w, i) => `
      <fieldset class="rep-card">
        <legend>${esc(t('website'))} ${i + 1}</legend>
        <div class="grid2">
          <div class="full"><label class="sub-label" for="site_${i}_url">${esc(t('websiteUrl'))}</label>
            <input class="field" type="url" id="site_${i}_url" data-site="${i}" data-f="url" value="${esc(w.url || '')}" placeholder="https://"></div>
          <div class="full"><label class="sub-label" for="site_${i}_like">${esc(t('whatLike'))}</label>
            <textarea class="field" id="site_${i}_like" rows="2" data-site="${i}" data-f="like">${esc(w.like || '')}</textarea></div>
        </div>
        ${list.length > 1 ? `<div class="rep-foot"><button type="button" class="btn-text danger" data-act="del-site" data-i="${i}">${esc(t('removeWebsite', { n: i + 1 }))}</button></div>` : ''}
      </fieldset>`).join('') +
      `<button type="button" class="btn-add" data-act="add-site" ${list.length >= MAX_SITES ? 'disabled' : ''}>${esc(t('addWebsite'))}</button></div>`;
  }

  /* ---------- Autosave ---------- */
  let saveTimer = null;
  function touch() {
    const p = current();
    if (!p) return;
    p.updated = Date.now();
    const el = $('#savedState');
    if (el) { el.textContent = t('saving'); el.classList.add('busy'); }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 350);
  }
  function flush() {
    clearTimeout(saveTimer);
    saveTimer = null;
    const ok = persist();
    const el = $('#savedState');
    if (el) { el.textContent = ok === false ? t('notSaved') : t('allSaved'); el.classList.remove('busy'); }
  }
  window.addEventListener('beforeunload', () => { if (saveTimer) flush(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && saveTimer) flush(); });

  function refreshProgress() {
    const p = current();
    if (!p || view !== 'wizard') return;
    const s = stats(p);
    const pl = $('#pctLabel'); if (pl) pl.textContent = t('pctComplete', { n: s.pct });
    const ab = $('#asciiBar'); if (ab) ab.textContent = asciiBar(s.pct);
    $$('.seg').forEach((b) => {
      const { done, label } = segLabel(Number(b.dataset.step), p);
      b.querySelector('.fill').style.width = Math.round(done * 100) + '%';
      b.setAttribute('aria-label', label);
    });
  }

  /* ---------- Events ---------- */
  document.addEventListener('input', (e) => {
    const tg = e.target;
    if (tg.dataset.set) {
      settings[tg.dataset.set] = tg.value;
      writeLS(LS_SETTINGS, settings);
      if (tg.dataset.set === 'studio') $('#brandName').textContent = tg.value || t('websiteDiscovery');
      return;
    }
    const p = current();
    if (!p || view !== 'wizard') return;
    if (tg.dataset.k) p.a[tg.dataset.k] = tg.value;
    else if (tg.dataset.qn) p.qn[tg.dataset.qn] = tg.value;
    else if (tg.dataset.svc != null) {
      const i = Number(tg.dataset.svc);
      p.services[i][tg.dataset.f] = tg.value;
      if (tg.dataset.f === 'name') {
        const lg = $(`[data-legend="${i}"]`);
        if (lg) lg.textContent = `${t('service')} ${i + 1}${tg.value.trim() ? ': ' + tg.value.trim() : ''}`;
      }
    } else if (tg.dataset.site != null) {
      p.websites[Number(tg.dataset.site)][tg.dataset.f] = tg.value;
    } else return;
    touch();
    refreshProgress();
  });

  document.addEventListener('change', (e) => {
    const tg = e.target;
    if (!tg.dataset.check) return;
    const p = current();
    if (!p) return;
    const k = tg.dataset.check;
    const arr = Array.isArray(p.a[k]) ? p.a[k].slice() : [];
    const i = arr.indexOf(tg.value);
    if (tg.checked && i < 0) arr.push(tg.value);
    if (!tg.checked && i >= 0) arr.splice(i, 1);
    const q = findQuestion(k);
    p.a[k] = q ? q.o.filter((o) => arr.includes(o)) : arr; // keep original option order
    tg.closest('.check').classList.toggle('on', tg.checked);
    if (tg.value === 'Other') {
      const other = $(`[data-other="${k}"]`);
      if (other) { other.classList.toggle('hidden', !tg.checked); if (tg.checked) other.focus(); }
    }
    touch();
    refreshProgress();
  });

  function findQuestion(k) {
    for (const s of SECTIONS) for (const q of s.q) if (q.k === k) return q;
    return null;
  }

  document.addEventListener('submit', (e) => e.preventDefault());

  document.addEventListener('click', (e) => {
    const tg = e.target.closest('button, [data-act]');
    if (!tg) return;
    const p = current();

    // Pills: single choice, click again to clear
    if (tg.dataset.pick && p) {
      const k = tg.dataset.pick;
      const val = p.a[k] === tg.dataset.v ? '' : tg.dataset.v;
      p.a[k] = val;
      $$(`[data-pick="${k}"]`).forEach((b) => { const on = b.dataset.v === val; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      touch(); refreshProgress(); return;
    }
    if (tg.dataset.svcpick != null && p) {
      const i = Number(tg.dataset.svcpick), f = tg.dataset.f;
      const val = p.services[i][f] === tg.dataset.v ? '' : tg.dataset.v;
      p.services[i][f] = val;
      $$(`[data-svcpick="${i}"][data-f="${f}"]`).forEach((b) => { const on = b.dataset.v === val; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      touch(); return;
    }
    if (tg.dataset.status && p) {
      const k = tg.dataset.status, item = tg.dataset.item;
      p.a[k] = Object.assign({}, p.a[k] || {}, { [item]: tg.dataset.v });
      tg.parentElement.querySelectorAll('.pill').forEach((b) => { const on = b === tg; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      touch(); return;
    }
    if (tg.dataset.note && p) {
      const ta = $('#n_' + tg.dataset.note);
      const show = ta.classList.contains('hidden');
      ta.classList.toggle('hidden', !show);
      tg.textContent = show ? t('hideNote') : (trim(ta.value) ? t('showNote') : t('addNote'));
      tg.setAttribute('aria-expanded', show);
      if (show) ta.focus();
      return;
    }

    const act = tg.dataset.act;
    if (!act) return;
    const id = tg.dataset.id;

    switch (act) {
      case 'lang': {
        if (settings.lang === tg.dataset.v) return;
        flushIfNeeded();
        settings.lang = tg.dataset.v;
        writeLS(LS_SETTINGS, settings);
        rerenderKeep(() => { const b = $(`[data-act="lang"][data-v="${settings.lang}"]`); if (b) b.focus(); });
        break;
      }
      case 'home': flushIfNeeded(); go('home'); break;
      case 'new': openProjectModal(); break;
      case 'open': {
        const pr = getProject(id); if (!pr) return;
        go('wizard', { id, focus: '#secTitle' }); break;
      }
      case 'dup': duplicateProject(id); break;
      case 'del': confirmDelete(id); break;
      case 'pdf': { const pr = getProject(id); if (pr) requestOutput(pr, 'pdf'); break; }
      case 'jump': setStep(Number(tg.dataset.step)); break;
      case 'back':
        if (!p) return;
        if (p.step === 0) { flushIfNeeded(); go('home'); } else setStep(p.step - 1);
        break;
      case 'next':
        if (!p) return;
        flushIfNeeded();
        if (p.step === NOTES_STEP) go('review', { focus: '#revTitle' });
        else { setStep(p.step + 1); toast(t('saved')); }
        break;
      case 'review': flushIfNeeded(); go('review', { focus: '#revTitle' }); break;
      case 'edit-sec': setStep(Number(tg.dataset.step)); break;
      case 'edit-details': if (p) openProjectModal(p); break;
      case 'reset': if (p) confirmReset(p); break;
      case 'add-svc':
        if (p.services.length >= MAX_SERVICES) return;
        p.services.push(blankService()); touch(); rerenderKeep(() => {
          const n = p.services.length - 1; const el = $(`#svc_${n}_name`); if (el) { el.focus(); el.scrollIntoView({ block: 'center' }); }
        });
        break;
      case 'del-svc': {
        const i = Number(tg.dataset.i);
        const s = p.services[i];
        const doDel = () => { p.services.splice(i, 1); touch(); flush(); rerenderKeep(); refreshProgress(); toast(t('serviceRemoved')); };
        if (SVC_FIELDS.some((f) => trim(s[f.k]))) {
          modal({
            title: t('removeServiceQ', { n: i + 1 }),
            body: `<p>${esc(trim(s.name) ? t('removeServiceNamed', { name: trim(s.name) }) : t('removeServiceUnnamed'))}</p>`,
            actions: [{ label: t('keepIt'), cls: 'btn-outline' }, { label: t('removeServiceBtn'), cls: 'btn-danger', run: doDel }]
          });
        } else doDel();
        break;
      }
      case 'add-site':
        if (p.websites.length >= MAX_SITES) return;
        p.websites.push(blankSite()); touch(); rerenderKeep(() => {
          const n = p.websites.length - 1; const el = $(`#site_${n}_url`); if (el) { el.focus(); el.scrollIntoView({ block: 'center' }); }
        });
        break;
      case 'del-site': {
        const i = Number(tg.dataset.i);
        p.websites.splice(i, 1); touch(); flush(); rerenderKeep(); refreshProgress(); toast(t('websiteRemoved'));
        break;
      }
      case 'gen-pdf': if (p) requestOutput(p, 'pdf'); break;
      case 'print': if (p) requestOutput(p, 'print'); break;
    }
  });

  function flushIfNeeded() { if (saveTimer) flush(); }

  function setStep(n) {
    const p = current(); if (!p) return;
    flushIfNeeded();
    p.step = Math.max(0, Math.min(NOTES_STEP, n));
    persist();
    go('wizard', { focus: '#secTitle' });
  }

  function rerenderKeep(after) {
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
    if (after) after();
  }

  /* ---------- Projects: create / edit / duplicate / delete / reset ---------- */
  function readLogo(file) {
    return new Promise((resolve, reject) => {
      if (!/^image\//.test(file.type)) { reject(new Error(t('logoNotImage'))); return; }
      const fr = new FileReader();
      fr.onerror = () => reject(new Error(t('logoReadErr')));
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 360;
          const r = Math.min(1, max / Math.max(img.width || max, img.height || max));
          const w = Math.max(1, Math.round((img.width || max) * r));
          const h = Math.max(1, Math.round((img.height || max) * r));
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          try { resolve({ data: c.toDataURL('image/png'), w, h }); } catch (err) { reject(new Error(t('logoProcErr'))); }
        };
        img.onerror = () => reject(new Error(t('logoOpenErr')));
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  function openProjectModal(existing) {
    const p = existing || {};
    let logo = { data: p.logo || '', w: p.logoW || 0, h: p.logoH || 0 };
    const color = p.color || PALETTE[projects.length % PALETTE.length].c;
    const body = `
      <div class="form">
        <div><label class="lbl" for="m_client">${esc(t('clientName'))}</label><input class="field" id="m_client" value="${esc(p.clientName || '')}" placeholder="${esc(t('clientPh'))}" autocomplete="off"><p class="err hidden" id="e_client">${esc(t('clientNameErr'))}</p></div>
        <div><label class="lbl" for="m_biz">${esc(t('businessName'))}</label><input class="field" id="m_biz" value="${esc(p.businessName || '')}" placeholder="${esc(t('businessPh'))}" autocomplete="off"><p class="err hidden" id="e_biz">${esc(t('businessErr'))}</p></div>
        <div><label class="lbl" for="m_proj">${esc(t('projectName'))}</label><input class="field" id="m_proj" value="${esc(p.projectName || '')}" placeholder="${esc(t('projectPh'))}" autocomplete="off"></div>
        <fieldset style="border:0;padding:0;margin:0"><legend class="lbl" style="font-weight:700;font-size:.92rem;margin-bottom:8px">${esc(t('projectColour'))}</legend>
          <div class="swatches">${PALETTE.map((s) => `<label class="swatch"><input type="radio" name="m_color" value="${s.c}" ${s.c === color ? 'checked' : ''}><span style="background:${s.c}"></span><span class="sr-only">${esc(isPT() ? s.pt : s.name)}</span></label>`).join('')}</div>
        </fieldset>
        <div><span class="lbl" id="m_logo_l">${esc(t('clientLogo'))}</span>
          <div class="logo-row">
            <div class="logo-preview" id="m_logo_prev">${logo.data ? `<img src="${logo.data}" alt="${esc(t('logoPreview'))}">` : esc(t('noLogo'))}</div>
            <span class="btn btn-outline file-btn">${esc(t('chooseImage'))}<input type="file" id="m_logo" accept="image/*" aria-labelledby="m_logo_l"></span>
            <button type="button" class="btn-text danger ${logo.data ? '' : 'hidden'}" id="m_logo_rm">${esc(t('removeLogo'))}</button>
          </div>
          <p class="err hidden" id="e_logo"></p>
        </div>
      </div>`;

    return modal({
      title: existing ? t('editProjectTitle') : t('newProjectTitle'),
      intro: existing ? '' : t('newProjectIntro'),
      body,
      actions: [
        { label: t('cancel'), cls: 'btn-outline' },
        {
          label: existing ? t('saveDetails') : t('createProject'), cls: 'btn-primary', keepOpen: true,
          run: () => {
            const clientName = $('#m_client').value.trim();
            const businessName = $('#m_biz').value.trim();
            const projectName = $('#m_proj').value.trim() || defaultProjectName(businessName);
            const colorV = ($('input[name="m_color"]:checked') || {}).value || PALETTE[0].c;
            $('#e_client').classList.toggle('hidden', !!clientName);
            $('#e_biz').classList.toggle('hidden', !!businessName);
            if (!clientName) { $('#m_client').focus(); return false; }
            if (!businessName) { $('#m_biz').focus(); return false; }
            if (existing) {
              Object.assign(existing, { clientName, businessName, projectName, color: colorV, logo: logo.data, logoW: logo.w, logoH: logo.h, updated: Date.now() });
              if (!trim(existing.a.bizName)) existing.a.bizName = businessName;
              persist();
              render();
              toast(t('detailsSaved'));
            } else {
              const np = newProject({ clientName, businessName, projectName, color: colorV, logo: logo.data, logoW: logo.w, logoH: logo.h });
              projects.push(np);
              persist();
              go('wizard', { id: np.id, focus: '#secTitle' });
              toast(t('projectCreated', { b: businessName }));
            }
            return true;
          }
        }
      ],
      onOpen: () => {
        const accentPreview = () => { const c = ($('input[name="m_color"]:checked') || {}).value; if (c) $('.modal').style.setProperty('--accent', c); };
        $$('input[name="m_color"]').forEach((r) => r.addEventListener('change', accentPreview));
        accentPreview();
        const biz = $('#m_biz'), proj = $('#m_proj');
        biz.addEventListener('input', () => { proj.placeholder = biz.value.trim() ? defaultProjectName(biz.value.trim()) : t('projectPh'); });
        $('#m_logo').addEventListener('change', async (ev) => {
          const f = ev.target.files && ev.target.files[0];
          const err = $('#e_logo');
          err.classList.add('hidden');
          if (!f) return;
          try {
            logo = await readLogo(f);
            $('#m_logo_prev').innerHTML = `<img src="${logo.data}" alt="${esc(t('logoPreview'))}">`;
            $('#m_logo_rm').classList.remove('hidden');
          } catch (er) { err.textContent = er.message; err.classList.remove('hidden'); }
          ev.target.value = '';
        });
        $('#m_logo_rm').addEventListener('click', () => {
          logo = { data: '', w: 0, h: 0 };
          $('#m_logo_prev').textContent = t('noLogo');
          $('#m_logo_rm').classList.add('hidden');
        });
        $('#m_client').focus();
      }
    });
  }

  function duplicateProject(id) {
    const src = getProject(id); if (!src) return;
    const c = normalize(clone(src));
    c.id = uid();
    c.projectName = `${src.projectName} ${t('copySuffix')}`;
    c.created = c.updated = Date.now();
    projects.push(c);
    persist();
    render();
    toast(t('duplicated', { p: src.projectName }));
  }

  function confirmDelete(id) {
    const p = getProject(id); if (!p) return;
    modal({
      title: t('deleteQ'),
      body: `<p>${esc(t('deleteText', { p: p.projectName }))}</p>`,
      actions: [
        { label: t('keepProject'), cls: 'btn-outline' },
        {
          label: t('deleteProject'), cls: 'btn-danger', run: () => {
            projects = projects.filter((x) => x.id !== id);
            if (currentId === id) currentId = null;
            persist();
            go('home');
            toast(t('projectDeleted'));
          }
        }
      ]
    });
  }

  function confirmReset(p) {
    modal({
      title: t('resetQ'),
      body: `<p>${esc(t('resetText', { p: p.projectName }))}</p>`,
      actions: [
        { label: t('cancel'), cls: 'btn-outline' },
        {
          label: t('resetAnswers'), cls: 'btn-danger', run: () => {
            p.a = { bizName: p.businessName };
            p.qn = {};
            p.services = [blankService()];
            p.websites = [blankSite()];
            p.step = 0;
            p.updated = Date.now();
            persist();
            go('wizard', { focus: '#secTitle' });
            toast(t('answersCleared'));
          }
        }
      ]
    });
  }

  /* ---------- Review ---------- */
  function itemHTML(it) {
    const np = `<span class="np">${esc(t('notProvided'))}</span>`;
    const noteHTML = it.note ? `<p class="rev-note"><b>${esc(t('noteLbl'))}</b> ${esc(it.note)}</p>` : '';
    if (it.kind === 'qa') {
      return `<div class="rev-row ${it.a ? '' : 'missing'}"><dt>${esc(it.q)}</dt><dd>${it.a ? esc(it.a) : np}${noteHTML}</dd></div>`;
    }
    if (it.kind === 'groups') {
      const inner = it.groups.length ? it.groups.map((g) => `
        <div class="rev-group">${g.title ? `<h4>${esc(g.title)}</h4>` : ''}
          <table>${g.rows.map(([l, v]) => `<tr><td>${esc(l)}</td><td>${v ? esc(v) : np}</td></tr>`).join('')}</table>
        </div>`).join('') : np;
      return `<div class="rev-row ${it.groups.length ? '' : 'missing'}"><dt>${esc(it.q)}</dt><dd>${inner}${noteHTML}</dd></div>`;
    }
    return `<div class="rev-row"><dt>${esc(t('notes'))}</dt><dd>${it.a ? esc(it.a) : np}</dd></div>`;
  }

  function renderReview() {
    const p = current();
    const s = stats(p);
    const r = report(p);
    const left = s.total - s.done;
    const done = left === 0;
    const confetti = done ? `<div class="confetti" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${secColor(i)};animation-delay:${(i % 7) * 0.08}s"></i>`).join('')}</div>` : '';

    const actions = `
      <button type="button" class="btn btn-outline" data-act="jump" data-step="${p.step}">${esc(t('backToQuestions'))}</button>
      <button type="button" class="btn btn-outline" data-act="print">${esc(t('printSave'))}</button>
      <button type="button" class="btn btn-primary" data-act="gen-pdf">${esc(t('genPdf'))}</button>`;

    app.innerHTML = `
      <div class="review">
        <div class="review-head">
          ${confetti}
          <div>
            <h1 id="revTitle" tabindex="-1">${esc(t('summaryTitle', { b: p.businessName }))}</h1>
            <p>${esc(p.projectName)}${p.clientName ? ' ' + esc(t('with')) + ' ' + esc(p.clientName) : ''}</p>
          </div>
          <div class="completion ${done ? 'done' : ''}">
            <strong>${esc(t('completionPct', { n: s.pct }))}</strong>
            <span>${esc(done ? t('allAnswered') : t(left === 1 ? 'stillNeed1' : 'stillNeedN', { n: left }))}</span>
          </div>
        </div>
        <div class="review-actions">${actions}</div>
        ${r.map((sec) => {
          const c = sec.step === NOTES_STEP ? '#B9B3D9' : secColor(sec.step);
          return `<section class="rev-sec" style="--c:${c};--c-ink:${inkOn(c)}">
            <header><h2><span class="num">${sec.n}</span>${esc(sec.title)}</h2>
              <button type="button" class="edit" data-act="edit-sec" data-step="${sec.step}" aria-label="${esc(t('editX', { s: sec.title }))}">${esc(t('edit'))}</button></header>
            <dl>${sec.items.map(itemHTML).join('')}</dl>
          </section>`;
        }).join('')}
        <div class="review-actions">${actions}</div>
      </div>`;
  }

  /* ---------- Output guard (warn before PDF / print) ---------- */
  function requestOutput(p, mode) {
    flushIfNeeded();
    const s = stats(p);
    const run = () => (mode === 'print' ? printProject(p) : downloadPDF(p));
    if (!s.missing.length) { run(); return; }
    const keyMissing = s.missing.filter((m) => m.q.imp);
    const pool = keyMissing.length ? keyMissing : s.missing;
    const shown = pool.slice(0, 8);
    const firstSec = (keyMissing[0] || s.missing[0]).sec;
    const n = s.missing.length, k = keyMissing.length;
    const inc = k ? t('including', { k, qs: t(k === 1 ? 'question1' : 'questionN') }) : '';
    const bodyText = t('warnBody', { n, qs: t(n === 1 ? 'question1' : 'questionN'), need: t(n === 1 ? 'need1' : 'needN'), inc }).replace(/\s+/g, ' ');
    modal({
      title: k ? t('warnKeyTitle') : t('warnTitle'),
      body: `<p>${esc(bodyText)}</p>
        <ul>${shown.map((m) => `<li><b>${esc(secT(SECTIONS[m.sec]))}:</b> ${esc(qL(m.q))}</li>`).join('')}${pool.length > shown.length ? `<li>${esc(t('andMore'))}</li>` : ''}</ul>`,
      actions: [
        { label: mode === 'print' ? t('printAnyway') : t('genAnyway'), cls: 'btn-outline', run },
        { label: t('finishAnswering'), cls: 'btn-primary', run: () => { currentId = p.id; p.step = firstSec; persist(); go('wizard', { focus: '#secTitle' }); } }
      ]
    });
  }

  /* ---------- Print ---------- */
  function printHTML(p) {
    const r = report(p);
    const today = fmtDate(Date.now());
    const s = stats(p);
    const NP = esc(t('notProvided'));
    const qa = (it) => {
      const note = it.note ? `<div class="lbl">${esc(t('notes'))}</div><div class="note">${esc(it.note)}</div>` : '';
      if (it.kind === 'qa') {
        return `<div class="doc-q"><div class="lbl">${esc(t('question'))}</div><div class="qtext">${esc(it.q)}</div>
          <div class="lbl">${esc(t('answer'))}</div><div class="ans ${it.a ? '' : 'np'}">${it.a ? esc(it.a) : NP}</div>${note}</div>`;
      }
      if (it.kind === 'groups') {
        const inner = it.groups.length ? it.groups.map((g) => `<div class="doc-group">${g.title ? `<h4>${esc(g.title)}</h4>` : ''}<table>${g.rows.map(([l, v]) => `<tr><td>${esc(l)}</td><td class="${v ? '' : 'np'}">${v ? esc(v) : NP}</td></tr>`).join('')}</table></div>`).join('') : `<span class="np">${NP}</span>`;
        return `<div class="doc-q"><div class="lbl">${esc(t('question'))}</div><div class="qtext">${esc(it.q)}</div><div class="lbl">${esc(t('answer'))}</div><div class="ans">${inner}</div>${note}</div>`;
      }
      return `<div class="doc-notes ${it.a ? '' : 'np'}">${it.a ? esc(it.a) : NP}</div>`;
    };
    return `<div class="doc" style="--accent:${p.color}" lang="${isPT() ? 'pt-BR' : 'en'}">
      <section class="doc-cover">
        <div class="studio"><span>${esc(settings.studio || '')}</span>${p.logo ? `<img src="${p.logo}" alt="">` : ''}</div>
        <h1>${esc(p.businessName)}</h1>
        <p class="subtitle">${esc(t('docSubtitle'))}</p>
        <table class="doc-info">
          <tr><td>${esc(t('client'))}</td><td>${esc(p.clientName || '')}</td></tr>
          <tr><td>${esc(t('business'))}</td><td>${esc(p.businessName)}</td></tr>
          <tr><td>${esc(t('project'))}</td><td>${esc(p.projectName)}</td></tr>
          <tr><td>${esc(t('date'))}</td><td>${esc(today)}</td></tr>
          <tr><td>${esc(t('preparedBy'))}</td><td>${esc([settings.manager, settings.studio].filter(Boolean).join(', '))}</td></tr>
          <tr><td>${esc(t('completion'))}</td><td>${esc(t('completionVal', { n: s.pct }))}</td></tr>
        </table>
        <ol class="doc-toc">${r.map((sec) => `<li>${esc(sec.title)}</li>`).join('')}<li>${esc(t('confirmation'))}</li></ol>
      </section>
      ${r.map((sec) => `<section class="doc-sec"><h2>${sec.n}. ${esc(sec.title)}</h2>${sec.items.map(qa).join('')}</section>`).join('')}
      <section class="doc-confirm">
        <h2>${esc(t('confirmation'))}</h2>
        <p>${esc(t('confirmText'))}</p>
        <div class="sig"><span>${esc(t('sigClient'))}</span><span></span></div>
        <div class="sig"><span>${esc(t('sigSignature'))}</span><span></span></div>
        <div class="sig"><span>${esc(t('sigDate'))}</span><span></span></div>
        <div class="sig"><span>${esc(t('sigPM'))}</span><span></span></div>
      </section>
      <div class="doc-foot"><span>${esc(settings.studio || '')} | ${esc(t('footer', { b: p.businessName }))}</span><span>${esc(today)}</span></div>
    </div>`;
  }

  function printProject(p) {
    const root = $('#print-root');
    root.innerHTML = printHTML(p);
    const oldTitle = document.title;
    document.title = `${slug(p.businessName)}-${t('fileSlug')}`;
    const cleanup = () => { document.title = oldTitle; root.innerHTML = ''; window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => {
      try { window.print(); } catch (e) { toast(t('printUnavailable'), true); }
    }, 60);
  }

  /* ---------- PDF (jsPDF) ---------- */
  function cleanText(s) {
    return String(s == null ? '' : s)
      .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
      .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
      .replace(/[\u2013\u2014\u2212]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/[\u2022\u25CF\u25AA]/g, '-')
      .replace(/\u00A0/g, ' ')
      .replace(/\r\n?/g, '\n')
      .replace(/[^\x09\x0A\x20-\x7E\xA1-\xFF]/g, '');
  }

  function buildPDF(p) {
    const J = window.jspdf && window.jspdf.jsPDF;
    if (!J) return null;
    const doc = new J({ unit: 'mm', format: 'a4', compress: true });
    const W = 210, H = 297, M = 20, CW = W - 2 * M, TOP = 28, BOTTOM = H - 22;
    const acc = hexToRgb(p.color);
    const accText = luminance(p.color) > 0.42 ? acc.map((v) => Math.round(v * 0.55)) : acc;
    const accSoft = acc.map((v) => Math.round(v + (255 - v) * 0.9));
    const INK = [31, 26, 61], MUT = [110, 106, 138], LINE = [226, 223, 238];
    const PT = 0.3528;
    const LH = (size, f = 1.42) => size * PT * f;
    const LABEL_W = isPT() ? 25 : 24;
    let y = M;

    const font = (size, style = 'normal', color = INK) => { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(color[0], color[1], color[2]); };
    const split = (text, size, width, style = 'normal') => { doc.setFont('helvetica', style); doc.setFontSize(size); return doc.splitTextToSize(cleanText(text), width); };
    const txt = (s, x, yy) => doc.text(s, x, yy, { baseline: 'top' });
    const addPage = () => { doc.addPage(); y = TOP; };
    const ensure = (h) => { if (y + h > BOTTOM) addPage(); };

    // Label/value row; long values flow onto the next page safely
    function row(label, value, o = {}) {
      const x = o.x != null ? o.x : M;
      const lw = o.labelW != null ? o.labelW : LABEL_W;
      const size = o.size || 10;
      const style = o.style || 'normal';
      const color = o.color || INK;
      const vx = x + lw;
      const vw = W - M - vx;
      const ll = split(label, 8, lw - 3, 'bold');
      const vl = split(value, size, vw, style);
      const hL = ll.length * LH(8) + 0.6;
      const hV = vl.length * LH(size);
      ensure(Math.min(Math.max(hL, hV), 60));
      const startPage = doc.getNumberOfPages();
      const y0 = y;
      font(8, 'bold', MUT);
      ll.forEach((l, i) => txt(l, x, y0 + 0.6 + i * LH(8)));
      if (o.bar) { doc.setDrawColor(acc[0], acc[1], acc[2]); doc.setLineWidth(0.7); }
      vl.forEach((l, i) => {
        if (i > 0) ensure(LH(size));
        font(size, style, color);
        txt(l, vx + (o.bar ? 2.5 : 0), y);
        if (o.bar) doc.line(vx, y, vx, y + LH(size));
        y += LH(size);
      });
      if (doc.getNumberOfPages() === startPage) y = Math.max(y, y0 + hL);
    }

    function divider() {
      doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2);
      doc.line(M, y, W - M, y);
    }

    const NP = t('notProvided');

    // ---- Cover page ----
    doc.setFillColor(acc[0], acc[1], acc[2]);
    doc.rect(0, 0, W, 6, 'F');
    font(9, 'bold', MUT);
    txt(cleanText(settings.studio || ''), M, 16);
    if (p.logo && p.logoW && p.logoH) {
      try {
        const ratio = p.logoW / p.logoH;
        let w = 40, h = w / ratio;
        if (h > 20) { h = 20; w = h * ratio; }
        doc.addImage(p.logo, 'PNG', W - M - w, 14, w, h);
      } catch (e) { /* skip logo if it can't be embedded */ }
    }
    y = 52;
    const titleLines = split(p.businessName, 30, CW, 'bold');
    font(30, 'bold', INK);
    titleLines.forEach((l) => { txt(l, M, y); y += LH(30, 1.15); });
    y += 2;
    font(13, 'normal', MUT);
    split(t('docSubtitle'), 13, CW).forEach((l) => { txt(l, M, y); y += LH(13); });
    y += 7;
    doc.setFillColor(accText[0], accText[1], accText[2]);
    doc.rect(M, y, 26, 1.4, 'F');
    y += 10;

    const s = stats(p);
    const info = [
      [t('client'), p.clientName || ''],
      [t('business'), p.businessName],
      [t('project'), p.projectName],
      [t('date'), fmtDate(Date.now())],
      [t('preparedBy'), [settings.manager, settings.studio].filter(Boolean).join(', ')],
      [t('completion'), t('completionVal', { n: s.pct })]
    ];
    const infoTop = y;
    const rowsH = info.map(([, v]) => Math.max(1, split(v, 10.5, CW - 48).length) * LH(10.5) + 4);
    doc.setFillColor(accSoft[0], accSoft[1], accSoft[2]);
    doc.roundedRect(M, infoTop, CW, rowsH.reduce((a, b) => a + b, 0) + 6, 3, 3, 'F');
    y = infoTop + 5;
    info.forEach(([l, v], i) => {
      font(8.5, 'bold', MUT); txt(cleanText(l), M + 6, y + 0.8);
      font(10.5, 'normal', INK);
      split(v, 10.5, CW - 48).forEach((ln, j) => txt(ln, M + 42, y + j * LH(10.5)));
      y += rowsH[i];
    });
    y += 14;

    const rep = report(p);
    font(11, 'bold', INK); txt(cleanText(t('contents')), M, y); y += 8;
    const tocItems = rep.map((sec) => `${sec.n}.  ${sec.title}`).concat([`${rep.length + 1}.  ${t('confirmation')}`]);
    const half = Math.ceil(tocItems.length / 2);
    tocItems.forEach((it, i) => {
      font(10, 'normal', INK);
      const col = i < half ? 0 : 1;
      txt(cleanText(it), M + col * (CW / 2), y + (i % half) * LH(10, 1.7));
    });

    // ---- Sections ----
    const numInk = luminance(p.color) > 0.42 ? INK : [255, 255, 255];
    function heading(n, title) {
      doc.setFillColor(acc[0], acc[1], acc[2]);
      doc.roundedRect(M, y, 9, 9, 2, 2, 'F');
      font(10.5, 'bold', numInk);
      doc.text(String(n), M + 4.5, y + 4.6, { align: 'center', baseline: 'middle' });
      font(15, 'bold', INK);
      txt(cleanText(title), M + 13, y + 0.8);
      y += 13;
      doc.setDrawColor(acc[0], acc[1], acc[2]); doc.setLineWidth(0.6);
      doc.line(M, y - 2, W - M, y - 2);
    }

    addPage();
    rep.forEach((sec) => {
      ensure(34);
      if (y > TOP + 1) y += 6;
      heading(sec.n, sec.title);
      y += 3;

      sec.items.forEach((it) => {
        if (it.kind === 'text') {
          if (!it.a) { row(t('notes'), NP, { style: 'italic', color: MUT }); }
          else {
            split(it.a, 10.5, CW).forEach((l) => { ensure(LH(10.5)); font(10.5, 'normal', INK); txt(l, M, y); y += LH(10.5); });
          }
          y += 3;
          return;
        }
        const qLines = split(it.q, 10.5, CW - LABEL_W, 'bold');
        ensure(Math.min(qLines.length * LH(10.5) + LH(10) * 2 + 6, 40));
        row(t('question'), it.q, { style: 'bold', size: 10.5 });
        y += 1.4;
        if (it.kind === 'qa') {
          row(t('answer'), it.a || NP, it.a ? {} : { style: 'italic', color: MUT });
        } else if (it.kind === 'groups') {
          if (!it.groups.length) row(t('answer'), NP, { style: 'italic', color: MUT });
          it.groups.forEach((g, gi) => {
            if (g.title) {
              ensure(LH(10) + LH(9.5) * 2);
              if (gi > 0) y += 1.5;
              font(8, 'bold', MUT); if (gi === 0) txt(cleanText(t('answer')), M, y + 0.6);
              font(10, 'bold', accText); txt(cleanText(g.title), M + LABEL_W, y);
              y += LH(10) + 0.6;
            } else if (gi === 0) {
              font(8, 'bold', MUT); txt(cleanText(t('answer')), M, y + 0.6);
            }
            g.rows.forEach(([l, v]) => {
              row(l, v || NP, Object.assign({ x: M + LABEL_W, labelW: 44, size: 9.5 }, v ? {} : { style: 'italic', color: MUT }));
              y += 0.6;
            });
          });
        }
        if (it.note) { y += 1.4; row(t('notes'), it.note, { style: 'italic', size: 9.5, bar: true }); }
        y += 3;
        ensure(4);
        divider();
        y += 4;
      });
    });

    // ---- Confirmation ----
    ensure(100);
    y += 8;
    heading(rep.length + 1, t('confirmation'));
    y += 4;
    split(t('confirmText'), 10, CW).forEach((l) => { font(10, 'normal', INK); txt(l, M, y); y += LH(10); });
    y += 8;
    [t('sigClient'), t('sigSignature'), t('sigDate'), t('sigPM')].forEach((l) => {
      font(10, 'bold', INK); txt(cleanText(l), M, y + 3);
      doc.setDrawColor(INK[0], INK[1], INK[2]); doc.setLineWidth(0.3);
      doc.line(M + 46, y + 8, W - M, y + 8);
      y += 16;
    });

    // ---- Header & footer on every page ----
    const total = doc.getNumberOfPages();
    const footLeft = cleanText(`${settings.studio || ''}${settings.studio ? '  |  ' : ''}${t('footer', { b: p.businessName })}`);
    const dateStr = cleanText(fmtDate(Date.now()));
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      if (i > 1) {
        doc.setFillColor(acc[0], acc[1], acc[2]); doc.rect(0, 0, W, 2.5, 'F');
        font(8.5, 'bold', INK); txt(cleanText(p.businessName), M, 11);
        font(8.5, 'normal', MUT); doc.text(dateStr, W - M, 11, { align: 'right', baseline: 'top' });
        doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2); doc.line(M, 17, W - M, 17);
      }
      doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2); doc.line(M, H - 15, W - M, H - 15);
      font(8, 'normal', MUT);
      txt(footLeft, M, H - 12);
      doc.text(cleanText(t('page', { i, n: total })), W - M, H - 12, { align: 'right', baseline: 'top' });
    }

    doc.setProperties({ title: cleanText(t('footer', { b: p.businessName })), author: cleanText(settings.studio || ''), subject: cleanText(t('docSubtitle')) });
    return doc;
  }

  function downloadPDF(p) {
    let doc;
    try { doc = buildPDF(p); } catch (e) {
      console.error(e);
      toast(t('pdfBuildErr'), true);
      printProject(p); return;
    }
    if (!doc) { toast(t('pdfEngineErr'), true); printProject(p); return; }
    const name = `${slug(p.businessName)}-${t('fileSlug')}-${new Date().toISOString().slice(0, 10)}.pdf`;
    try { doc.save(name); toast(t('pdfDownloaded')); } catch (e) {
      toast(t('downloadBlocked'), true); printProject(p);
    }
  }

  /* ---------- Modal & toast ---------- */
  let lastFocus = null;
  function modal({ title, intro, body, actions = [], onOpen }) {
    lastFocus = document.activeElement;
    const root = $('#modal-root');
    root.innerHTML = `
      <div class="modal-backdrop" data-backdrop>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <h2 id="modalTitle">${esc(title)}</h2>
          ${intro ? `<p>${esc(intro)}</p>` : ''}
          ${body || ''}
          <div class="modal-actions">${actions.map((a, i) => `<button type="button" class="btn ${a.cls || 'btn-outline'}" data-mi="${i}">${esc(a.label)}</button>`).join('')}</div>
        </div>
      </div>`;
    const close = () => {
      root.innerHTML = '';
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'file') {
        const primary = actions.findIndex((a) => /btn-primary/.test(a.cls || ''));
        if (primary >= 0) { e.preventDefault(); root.querySelector(`[data-mi="${primary}"]`).click(); }
      }
      if (e.key === 'Tab') {
        const f = $$('button, input, textarea, select, [tabindex]:not([tabindex="-1"])', root).filter((el) => !el.disabled && el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    root.querySelector('[data-backdrop]').addEventListener('mousedown', (e) => { if (e.target.dataset.backdrop != null) close(); });
    $$('[data-mi]', root).forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const a = actions[Number(b.dataset.mi)];
      if (a.keepOpen) { if (a.run && a.run() !== false) close(); }
      else { close(); if (a.run) a.run(); }
    }));
    if (onOpen) onOpen(); else { const btns = $$('[data-mi]', root); (btns[btns.length - 1] || root).focus(); }
    return close;
  }

  let toastTimer = null;
  function toast(msg, isError) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.toggle('error', !!isError);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), isError ? 4200 : 1800);
  }

  /* ---------- Start ---------- */
  render();
})();
