export default `
O CRS movimenta saldos bancários entre mais de 120 países desde 2017, e um residente fiscal em Espanha com conta em Andorra, Suíça ou México vê esses dados chegar à Agência Tributária todo setembro.

O Common Reporting Standard (CRS) é a peça mais importante da fiscalidade internacional da última década, e muito poucas pessoas compreendem o que significa para alguém que tenha uma <a href="/pt/blog/llc-estados-unidos-guia-completo-nao-residentes-2026">LLC americana</a> ou contas fora do seu país de residência. Vamos desmontar o tema com precisão técnica e sem alarmismo.

Este artigo foi pensado a partir de Espanha e América Latina, mas toca numa ferida que afeta diretamente quem vive em **Portugal** ou no **Brasil**: a partir do momento em que tem uma LLC com conta em USD ou uma conta aberta fora do seu país de residência, surgem obrigações acessórias que muita gente só descobre com o primeiro aviso. Em Portugal são, no mínimo, o **Anexo J do IRS** (rendimentos obtidos no estrangeiro, incluindo juros, dividendos e mais-valias da LLC), o **Modelo 58 do Banco de Portugal** (comunicação de operações e posições com o exterior), a indicação obrigatória das contas de depósito ou de títulos abertas em entidades não residentes no Anexo J e, conforme o caso, a inclusão de criptoativos detidos no estrangeiro. Para quem reside no **Brasil**, soma-se a Declaração de Capitais Brasileiros no Exterior (DCBE) do Banco Central, a Declaração do Imposto sobre a Renda da Pessoa Física com a ficha de Bens e Direitos no exterior e o regime e-Financeira/DIRF nos casos aplicáveis. A lógica CRS que descrevemos aqui é a mesma; o que muda é o formulário local que tem de preencher para estar em ordem.

## O que é o CRS e porque existe

O **Common Reporting Standard** foi aprovado pelo Conselho da OCDE em julho de 2014, em resposta ao G20, depois da crise financeira e dos grandes escândalos de evasão fiscal (LuxLeaks, Panama Papers). O objetivo é claro: as administrações fiscais dos países aderentes trocam automaticamente informação sobre contas financeiras de não residentes.

A nível técnico, o CRS generaliza a mais de cem jurisdições o modelo anterior (FATCA), mas em base multilateral em vez de bilateral. Espanha transpô-lo através do Real Decreto 1021/2015 e da Orden HAP/1695/2016, que regulam o **Modelo 289** (declaração informativa anual de contas financeiras de não residentes que as instituições financeiras espanholas remetem à AEAT, e que Espanha recebe em sentido inverso a partir dos restantes países aderentes).

Na América Latina foi implementado, entre outros, no México (desde 2017), Argentina, Colômbia, Chile, Brasil, Uruguai, Panamá, Peru, Costa Rica, Equador e República Dominicana. Os Estados Unidos, ponto essencial, **não aderiram ao CRS**. Têm o seu próprio sistema (FATCA), bilateral e apenas de saída, não de entrada. Aprofundamos isto no nosso artigo sobre <a href="/pt/blog/as-contas-bancarias-americanas-reportam-a-sua-autoridade">se as contas bancárias americanas reportam à sua autoridade fiscal</a> e, para perceber porque também não assinarão a nova versão, em <a href="/pt/blog/crs-2-0-carf-por-que-os-eua-nunca-vao-assinar-llc">CRS 2.0 e CARF: porque os EUA nunca vão assinar</a>.

### Quadro normativo

- **OCDE**: Common Reporting Standard, julho de 2014. Texto consolidado e comentários oficiais.
- **UE**: Diretiva 2011/16/UE de cooperação administrativa (DAC), alterada pela DAC2 (Diretiva 2014/107/UE), que incorpora o CRS no direito da União.
- **Espanha**: Real Decreto 1021/2015, Orden HAP/1695/2016, Orden HAC/3625/2003 (Modelo 720), Orden HFP/886/2023 (Modelo 721 sobre criptoativos detidos no estrangeiro).
- **Multilateral Competent Authority Agreement (MCAA)**: o instrumento da OCDE pelo qual cada país ativa a troca bilateral com cada um dos restantes. Espanha tem ativada a troca com praticamente toda a UE e com a maior parte das jurisdições aderentes.

## Que informação é exatamente reportada

Cada **Reporting Financial Institution** (banco, broker, fintech com licença bancária, fundo de investimento, companhia de seguros com produtos de investimento) que detete um titular cuja residência fiscal seja diferente do país onde a conta está aberta deve reportar:

| Categoria | Detalhe |
| --- | --- |
| Dados do titular | Nome, morada, país de residência fiscal, NIF/TIN, data e local de nascimento (pessoas singulares) |
| Dados da entidade | Nome, NIF, país. Em contas tituladas por **NFE passivas**, também os dados dos **beneficiários efetivos** controladores |
| Dados da conta | Número de conta, nome e número identificativo da instituição financeira |
| Saldos | Saldo ou valor ao fim do ano civil (ou ao fecho da conta se cancelada durante o ano) |
| Rendimentos | Juros brutos, dividendos brutos, outros rendimentos, receitas brutas por venda ou reembolso de ativos financeiros (contas de custódia) |

Este fluxo é anual, normalmente entre maio e setembro do ano seguinte ao exercício reportado, e é cruzado com as declarações do contribuinte (em Espanha: IRPF, Modelo 720 e, após a última reforma, Modelo 721 para criptoativos; em Portugal: IRS com Anexo J e Modelo 58 do BdP).

## O que se passa com a sua LLC americana: a nuance que quase ninguém explica

É aqui que aparecem os mal-entendidos. Vamos fixar conceitos:

1. **Os EUA não enviam dados via CRS.** Nem a Mercury, nem a Relay, nem um banco regional americano enviarão dados diretamente à AEAT, ao SAT, à DIAN, à AFIP ou à AT portuguesa via CRS. O que os EUA fazem é FATCA, que é **unilateral de saída**: pede dados a entidades estrangeiras sobre contas de US persons, mas não envia automaticamente dados equivalentes em sentido inverso (fá-lo nalguns casos via IGAs Modelo 1, mas com alcance muito inferior ao do CRS).
2. **As suas contas em fintech europeias em nome da LLC SÃO reportadas.** Wise (Bélgica), Revolut (Lituânia, e Reino Unido com regime próprio pós-Brexit), N26 (Alemanha) e Wallester (Estónia) são entidades financeiras sujeitas a CRS nas respetivas jurisdições. Se a titular é a sua LLC e o **beneficiário efetivo** é residente fiscal em Portugal, Espanha ou na América Latina, esses dados chegam à sua administração fiscal. Desenvolvemo-lo a fundo nos artigos dedicados a <a href="/pt/blog/revolut-business-e-crs-o-que-e-reportado-a-sua-autoridade">Revolut e CRS</a> e <a href="/pt/blog/wise-business-e-crs-o-que-e-reportado-a-sua-autoridade">Wise e CRS</a>.
3. **A sua LLC é provavelmente uma NFE passiva (Passive NFE)**, salvo se demonstrar atividade operativa real (mais de 50% dos seus rendimentos são operativos e não rendas passivas como dividendos, juros, rendas ou royalties não associados a uma exploração). No caso típico de um trabalhador independente com uma Single-Member LLC que fatura serviços, há debate doutrinal: uma leitura literal do CRS classificá-la-ia como Active NFE (negócio operativo), mas a fintech europeia típica classifica-a como Passive NFE por prudência, o que **obriga ao reporte dos controlling persons**. Esta nuance escapa a quase toda a gente.

### Como se determina a residência fiscal para efeitos de CRS

A instituição financeira aplica uma **due diligence** (RD 1021/2015 e Anexo I do CRS) baseada na autodeclaração do titular mais indícios objetivos: morada postal, número de telefone, IP recorrente, NIF declarado, instrução de transferência repetida para contas noutro país, procurações outorgadas a residentes noutro país.

Se a sua autodeclaração diz "residência fiscal em Andorra" mas o seu IP, morada de envio do cartão e transferências recorrentes apontam para Lisboa ou Madrid, a instituição pode pedir **documentação adicional** (certificado de residência fiscal emitido pela autoridade competente, contrato de arrendamento, etc.) ou, em caso de dúvida, reportar a ambas as jurisdições. Mentir na autodeclaração CRS é uma infração tributária na maioria das jurisdições e pode ter consequências penais se concorrer com quotas defraudadas relevantes.

## Implicações reais em Portugal (Anexo J do IRS e Modelo 58 do Banco de Portugal)

Se for residente fiscal em Portugal nos termos do art. 16.º do CIRS (mais de 183 dias no território nacional, ou habitação que faça presumir intenção de residência habitual) e tiver:

- **Contas de depósito ou de títulos abertas em instituição financeira não residente** (incluindo as IBAN europeias da Wise, Revolut, N26, Wallester ou as contas USD da sua LLC na Mercury, Relay, Choice Financial Group): obrigação de **identificar a existência da conta** no Anexo J da declaração Modelo 3 do IRS, com indicação do IBAN/identificador, do código de país e do saldo a 31 de dezembro. Não há limiar mínimo: é obrigatório a partir do primeiro euro.
- **Rendimentos da sua LLC americana** (juros das contas Mercury/Wise, dividendos, mais-valias, rendimentos da actividade): Categoria E (capitais), F (prediais se houver imóvel), G (mais-valias) ou B (independentes, se a LLC realizar a sua actividade profissional como trabalhador independente português) consoante a qualificação. A LLC unipessoal é tratada pela AT como entidade fiscalmente transparente; os rendimentos são imputados directamente ao sócio residente, com **crédito de imposto** pelo IRS retido nos EUA, nos termos da Convenção para Evitar a Dupla Tributação entre Portugal e os EUA (CDT 1994) e do art. 81.º do CIRS.
- **Comunicações ao Banco de Portugal — Modelo 58**: se realizar operações com o exterior superiores a determinados limiares (atualmente 100 000 € por transação ou posição agregada superior a 1 000 000 €), tem obrigação de comunicar mensalmente ao **Banco de Portugal** as operações e posições com o exterior através do Sistema COPE (Comunicação de Operações e Posições com o Exterior). Verifique os limiares vigentes no Aviso do BdP correspondente.
- **Contribuição extraordinária e regime do RNH**: Após a reforma do regime fiscal do **Residente Não Habitual (RNH)** em 2024 (com fim do regime para novos inscritos a partir de 2024 e transição para o IFICI), os rendimentos da LLC americana passam a tributar nos termos gerais do CIRS para a maioria dos contribuintes, sem a taxa fixa de 20% que se aplicava sob o RNH clássico. Para inscritos antes de 31/03/2025 com direitos adquiridos, validar o tratamento caso a caso.

A AT cruza os ficheiros CRS recebidos via DGCI com a declaração Modelo 3 do IRS e com as comunicações do Banco de Portugal. As omissões deixaram de passar despercebidas. A **denúncia espontânea** prevista no art. 22.º do **RGIT** (Regime Geral das Infrações Tributárias) antes de qualquer ato inspetivo da AT permite reduzir a coima e excluir a responsabilidade penal por fraude fiscal (art. 103.º do RGIT) se o imposto em falta for pago.

### Implicações reais no Brasil

- **Declaração de Capitais Brasileiros no Exterior (DCBE)**: o residente fiscal brasileiro com posição de **valor igual ou superior a USD 1 000 000** em ativos no exterior a 31 de dezembro está obrigado a declarar anualmente ao **Banco Central do Brasil (BACEN)** via sistema CBE. Posições superiores a USD 100 milhões obrigam a declaração trimestral. Multas por omissão podem chegar aos 250 000 BRL (Resolução BCB 278/2022).
- **Declaração do Imposto sobre a Renda da Pessoa Física (DIRPF)**: a ficha **Bens e Direitos** exige listar a participação na LLC, o saldo das contas no exterior e os ativos detidos pela LLC, em BRL convertidos pela taxa do Banco Central a 31 de dezembro. Os rendimentos são tributados na **ficha de Rendimentos Recebidos do Exterior** com aplicação do **carnê-leão mensal** sobre o ganho.
- **e-Financeira e DIRF**: as instituições financeiras brasileiras reportam à RFB via e-Financeira; reciprocamente, a RFB recebe o flow CRS desde 2018 e cruza-o com a DIRPF. As omissões geram lançamento de ofício com multa de 75% (ou 150% nos casos qualificados) sobre o imposto devido. E se chegar uma notificação, na Exentax mantemos o dossiê pronto para responderes em horas, não em semanas.

## Como planear corretamente

A conclusão técnica é o oposto do que muito influencer diz: **uma LLC americana bem estruturada com banca exclusivamente em Mercury ou Relay (EUA) tem uma pegada CRS mínima**, porque os EUA não exportam dados via CRS. Mas a partir do momento em que adiciona uma camada europeia (Wise, Revolut, Wallester, N26), aceita que essa informação chegue à sua autoridade fiscal. Não é bom nem mau: simplesmente é assim, e planear exige conhecê-lo.

A estratégia profissional passa por:

1. **Declarar corretamente.** O cruzamento já existe; tentar esconder é perder tempo e expor-se a sanções.
2. **Desenhar a estrutura para que o declarado seja fiscalmente eficiente.** Implica decidir país de residência, instrumentos de investimento, calendário de remessas, deduções aplicáveis e Convenção para Evitar a Dupla Tributação aplicável. Veja o nosso <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">framework de desenho de estrutura internacional</a>.
3. **Manter documentação**: contratos, faturas, justificativos de despesa, livros contabilísticos da LLC, autodeclarações CRS coerentes. Sem documentação, uma inspeção inverte de facto o ónus da prova para o contribuinte. Na Exentax fechámos sem sanção clientes exatamente nesta situação. Falar cedo compensa — e poupa-te cinco dígitos.
4. **Conhecer os riscos de não o fazer bem.** Cobrimo-lo em <a href="/pt/blog/riscos-fiscais-de-uma-ma-estruturacao-internacional">riscos fiscais de uma má estruturação internacional</a>.
5. **Compreender a sua atividade económica.** Não tributa igual uma LLC de serviços que uma de e-commerce ou royalties. Desenvolvemo-lo em <a href="/pt/blog/tributacao-da-llc-segundo-a-atividade-economica-servicos">tributação da LLC segundo a atividade económica</a>.

## Erros típicos que vemos todas as semanas em Portugal e no Brasil

- "Como a Mercury está nos EUA, ninguém fica a saber." Verdade para a Mercury face ao CRS — os EUA não exportam dados por CRS — mas falso para as suas contas Wise (Bélgica), Revolut (Lituânia), Wallester (Estónia) ou N26 (Alemanha) em nome da mesma LLC, que chegam à AT portuguesa ou à RFB brasileira via fluxo CRS automático.
- "Coloquei residência fiscal no Dubai, em Andorra ou no regime fiscal de uma jurisdição de baixa tributação mas continuo a viver em Lisboa ou em São Paulo." A residência fiscal não se escolhe; determina-se por factos objectivos: em **Portugal**, art. 16.º do CIRS (mais de 183 dias, ou habitação habitual em Portugal); no **Brasil**, art. 12 da Lei 9.250/95 (residência habitual em território brasileiro, ou exercício de actividade profissional em carácter estável). Desenvolvemo-lo no nosso artigo sobre a <a href="/pt/blog/nomade-digital-onde-pagar-impostos-e-como-escolher-a">residência fiscal do nómada digital</a>.
- "Se a minha LLC fatura, não me acontece nada." A **AT portuguesa** pode aplicar a **cláusula geral anti-abuso (CGAA, art. 38.º LGT)** ou requalificar a LLC como estabelecimento estável de facto se for gerida desde Portugal sem substância nos EUA. No **Brasil**, a RFB aplica a **Lei 12.973/2014 (regime de tributação de lucros no exterior, TBU)** que tributa os lucros da controlada estrangeira independentemente da distribuição. Embora os EUA não sejam jurisdição de tributação favorecida nos termos da IN RFB 1.037/2010, a LLC pass-through pode ativar requalificações pela mecânica de Disregarded Entity. O planeamento tem de evitar esse caso, não ignorá-lo.
- "Vou pôr a conta em nome de um familiar." É o clássico testa-de-ferro disfarçado, qualificado em Portugal como fraude fiscal (art. 103.º do RGIT) e no Brasil como sonegação fiscal (Lei 8.137/90), com implicações penais e fiscais que analisamos em <a href="/pt/blog/proprietarios-ficticios-para-llcs-por-que-e-ilegal-e-os">testas-de-ferro e proprietários fictícios em LLC</a>.

## Em resumo

O CRS não se "evita" a partir de uma jurisdição europeia. Planeia-se com conhecimento. Uma LLC americana continua a ser uma ferramenta extraordinariamente útil, mas o desenho da sua arquitetura bancária e da sua residência fiscal são determinantes para que a pegada informativa que gera seja coerente com aquilo que declara.

Antes de avançar, põe números ao teu caso: a <a href="/pt#calculadora">calculadora Exentax</a> compara, em menos de 2 minutos, a tua carga fiscal atual com a que terias com uma LLC americana corretamente declarada no teu país de residência.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

Quer que vejamos como o CRS o afeta no seu caso concreto e desenhemos a arquitetura adequada? Reserve a sua consulta gratuita e analisamo-lo consigo.
Se ainda tiver dúvidas sobre as nuances desta estrutura, <a href="/pt/blog/por-que-freelancers-espanhois-estao-deixando-o-trabalho">porque deixar de ser trabalhador independente em Espanha (e que alternativas tem)</a> explica em detalhe um aspeto adjacente que costumamos deixar para outro dia.

_Veja também: [empresa no Panamá: fiscalidade e residência](/pt/blog/empresa-no-panama-fiscalidade-e-residencia-2026)._

<!-- related-inline-stripped-2026-04 -->

### Próximos passos

Se quiser validar se esta estratégia encaixa na sua situação concreta, na Exentax revemos o seu caso de forma personalizada e propomos a estrutura legal e eficiente que realmente lhe convém. Reserve uma sessão inicial sem compromisso a partir da nossa página de contacto.

<!-- exentax:banking-facts-v1 -->
## Factos bancários e fiscais que convém precisar

A informação sobre fintech e CRS evolui; aqui o estado atual, tal como está hoje:

### Notas por fornecedor

- **Mercury** opera com vários bancos parceiros com licença federal e cobertura **FDIC** via sweep network: principalmente **Choice Financial Group** e **Evolve Bank & Trust**, além de **Column N.A.** em alguns casos herdados. A Mercury não é um banco; é uma plataforma fintech apoiada nesses partner banks. Se a Mercury fechar uma conta, o saldo é normalmente devolvido **por cheque em papel enviado para a morada registada do titular**, o que pode ser um problema operacional sério para não residentes; convém manter uma conta secundária ativa (Relay, Wise Business, etc.) como contingência.
- **Wise** distribui dois produtos claramente diferentes: **Wise Personal** (conta pessoal) e **Wise Business** (conta de empresa, incluindo para a sua LLC). Para uma LLC deve abrir **Wise Business**, não a conta pessoal. Nuance CRS importante: uma **Wise Business titulada por uma LLC americana fica fora do CRS** porque a titular é uma entidade dos EUA e os EUA não são jurisdição CRS; o lado USD opera via Wise US Inc. (perímetro FATCA, não CRS). Em contrapartida, uma **Wise Personal aberta por um residente fiscal em Portugal**, em Espanha ou noutra jurisdição CRS **gera reporte CRS** via Wise Europe SA (Bélgica) sobre essa pessoa. Abrir Wise para a sua LLC não o inclui no CRS pela LLC; se mantiver adicionalmente uma Wise Personal em seu nome como residente CRS, essa segunda conta reporta.
- **Wallester** (Estónia) é uma entidade financeira europeia com licença EMI/banco emissor de cartões. As suas contas IBAN europeias **estão dentro do Common Reporting Standard (CRS)** e geram, portanto, reporte automático à administração tributária do país de residência do titular.
- **Payoneer** opera através de entidades europeias (Payoneer Europe Ltd, Irlanda) que também estão **no perímetro CRS** para clientes residentes em jurisdições participantes.
- **Revolut Business**: quando associado a uma **LLC norte-americana**, opera sob **Revolut Technologies Inc.** com **Lead Bank** como banco parceiro nos EUA. A conta entregue é uma conta dos EUA (routing + account number); **não é emitido IBAN europeu** a uma LLC. Os IBAN europeus (lituanos, BE) são da **Revolut Bank UAB** e são emitidos a clientes europeus do grupo. Se lhe oferecerem um IBAN europeu associado à sua LLC, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vive num país com CFC, transparência fiscal ou imputação de rendimentos. O que consegue é **não duplicar tributação** e **declarar corretamente em residência**, não eliminá-la.

<!-- exentax:legal-refs-v1 -->
## Referências: quadro legal e regulamentação

A argumentação deste artigo assenta na seguinte regulamentação e doutrina, atualmente em vigor:

- **Espanha.** Lei 35/2006 do IRPF (arts. 8, 9 e 91 sobre residência fiscal e transparência fiscal internacional), Lei 27/2014 do Imposto sobre Sociedades (art. 100 sobre TFI), Lei 58/2003 Geral Tributária, Lei 5/2022 que reformou o Modelo 720 após o acórdão TJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 e 720) e Orden HFP/887/2023 (Modelo 721 sobre criptoativos no estrangeiro).
- **Doutrina administrativa.** Resoluções do TEAC e consultas vinculativas da DGT relativas a LLC unipessoais (entre outras V0443-08, V1631-17, V1147-22), interpretadas à luz do BOE de fevereiro de 2020 sobre classificação de entidades estrangeiras transparentes.
- **Convenções e regulamentação internacional.** Convenção para Evitar a Dupla Tributação entre Espanha e EUA, assinada em 1990 com Protocolo de 2013 em vigor desde 2019, Diretiva 2011/16/UE alterada pela DAC6, DAC7 e DAC8, e Modelo de Convenção da OCDE com os seus Comentários.
- **EUA.** Treas. Reg. §301.7701-3 (classificação check-the-box), IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) e regulamentação FBAR (31 CFR 1010.350).

Este conteúdo é divulgativo e não substitui aconselhamento personalizado para a sua situação fiscal concreta.

<!-- exentax:execution-v2 -->
## O que o CRS significa hoje para residentes em Portugal e no Brasil

O CRS funciona em piloto automático: mais de 110 jurisdições trocam dados todos os setembros sobre saldos a 31 de dezembro do ano anterior. Se for residente fiscal em Portugal ou no Brasil, os bancos onde tem contas no estrangeiro já estão a reportar à AT portuguesa via DGCI ou à Receita Federal do Brasil via e-Financeira/CRS. Isto é o que importa entender, sem paranoia.

- **O que se reporta.** Saldos de conta a 31 de dezembro, rendimentos brutos do ano (juros, dividendos), nome do titular, residência fiscal declarada ao banco e, para entidades transparentes, dados do controlling person. A informação chega ao país de residência e é cruzada com a declaração fiscal do contribuinte.
- **O que não se reporta.** Movimentos detalhados da conta, contrapartes específicas, informação transacional. CRS é saldos + rendimentos brutos + identificação; não é rastreabilidade de cada operação. A perceção de "sabem tudo" é exagerada à letra mas certa em consequência: com saldos e rendimentos brutos constrói-se a presunção suficiente para abrir um pedido de informação.
- **Espanha, Modelo 720 e Modelo 721.** O residente fiscal espanhol tem obrigação própria de declarar contas no estrangeiro (>50 000 € combinado, Modelo 720) e criptoativos no estrangeiro (>50 000 €, Modelo 721). Não depende do CRS, depende da sua obrigação. O CRS apenas ajuda a AEAT a cruzar e a detetar omissões.
- **LATAM — ritmos diferentes.** O México (SAT) troca desde 2018 com cobertura extensa; a Colômbia (DIAN) desde 2017 com depuração progressiva; o Chile (SII) desde 2018; a Argentina (AFIP) desde 2018, com uso operacional ainda em construção; o Uruguai ativo, mas com regime de tax haven que matiza o fluxo nos dois sentidos. A intensidade do uso do dado varia, mas a disponibilidade é hoje generalizada.

### O que mais nos perguntam

**Se tenho a Mercury na minha LLC, o meu país sabe via CRS?** Não diretamente: os EUA não participam no CRS. O que entra no fluxo são as contas Wise (via Bélgica) e, se a LLC operasse a partir de um banco europeu ou asiático, esses também. A Mercury fica fora do fluxo automático, não fora de toda a obrigação declarativa.

**Como regularizo se passei anos sem declarar?** Com declaração complementar do 720 ou 721 antes que chegue um pedido de informação. O acórdão TJUE C-788/19 limitou as multas espanholas; pode regularizar a um custo muito menor do que há cinco anos. Avaliamos caso a caso.

Na Exentax mapeamos quais das suas contas entram no CRS, que obrigações declarativas cada uma ativa e desenhamos a entrada limpa ou a regularização ordenada, quando aplicável.
<!-- /exentax:execution-v2 -->

## Vamos falar da sua estrutura

Cada caso tem nuances: o seu país de residência, o tipo de atividade, onde estão os seus clientes, se faz investimento ou trading, se vende a particulares ou a empresas. Na Exentax revemos a sua situação, desenhamos a estrutura LLC que lhe encaixa e acompanhamo-lo todos os anos na manutenção. Reserve uma consulta com a nossa equipa e começamos por entender os seus números reais.

<!-- exentax:cross-refs-v1 -->
### Mais leituras relacionadas

- [Estruturas offshore: benefícios reais e riscos honestos](/pt/blog/estruturas-offshore-beneficios-e-riscos-reais)
- [De single-member a multi-member LLC: implicações fiscais reais antes de dar o passo](/pt/blog/de-single-member-a-multi-member-llc-implicacoes-fiscais)
- [Exit Tax em Espanha: imposto de saída para investidores em cripto, LLC e Interactive Brokers](/pt/blog/exit-tax-espanha-llc-cripto-interactive-brokers)
<!-- /exentax:cross-refs-v1 -->

Quer aplicar este protocolo ao seu caso? <a href="/pt/agendar">Reserve uma sessão com a equipa Exentax</a> e revemos a sua LLC com números reais em trinta minutos, sem compromisso.

<!-- exentax:defensa-fiscal-v1 -->
## E se as Finanças me perguntarem pela minha LLC?

  É a pergunta mais frequente na primeira consulta, e a resposta curta é: a tua LLC não é opaca e, corretamente declarada, uma inspeção fecha-se em formulários standard. As Finanças portuguesas, a Receita Federal brasileira ou a SEFAZ estadual podem pedir o Certificate of Formation do estado (Wyoming, Delaware ou Novo México), o EIN emitido pelo <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o Operating Agreement assinado, os extratos da Mercury ou Wise do exercício, o Form 5472 com 1120 pro-forma apresentado e a contabilidade que reconcilia receitas, despesas e movimentos. Se tudo isso existir e for entregue ordenado, a inspeção não escala. Fechamos isto contigo a partir da Exentax: uma chamada, submissão feita, ficheiro pronto, o risco fica no papel.

  O que as autoridades fiscais perseguem com razão são os testas-de-ferro, a residência fiscal de papel e a não declaração de contas estrangeiras. Uma LLC bem montada é exatamente o contrário: tu apareces como **beneficial owner** no BOI Report quando aplicável (verificável em <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tu assinas as contas bancárias e declaras o rendimento onde efetivamente vives. A estrutura está registada no Secretary of State do estado, nos ficheiros do IRS e, sempre que envolve um banco europeu, dentro do perímetro CRS do padrão da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  O erro que descarrila mesmo uma inspeção não é ter uma LLC; é não ter atribuído o rendimento corretamente no IRS pessoal (Anexo J do Modelo 3 em Portugal, Carnê-Leão Web e DAA no Brasil), não ter declarado as contas no estrangeiro (Modelo 58 ao Banco de Portugal a partir de 1 milhão €, DCBE ao Bacen a partir de 1 milhão USD) ou não ter documentado as operações entre o sócio e a LLC. Esses três frentes fecham-se antes do pedido, não depois. É aqui que entra a Exentax: apresentamos o formulário, arquivamos o comprovativo e, se a administração perguntar, a resposta já está pronta.

  ## O que uma LLC NÃO faz

  - **Não te isenta de tributar no teu país de residência.** Se vives em Portugal ou no Brasil, tributas aí o rendimento mundial. A LLC organiza o lado americano (zero imposto federal na SMLLC pass-through sem ECI); não desliga a tributação doméstica. O IRS é calculado sobre o lucro atribuído, não sobre as distribuições efetivamente recebidas.
  - **Não é um veículo offshore nem um esquema BEPS.** É uma entidade americana reconhecida pelo IRS, registada num estado concreto com morada física, agente registado e obrigações informativas anuais. Jurisdições offshore clássicas (BVI, Belize, Seychelles) não deixam rasto público; uma LLC deixa em cinco sítios.
  - **Não te protege se houver confusão patrimonial.** O *pierce the corporate veil* aciona-se assim que um juiz vê a LLC e o sócio funcionarem como a mesma carteira: contas misturadas, despesas pessoais pagas pela LLC, sem Operating Agreement, sem contabilidade. Três movimentos suspeitos bastam. Ver também jurisprudência comparada espanhola publicada no <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> sobre abuso de direito.
  - **Não te poupa contribuições para a Segurança Social.** Recibos verdes em Portugal, MEI ou autônomo no Brasil: a quota mensal continua a ser a mesma. A LLC opera a atividade face a clientes internacionais; a contribuição pessoal é independente.
  - **Não te dispensa de declarar as contas estrangeiras.** Portugal: Anexo J do Modelo 3 IRS + Modelo 58 ao BdP. Brasil: DCBE ao Bacen + e-Financeira via instituição financeira. Essas obrigações são da pessoa, não da LLC.

  Na Exentax fechamos estas cinco frentes todos os anos em paralelo com o calendário federal americano (Form 5472, 1120 pro-forma, FBAR, Annual Report estadual, BOI Report quando aplicável). O objetivo é que nenhuma inspeção encontre uma ponta solta e que a estrutura aguente uma revisão retroativa a 5-7 anos.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Precisa falar agora? Ligue-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreva-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20venho%20do%20artigo%20%22crs%20para%20residentes%20em%20espanha%20e%20latam%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje mesmo.</p>

Se preferir falar em direto, <a href="/pt/agendar">reserve uma sessão gratuita</a> e revemos o seu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
