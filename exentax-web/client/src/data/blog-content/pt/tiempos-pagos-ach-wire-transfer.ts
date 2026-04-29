export default `A partir de Portugal e do Brasil, estamos habituados às SEPA em 1 dia útil ou ao PIX em segundos. Nos EUA, o sistema funciona a outro ritmo: ACH demora 1-3 dias, Wire sai no próprio dia mas custa 15-35 USD, e RTP/FedNow ainda estão a chegar às fintechs. Perceber estes tempos evita atrasar pagamentos a fornecedores apenas por desconhecimento.

Vamos colocar todos os prazos na mesa para que não haja surpresas.

## ACH (Automated Clearing House)

ACH é o sistema de transferências domésticas dos EUA. É o método mais comum e o mais barato (geralmente grátis).

### Prazos do ACH

| Tipo | Prazo |
|---|---|
| ACH Standard | **1-3 dias úteis** |
| ACH Same-Day | **Mesmo dia** (se iniciado antes das 2:45pm ET) |
| ACH Next-Day | **Próximo dia útil** |

**Importante:** Os dias úteis são de segunda a sexta (sem feriados federais dos EUA). Se enviar um ACH na sexta à tarde, não chegará até segunda ou terça.

### Fatores que afetam o prazo

- **Hora de envio**: se enviar após o horário de corte (cut-off equipa), é processado no próximo dia útil
- **Banco receptor**: alguns bancos retêm os fundos ACH 1-2 dias adicionais para verificação
- **Primeira transferência**: a primeira vez que envia dinheiro para uma nova conta pode demorar mais por verificação de segurança
### Wire Transfer doméstico

Os wires domésticos (dentro dos EUA) são mais rápidos que ACH, mas têm custo.

### Prazos do Wire doméstico

| Tipo | Prazo |
|---|---|
| Wire doméstico standard | **Mesmo dia** (2-6 horas) |
| Wire doméstico urgente | **1-2 horas** |

Os wires domésticos costumam chegar em **horas**, não em dias. Por isso são usados para pagamentos urgentes ou valores grandes.
## Wire Transfer internacional (SWIFT)

Os wires internacionais usam a rede SWIFT e passam por bancos intermediários, o que os torna mais lentos.

### Prazos do Wire internacional

| Rota | Prazo |
|---|---|
| EUA → Europa | **1-3 dias úteis** |
| EUA → América Latina | **2-5 dias úteis** |
| EUA → Ásia | **2-4 dias úteis** |

### Por que demoram mais?

- **Bancos intermediários**: o dinheiro pode passar por 1-3 bancos intermediários antes de chegar ao destino
- **Fusos horários**: se o banco receptor já fechou, a transferência é processada no próximo dia útil
- **Compliance checks**: as transferências internacionais passam por controles antifraude e antilavagem
### Wise Business

Wise não usa a rede SWIFT para a maioria das transferências. Usa contas locais em cada país, o que reduz prazos e custos.

### Prazos no Wise

| Rota | Prazo |
|---|---|
| USD → EUR (SEPA) | **1-2 dias úteis** |
| USD → GBP | **1 dia útil** |
| USD → MXN | **1-2 dias úteis** |
| USD → COP | **1-3 dias úteis** |
### Comparativo geral

| Método | Prazo | Custo (Mercury) | Melhor para |
|---|---|---|---|
| ACH | 1-3 dias | Grátis | Pagamentos domésticos não urgentes |
| Wire doméstico | Mesmo dia | **$0 no Mercury** | Pagamentos urgentes dentro dos EUA |
| Wire internacional | 1-5 dias | **$0 no Mercury** | Pagamentos internacionais grandes |
| Wise | 1-2 dias | 0,4-1,5% | Pagamentos internacionais frequentes |
| Stripe/PayPal payout | 2-3 dias | Incluído | Cobranças a clientes |
## Dicas para acelerar seus pagamentos

- **Inicie as transferências cedo**: antes das 2pm hora do leste dos EUA. Após o cut-off, é processado no próximo dia útil
- **Evite sextas e feriados**: as transferências não são processadas em fins de semana. Um ACH iniciado na sexta chega na terça no mínimo
- **Use ACH Same-Day** quando precisar de velocidade sem custo de wire. está disponível no Mercury sem custo adicional
- **Consolide envios internacionais**: um wire grande sai mais barato que vários pequenos. E com Mercury, os wires são $0 de qualquer forma
- **Use Wise para pagamentos recorrentes**: mais rápido e mais barato que wires tradicionais para valores médios, graças à sua rede de contas locais

Para fechar, leituras relacionadas que encaixam naturalmente ao lado deste artigo: <a href="/pt/blog/seu-primeiro-mes-com-uma-llc-americana-o-que-esperar-semana">Seu primeiro mês com uma LLC americana: o que esperar semana a semana</a> e <a href="/pt/blog/trocar-divisas-para-sua-llc-melhores-opcoes-e-como-evitar">Trocar divisas para sua LLC: melhores opções e como evitar taxas ocultas</a> ajudam a arredondar o contexto.
### O dado que muda tudo: Mercury $0 wire fees

A maioria dos bancos cobra entre $15-50 por wire transfer. Mercury não cobra nada. Zero. Nem nacionais nem internacionais. Isso muda completamente como planeia seus pagamentos:

- Precisa pagar um fornecedor na Europa? Wire internacional do Mercury: $0
- Um cliente americano quer te pagar por wire? recebe grátis
- Wise pede enviar fundos por wire para verificação? $0

Mercury usa Column NA como banco custodiante, com seguro FDIC. Não é uma fintech experimental. é infraestrutura financeira séria para sua LLC.

Na Exentax otimizamos todas as semanas o routing bancário para clientes lusófonos. Marca a tua consulta gratuita: olhamos para os teus fluxos recorrentes e dizemos-te o que passa por ACH e o que tem de ir por Wire.
## Arquitetura bancária equilibrada: Mercury, Relay, Slash e Wise

Não existe a conta perfeita para uma LLC. Existe a **arquitetura** correta, onde cada ferramenta cobre um papel:

- **Mercury** (operada como fintech com bancos parceiros (Choice Financial Group e Evolve Bank & Trust principalmente; Column N.A. em contas legadas), FDIC via sweep network até ao limite em vigor). Conta principal operacional para não residentes com boa UX, ACH e wires. Continua a ser uma das opções mais comprovadas para abrir a partir de fora dos EUA.
- **Relay** (suportada pela Thread Bank, FDIC). Excelente como **conta de backup** e para gestão "envelope budgeting": permite criar até 20 subcontas e 50 cartões de débito, integração profunda com QuickBooks e Xero. Se a Mercury bloquear ou pedir revisão KYC, a Relay evita que a sua operativa pare.
- **Slash** (suportada pela Column N.A. (banco com licença federal, FDIC)). Banca desenhada para operadores online: emissão instantânea de cartões virtuais por fornecedor, controlos de gasto granulares, cashback em publicidade digital. É o complemento natural quando gere Meta Ads, Google Ads ou subscrições SaaS.
- **Wise Business** (EMI multi-divisa, não é banco). Para receber e pagar em EUR, GBP, USD e outras divisas com dados bancários locais e conversão à *mid-market rate*. Não substitui uma conta US real, mas é imbatível para tesouraria internacional.
- **Wallester / Revolut Business.** Wallester traz cartões corporativos com BIN próprio para alto volume. Revolut Business funciona como complemento europeu, não como conta principal da LLC.
A recomendação realista: **Mercury + Relay como backup + Slash para operativa publicitária + Wise para tesouraria FX**. É a configuração que minimiza risco de bloqueio e reduz custo real. Na Exentax abrimos e configuramos esta arquitetura como parte da constituição.

<!-- exentax:banking-facts-v1 -->
## Factos bancários e fiscais a precisar

A informação sobre fintechs e CRS evolui; este é o estado atual:

<!-- exentax:lote16-native-v1:tiempos-pagos-ach-wire-transfer-pt -->
## Porque é que para ACH e wire a previsibilidade conta mais do que a velocidade

O planeamento dos pagamentos via ACH e wire não fica mais simples se se procurar a velocidade máxima; fica mais simples se se procurar a previsibilidade. A diferença é concreta: uma wire emitida na manhã de terça-feira no âmbito de uma rotina estabelecida não levanta perguntas, ao passo que uma wire emitida sexta à noite fora de qualquer rotina abre conversas com a conformidade bancária que consomem tempo sem trazer nada à própria operação. A mesma lógica vale para ACH: um calendário regular, com montantes alinhados com os fluxos operacionais, funciona melhor do que um envio oportunista.

Um hábito que reduz a fricção consiste em fixar duas janelas semanais para os pagamentos a enviar e anunciá-las internamente. As contrapartes adaptam-se depressa, a contabilidade alinha as reconciliações e o próprio banco acaba por ler o perfil como previsível, o que reduz o número de revisões internas.
<!-- /exentax:lote16-native-v1:tiempos-pagos-ach-wire-transfer-pt -->

<!-- exentax:lote28-native-v1:tiempos-pagos-ach-wire-transfer-pt -->
## Como ler os tempos dos pagamentos ACH e wire transfer como um mapeamento estável em vez de uma espera incerta

Os tempos dos pagamentos ACH e wire transfer leem-se de forma mais útil como um mapeamento estável entre o tipo de instrução (ACH ou wire), o momento em que é lançada e o prazo operacional esperado, em vez de uma espera incerta. Estes prazos não mudam de mês para mês.
<!-- /exentax:lote28-native-v1:tiempos-pagos-ach-wire-transfer-pt -->

Antes de avançar, põe números ao teu caso: a <a href="/pt#calculadora">calculadora Exentax</a> compara, em menos de 2 minutos, a tua carga fiscal atual com a que terias com uma LLC americana corretamente declarada no teu país de residência.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

### Notas por provedor

- **Mercury** opera com vários bancos parceiros com licença federal e cobertura **FDIC** via sweep network: principalmente **Choice Financial Group** e **Evolve Bank & Trust**, e ainda **Column N.A.** em algumas contas legadas. Mercury não é um banco; é uma plataforma fintech suportada por esses partner banks. Se a Mercury encerrar uma conta, o saldo é normalmente devolvido **por cheque em papel enviado para a morada registada do titular**, o que pode ser um problema operacional sério para não residentes; convém manter uma conta secundária (Relay, Wise Business, etc.) como contingência.
- **Wise** tem dois produtos claramente distintos: **Wise Personal** e **Wise Business**. Para uma LLC abre-se **Wise Business**, não a conta pessoal. A entidade europeia é **Wise Europe SA (Bélgica)**, que emite IBAN BE para EUR; os IBAN lituanos só persistem em contas europeias herdadas. **Wise Business titularidade de uma LLC dos EUA fica FORA do CRS** porque a titular é uma entidade dos EUA e os EUA não são jurisdição participante do CRS; o lado USD opera via Wise US Inc. (perímetro FATCA, não CRS). Apenas uma **Wise Personal aberta por um indivíduo residente fiscal numa jurisdição CRS** (p. ex. Espanha) é reportada via Wise Europe SA (Bélgica) sobre esse indivíduo.
- **Wallester** (Estónia) é uma entidade financeira europeia com licença EMI/banco emissor de cartões. As suas contas IBAN europeias **estão dentro da Norma Comum de Comunicação (CRS)** e geram, por isso, troca automática de informação para a administração fiscal do país de residência.
- **Payoneer** opera através de entidades europeias (Payoneer Europe Ltd, Irlanda) também **no âmbito do CRS** para clientes residentes em jurisdições participantes.
- **Revolut Business**: quando associado a uma **LLC norte-americana**, opera sob **Revolut Technologies Inc.** com **Lead Bank** como banco parceiro nos EUA. A conta entregue é uma conta dos EUA (routing + account number); **não é emitido IBAN europeu** a uma LLC. Os IBAN europeus (lituanos, BE) são da **Revolut Bank UAB** e são emitidos a clientes europeus do grupo. Se lhe oferecerem um IBAN europeu associado à sua LLC, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.
## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.<!-- exentax:execution-v2 -->
## Tempos de pagamento ACH e wire transfer nos US: quanto demora cada método e quando usar qual

Vindo do SEPA, o sistema de pagamento US parece de outro século. Convém entender porque afecta quando cobra e quanto em comissões.

- **ACH (Automated Clearing House).** O SEPA americano. Custo quase zero (0$-1$), liquidação em 1-3 dias úteis. Standard para B2B doméstico recorrente.
- **Wire transfer doméstico.** Como transferência urgente: 5$-30$, chega em horas (mesmo dia se antes de cutoff ~14:00 ET).
- **Wire transfer internacional (SWIFT).** 15$-50$ + comissões bancos intermediários + spread FX (~1%-3%). Chega em 1-5 dias úteis.
- **Stripe payouts.** ACH 2 dias úteis (standard) ou instantâneo com 1% extra.

### Estratégia operacional típica

Revenue: clientes US via ACH/Stripe → Mercury/Wise USD. Clientes internacionais via Wise. Outflow: fornecedores US via ACH gratuito, internacionais via Wise, draw pessoal via Wise USD → IBAN EUR.

### O que mais nos perguntam

**Porque a Stripe demora 7 dias?** Rolling reserve: hold preventivo contra chargebacks. Contas novas 7-14 dias, depois 2.

**Wise USD é realmente "conta US"?** Conta Wise Inc. com routing ACH próprio. Opera como conta US para ACH e wires domésticos.

Na Exentax montamos a arquitetura bancária por caso de uso.
<!-- /exentax:execution-v2 -->

## Como trabalhamos na Exentax

A nossa equipa é especializada em estruturas fiscais internacionais para residentes de países de língua espanhola que operam negócios online. Combinamos conhecimento local de Espanha, Andorra e América Latina com experiência operacional na constituição de entidades em Delaware, Wyoming, Estónia e outras jurisdições. Cada caso começa com uma consulta gratuita na qual avaliamos a residência, a atividade e os objetivos, e dizemos-lhe honestamente se a estrutura proposta faz sentido ou se uma alternativa mais simples é suficiente.

  ### SEPA, TARGET2 e particularidades para titulares de LLC residentes em Portugal

  Quem opera uma LLC americana a partir de Portugal combina na prática transferências ACH/Wire em USD com transferências **SEPA em EUR** para o seu IBAN português. Os tempos de execução em Portugal são: **SEPA Credit Transfer (SCT)** D+1 dia útil, **SEPA Instant Credit Transfer (SCT Inst)** menos de 10 segundos 24/7 — obrigatória para receção até 9 de outubro de 2025 e para envio até 9 de abril de 2026 ao abrigo do **Regulamento UE 2024/886**. O Banco de Portugal regula este sistema e publicou o **Aviso 1/2022 do BdP** sobre comunicação de operações cambiais e contas no estrangeiro com saldo superior a USD 1 000 000 (Sistema CBE).

<!-- exentax:lote9-native-v1:tiempos-pagos-ach-wire-transfer -->
## Uma nota prática sobre os prazos

Os prazos ACH e wire não são valores fixos: dependem da hora de
envio, do dia da semana e do corredor bancário concreto. O
membro que integra estas variáveis no ciclo de facturação evita
a maioria das fricções de tesouraria que afectam as LLC em fase
de crescimento.

<!-- /exentax:lote9-native-v1:tiempos-pagos-ach-wire-transfer -->

<!-- exentax:cross-refs-v1 -->
## Para continuar a leitura

- [IBAN, SWIFT e routing number: entendendo os códigos bancários internacionais](/pt/blog/iban-swift-e-routing-number-entendendo-os-codigos-bancarios)
- [Como abrir uma conta Mercury para a sua LLC de qualquer país](/pt/blog/como-abrir-uma-conta-mercury-para-sua-llc-de-qualquer-pais)
- [Trocar divisas para a sua LLC: melhores opções e como evitar taxas ocultas](/pt/blog/trocar-divisas-para-sua-llc-melhores-opcoes-e-como-evitar)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:defensa-fiscal-v1 -->
## E se as Finanças me perguntarem pela minha LLC?

  É a pergunta mais frequente na primeira consulta, e a resposta curta é: a tua LLC não é opaca e, corretamente declarada, uma inspeção fecha-se em formulários standard. As Finanças portuguesas, a Receita Federal brasileira ou a SEFAZ estadual podem pedir o Certificate of Formation do estado (Wyoming, Delaware ou Novo México), o EIN emitido pelo <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o Operating Agreement assinado, os extratos da Mercury ou Wise do exercício, o Form 5472 com 1120 pro-forma apresentado e a contabilidade que reconcilia receitas, despesas e movimentos. Se tudo isso existir e for entregue ordenado, a inspeção não escala. É por isso que na Exentax mantemos o teu calendário em ordem — tu deixas de pensar em prazos e nós fechamo-los antes que mordam.

  O que as autoridades fiscais perseguem com razão são os testas-de-ferro, a residência fiscal de papel e a não declaração de contas estrangeiras. Uma LLC bem montada é exatamente o contrário: tu apareces como **beneficial owner** no BOI Report quando aplicável (verificável em <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tu assinas as contas bancárias e declaras o rendimento onde efetivamente vives. A estrutura está registada no Secretary of State do estado, nos ficheiros do IRS e, sempre que envolve um banco europeu, dentro do perímetro CRS do padrão da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  O erro que descarrila mesmo uma inspeção não é ter uma LLC; é não ter atribuído o rendimento corretamente no IRS pessoal (Anexo J do Modelo 3 em Portugal, Carnê-Leão Web e DAA no Brasil), não ter declarado as contas no estrangeiro (Modelo 58 ao Banco de Portugal a partir de 1 milhão €, DCBE ao Bacen a partir de 1 milhão USD) ou não ter documentado as operações entre o sócio e a LLC. Esses três frentes fecham-se antes do pedido, não depois. Respira: na Exentax isto é rotina, pomos-te em dia e a próxima revisão fecha-se numa volta, sem sobressaltos.

  ## O que uma LLC NÃO faz

  - **Não te isenta de tributar no teu país de residência.** Se vives em Portugal ou no Brasil, tributas aí o rendimento mundial. A LLC organiza o lado americano (zero imposto federal na SMLLC pass-through sem ECI); não desliga a tributação doméstica. O IRS é calculado sobre o lucro atribuído, não sobre as distribuições efetivamente recebidas.
  - **Não é um veículo offshore nem um esquema BEPS.** É uma entidade americana reconhecida pelo IRS, registada num estado concreto com morada física, agente registado e obrigações informativas anuais. Jurisdições offshore clássicas (BVI, Belize, Seychelles) não deixam rasto público; uma LLC deixa em cinco sítios.
  - **Não te protege se houver confusão patrimonial.** O *pierce the corporate veil* aciona-se assim que um juiz vê a LLC e o sócio funcionarem como a mesma carteira: contas misturadas, despesas pessoais pagas pela LLC, sem Operating Agreement, sem contabilidade. Três movimentos suspeitos bastam. Ver também jurisprudência comparada espanhola publicada no <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> sobre abuso de direito.
  - **Não te poupa contribuições para a Segurança Social.** Recibos verdes em Portugal, MEI ou autônomo no Brasil: a quota mensal continua a ser a mesma. A LLC opera a atividade face a clientes internacionais; a contribuição pessoal é independente.
  - **Não te dispensa de declarar as contas estrangeiras.** Portugal: Anexo J do Modelo 3 IRS + Modelo 58 ao BdP. Brasil: DCBE ao Bacen + e-Financeira via instituição financeira. Essas obrigações são da pessoa, não da LLC.

  Na Exentax fechamos estas cinco frentes todos os anos em paralelo com o calendário federal americano (Form 5472, 1120 pro-forma, FBAR, Annual Report estadual, BOI Report quando aplicável). O objetivo é que nenhuma inspeção encontre uma ponta solta e que a estrutura aguente uma revisão retroativa a 5-7 anos.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22A%20partir%20de%20Portugal%20e%20do%20Brasil%2C%20estamos%20habituados%20%C3%A0s%20SEPA%20em%201%20dia%20%C3%BAtil%20ou%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->`;
