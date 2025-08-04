export const DATA_CATEGORIAS = {
  GV: {
    introducao: `A categoria Governar do NIST Cybersecurity Framework (CSF) 2.0 é uma das novas categorias introduzidas nesta versão do framework. Ela foca no estabelecimento de políticas, processos e estruturas organizacionais para garantir que as atividades de segurança cibernética estejam alinhadas com os objetivos estratégicos e os requisitos de conformidade da organização.

O principal objetivo da categoria Governar é assegurar que a gestão e a direção da segurança cibernética sejam devidamente integradas à governança corporativa e envolve:`,

    definicao_list: `Definição de Políticas e Estruturas de Gestão: Estabelecer políticas de segurança cibernética que sejam consistentemente com os objetivos da organização. Isso inclui definir as responsabilidades e os papéis de todos os envolvidos, assegurando que a segurança cibernética esteja incorporada nos processos de governança geral da organização.

Planejamento e Alocação de Recursos: Assegurar que os recursos (financeiros, humanos e tecnológicos) sejam adequados e estejam devidamente alocados para implementar e manter a segurança cibernética. Isso inclui priorizar investimentos e planejar a continuidade dos negócios em caso de incidentes de segurança.

Gestão de Riscos e Conformidade: Integrar o gerenciamento de riscos cibernéticos ao gerenciamento de riscos empresariais em geral, garantindo que a organização esteja em conformidade com regulamentações e legislações aplicáveis. Isso envolve monitorar e revisar continuamente a postura de risco, além de garantir que o gerenciamento de riscos seja um processo contínuo e alinhado com a estratégia corporativa.

Cultura e Comunicação: Promover uma cultura organizacional que valorize a segurança cibernética e a proteção de dados. Isso inclui assegurar que todos os níveis da organização, incluindo a alta administração, estejam cientes dos riscos de segurança cibernética e de suas responsabilidades. O compromisso da liderança com a segurança cibernética é essencial para incentivar práticas seguras em todos os departamentos.

Monitoramento da Conformidade e da Eficácia: Estabelecer métricas e métodos de monitoramento para avaliar a eficácia das políticas e controles de segurança implementados. Isso ajuda a garantir que as estratégias de segurança estejam funcionando conforme o planejado e que quaisquer desvios possam ser corrigidos rapidamente.`,

    texto: `A categoria Governar é fundamental para garantir que a segurança cibernética não seja tratada apenas como apenas uma questão técnica, mas como um componente crítico da gestão empresarial. Ela ajuda a estabelecer um alinhamento estratégico, permitindo que a organização responda de forma eficaz às ameaças e oportunidades, ao mesmo tempo em que cumpre suas obrigações de conformidade.`,

    subcategorias: {
      "GV.OC": {
        descricao: "Contexto Organizacional",
        "GV.OC-01":
          "A missão organizacional é compreendida e orienta a gestão de riscos cibernéticos.",
        "GV.OC-02":
          "Os stakeholders internos e externos são compreendidos, e suas necessidades e expectativas em relação à gestão de riscos cibernéticos são entendidas e consideradas.",
        "GV.OC-03":
          "Os requisitos legais, regulatórios e contratuais relacionados à cibersegurança — incluindo obrigações de privacidade e liberdades civis — são compreendidos e geridos.",
        "GV.OC-04":
          "Os objetivos críticos, capacidades e serviços dos quais os stakeholders dependem ou esperam da organização são compreendidos e comunicados.",
        "GV.OC-05":
          "Os resultados, capacidades e serviços dos quais a organização depende são compreendidos e comunicados.",
      },

      "GV.RM": {
        descricao: "Estratégia de Gerenciamento de Riscos",
        "GV.RM-01":
          "Os objetivos de gestão de risco são estabelecidos e acordados pelos stakeholders da organização.",
        "GV.RM-02":
          "Declarações de apetite ao risco e tolerância ao risco são estabelecidas, comunicadas e mantidas.",
        "GV.RM-03":
          "As atividades e resultados da gestão de riscos cibernéticos são incluídos nos processos de gestão de riscos empresariais.",
        "GV.RM-04":
          "Uma direção estratégica que descreve opções apropriadas de resposta ao risco é estabelecida e comunicada.",
        "GV.RM-05":
          "São estabelecidas linhas de comunicação para riscos cibernéticos em toda a organização, incluindo riscos de fornecedores e outras terceiras partes.",
        "GV.RM-06":
          "Um método padronizado para calcular, documentar, categorizar e priorizar riscos cibernéticos é estabelecido e comunicado.",
        "GV.RM-07":
          "Oportunidades estratégicas (ou seja, riscos positivos) são caracterizadas e incluídas nas discussões sobre risco cibernético da organização.",
      },

      "GV.RR": {
        descricao: "Funções e Responsabilidades de Risco",
        "GV.RR-01":
          "A liderança organizacional é responsável e responsabilizada pelo risco cibernético e promove uma cultura que é consciente dos riscos, da ética e está em constante melhoria.",
        "GV.RR-02":
          "Papéis, responsabilidades e autoridades relacionadas à gestão de risco cibernético são estabelecidos, comunicados, compreendidos e aplicados.",
        "GV.RR-03":
          "Recursos adequados são alocados de forma proporcional à estratégia de risco cibernético, papéis, responsabilidades e políticas.",
        "GV.RR-04":
          "A cibersegurança é incluída nas práticas de recursos humanos.",
      },

      "GV.PO": {
        descricao: "Política de Gerenciamento",
        "GV.PO-01":
          "Política para a gestão de riscos cibernéticos é estabelecida com base no contexto organizacional, estratégia de cibersegurança e prioridades e é comunicada e aplicada.",
        "GV.PO-02":
          "Política para a gestão de riscos cibernéticos é revisada, atualizada, comunicada e aplicada para refletir mudanças nos requisitos, ameaças, tecnologia e missão organizacional.",
      },

      "GV.OV": {
        descricao: "Supervisão",
        "GV.OV-01":
          "Os resultados da estratégia de gestão de riscos cibernéticos são revisados para informar e ajustar a estratégia e a direção.",
        "GV.OV-02":
          "A estratégia de gestão de riscos cibernéticos é revisada e ajustada para garantir a cobertura dos requisitos e riscos organizacionais.",
        "GV.OV-03":
          "O desempenho da gestão de riscos cibernéticos organizacional é avaliado e revisado para ajustes necessários.",
      },

      "GV.SC": {
        descricao: "Gerenciamento da Cadeia de Suprimentos",
        "GV.SC-01":
          "Um programa de gestão de riscos da cadeia de suprimentos de cibersegurança, estratégia, objetivos, políticas e processos são estabelecidos e acordados pelos stakeholders organizacionais.",
        "GV.SC-02":
          "Papéis e responsabilidades de cibersegurança para fornecedores, clientes e parceiros são estabelecidos, comunicados e coordenados interna e externamente.",
        "GV.SC-03":
          "A gestão de riscos da cadeia de suprimentos de cibersegurança é integrada à gestão de riscos de cibersegurança e empresarial, avaliação de riscos e processos de melhoria.",
        "GV.SC-04":
          "Fornecedores são conhecidos e priorizados pela criticidade.",
        "GV.SC-05":
          "Requisitos para abordar riscos de cibersegurança em cadeias de suprimentos são estabelecidos, priorizados e integrados em contratos e outros tipos de acordos com fornecedores e outras terceiras partes relevantes.",
        "GV.SC-06":
          "Planejamento e diligências prévias são realizados para reduzir riscos antes de entrar em relações formais com fornecedores ou outras terceiras partes.",
        "GV.SC-07":
          "Os riscos apresentados por um fornecedor, seus produtos e serviços e outras terceiras partes são compreendidos, registrados, priorizados, avaliados, respondidos e monitorados ao longo do relacionamento.",
        "GV.SC-08":
          "Fornecedores relevantes e outras terceiras partes são incluídos no planejamento, resposta e recuperação de incidentes.",
        "GV.SC-09":
          "Práticas de segurança da cadeia de suprimentos são integradas aos programas de gestão de riscos de cibersegurança e empresarial, e seu desempenho é monitorado ao longo do ciclo de vida de produtos e serviços tecnológicos.",
        "GV.SC-10":
          "Planos de gestão de riscos da cadeia de suprimentos de cibersegurança incluem disposições para atividades que ocorrem após a conclusão de uma parceria ou acordo de serviço.",
      },
    },
  },

  ID: {
    introducao: `A categoria Identificar do NIST Cybersecurity Framework (CSF) 2.0 é um dos principais pilares para a construção de uma estratégia sólida de segurança cibernética. Ela tem como objetivo proporcionar um entendimento profundo do ambiente organizacional, facilitando a gestão de riscos relacionados aos ativos, dados, sistemas e processos. A Identificação é a base para as demais funções de segurança cibernética, pois ajuda a organização a conhecer sua infraestrutura e entender onde estão os principais riscos. 
        
Os principais objetivos da categoria Identificar incluem: `,

    definicao_list: `Entendimento dos Ativos e Recursos: É necessário mapear e inventariar todos os ativos, incluindo hardware, software, dados e recursos humanos críticos para a operação da organização. Isso garante que a organização saiba o que precisa ser protegido, quais são os ativos mais importantes e qual o nível de risco que eles representam. Esses ativos podem incluir sistemas de TI, dados sensíveis, dispositivos de rede, entre outros. 
Identificação de Riscos e Vulnerabilidades: Envolve realizar uma avaliação abrangente para identificar riscos potenciais, vulnerabilidades e ameaças que possam afetar os ativos críticos. Esse processo permite que a organização entenda sua exposição a riscos e planeje estratégias de mitigação adequadas. A identificação de riscos também está alinhada com o processo de priorização, onde se entende quais são os riscos mais críticos e que requerem atenção imediata. 
Mapeamento dos Processos de Negócio: É essencial identificar e entender os processos de negócio da organização e como os ativos de TI e os dados se relacionam com esses processos. Isso inclui entender as interdependências entre sistemas e como o comprometimento de um ativo específico pode impactar o funcionamento geral da empresa. 
Identificação de Dependências Externas: Esta etapa envolve identificar dependências externas, como fornecedores, parceiros e provedores de serviços. A dependência de terceiros cria riscos adicionais para a organização, e o processo de identificação ajuda a mapear quais relacionamentos críticos precisam de atenção, garantindo que as expectativas e as responsabilidades relacionadas à segurança estejam bem definidas. 
Análise de Contexto e Requisitos de Segurança: É fundamental entender o contexto em que a organização opera, incluindo as regulamentações e legislações que devem ser seguidas. Isso garante que as práticas de segurança cibernética estejam alinhadas com os requisitos legais, normativos e os objetivos do negócio. Essa identificação permite que a organização cumpra requisitos de conformidade e evite penalidades legais e financeiras. 
Categorização de Riscos: O processo de identificação também deve resultar na categorização dos riscos associados a diferentes ativos e processos. Isso significa definir a criticidade de cada risco, o impacto potencial e o nível de vulnerabilidade, para que se possa priorizar ações corretivas e mitigadoras de forma eficiente. `,

    texto: `A categoria Identificar é crucial porque estabelece as bases para o desenvolvimento de um programa de segurança cibernética robusto. Sem entender o que deve ser protegido e onde estão os principais riscos, qualquer tentativa de implementar controles e medidas de segurança eficazes será falha.  
 
Ao garantir que todos os ativos e riscos estejam bem mapeados e entendidos, a organização pode planejar e aplicar políticas de segurança de forma mais eficaz, facilitando a execução das outras funções do framework, como proteger, detectar, responder e recuperar. `,
    subcategorias: {
      "ID.AM": {
        descricao: "Gerenciamento de Ativos",
        "ID.AM-01":
          "Inventários de hardware gerenciados pela organização são mantidos.",
        "ID.AM-02":
          "Inventários de software, serviços e sistemas gerenciados pela organização são mantidos.",
        "ID.AM-03":
          "Representações das comunicações de rede autorizadas da organização e dos fluxos de dados de rede internos e externos são mantidas",
        "ID.AM-04":
          "Inventários de serviços fornecidos por fornecedores são mantidos",
        "ID.AM-05":
          "Ativos são priorizados com base na classificação, criticidade, recursos e impacto na missão",
        "ID.AM-07":
          "Inventários de dados e metadados correspondentes para tipos de dados designados são mantidos",
        "ID.AM-08":
          "Sistemas, hardware, software, serviços e dados são gerenciados ao longo de seus ciclos de vida",
      },
      "ID.RA": {
        descricao: "Avaliação de Riscos",
        "ID.RA-01":
          "Vulnerabilidades nos ativos são identificadas, validadas e registradas",
        "ID.RA-02":
          "Inteligência sobre ameaças cibernéticas é recebida de fóruns e fontes de compartilhamento de informações",
        "ID.RA-03":
          "Ameaças internas e externas à organização são identificadas e registradas",
        "ID.RA-04":
          "Os impactos potenciais e as probabilidades de ameaças explorarem vulnerabilidades são identificados e registrados",
        "ID.RA-05":
          "Ameaças, vulnerabilidades, probabilidades e impactos são usados para entender o risco inerente e informar a priorização da resposta ao risco",
        "ID.RA-06":
          "Respostas ao risco são escolhidas, priorizadas, planejadas, rastreadas e comunicadas",
        "ID.RA-07":
          "Mudanças e exceções são gerenciadas, avaliadas quanto ao impacto no risco, registradas e rastreadas",
        "ID.RA-08":
          "Processos para receber, analisar e responder a divulgações de vulnerabilidades são estabelecidos",
        "ID.RA-09":
          "A autenticidade e integridade do hardware e software são avaliadas antes da aquisição e uso",
        "ID.RA-10": "Fornecedores críticos são avaliados antes da aquisição",
      },
      "ID.IM": {
        descricao: "Identificação de Melhorias",
        "ID.IM-01": "Melhorias são identificadas a partir de avaliações",
        "ID.IM-02":
          "Melhorias são identificadas a partir de testes de segurança e exercícios, incluindo aqueles realizados em coordenação com fornecedores e terceiros relevantes",
        "ID.IM-03":
          "Melhorias são identificadas a partir da execução de processos operacionais, procedimentos e atividades",
        "ID.IM-04":
          "Planos de resposta a incidentes e outros planos de cibersegurança que afetam as operações são estabelecidos, comunicados, mantidos e melhorados",
      },
    },
  },
  PR: {
    introducao: `A categoria Proteger do NIST Cybersecurity Framework (CSF) 2.0 foca no desenvolvimento e na implementação de medidas de segurança para garantir a resiliência dos sistemas e a proteção dos ativos críticos da organização contra ataques e incidentes cibernéticos. O objetivo principal dessa função é limitar ou conter o impacto de um possível incidente de segurança. Para isso, são adotadas práticas e controles que visam reduzir a probabilidade de ocorrência e garantir que, caso algo aconteça, as consequências sejam minimizadas.`,

    definicao_list: `Controle de Acesso: Implementar controles de acesso baseados no princípio do menor privilégio, garantindo que os usuários, dispositivos e sistemas tenham apenas os acessos necessários para desempenhar suas funções. Isso inclui a autenticação forte de usuários, o uso de autenticação multifator (MFA) e a definição de regras claras sobre quem pode acessar informações críticas e de que forma.
Proteção de Dados: Garantir a segurança dos dados em repouso e em trânsito é uma prioridade. Isso inclui a criptografia de dados sensíveis, controle de acesso a informações confidenciais e a implementação de políticas de prevenção contra perda de dados (DLP). É essencial que os dados críticos da organização estejam devidamente protegidos contra acessos não autorizados e roubo.
Treinamento e Conscientização: Treinar os colaboradores é uma parte fundamental da função Proteger. É necessário desenvolver programas de conscientização e treinamentos regulares para todos os funcionários, educando-os sobre as melhores práticas de segurança e ajudando-os a identificar potenciais ameaças, como phishing e técnicas de engenharia social. A conscientização reduz significativamente o risco de que erros humanos sejam uma porta de entrada para incidentes de segurança.
Segurança de Tecnologia e Processos: Esta área envolve implementar medidas de proteção em tecnologias, como sistemas operacionais, aplicações e infraestrutura de rede. Isso inclui o uso de firewalls, sistemas de detecção e prevenção de intrusões (IDS/IPS), antivírus, e a aplicação de patches e atualizações para mitigar vulnerabilidades. Processos de segurança, como backup de dados e práticas de gerenciamento de configuração, também são implementados para garantir a resiliência dos sistemas.
Manutenção e Gestão de Identidades: A gestão de identidades e credenciais é essencial para proteger o ambiente organizacional. Isso envolve estabelecer processos para a criação, modificação e exclusão de contas de usuário e garantir que cada pessoa tenha um acesso adequado, incluindo a remoção imediata de acessos para ex-colaboradores ou mudanças de função dentro da organização. A implementação de políticas de identidade forte evita acessos indevidos e reduz os riscos associados a credenciais comprometidas.
Proteção de Recursos e Redução de Vulnerabilidades: Implementar técnicas e controles para proteger recursos organizacionais de ataques. Isso pode incluir segmentação de rede, uso de VPNs (redes privadas virtuais) para acessos remotos, e a realização de avaliações regulares de vulnerabilidades para identificar e corrigir fraquezas antes que sejam exploradas por agentes maliciosos.`,

    texto: `A função Proteger é fundamental porque estabelece as medidas proativas que permitem reduzir os riscos e proteger os ativos mais importantes da organização. Uma vez que os ativos e riscos são identificados (etapa "Identificar"), a função Proteger foca em garantir a segurança do ambiente através da adoção de medidas práticas e consistentes que ajudam a criar uma barreira contra ameaças. Essas medidas de proteção servem como a linha de defesa que mitiga as chances de um incidente cibernético causar impactos severos na organização.`,
    subcategorias: {
      "PR.AA": {
        descricao: "Controle de Acesso e Autenticação",
        "PR.AA-04":
          "Adotar criptografia de ponta a ponta para todas as transmissões de identidade. Utilizar protocolos seguros (como TLS 1.3) para proteger as informações de identidade e realizar testes regulares para verificar a segurança das transmissões.",
        "PR.AA-06":
          "Implementar sistemas de vigilância e monitoramento de acesso físico, incluindo sensores e câmeras, para garantir um controle contínuo do acesso aos ativos. Revisar políticas de acesso físico com base em avaliações periódicas de risco.",
      },
      "PR.DS": {
        descricao: "Proteção de Dados",
        "PR.DS-01":
          "Implementar criptografia para todos os dados em repouso e assegurar que apenas algoritmos recomendados e seguros sejam usados. Monitorar regularmente o acesso aos repositórios de dados e arquivos para identificar qualquer anomalia ou tentativa de acesso indevido.",
        "PR.DS-02":
          "Implementar criptografia para todos os dados em trânsito e assegurar que apenas algoritmos recomendados e seguros sejam usados. Monitorar regularmente os canais de comunicação para identificar qualquer anomalia ou tentativa de interceptação de dados.",
        "PR.DS-10":
          "Implementar tecnologias de criptografia de memória e processos para proteger os dados enquanto estão em uso, além de utilizar criptografia de ponta a ponta para garantir que os dados permaneçam protegidos durante todo o ciclo de vida. Definir e implementar políticas de controle de acesso baseadas em funções (RBAC), limitando o acesso a dados sensíveis apenas a usuários ou processos autorizados, realizando revisões periódicas dos acessos concedidos e atualizando as permissões conforme mudanças nos cargos e funções. Implementar soluções de monitoramento continuo para rastrear o acesso aos dados e identificar atividades suspeitas, juntamente com a configuração de alertas automáticos para notificar a equipe de segurança sobre acessos não autorizados.",
        "PR.DS-11":
          "Estabelecer uma política formal que defina a frequência, retenção e procedimentos de restauração dos dados, além de classificar os dados para definir a periodicidade dos backups de acordo com a criticidade e o impacto no negócio. Todos os backups devem ser criptografados, tanto em trânsito quanto em repouso, para garantir a confidencialidade dos dados armazenados, e medidas de segurança física e lógica devem ser implementadas para proteger os servidores e dispositivos utilizados para armazenar os backups. Todos os backups devem ser testados periodicamente para garantir a integridade e a disponibilidade dos dados quando necessário.",
      },
      "PR.PS": {
        descricao: "Gestão de Sistemas e Hardware",
        "PR.PS-01":
          "Estabelecer uma política de gerenciamento de configuração que inclua auditorias periódicas para verificar a consistência e integridade das configurações. Utilizar ferramentas que automatizem o rastreamento de alterações de configuração.",
        "PR.PS-02":
          "Implementar um ciclo de manutenção proativo para o software, incluindo atualizações regulares e substituições quando necessário. Avaliar o risco de cada software antes de decidir por sua manutenção ou remoção.",
        "PR.PS-03":
          "Estabelecer um inventário detalhado de hardware, incluindo a data prevista de substituição. Realizar avaliações de risco anuais para decidir sobre a manutenção, substituição ou descarte de hardware.",
        "PR.PS-04":
          "Garantir que todos os registros de log sejam centralizados e monitorados em tempo real. Utilizar soluções de Next Generation SIEM (Security Information and Event Management) e/ou OpenXDR para facilitar o monitoramento contínuo e a análise dos registros.",
        "PR.PS-05":
          "Implementar um controle rigoroso de políticas de instalação de software e garantir que apenas software aprovado possa ser instalado. Utilizar listas de permissão (whitelisting) e listas de bloqueio (blacklisting) para controlar a instalação de aplicativos.",
        "PR.PS-06":
          "Integrar revisões de segurança em todas as fases do ciclo de vida de desenvolvimento de software, incluindo análise de código estático e dinâmico. Monitorar continuamente a segurança das práticas de desenvolvimento com métricas claras para avaliar a eficácia.",
      },
      "PR.IP": {
        descricao: "Proteção de Infraestrutura",
        "PR.IP-01":
          "Implementar controles de acesso robustos, incluindo autenticação multifator (MFA) w/ou Zero Trust Network Access (ZTNA) para todos os usuários, especialmente aqueles que possuem acesso a sistemas críticos. Segmentar a rede, garantindo que diferentes áreas da organização tenham níveis de acesso diferenciados e isolados, minimizando o impacto de possíveis incidentes de segurança.",
        "PR.IP-03":
          "Desenvolver planos de continuidade de negócios que incluam cenários de desastre e mecanismos para garantir a resiliência das operações. Realizar testes de resiliência regulares, incluindo simulações de interrupções e falhas de sistemas.",
        "PR.IP-04":
          "Garantir a capacidade adequada de recursos para manter a disponibilidade dos serviços críticos, incluindo redundância em termos de infraestrutura e equipe. Realizar avaliações periódicas da infraestrutura de TI para identificar pontos fracos e garantir a capacidade de manter os serviços em funcionamento durante eventos adversos.",
      },
    },
  },
  DE: {
    introducao: `A categoria Detectar do NIST Cybersecurity Framework (CSF) 2.0 tem como objetivo identificar rapidamente atividades e eventos anômalos que possam indicar a ocorrência de um incidente de segurança cibernética. A função Detectar foca em garantir que a organização tenha a capacidade de monitorar seus sistemas continuamente e responder prontamente a qualquer indício de violação, minimizando assim o impacto potencial de um incidente.`,

    definicao_list: `Monitoramento Contínuo de Atividades: Implementar sistemas de monitoramento contínuo para identificar atividades suspeitas em redes, sistemas e aplicativos. Esses sistemas, como Next Generation SIEM (Next Generation Security Information and Event Management) e/ou OpenXDR (Open eXtend Detection and Respond), fornecem visibilidade em tempo real sobre o que está acontecendo no ambiente organizacional, ajudando a detectar comportamentos incomuns e anomalias.
Identificação de Anomalias e Eventos: Desenvolver a capacidade de identificar eventos que não correspondem ao comportamento usual, seja relacionado ao tráfego de rede, acesso a dados ou qualquer atividade dentro dos sistemas da organização. Esse processo envolve definir o que é considerado “normal” para a infraestrutura e detectar quaisquer desvios. A detecção de anomalias é uma técnica eficaz para reconhecer atividades que podem indicar tentativas de intrusão ou ataques.
Análise de Logs e Auditoria: Manter registros detalhados (logs) de todas as atividades importantes que ocorrem nos sistemas e redes da organização. Esses registros são analisados regularmente para identificar padrões suspeitos e fornecer uma linha do tempo precisa de eventos que podem ter levado a um incidente. A auditoria de logs é essencial para garantir que nada passe despercebido e que haja um histórico detalhado em caso de investigação posterior.
Detecção de Ameaças e Vulnerabilidades: Utilizar ferramentas de detecção, como sistemas de detecção de intrusão (IDS), sistemas de prevenção de intrusão (IPS), scanners de vulnerabilidade e outras soluções avançadas para detectar tentativas de ataque ou exploração de falhas. O uso de técnicas automatizadas permite uma resposta rápida e assertiva a possíveis ameaças antes que elas comprometam sistemas críticos.
Integração com Inteligência de Ameaças: Adotar inteligência de ameaças cibernéticas (Threat Intelligence) para manter a organização informada sobre novas ameaças e tendências. Essa inteligência é integrada aos sistemas de monitoramento para melhorar a capacidade de identificar rapidamente novos ataques que estão ocorrendo na comunidade mais ampla. A inteligência de ameaças permite uma detecção mais proativa e uma preparação adequada para enfrentar os desafios emergentes.
Alertas e Notificações: Estabelecer mecanismos eficazes de alerta e notificação, para que, quando um evento suspeito for identificado, a equipe responsável pela segurança seja imediatamente informada. Isso inclui definir uma prioridade para os alertas, de acordo com a criticidade dos eventos, garantindo que incidentes mais graves recebam atenção imediata.`,

    texto: `A função Detectar é essencial para proporcionar à organização uma resposta rápida e eficaz em caso de ameaças cibernéticas. Ao implementar monitoramento contínuo, identificar anomalias e manter uma análise detalhada dos registros, a organização pode reconhecer ameaças em suas fases iniciais, permitindo ações de contenção antes que causem danos significativos. A detecção eficaz reduz o tempo entre a ocorrência de um incidente e a resposta adequada, limitando o impacto sobre as operações e fortalecendo a postura geral de segurança da organização.`,
    subcategorias: {
      "DE.CM": {
        descricao: "Monitoramento Contínuo",
        "DE.CM-01":
          "Redes e serviços de rede são monitorados para identificar eventos potencialmente adversos.",
        "DE.CM-02":
          "O ambiente físico é monitorado para identificar eventos potencialmente adversos.",
        "DE.CM-03":
          "Atividades de pessoal e uso de tecnologia são monitorados para identificar eventos potencialmente adversos.",
        "DE.CM-06":
          "Atividades e serviços de provedores de serviço externos são monitorados para identificar eventos potencialmente adversos.",
        "DE.CM-09":
          "Hardware e software de computação, ambientes de execução e seus dados são monitorados para identificar eventos potencialmente adversos.",
      },
      "DE.AE": {
        descricao: "Análise e Avaliação de Eventos Adversos",
        "DE.AE-02":
          "Eventos potencialmente adversos são analisados para melhor entender as atividades associadas.",
        "DE.AE-03": "Informações são correlacionadas de múltiplas fontes.",
        "DE.AE-04":
          "O impacto estimado e o alcance dos eventos adversos são compreendidos.",
        "DE.AE-06":
          "Informações sobre eventos adversos são fornecidas a pessoal autorizado e ferramentas.",
        "DE.AE-07":
          "Inteligência de ameaças cibernéticas e outras informações contextuais são integradas à análise.",
        "DE.AE-08":
          "Incidentes são declarados quando eventos adversos atendem aos critérios de incidente definidos.",
      },
    },
  },

  RS: {
    introducao: `A categoria Responder do NIST Cybersecurity Framework (CSF) 2.0 tem como objetivo garantir que a organização esteja preparada para responder de maneira rápida e eficaz a incidentes de segurança cibernética, minimizando os danos e assegurando uma recuperação rápida das operações. A função Responder é crucial para conter o impacto de ataques cibernéticos, mitigar vulnerabilidades exploradas e restaurar a confiança na segurança dos sistemas.`,

    definicao_list: `Planejamento de Resposta a Incidentes: Desenvolver e manter um plano de resposta a incidentes que seja claro e abrangente. Esse plano deve incluir procedimentos específicos para diferentes tipos de incidentes, definir responsabilidades e estabelecer um processo bem definido para gerenciar cada etapa da resposta. A preparação é essencial para garantir que todas as partes da organização saibam exatamente o que fazer quando ocorre um incidente.
Análise e Avaliação de Incidentes: Durante e após a ocorrência de um incidente, é importante analisar o que aconteceu e entender a causa raiz. Essa análise detalhada permite que a organização identifique as vulnerabilidades exploradas e entenda como o ataque ocorreu, ajudando a evitar que um incidente semelhante ocorra novamente. A avaliação dos impactos é igualmente fundamental para definir a melhor forma de mitigação.
Mitigação de Impactos: Implementar ações para conter o incidente e reduzir os danos causados. Isso pode incluir a segmentação da rede para impedir a propagação de um ataque, a suspensão de contas comprometidas, a aplicação de correções ou mudanças de configuração, entre outras medidas. A mitigação é uma resposta imediata para evitar que o incidente se agrave e cause maiores impactos.
Comunicação Interna e Externa: Estabelecer protocolos de comunicação claros durante um incidente. Isso inclui notificar partes interessadas internas, como a alta administração, e, quando necessário, comunicar externamente com clientes, reguladores e o público. A comunicação eficaz ajuda a gerenciar as expectativas das partes interessadas e a manter a transparência, minimizando os impactos na reputação da organização.
Documentação e Relatórios de Incidentes: Documentar cada incidente de maneira detalhada, registrando o que aconteceu, como foi identificado, quais ações foram tomadas e quais foram os resultados. A documentação não só facilita o aprendizado e a melhoria contínua, mas também é essencial para auditorias e conformidade com regulamentações.
Aprendizado Pós-Incidente: Após a mitigação de um incidente, é necessário realizar uma análise pós-ação para avaliar o que funcionou bem e o que precisa ser melhorado. Esse aprendizado é usado para ajustar os planos de resposta a incidentes e fortalecer as defesas da organização, garantindo que a mesma situação não se repita. O objetivo é evoluir continuamente e adaptar as estratégias de resposta às novas ameaças.`,

    texto: `A função Responder é essencial porque garante que, mesmo em um cenário onde as defesas falhem e um incidente ocorra, a organização seja capaz de agir de maneira coordenada e eficaz para minimizar os danos. A capacidade de resposta rápida reduz o tempo de exposição e o impacto de incidentes, protege a continuidade dos negócios e assegura que a organização possa se recuperar e aprender com a experiência. Com uma resposta bem planejada e executada, a confiança na segurança cibernética pode ser restaurada e aprimorada.`,
    subcategorias: {
      "RS.MA": {
        descricao: "Planejamento de Resposta",
        "RS.MA-01":
          "O plano de resposta a incidentes é executado em coordenação com terceiros relevantes uma vez que um incidente é declarado.",
        "RS.MA-02": "Relatórios de incidentes são triados e validados.",
        "RS.MA-03": "Incidentes são categorizados e priorizados.",
        "RS.MA-04": "Incidentes são escalados ou elevados conforme necessário.",
        "RS.MA-05":
          "Os critérios para iniciar a recuperação de incidentes são aplicados.",
      },
      "RS.AN": {
        descricao: "Análise do Incidente",
        "RS.AN-03":
          "Análises são realizadas para estabelecer o que ocorreu durante um incidente e a causa raiz do incidente.",
        "RS.AN-06":
          "Ações realizadas durante uma investigação são registradas, e a integridade e a proveniência dos registros são preservadas.",
        "RS.AN-07":
          "Dados e metadados do incidente são coletados, e sua integridade e proveniência são preservadas.",
        "RS.AN-08": "A magnitude de um incidente é estimada e validada.",
      },
      "RS.CO": {
        descricao: "Comunicação e Coordenação",
        "RS.CO-02":
          "Partes interessadas internas e externas são notificadas dos incidentes.",
        "RS.CO-03":
          "Informações são compartilhadas com partes interessadas internas e externas designadas.",
      },
      "RS.MI": {
        descricao: "Mitigação e Recuperação",
        "RS.MI-01": "Incidentes são contidos.",
        "RS.MI-02": "Incidentes são erradicados.",
      },
    },
  },

  RC: {
    introducao: `A categoria Recuperar do NIST Cybersecurity Framework (CSF) 2.0 tem como objetivo garantir que a organização consiga restabelecer rapidamente suas operações e serviços após um incidente de segurança cibernética. O foco da função Recuperar é minimizar os impactos de longo prazo, restaurar a normalidade dos negócios e melhorar a resiliência organizacional contra futuros incidentes, garantindo que a empresa esteja preparada para retornar a uma situação estável com o menor impacto possível.`,

    definicao_list: `Planejamento de Recuperação: Desenvolver e manter um plano de recuperação que inclua ações específicas para restaurar sistemas e serviços críticos após um incidente. Esse planejamento é vital para garantir que as etapas necessárias para a recuperação estejam claramente definidas, e que as equipes saibam como proceder para restabelecer operações sem causar maiores prejuízos ou interrupções desnecessárias.
Recuperação dos Serviços e Sistemas Impactados: Garantir a restauração dos serviços e sistemas que foram impactados pelo incidente de segurança. Isso pode envolver a recuperação de dados a partir de backups, a reinstalação de sistemas, a validação de que todos os componentes estão funcionando de maneira adequada, e a aplicação de atualizações para corrigir falhas que possam ter contribuído para o incidente.
Gestão da Comunicação Pós-Incidente: Estabelecer uma comunicação clara e eficaz com todas as partes interessadas durante o processo de recuperação. Isso inclui a notificação de clientes, fornecedores, parceiros e órgãos reguladores sobre o progresso da recuperação e o restabelecimento dos serviços. Uma comunicação aberta ajuda a manter a confiança e gerenciar as expectativas de todas as partes envolvidas.
Avaliação e Melhoria dos Processos de Recuperação: Após a recuperação dos sistemas e operações, é importante avaliar o processo de recuperação para identificar o que funcionou bem e o que pode ser melhorado. Esse aprendizado é essencial para ajustar os planos de recuperação e melhorar a eficácia das respostas em futuros incidentes. A organização deve aprender com cada evento para se tornar mais resiliente.
Documentação e Registros da Recuperação: Documentar todas as etapas e atividades realizadas durante o processo de recuperação é fundamental para criar um histórico detalhado do incidente e das ações tomadas. Esse registro pode ser usado para auditorias futuras, conformidade regulatória e para melhorar o planejamento de incidentes futuros. Documentar o processo de recuperação também ajuda a garantir que lições aprendidas sejam aplicadas para fortalecer as operações da organização.
Restaurar a Confiança e Reavaliar o Ambiente: Além de restaurar as operações técnicas, a recuperação também inclui a restauração da confiança dos clientes, dos colaboradores e de outras partes interessadas. Isso envolve assegurar que os sistemas agora são seguros e comunicar as melhorias feitas para evitar incidentes semelhantes no futuro. Reavaliar o ambiente pós-incidente é importante para garantir que as vulnerabilidades sejam corrigidas e que as medidas preventivas sejam aprimoradas.`,

    texto: `A função Recuperar é essencial para assegurar que a organização possa retomar suas operações de maneira ágil e coordenada após um incidente de segurança cibernética. Ela não apenas reduz os impactos de longo prazo de um ataque, mas também contribui para uma resposta mais resiliente e para o aprimoramento contínuo dos processos de segurança. A recuperação bem-sucedida garante que a organização esteja pronta para enfrentar novos desafios e demonstra a sua capacidade de lidar eficazmente com crises, fortalecendo a confiança interna e externa na sua infraestrutura de segurança.`,
    subcategorias: {
      "RC.RP": {
        descricao: "Planejamento de Recuperação",
        "RC.RP-01":
          "A parte de recuperação do plano de resposta a incidentes é executada uma vez iniciada a partir do processo de resposta a incidentes.",
        "RC.RP-02":
          "Ações de recuperação são selecionadas, dimensionadas, priorizadas e realizadas.",
        "RC.RP-03":
          "A integridade dos backups e outros ativos de restauração é verificada antes de usá-los para restauração.",
        "RC.RP-04":
          "Funções críticas de missão e gestão de riscos de cibersegurança são consideradas para estabelecer normas operacionais pós-incidente.",
        "RC.RP-05":
          "A integridade dos ativos restaurados é verificada, sistemas e serviços são restaurados, e o status operacional normal é confirmado.",
        "RC.RP-06":
          "O fim da recuperação de incidentes é declarado com base em critérios, e a documentação relacionada ao incidente é completada.",
      },
      "RC.RO": {
        descricao: "Comunicação e Coordenação na Recuperação",
        "RC.RO-03":
          "Atividades de recuperação e progresso na restauração das capacidades operacionais são comunicados a partes interessadas internas e externas designadas.",
        "RC.RO-04":
          "Atualizações públicas sobre a recuperação de incidentes são compartilhadas usando métodos e mensagens aprovados.",
      },
    },
  },
};
