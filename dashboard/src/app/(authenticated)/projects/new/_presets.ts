/**
 * Quick Fill presets — dev-only seed data for the create-project form.
 *
 * Each preset is a fully-typed snapshot of every form-state field the
 * QuickFillButton component can hydrate via its `onSelect` callback.
 *
 * Constraints:
 *   - `segment` values MUST exist in `SUPPORTED_SEGMENTS` (dashboard/src/types/project.ts).
 *   - `moodTags` values MUST be in canonical `MOOD_TAGS` enum.
 *   - `styleTags` values MUST be in canonical `STYLE_TAGS` enum.
 *   - `companySize`, `primaryCta` values match the discriminated unions in
 *     CreateProjectInput / ProjectBriefSchema.
 *   - `rankedObjectives` ids must come from `RANKED_OBJECTIVE_IDS`.
 *
 * This module has no React dependency and is safe to import from any client
 * component.
 */

export interface PresetValues {
  companyName: string;
  segment: string;
  niche?: string;
  region: string;
  companySize: "solo" | "2-10" | "11-50" | "51-200" | "200+";
  description: string;
  primaryCta: "book" | "buy" | "contact" | "subscribe" | "learn-more";
  mainService: string;
  whatMakesSpecial: string[]; // 3-5 bullets, each <= 120 chars
  keyResults?: string;
  idealPublic: string;
  moodTags: string[]; // 1-5, from canonical MOOD_TAGS
  styleTags: string[]; // 1-5, from canonical STYLE_TAGS
  voiceTone: string[]; // 1-3, from VOICE_TONE_OPTIONS
  slogan?: string;
  hasBrandColor: boolean;
  brandColors: string[]; // 1-3 hex values when hasBrandColor=true
  colorsToAvoid?: string[];
  inspirationSites?: string[];
  doNots?: string;
  rankedObjectives: Array<{ id: string; rank: number }>;
  phone?: string;
  emailValue?: string;
}

export const PRESETS: ReadonlyArray<{
  key: string;
  label: string;
  values: PresetValues;
}> = [
  // 1. Padaria Artesanal — PT-BR
  {
    key: "padaria-artesanal",
    label: "Padaria Artesanal (PT-BR)",
    values: {
      companyName: "Padaria Fermenta",
      segment: "bakery",
      niche: "artisan bakery",
      region: "São Paulo, SP",
      companySize: "solo",
      description:
        "Padaria artesanal de bairro especializada em pães de fermentação natural e doces de receitas de família. Cada fornada é feita à mão, com farinhas selecionadas e tempo de descanso longo. Atendemos São Paulo com retirada local e entrega no mesmo dia.",
      primaryCta: "buy",
      mainService:
        "Pães de fermentação natural e confeitaria artesanal sob encomenda",
      whatMakesSpecial: [
        "Fermentação natural de 24h em todos os pães",
        "Farinhas orgânicas de pequenos produtores brasileiros",
        "Receitas de família passadas por três gerações",
        "Encomendas personalizadas para eventos e cestas",
      ],
      keyResults:
        "Mais de 4.000 pães entregues em 2025, nota 4.9 no Google e 18 cafés parceiros em SP.",
      idealPublic:
        "Famílias e profissionais em São Paulo que valorizam ingredientes naturais e querem pães frescos no café da manhã.",
      moodTags: ["friendly", "trustworthy"],
      styleTags: ["minimal", "classic", "playful"],
      voiceTone: ["warm", "casual"],
      slogan: "Pão feito devagar, do nosso forno pra sua mesa.",
      hasBrandColor: true,
      brandColors: ["#C8763A"],
      colorsToAvoid: ["neon green", "electric blue"],
      inspirationSites: ["https://tartine.com", "https://saintfrankcoffee.com"],
      doNots:
        "Evitar fotos genéricas de banco de imagens. Não usar termos como 'gourmet' ou 'premium'.",
      rankedObjectives: [
        { id: "sell-products", rank: 1 },
        { id: "tell-our-story", rank: 2 },
      ],
      phone: "+55 11 98765-4321",
      emailValue: "ola@padariafermenta.com.br",
    },
  },

  // 2. SaaS Analytics — EN
  {
    key: "saas-analytics",
    label: "SaaS Analytics (EN)",
    values: {
      companyName: "Pulselayer Analytics",
      segment: "saas",
      niche: "product analytics platform",
      region: "Remote / Global",
      companySize: "11-50",
      description:
        "Pulselayer is a product analytics platform for B2B SaaS teams that need answers, not dashboards. We turn raw event streams into clear, decision-ready insights so PMs can ship faster. Trusted by 200+ teams across North America and Europe.",
      primaryCta: "subscribe",
      mainService:
        "Self-serve product analytics with cohort, funnel and retention reports out of the box",
      whatMakesSpecial: [
        "Set up tracking in under 10 minutes with our SDK",
        "AI-assisted insights that surface unusual user behavior",
        "SOC 2 Type II compliant from day one",
        "Transparent flat-rate pricing — no event quotas",
      ],
      keyResults:
        "Used by 200+ SaaS companies. Customers report 35% faster feature decisions on average.",
      idealPublic:
        "Product managers and growth engineers at Series A-C SaaS companies who outgrew Mixpanel pricing.",
      moodTags: ["professional", "trustworthy"],
      styleTags: ["modern", "minimal", "corporate"],
      voiceTone: ["technical", "authoritative"],
      slogan: "Analytics for people who ship.",
      hasBrandColor: true,
      brandColors: ["#2563EB"],
      colorsToAvoid: ["pastel pink", "lime green"],
      inspirationSites: ["https://linear.app", "https://vercel.com"],
      doNots:
        "Avoid generic dashboard screenshots. Don't mention competitors by name.",
      rankedObjectives: [
        { id: "generate-leads", rank: 1 },
        { id: "build-trust", rank: 2 },
      ],
    },
  },

  // 3. Boutique Law Firm — PT-BR
  {
    key: "boutique-law-firm",
    label: "Boutique Law Firm (PT-BR)",
    values: {
      companyName: "Albuquerque & Reis Advocacia",
      segment: "law-firm",
      niche: "boutique corporate law firm",
      region: "Rio de Janeiro, RJ",
      companySize: "2-10",
      description:
        "Escritório boutique especializado em direito empresarial, fusões e aquisições e contencioso estratégico. Atuamos para empresas de médio porte que buscam atendimento próximo, com partners diretamente envolvidos em cada caso. Mais de 20 anos de experiência no Rio de Janeiro.",
      primaryCta: "contact",
      mainService:
        "Assessoria jurídica empresarial com foco em M&A, governança e contencioso estratégico",
      whatMakesSpecial: [
        "Atendimento direto pelos sócios — sem intermediários",
        "Equipe enxuta de 8 advogados altamente especializados",
        "Mais de R$ 2 bilhões em transações estruturadas desde 2003",
        "Pareceres em até 5 dias úteis para clientes recorrentes",
      ],
      keyResults:
        "Mais de 150 operações de M&A concluídas, 98% de retenção de clientes corporativos.",
      idealPublic:
        "Diretores jurídicos e CEOs de empresas de médio porte no eixo Rio-SP que precisam de assessoria sob medida.",
      moodTags: ["professional", "elegant", "serious"],
      styleTags: ["classic", "corporate", "minimal"],
      voiceTone: ["formal", "authoritative"],
      slogan: "Estratégia jurídica feita sob medida.",
      hasBrandColor: true,
      brandColors: ["#1C1C1C"],
      colorsToAvoid: ["neon orange", "magenta"],
      inspirationSites: ["https://mattosfilho.com.br"],
      doNots:
        "Não prometer resultados específicos. Evitar linguagem agressiva ou marketeira.",
      rankedObjectives: [
        { id: "build-trust", rank: 1 },
        { id: "generate-leads", rank: 2 },
      ],
      phone: "+55 21 3030-1010",
      emailValue: "contato@albuquerquereis.adv.br",
    },
  },

  // 4. Yoga Studio — PT-BR
  {
    key: "yoga-studio",
    label: "Yoga Studio (PT-BR)",
    values: {
      companyName: "Espaço Prana Yoga",
      segment: "gym",
      niche: "yoga studio",
      region: "Florianópolis, SC",
      companySize: "solo",
      description:
        "Estúdio de yoga em Florianópolis com aulas presenciais e online em pequenos grupos. Foco em hatha, vinyasa e yin para todos os níveis. Espaço acolhedor a 5 minutos da praia da Joaquina, com chá após as aulas.",
      primaryCta: "book",
      mainService:
        "Aulas de yoga em turmas reduzidas, aulões mensais e retiros trimestrais",
      whatMakesSpecial: [
        "Turmas com no máximo 8 alunos para atenção individualizada",
        "Professora certificada Yoga Alliance com 12 anos de prática",
        "Aulas matinais ao ar livre na temporada",
        "Primeira aula sempre experimental e gratuita",
      ],
      idealPublic:
        "Adultos em Florianópolis que buscam reduzir estresse, melhorar postura e ter uma rotina de movimento consciente.",
      moodTags: ["calm", "friendly", "trustworthy"],
      styleTags: ["minimal", "modern", "editorial"],
      voiceTone: ["warm", "inspirational"],
      slogan: "Respira. Você chegou.",
      hasBrandColor: true,
      brandColors: ["#7C9E8A"],
      colorsToAvoid: ["bright red"],
      inspirationSites: ["https://www.modoyoga.com"],
      doNots:
        "Evitar imagens de corpos hiperflexíveis ou competitivas. Sem clichês de 'transformação'.",
      rankedObjectives: [
        { id: "drive-foot-traffic", rank: 1 },
        { id: "grow-community", rank: 2 },
      ],
      phone: "+55 48 99876-5432",
      emailValue: "ola@espacoprana.com.br",
    },
  },

  // 5. E-commerce Sneakers — PT-BR
  {
    key: "ecommerce-sneakers",
    label: "E-commerce Sneakers (PT-BR)",
    values: {
      companyName: "Solado Store",
      segment: "ecommerce",
      niche: "sneaker store",
      region: "Curitiba, PR",
      companySize: "2-10",
      description:
        "Loja online de sneakers raros e edições limitadas, com curadoria autoral e autenticação garantida. Atendemos colecionadores e sneakerheads em todo o Brasil. Lançamentos semanais e drops exclusivos para a comunidade.",
      primaryCta: "buy",
      mainService:
        "Venda de sneakers raros, retros e collabs com autenticação garantida",
      whatMakesSpecial: [
        "Autenticação por especialista em todas as peças",
        "Drops semanais de pares limitados",
        "Comunidade ativa de 12 mil sneakerheads no Discord",
        "Frete grátis acima de R$ 800 para todo o Brasil",
      ],
      keyResults:
        "Mais de 5.000 pares vendidos em 2025, nota 9.6 no Reclame Aqui.",
      idealPublic:
        "Sneakerheads e colecionadores entre 18 e 35 anos que querem peças autenticadas sem viajar pra fora.",
      moodTags: ["energetic", "fun"],
      styleTags: ["bold", "playful", "modern"],
      voiceTone: ["casual", "witty"],
      slogan: "Pé no chão, hype na cabeça.",
      hasBrandColor: true,
      brandColors: ["#FF3B00", "#1A1A1A"],
      colorsToAvoid: ["pastel cores suaves"],
      inspirationSites: ["https://www.kith.com", "https://endclothing.com"],
      doNots:
        "Sem fotos genéricas de tênis em fundo branco. Evitar tom corporativo.",
      rankedObjectives: [
        { id: "sell-products", rank: 1 },
        { id: "showcase-portfolio", rank: 2 },
      ],
      phone: "+55 41 3344-5566",
      emailValue: "atendimento@soladostore.com.br",
    },
  },

  // 6. Marketing Agency — EN
  {
    key: "marketing-agency",
    label: "Marketing Agency (EN)",
    values: {
      companyName: "Northvolt Studio",
      segment: "consulting",
      niche: "digital marketing agency",
      region: "São Paulo, SP",
      companySize: "11-50",
      description:
        "Northvolt is a São Paulo–based digital studio building brand systems, paid acquisition engines and conversion-driven websites for ambitious DTC and B2B teams. We bring strategy, design and engineering under one roof to ship faster. Senior team only — no juniors on accounts.",
      primaryCta: "contact",
      mainService:
        "Brand systems, paid acquisition and high-conversion websites for growth-stage companies",
      whatMakesSpecial: [
        "Senior-only team — every account has a partner attached",
        "In-house design, copy and engineering — no subcontracting",
        "Outcome-based pricing on retainers above 6 months",
        "47 brand launches shipped in the last 24 months",
      ],
      keyResults:
        "Average client ROAS 4.2x. 92% retainer renewal rate across 2024-2025.",
      idealPublic:
        "Founders and CMOs of Series A+ DTC and B2B brands ready to invest 6-figures in their growth engine.",
      moodTags: ["energetic", "elegant", "professional"],
      styleTags: ["editorial", "bold", "modern"],
      voiceTone: ["witty", "authoritative"],
      slogan: "Brands that compound.",
      hasBrandColor: true,
      brandColors: ["#D946EF"],
      colorsToAvoid: ["beige", "navy"],
      inspirationSites: ["https://huncwot.com", "https://www.basicagency.com"],
      doNots:
        "Avoid stock photography of handshakes. No generic 'we are creative' copy.",
      rankedObjectives: [
        { id: "showcase-portfolio", rank: 1 },
        { id: "generate-leads", rank: 2 },
      ],
    },
  },

  // 7. Independent Consultant — PT-BR
  {
    key: "independent-consultant",
    label: "Independent Consultant (PT-BR)",
    values: {
      companyName: "Marina Soares Consultoria",
      segment: "consulting",
      niche: "operations consulting for SMBs",
      region: "Remote / Brasil",
      companySize: "solo",
      description:
        "Consultoria independente em operações e processos para pequenas e médias empresas brasileiras. Atendo founders e diretores que precisam organizar a casa para escalar com saúde. 12 anos de experiência liderando ops em scale-ups antes de virar consultora solo.",
      primaryCta: "contact",
      mainService:
        "Consultoria de operações sob medida — diagnóstico, redesenho de processos e implementação",
      whatMakesSpecial: [
        "Atendimento direto comigo — sem times terceirizados",
        "Diagnóstico de 30 dias com plano executável ao fim",
        "Background hands-on em três scale-ups brasileiras",
        "Disponibilidade limitada a 4 clientes por trimestre",
      ],
      keyResults:
        "Mais de 25 empresas atendidas, redução média de 40% em retrabalho operacional.",
      idealPublic:
        "Founders e COOs de PMEs entre 20 e 200 pessoas que sentem que a operação virou gargalo do crescimento.",
      moodTags: ["professional", "trustworthy", "friendly"],
      styleTags: ["minimal", "classic", "corporate"],
      voiceTone: ["formal", "warm"],
      slogan: "Operação afiada para o próximo passo.",
      hasBrandColor: true,
      brandColors: ["#374151"],
      colorsToAvoid: ["neon", "rosa choque"],
      inspirationSites: ["https://basecamp.com"],
      doNots:
        "Nada de jargão de consultoria de big four. Sem promessas vazias de 'transformação digital'.",
      rankedObjectives: [
        { id: "tell-our-story", rank: 1 },
        { id: "generate-leads", rank: 2 },
      ],
      phone: "+55 11 99123-4567",
      emailValue: "marina@marinasoares.com.br",
    },
  },

  // 8. Fine Dining Restaurant — PT-BR
  {
    key: "fine-dining-restaurant",
    label: "Fine Dining Restaurant (PT-BR)",
    values: {
      companyName: "Casa Trama",
      segment: "restaurant",
      niche: "fine dining",
      region: "Belo Horizonte, MG",
      companySize: "11-50",
      description:
        "Restaurante de alta gastronomia em Belo Horizonte focado em ingredientes mineiros reinterpretados em menu degustação. Cozinha aberta, carta de vinhos curada com mais de 200 rótulos e ambiente intimista para 32 lugares. Reservas com até 60 dias de antecedência.",
      primaryCta: "book",
      mainService:
        "Menu degustação contemporâneo com ingredientes mineiros e harmonização de vinhos",
      whatMakesSpecial: [
        "Menu degustação de 8 tempos que muda a cada estação",
        "Mais de 70% dos ingredientes vêm de produtores de Minas",
        "Carta de vinhos premiada com 200+ rótulos selecionados",
        "Apenas 32 lugares para experiência intimista",
      ],
      keyResults:
        "Eleito top 5 restaurantes de BH em 2024 e 2025 pela Veja Comer & Beber.",
      idealPublic:
        "Casais e grupos pequenos que celebram ocasiões especiais e valorizam alta gastronomia regional.",
      moodTags: ["elegant", "trustworthy", "calm"],
      styleTags: ["luxury", "editorial", "classic"],
      voiceTone: ["formal", "inspirational"],
      slogan: "A trama dos sabores de Minas, reinterpretada.",
      hasBrandColor: true,
      brandColors: ["#8B6914", "#1C1C1C"],
      colorsToAvoid: ["amarelo neon", "pink"],
      inspirationSites: ["https://www.dom.com.br", "https://noma.dk"],
      doNots:
        "Evitar fotos próximas demais dos pratos. Sem linguagem informal nem emojis.",
      rankedObjectives: [
        { id: "drive-foot-traffic", rank: 1 },
        { id: "tell-our-story", rank: 2 },
      ],
      phone: "+55 31 3222-7878",
      emailValue: "reservas@casatrama.com.br",
    },
  },

  // 9. Real Estate Broker — PT-BR
  {
    key: "real-estate-broker",
    label: "Real Estate Broker (PT-BR)",
    values: {
      companyName: "Imobiliária Cerrado Brasil",
      segment: "real-estate",
      niche: "high-end residential brokerage",
      region: "Brasília, DF",
      companySize: "2-10",
      description:
        "Imobiliária boutique em Brasília especializada em imóveis residenciais de alto padrão no Plano Piloto e Lago Sul. Atuamos com curadoria personalizada, apresentação fotográfica profissional e assessoria completa do tour à escritura. Mais de 18 anos de mercado.",
      primaryCta: "contact",
      mainService:
        "Corretagem de imóveis residenciais de alto padrão em Brasília e região",
      whatMakesSpecial: [
        "Carteira curada com 60 imóveis exclusivos a qualquer momento",
        "Tour fotográfico profissional + plantas e drone em todos os anúncios",
        "Equipe de 6 corretores credenciados pelo CRECI-DF",
        "Assessoria jurídica e financeira inclusa até a escritura",
      ],
      keyResults:
        "Mais de R$ 350 milhões em VGV transacionado nos últimos 5 anos.",
      idealPublic:
        "Famílias e investidores procurando imóveis acima de R$ 1,5 milhão em Brasília que valorizam atendimento consultivo.",
      moodTags: ["trustworthy", "professional", "serious"],
      styleTags: ["classic", "corporate", "minimal"],
      voiceTone: ["formal", "warm"],
      slogan: "Onde Brasília mora bem.",
      hasBrandColor: true,
      brandColors: ["#1D4ED8"],
      colorsToAvoid: ["verde neon", "vermelho vivo"],
      inspirationSites: ["https://www.compass.com"],
      doNots:
        "Nada de fotos genéricas de chaves ou apertos de mão. Não usar termos vagos como 'oportunidade única'.",
      rankedObjectives: [
        { id: "generate-leads", rank: 1 },
        { id: "build-trust", rank: 2 },
      ],
      phone: "+55 61 3344-2020",
      emailValue: "contato@cerradobrasil.com.br",
    },
  },

  // 10. Hair Salon — PT-BR
  {
    key: "hair-salon",
    label: "Hair Salon (PT-BR)",
    values: {
      companyName: "Studio Mecha",
      segment: "beauty-salon",
      niche: "color-focused hair salon",
      region: "Porto Alegre, RS",
      companySize: "solo",
      description:
        "Salão de beleza em Porto Alegre especializado em coloração criativa, mechas e tratamentos capilares de alta performance. Espaço descolado no Bom Fim, atendimento individual com hora marcada. Produtos veganos e técnicas atualizadas em treinamentos internacionais anuais.",
      primaryCta: "book",
      mainService:
        "Coloração criativa, mechas, cortes autorais e tratamentos capilares profundos",
      whatMakesSpecial: [
        "Atendimento individual com hora marcada — sem espera",
        "Produtos veganos e cruelty-free em todos os serviços",
        "Atualização anual em academias de coloração na Europa",
        "Café especial e playlist no fone enquanto você relaxa",
      ],
      idealPublic:
        "Mulheres e pessoas LGBTQIAP+ entre 20 e 45 anos que buscam coloração criativa e atendimento sem julgamento.",
      moodTags: ["friendly", "fun", "energetic"],
      styleTags: ["playful", "bold", "modern"],
      voiceTone: ["casual", "playful"],
      slogan: "Sua melhor mecha mora aqui.",
      hasBrandColor: true,
      brandColors: ["#EC4899", "#F9A8D4"],
      colorsToAvoid: ["bege", "marrom escuro"],
      inspirationSites: ["https://www.bumbleandbumble.com"],
      doNots:
        "Sem clichês de 'transformação' antes-e-depois. Evitar linguagem hetero-padrão.",
      rankedObjectives: [
        { id: "drive-foot-traffic", rank: 1 },
        { id: "showcase-portfolio", rank: 2 },
      ],
      phone: "+55 51 99654-3210",
      emailValue: "agenda@studiomecha.com.br",
    },
  },
];
