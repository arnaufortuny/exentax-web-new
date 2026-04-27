export default `Ao saltar do IBAN português ou do PIX brasileiro para o ecossistema bancário americano, falta-te metade do vocabulário: a tua LLC não te dá um IBAN, dá um routing number e um account number, e o SWIFT só aparece no internacional. Enquanto não fixares esta diferença, as transferências vão ou chegam com comissões escondidas.

Vamos explicar cada um de forma clara para que nunca mais fiques a pensar "qual dou a este cliente?"

## Routing Number (ABA Number)

É o código que identifica um banco dentro dos Estados Unidos. Tem **9 dígitos** e é usado exclusivamente para transferências domésticas dentro dos EUA.

**Exemplo:** 084106768

### Quando precisas dele?

- Para receber pagamentos **ACH** de clientes americanos
- Para receber **wires domésticos** dentro dos EUA
- Para configurar pagamentos automáticos (folhas de pagamento, subscrições)
- Para conectar a tua conta com Stripe, PayPal, Amazon

### Onde o encontras?

No Mercury: Dashboard → Account Details → "Routing Number"

**Nota importante:** Mercury tem **dois routing numbers**: um para ACH e outro para Wire. Certifica-te de dar o correto conforme o tipo de transferência.
### SWIFT / BIC Code

O **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) ou **BIC** (Bank Identifier Code) é o código que identifica um banco a nível internacional. Tem entre **8 e 11 caracteres** (letras e números).

**Exemplo:** CHASUS33 (JPMorgan Chase)

### Quando precisas dele?

- Para receber **wire transfers internacionais** de fora dos EUA
- Para que um cliente na Europa, América Latina ou Ásia te envie dinheiro

### Por que é diferente do Routing Number?

O Routing Number é para o sistema doméstico americano (ACH/Fedwire). O SWIFT é para o sistema internacional. São duas redes de pagamentos diferentes.
## IBAN (International Bank Account Number)

O **IBAN** é um formato padronizado de número de conta que se usa na Europa, Médio Oriente e partes da América Latina. Tem entre **15 e 34 caracteres** (varia por país) e contém o código do país, o banco e a conta.

**Exemplo:** ES91 2100 0418 4502 0005 1332 (Espanha)

### As contas americanas têm IBAN?

**Não.** Os Estados Unidos não usam o sistema IBAN. As contas americanas usam Routing Number + Account Number.

Se um cliente europeu te pede o teu IBAN para te pagar, a resposta é: "Não tenho IBAN. aqui tens o meu Routing Number, Account Number e SWIFT Code para wire internacional."

### E se precisares de receber pagamentos da Europa?

Aqui é onde o **Wise Business** brilha. O Wise dá-te um IBAN europeu (com prefixo BE ou DE) vinculado à tua conta. Os clientes europeus podem pagar-te por SEPA como se fosse uma transferência local, sem comissões de wire internacional.
### Resumo rápido

| Código | O que é | Dígitos | Usa-se em | Para quê |
|---|---|---|---|---|
| Routing Number | ID do banco nos EUA | 9 | EUA | ACH e Wires domésticos |
| SWIFT/BIC | ID do banco internacional | 8-11 | Mundial | Wires internacionais |
| IBAN | Nº de conta internacional | 15-34 | Europa, MENA, LatAm | Transferências SEPA |
| Account Number | Nº da tua conta | 10-17 | EUA | Identificar a tua conta |
### Que dados dar a cada tipo de cliente?

### Cliente americano
- **Routing Number** (ACH ou Wire conforme o tipo de pagamento)
- **Account Number**
- **Nome da LLC** (como beneficiário)

### Cliente europeu
- **SWIFT Code** + **Account Number** + **Routing Number** para wire internacional
- Ou melhor: **IBAN europeu do Wise** para que pague por SEPA (mais barato e rápido)

### Cliente latino-americano
- **SWIFT Code** + **Account Number** + **Routing Number** para wire internacional
- Ou: **dados locais do Wise** se o país tiver conta local disponível
## O truque para cobrar mais barato: contas locais

Aqui vai um conselho que vale ouro: se tens clientes na Europa que te pagam regularmente, **NÃO lhes dês os teus dados de wire internacional**. Dá-lhes o teu **IBAN europeu do Wise Business**.

Porquê? Um wire internacional EUA→Europa pode custar ao pagador 20-50€ e demorar 2-5 dias. Um SEPA a partir da conta Wise da tua LLC custa 0-1€ e chega em 1 dia.

O Wise (que é uma EMI, não um banco) gera-te contas locais em múltiplos países:
- **IBAN europeu** (prefixo BE ou DE) para cobranças SEPA
- **Dados USD** para clientes americanos (routing + account number)
- **Sort code** britânico para clientes UK
- **BSB** australiano para clientes na Austrália

Os teus clientes pagam como se fosse uma transferência local. tu recebes no teu saldo multi-divisa do Wise e depois transferes para o Mercury quando te convier.

Se ficaram pontos desta estrutura por aprofundar, <a href="/pt/blog/ach-vs-transferencia-bancaria-prazos-de-pagamento-e-impacto">ACH vs transferência bancária: prazos de pagamento e impacto no fluxo de caixa da LLC</a> e <a href="/pt/blog/como-escalar-seu-negocio-digital-com-uma-llc-americana">Como escalar seu negócio digital com uma LLC americana</a> detalham peças vizinhas que costumamos reservar para artigos dedicados.
### Mercury: dados bancários que precisas

Para o Mercury, os dados que darás aos clientes são:

- **Routing Number ACH:** Para cobranças ACH domésticas (pagamentos de clientes US, depósitos de Stripe/PayPal)
- **Routing Number Wire:** Para wires domésticos (atenção: é diferente do de ACH)
- **Account Number:** O teu número de conta
- **SWIFT Code:** Para wires internacionais recebidos
- **Endereço do banco:** Column NA, San Francisco, CA

Mercury tem $0 em comissões de wire, tanto nacionais como internacionais. Os teus fundos estão custodiados na Column NA com seguro FDIC.

Na Exentax configuramos Mercury, Wise e Revolut Business para que as transferências entre os teus clientes e a tua LLC passem limpas. Marca a tua consultoria gratuita: damos-te o manual certo para o teu negócio.
## Stack bancário equilibrado: Mercury, Relay, Slash e Wise

Não existe a conta perfeita para uma LLC. Existe o **stack** correto, onde cada ferramenta cobre um papel:

- **Mercury** (operada como fintech com bancos parceiros (Choice Financial Group e Evolve Bank & Trust principalmente; Column N.A. em contas legadas), FDIC via sweep network até ao limite em vigor). Conta principal operacional para não residentes com boa UX, ACH e wires. Continua a ser uma das opções mais comprovadas para abrir a partir de fora dos EUA.
- **Relay** (suportada pela Thread Bank, FDIC). Excelente como **conta de backup** e para gestão "envelope budgeting": permite criar até 20 subcontas e 50 cartões de débito, integração profunda com QuickBooks e Xero. Se a Mercury bloquear ou pedir revisão KYC, a Relay evita que a sua operativa pare.
- **Slash** (suportada pela Column N.A. (banco com licença federal, FDIC)). Banca desenhada para operadores online: emissão instantânea de cartões virtuais por fornecedor, controlos de gasto granulares, cashback em publicidade digital. É o complemento natural quando gere Meta Ads, Google Ads ou subscrições SaaS.
- **Wise Business** (EMI multi-divisa, não é banco). Para receber e pagar em EUR, GBP, USD e outras divisas com dados bancários locais e conversão à *mid-market rate*. Não substitui uma conta US real, mas é imbatível para tesouraria internacional.
- **Wallester / Revolut Business.** Wallester traz cartões corporativos com BIN próprio para alto volume. Revolut Business funciona como complemento europeu, não como conta principal da LLC.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

A recomendação realista: **Mercury + Relay como backup + Slash para operativa publicitária + Wise para tesouraria FX**. É a configuração que minimiza risco de bloqueio e reduz custo real. Na Exentax abrimos e configuramos este stack como parte da constituição.
### Próximos passos

Agora que tem o contexto completo, o passo seguinte natural é confrontá-lo com a sua própria situação: o que encaixa, o que não encaixa e onde estão as nuances que dependem da sua residência, da sua actividade e do seu volume. Uma revisão rápida do seu caso costuma poupar muito ruído antes de qualquer decisão estrutural.

<!-- exentax:banking-facts-v1 -->
## Factos bancários e fiscais a precisar

A informação sobre fintechs e CRS evolui; este é o estado atual:
### Notas por provedor

- **Mercury** opera com vários bancos parceiros com licença federal e cobertura **FDIC** via sweep network: principalmente **Choice Financial Group** e **Evolve Bank & Trust**, e ainda **Column N.A.** em algumas contas legadas. Mercury não é um banco; é uma plataforma fintech suportada por esses partner banks. Se a Mercury encerrar uma conta, o saldo é normalmente devolvido **por cheque em papel enviado para a morada registada do titular**, o que pode ser um problema operacional sério para não residentes; convém manter uma conta secundária (Relay, Wise Business, etc.) como contingência.
- **Wise** tem dois produtos claramente distintos: **Wise Personal** e **Wise Business**. Para uma LLC abre-se **Wise Business**, não a conta pessoal. A entidade europeia é **Wise Europe SA (Bélgica)**, que emite IBAN BE para EUR; os IBAN lituanos só persistem em contas europeias herdadas. **Wise Business titularidade de uma LLC dos EUA fica FORA do CRS** porque a titular é uma entidade dos EUA e os EUA não são jurisdição participante do CRS; o lado USD opera via Wise US Inc. (perímetro FATCA, não CRS). Apenas uma **Wise Personal aberta por um indivíduo residente fiscal numa jurisdição CRS** (p. ex. Espanha) é reportada via Wise Europe SA (Bélgica) sobre esse indivíduo.
- **Wallester** (Estónia) é uma entidade financeira europeia com licença EMI/banco emissor de cartões. As suas contas IBAN europeias **estão dentro da Norma Comum de Comunicação (CRS)** e geram, por isso, troca automática de informação para a administração fiscal do país de residência.
- **Payoneer** opera através de entidades europeias (Payoneer Europe Ltd, Irlanda) também **no âmbito do CRS** para clientes residentes em jurisdições participantes.
- **Revolut Business**: quando associado a uma **LLC norte-americana**, opera sob **Revolut Technologies Inc.** com **Lead Bank** como banco parceiro nos EUA. A conta entregue é uma conta dos EUA (routing + account number); **não é emitido IBAN europeu** a uma LLC. Os IBAN europeus (lituanos, BE) são da **Revolut Bank UAB** e são emitidos a clientes europeus do grupo. Se lhe oferecerem um IBAN europeu associado à sua LLC, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.
## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.<!-- exentax:execution-v2 -->
## IBAN, SWIFT e Routing Number: para que serve cada um e porque a sua LLC os precisa bem

Confundir IBAN, SWIFT/BIC e ABA Routing Number custa pagamentos rejeitados, transferências devolvidas e três dias ao telefone com o suporte. Cada formato responde a um sistema distinto, e a sua LLC americana usa os três conforme o tipo de cobrança.

- **Routing Number (ABA, 9 dígitos).** Identificador do banco no sistema doméstico americano. Usado por ACH (transferências internas US, rápidas e baratas) e wires domésticos. Mercury, Bluevine e qualquer conta US-only dão Routing Number. Se o cliente paga dos EUA, sempre Routing + número de conta.
- **SWIFT/BIC (8-11 caracteres).** Identificador internacional do banco para transferências transfronteiriças. Necessário quando um cliente europeu, LATAM ou asiático envia dinheiro do banco local. Mercury, Wise Business dão SWIFT - mas o wire internacional custa 15-30 USD e demora 1-3 dias.
- **IBAN (até 34 caracteres).** Padrão europeu + 80 jurisdições. As contas US tradicionais não têm IBAN - só SWIFT. Wise Business emite IBANs europeus (Bélgica, UK, Hungria) para a sua LLC, reduzindo fricção na facturação UE: o seu cliente português paga o IBAN da Wise como se fosse SEPA local, sem custo de wire.
- **Boas práticas operacionais.** Cliente US: partilhe Routing + conta (ACH). Cliente UE B2B: partilhe IBAN Wise Business. Cliente fora UE/US: partilhe SWIFT + conta. Misturar formatos confunde o ordenante e devolve a transferência.

### O que mais nos perguntam

**A minha LLC pode ter IBAN português?** Não directamente: a LLC é entidade US sem estabelecimento estável UE. Mas a Wise Business atribui um IBAN europeu (Bélgica), funcionalmente suficiente para SEPA e conversões EUR.

**Porque é que o meu cliente europeu não consegue pagar com cartão quando lhe dou SWIFT?** Porque SWIFT é transferência bancária, não pagamento com cartão. Para cartão use Stripe ou equivalente. Para wire, o cliente precisa de SWIFT + conta + morada do beneficiário e do banco.

Na Exentax configuramos o stack bancário completo da sua LLC (Mercury principal, Wise Business secundária com IBAN europeu, gateway de pagamento se aplicável) para cobrar limpo em cada moeda e país.
<!-- /exentax:execution-v2 -->

## Como trabalhamos na Exentax

A nossa equipa é especializada em estruturas fiscais internacionais para residentes de países de língua espanhola que operam negócios online. Combinamos conhecimento local de Espanha, Andorra e América Latina com experiência operacional na constituição de entidades em Delaware, Wyoming, Estónia e outras jurisdições. Cada caso começa com uma consulta gratuita na qual avaliamos a residência, a atividade e os objetivos, e dizemos-lhe honestamente se a estrutura proposta faz sentido ou se uma alternativa mais simples é suficiente.

<!-- exentax:defensa-fiscal-v1 -->
## E se as Finanças me perguntarem pela minha LLC?

  É a pergunta mais frequente na primeira consulta, e a resposta curta é: a tua LLC não é opaca e, corretamente declarada, uma inspeção fecha-se em formulários standard. As Finanças portuguesas, a Receita Federal brasileira ou a SEFAZ estadual podem pedir o Certificate of Formation do estado (Wyoming, Delaware ou Novo México), o EIN emitido pelo <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o Operating Agreement assinado, os extratos da Mercury ou Wise do exercício, o Form 5472 com 1120 pro-forma apresentado e a contabilidade que reconcilia receitas, despesas e movimentos. Se tudo isso existir e for entregue ordenado, a inspeção não escala.

  O que as autoridades fiscais perseguem com razão são os testas-de-ferro, a residência fiscal de papel e a não declaração de contas estrangeiras. Uma LLC bem montada é exatamente o contrário: tu apareces como **beneficial owner** no BOI Report quando aplicável (verificável em <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tu assinas as contas bancárias e declaras o rendimento onde efetivamente vives. A estrutura está registada no Secretary of State do estado, nos ficheiros do IRS e, sempre que envolve um banco europeu, dentro do perímetro CRS do padrão da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  O erro que descarrila mesmo uma inspeção não é ter uma LLC; é não ter atribuído o rendimento corretamente no IRS pessoal (Anexo J do Modelo 3 em Portugal, Carnê-Leão Web e DAA no Brasil), não ter declarado as contas no estrangeiro (Modelo 58 ao Banco de Portugal a partir de 1 milhão €, DCBE ao Bacen a partir de 1 milhão USD) ou não ter documentado as operações entre o sócio e a LLC. Esses três frentes fecham-se antes do pedido, não depois.

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Ao%20saltar%20do%20IBAN%20portugu%C3%AAs%20ou%20do%20PIX%20brasileiro%20para%20o%20ecossistema%20banc%C3%A1rio%20%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
