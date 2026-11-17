/* botões de filtro de área */
// só aparecem botões das áreas que têm pelo menos um projeto
const AREAS = [
  { id: "web",          label: "Web" },
  { id: "dados-ia",     label: "Dados & IA" },
  { id: "cloud-devops", label: "Cloud & DevOps" },
  { id: "cyber",        label: "Segurança" },
  { id: "games",        label: "Games" }
];

// se o projeto não tiver o campo "areas", a área é deduzida das suas tecnologias (campo "tech") por esta tabela
const TECH_AREAS = {
  web: ["html", "css", "react", "vue", "angular", "next.js", "node.js", "express", "django", "flask", "tailwind", "typescript", "php", "laravel"],
  "dados-ia": ["pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "keras", "jupyter", "power bi", "tableau", "spark", "opencv", "langchain"],
  "cloud-devops": ["docker", "kubernetes", "terraform", "aws", "azure", "gcp", "github actions", "jenkins", "ansible"],
  cyber: ["nmap", "wireshark", "burp suite", "metasploit", "kali linux", "owasp", "hashcat"],
  games: ["unity", "godot", "unreal engine", "phaser", "pygame"]
};

// campos usados no CARD:    name, description, cover, images
// campos usados na JANELA:  longDescription, tech, features (opcionais)
// repo = botão "Abrir projeto" (repositório)   |   link = botão "Ver projeto" (site/jogo no ar)
// campo opcional "areas": ["web", "cloud-devops"] define as áreas à mão
const PROJECTS = [
  {
    name: "WordHunt",
    description: "Plataforma web de Caça-Palavras educativo para professores criarem atividades e alunos jogarem.",
    longDescription: "O WordHunt é uma aplicação web de Caça-Palavras desenvolvida para ser hospedada em uma plataforma de jogos educativos. Nela, professores podem cadastrar e gerenciar seus caça-palavras com geração automática da grade de letras a partir de listas de palavras e dicas, enquanto os alunos acessam e jogam de forma interativa.",
    tech: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker", "JavaScript", "HTML", "CSS"],
    features: [
      "Geração automática de grades de caça-palavras em múltiplos níveis de dificuldade",
      "Painel do professor para criação, importação via arquivo .txt e gerenciamento de jogos",
      "Acesso rápido para alunos via código da atividade e filtros",
      "Ambiente containerizado com Docker e banco de dados PostgreSQL"
    ],
    link: "",
    repo: "https://github.com/marceloareas/CacaPalavras/tree/dev",
    cover: "assets/images/projects/projeto-1/cover.jpg",
    images: [
      "assets/images/projects/projeto-1/1.jpg",
      "assets/images/projects/projeto-1/2.jpg"
    ]
  },
  {
    name: "PestJourney (Em andamento)",
    description: "Jogo educativo sobre Manejo Integrado de Pragas (MIP) e genética mendeliana na agricultura.",
    longDescription: "Um jogo digital educativo desenvolvido na Unity que simula a dinâmica ecológica entre plantações (couve, tomate, feijão e milho), pragas, agrotóxicos e predadores naturais. Fundamentado nos princípios do Manejo Integrado de Pragas (MIP) e na genética mendeliana (diibridismo e Quadro de Punnett), o jogo demonstra como o uso indiscriminado de agrotóxicos gera pressão seletiva e populações de pragas resistentes, além de impactos financeiros e ambientais no solo.",
    tech: ["Unity", "C#", "Lua", "MoonSharp"],
    features: [
      "Motor genético baseado no Quadro de Punnett para simular resistência a agrotóxicos ao longo das gerações",
      "Sistemas de controle químico, biológico (predadores naturais) e cultural (policultura)",
      "Narrativa, tutoriais contextuais e desbloqueio progressivo baseados no padrão Observer",
      "Enciclopédia interativa com a cadeia alimentar e atributos econômicos das culturas"
    ],
    link: "https://clarabarr.itch.io/pest-journey",
    cover: "assets/images/projects/projeto-2/cover.jpg",
    images: []
  },
  {
    name: "Giro Food",
    description: "Plataforma de delivery e gestão de pedidos construída com arquitetura de microsserviços.",
    longDescription: "Sistema web para pedidos de comida e gerenciamento de restaurantes, estruturado em uma arquitetura de microsserviços independentes (Autenticação, Catálogo e Pedidos). O projeto utiliza containerização com Docker e comunicação integrada entre o frontend em React e as APIs RESTful em Node.js.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Docker", "JavaScript", "HTML", "CSS"],
    features: [
      "Arquitetura distribuída em microsserviços (Autenticação, Catálogo e Pedidos)",
      "Autenticação e controle de sessão com JSON Web Token (JWT) e bcrypt",
      " Persistência de dados com MongoDB e Mongoose",
      "Orquestração de serviços e containers utilizando Docker"
    ],
    link: "",
    repo: "https://github.com/barretoclara/giro-food",
    cover: "assets/images/projects/projeto-3/cover.jpg",
    images: []
  },
  {
    name: "Panelinha Digital",
    description: "Aplicação web Full Stack para gestão de receitas culinárias, estoque doméstico e lista de mercado.",
    longDescription: "O Panelinha Digital auxilia usuários no organização da rotina alimentar. A plataforma permite cadastrar e favoritar receitas, buscar pratos a partir dos ingredientes disponíveis em casa, controlar o estoque doméstico e gerar listas de compras inteligentes de forma integrada.",
    tech: ["React", "Redux", "Node.js", "Express", "MongoDB", "JavaScript", "HTML", "CSS"],
    features: [
      "Cadastro, visualização detalhada e gerenciamento de receitas e suas categorias",
      "Controle de estoque de ingredientes, abate automático de itens ao marcar receitas como preparadas",
      "Geração automatizada de lista de mercado baseada nas receitas selecionadas e estoque disponível",
      "Gerenciamento de estado global no frontend com Redux Toolkit e autenticação de usuários"
    ],
    link: "",
    repo: "https://github.com/barretoclara/psw-2025",
    cover: "assets/images/projects/projeto-4/cover.jpg",
    images: []
  },
  {
    name: "Cable",
    description: "Aplicativo desktop para estudantes de Ciência da Computação do CEFET/RJ gerenciarem horas complementares.",
    longDescription: "O Cable é um aplicativo desktop construído para ajudar estudantes de Ciência da Computação do UFCIRJ (CEFET/RJ) a gerenciarem suas horas de Atividades Complementares de acordo com as regras do regulamento interno. O sistema calcula automaticamente os mínimos exigidos e tetos máximos aceitos por categoria e subcategoria, exibe gráficos e barras de progresso, aponta pendências e acompanha a evolução até as 230 horas obrigatórias.",
    tech: ["Python", "CustomTkinter", "Matplotlib", "JSON"],
    features: [
      "Cálculo automático de horas válidas respeitando mínimos e tetos de cada categoria e subcategoria do regulamento",
      "Dashboard com gráfico de rosca, barras de progresso e painel de pendências até as 230h obrigatórias",
      "Cadastro, edição e exclusão de atividades com nome, categoria, subcategoria, horas, data e observações",
      "Interface com alternância entre modo escuro e claro e salvamento automático em arquivo data.json"
    ],
    link: "",
    repo: "https://github.com/barretoclara/cable",
    cover: "assets/images/projects/projeto-5/cover.jpg",
    images: []
  }
];