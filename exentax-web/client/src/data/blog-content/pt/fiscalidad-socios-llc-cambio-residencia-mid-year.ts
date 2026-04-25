export default `Mudar de país de residência fiscal a meio de um exercício enquanto és membro de uma LLC americana é um dos cenários mais complicados de gerir bem. Não tanto pelo lado americano (a LLC continua a ser o que era), mas pela imputação de rendimentos a duas jurisdições no mesmo ano.

### Ponto de partida: a LLC não se move

A LLC é uma entidade dos EUA com domicílio próprio, EIN, compliance ao <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> e <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.

- **Form 5472 + 1120 pro-forma** apresentado para o exercício como sempre.
- **BOI Report** só actualiza se a informação pessoal reportada mudar.
- **Banca** (Mercury, Wise) actualiza-se com a nova morada após consumar a mudança.

O que muda: **onde declaras** os rendimentos atribuídos pela LLC.
### Determinação da residência fiscal a meio do ano

Critérios mais habituais:
- **Mais de 183 dias no país no ano civil**.
- **Centro de interesses económicos ou vitais**.
- **Domicílio fiscal** segundo registo administrativo.
### Duas abordagens: split-year vs ano inteiro

### Países split-year
Reino Unido, Países Baixos em parte: o exercício parte-se em dois. Mais simples e justo.

### Países de ano inteiro
Espanha, Alemanha, França (com nuances): és residente ou não para o ano completo. Pode gerar **dupla residência simultânea**; convenções desempatam.
### Tie-breaker rules

Pela ordem:
1. **Habitação permanente disponível**.
2. **Centro de interesses vitais**.
3. **Local habitual de permanência**.
4. **Nacionalidade**.
5. **Acordo amistoso**.

Aplicar correctamente exige documentação.
### Como tributa a LLC em cada tramo

SMLLC disregarded:
- **Durante residência A**: lucros atribuídos tributados no IR de A.
- **Durante residência B**: tributados no IR de B.
- **Sobreposição**: convenção A-B com tie-breakers.

Regra: por accrual, não por cash. Corte contabilístico na data da mudança.
## Casos típicos

### Espanha → Andorra a meio do ano
Espanha considera residência por ano civil completo se 183 dias. Andorra trata como parcial desde a chegada.

### Argentina → México a meio do ano
Regras diferentes; centro de interesses vitais essencial.

### Alemanha → Portugal com IFICI
Declaração alemã do período. Portugal desde inscrição, possivelmente IFICI.

### Para jurisdição sem tributação pessoal
EAU, Mónaco. Prova sólida da mudança efectiva.
### Erros típicos

- **Não documentar a data exacta**.
- **Assumir a mudança sem cumprir os critérios**.
- **Não informar as plataformas**: dispara incoerência CRS.
- **Deixar de apresentar o 5472** "porque já não vivo em Espanha" (a LLC continua).
- **Falta de coordenação entre assessores**: mesmo rendimento duplicado ou omitido.
### A fazer antes da mudança

- **Análise fiscal prévia**.
- **Documentação da mudança**: voo, contrato em destino, baixa em origem.
- **Planeamento de calendário** (semanas podem fazer grande diferença).
- **Coordenação com assessor em destino**.
- **Actualização ordenada de banca/plataformas**.
### Como o abordamos na Exentax

Na Exentax acompanhamos mudanças de residência com LLC com frequência. Agenda uma sessão inicial gratuita na nossa página de agendamento.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.

Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:banking-facts-v1 -->
## Factos bancários e fiscais a precisar

A informação sobre fintechs e CRS evolui; este é o estado atual:

### Notas por provedor

- **Mercury** opera com vários bancos parceiros com licença federal e cobertura **FDIC** via sweep network: principalmente **Choice Financial Group** e **Evolve Bank & Trust**, e ainda **Column N.A.** em algumas contas legadas. Mercury não é um banco; é uma plataforma fintech suportada por esses partner banks. Se a Mercury encerrar uma conta, o saldo é normalmente devolvido **por cheque em papel enviado para a morada registada do titular**, o que pode ser um problema operacional sério para não residentes; convém manter uma conta secundária (Relay, Wise Business, etc.) como contingência.
- **Wise** tem dois produtos claramente distintos: **Wise Personal** e **Wise Business**. Para uma LLC abre-se **Wise Business**, não a conta pessoal. A entidade europeia é **Wise Europe SA (Bélgica)**, que emite IBAN BE para EUR; os IBAN lituanos só persistem em contas europeias herdadas. **Wise Business titularidade de uma LLC dos EUA fica FORA do CRS** porque a titular é uma entidade dos EUA e os EUA não são jurisdição participante do CRS; o lado USD opera via Wise US Inc. (perímetro FATCA, não CRS). Apenas uma **Wise Personal aberta por um indivíduo residente fiscal numa jurisdição CRS** (p. ex. Espanha) é reportada via Wise Europe SA (Bélgica) sobre esse indivíduo.
- **Wallester** (Estónia) é uma entidade financeira europeia com licença EMI/banco emissor de cartões. As suas contas IBAN europeias **estão dentro da Norma Comum de Comunicação (CRS)** e geram, por isso, troca automática de informação para a administração fiscal do país de residência.
- **Payoneer** opera através de entidades europeias (Payoneer Europe Ltd, Irlanda) também **no âmbito do CRS** para clientes residentes em jurisdições participantes.
- **Revolut Business**: quando associado a uma **LLC norte-americana**, o esquema típico passa pela Revolut Payments USA; os IBAN europeus (lituanos, BE) **não são emitidos por defeito** a uma LLC, são emitidos a clientes europeus do banco europeu do grupo. Se lhe oferecerem um IBAN europeu, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram em recent years; eis o estado atual:
### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações IRS e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.
## Referências: fontes sobre estruturas e jurisdições

As comparações e dados quantitativos sobre as jurisdições citadas baseiam-se em fontes oficiais atualizadas a hoje:

- **Estados Unidos.** Delaware General Corporation Law e Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), instruções do IRS para o Form 5472 e IRC §7701 (classificação de entidades).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (IS a 10%), Llei 5/2014 del IRPF e regime de residência ativa/passiva do Govern d'Andorra.
- **Estónia.** Income Tax Act estónio (imposto diferido sobre lucros distribuídos a 20/22%) e documentação oficial do programa e-Residency.
- **Espanha.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 sobre residência e art. 100 sobre TFI) e regime especial de impatriados (art. 93 LIRPF, "Lei Beckham").
- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Pilar Dois (GloBE) e Modelo de Convenção OCDE com Comentários.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

A escolha de jurisdição depende sempre da residência fiscal real do titular e da substância económica da atividade; analise o seu caso específico antes de qualquer decisão estrutural.

<!-- exentax:execution-v2 -->
## Mudar de residência fiscal a meio do ano com uma LLC: o que quase ninguém planeia bem

Mudar a 1 de Janeiro é limpo. Fazê-lo a 17 de Junho com uma LLC activa abre cinco frentes ao mesmo tempo: rateio de rendimentos, duas declarações, exit tax se o seu país a aplica, redocumentação bancária e reset CRS. Eis o que convém ter resolvido antes.

- **Rateio e duas declarações.** A maioria das jurisdições tributa-o como residente do país A até à data de mudança e do país B a partir daí. Os rendimentos atribuídos pela LLC dividem-se por dias reais ou por critério de acréscimo, consoante a jurisdição. Documente a data exacta com bilhetes, contrato de arrendamento e empadronamento.
- **Exit tax e mais-valias latentes.** Portugal não aplica exit tax pessoal generalizado, mas Espanha (art. 95 bis), França (art. 167 bis), Alemanha (§6 AStG) sim acima de certos limiares. Uma participação em LLC com valor elevado pode despoletá-lo. Valorize antes, não depois.
- **Reset CRS e banca.** A sua LLC tem de actualizar a autodeclaração CRS na Mercury, Wise e todos os outros provedores com o novo país. Atrase-o e podem congelar a conta ou reportar ao país errado durante um ano inteiro.
- **CFC do novo país.** Chega a uma jurisdição com CFC diferente (Itália, Alemanha): a sua LLC pode já não ser neutra e precisar de reestruturação ou substância documentada adicional.

### O que mais nos perguntam

**Quando conta a data de mudança?** Depende do país: Portugal e Espanha contam a partir do dia 184 de presença ou centro de interesses vitais; Reino Unido aplica split-year treatment com regras próprias. Documente entrada e saída.

**Posso distribuir dividendos antes para poupar?** Às vezes sim, às vezes é exit tax encoberta. Modele o custo fiscal nos dois países antes de mover um euro - a ordem importa.

Na Exentax planeamos mudanças de residência a meio do ano com LLC activa: calendário fiscal óptimo, fluxos pré-mudança e documentação que aguenta sob ambas as inspecções.
<!-- /exentax:execution-v2 -->

<!-- exentax:cross-refs-v1 -->
### Leituras adicionais

- [LLC nos Estados Unidos: guia completo para não residentes](/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em)
<!-- /exentax:cross-refs-v1 -->
### Lembrete prático

Cada situação fiscal depende da sua residência, da atividade exercida e dos contratos em vigor. As informações aqui apresentadas são gerais e não substituem aconselhamento personalizado; analise o seu caso específico antes de tomar decisões estruturais.
## Como trabalhamos na Exentax

A nossa equipa é especializada em estruturas fiscais internacionais para residentes de países de língua espanhola que operam negócios online. Combinamos conhecimento local de Espanha, Andorra e América Latina com experiência operacional na constituição de entidades em Delaware, Wyoming, Estónia e outras jurisdições. Cada caso começa com uma consulta gratuita na qual avaliamos a residência, a atividade e os objetivos, e dizemos-lhe honestamente se a estrutura proposta faz sentido ou se uma alternativa mais simples é suficiente.
### Nota editorial

Este artigo é atualizado anualmente com as alterações regulatórias que afetam as estruturas abordadas. Se detetar uma referência desatualizada, escreva-nos e revê-la-emos no próximo ciclo editorial; mantemos a data de publicação visível no topo de cada artigo para total transparência.

  ### Mudança de residência fiscal a meio do ano: enquadramento português para sócios de LLC

  Para um sócio de LLC americana que altere a residência fiscal portuguesa a meio do ano, aplica-se desde a **Lei 82-E/2014** o regime do **art. 16.º, n.º 3 do CIRS** que prevê o **split-year**: a residência considera-se com início no dia da chegada e termo no dia da partida, repartindo as obrigações declarativas entre o período de residente (Modelo 3 IRS completo com Anexo J para rendimentos LLC) e o período de não residente (Categoria F/G isolada se aplicável).

  **Critérios de residência fiscal:** o **art. 16.º, n.º 1 do CIRS** define como residente quem (a) permaneça em território português mais de 183 dias no ano civil, (b) disponha de habitação que faça supor a intenção de a manter como residência habitual, (c) seja tripulante de navios/aeronaves ao serviço de entidades com residência/sede em PT, ou (d) desempenhe funções públicas no estrangeiro. A presunção de residência habitual cessa quando o sujeito demonstra a fixação noutro Estado.

  **RNH e IFICI (Lei 56/2023 — Mais Habitação):** o regime de **Residente Não Habitual** foi extinto para novas inscrições a partir de 01/01/2024, sendo substituído pelo **IFICI (Incentivo Fiscal à Investigação Científica e Inovação)** previsto no novo **art. 58.º-A do EBF**, com taxa especial de **20 %** durante 10 anos para rendimentos de atividades de elevado valor acrescentado constantes da **Portaria 12/2010** (atualizada).

  **Exit tax — art. 10.º-A do CIRS:** para residentes que cessem a residência fiscal portuguesa, aplica-se a tributação das mais-valias latentes em participações sociais (incluindo LLCs unipessoais ou com mais sócios), com possibilidade de **diferimento** até à efetiva alienação se o destino for um Estado da UE/EEE com troca de informações; para mudança para os EUA, aplica-se a tributação imediata salvo prestação de **garantia idónea** (art. 10.º-A, n.º 4).

  **CDI Portugal-EUA (Decreto 73/95 de 26/10):** o **art. 4.º** estabelece os critérios de tie-breaker (residência permanente → centro de interesses vitais → permanência habitual → nacionalidade → procedimento amigável). O **art. 23.º** prevê o método do **crédito de imposto** para evitar dupla tributação. A **Saving Clause do art. 1.º, n.º 3** confere aos EUA o direito de tributar os seus cidadãos e green-card holders independentemente da residência. **Conservação de documentos por 10 anos** (art. 130.º CIRS).

  **Brasil — quadro paralelo:** para sócios brasileiros, a **Lei 9.718/98** + **IN RFB 208/2002** prevêem a **Comunicação de Saída Definitiva (CSDP)** e a **Declaração de Saída Definitiva (DSDP)**, com tributação das mais-valias na data da saída segundo o art. 38 da IN.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Mudar%20de%20pa%C3%ADs%20de%20resid%C3%AAncia%20fiscal%20a%20meio%20de%20um%20exerc%C3%ADcio%20enquanto%20%C3%A9s%20membro%20%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
