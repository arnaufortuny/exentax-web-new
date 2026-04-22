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

Na Exentax otimizamos todas as semanas o routing bancário para clientes lusófonos. Marca a tua consultoria gratuita: olhamos para os teus fluxos recorrentes e dizemos-te o que passa por ACH e o que tem de ir por Wire.
## Stack bancário equilibrado: Mercury, Relay, Slash e Wise

Não existe a conta perfeita para uma LLC. Existe o **stack** correto, onde cada ferramenta cobre um papel:

- **Mercury** (operada como fintech com bancos parceiros (Choice Financial Group e Evolve Bank & Trust principalmente; Column N.A. em contas legadas), FDIC via sweep network até ao limite em vigor). Conta principal operacional para não residentes com boa UX, ACH e wires. Continua a ser uma das opções mais comprovadas para abrir a partir de fora dos EUA.
- **Relay** (suportada pela Thread Bank, FDIC). Excelente como **conta de backup** e para gestão "envelope budgeting": permite criar até 20 subcontas e 50 cartões de débito, integração profunda com QuickBooks e Xero. Se a Mercury bloquear ou pedir revisão KYC, a Relay evita que a sua operativa pare.
- **Slash** (suportada pela Column N.A. (banco com licença federal, FDIC)). Banca desenhada para operadores online: emissão instantânea de cartões virtuais por fornecedor, controlos de gasto granulares, cashback em publicidade digital. É o complemento natural quando gere Meta Ads, Google Ads ou subscrições SaaS.
- **Wise Business** (EMI multi-divisa, não é banco). Para receber e pagar em EUR, GBP, USD e outras divisas com dados bancários locais e conversão à *mid-market rate*. Não substitui uma conta US real, mas é imbatível para tesouraria internacional.
- **Wallester / Revolut Business.** Wallester traz cartões corporativos com BIN próprio para alto volume. Revolut Business funciona como complemento europeu, não como conta principal da LLC.
A recomendação realista: **Mercury + Relay como backup + Slash para operativa publicitária + Wise para tesouraria FX**. É a configuração que minimiza risco de bloqueio e reduz custo real. Na Exentax abrimos e configuramos este stack como parte da constituição.

<!-- exentax:banking-facts-v1 -->
## Factos bancários e fiscais a precisar

A informação sobre fintechs e CRS evolui; este é o estado atual:

<!-- exentax:calc-cta-v1 -->
> **Coloque números no seu caso.** A <a href="/pt#calculadora">calculadora fiscal Exentax</a> compara a sua carga tributária atual com o que pagaria operando uma LLC norte-americana corretamente declarada no seu país de residência.
<!-- /exentax:calc-cta-v1 -->

### Notas por provedor

- **Mercury** opera com vários bancos parceiros com licença federal e cobertura **FDIC** via sweep network: principalmente **Choice Financial Group** e **Evolve Bank & Trust**, e ainda **Column N.A.** em algumas contas legadas. Mercury não é um banco; é uma plataforma fintech suportada por esses partner banks. Se a Mercury encerrar uma conta, o saldo é normalmente devolvido **por cheque em papel enviado para a morada registada do titular**, o que pode ser um problema operacional sério para não residentes; convém manter uma conta secundária (Relay, Wise Business, etc.) como contingência.
- **Wise** tem dois produtos claramente distintos: **Wise Personal** e **Wise Business**. Para uma LLC abre-se **Wise Business**, não a conta pessoal. A entidade europeia é **Wise Europe SA (Bélgica)**, que emite IBAN BE para EUR; os IBAN lituanos só persistem em contas europeias herdadas. **Wise Business titularidade de uma LLC dos EUA fica FORA do CRS** porque a titular é uma entidade dos EUA e os EUA não são jurisdição participante do CRS; o lado USD opera via Wise US Inc. (perímetro FATCA, não CRS). Apenas uma **Wise Personal aberta por um indivíduo residente fiscal numa jurisdição CRS** (p. ex. Espanha) é reportada via Wise Europe SA (Bélgica) sobre esse indivíduo.
- **Wallester** (Estónia) é uma entidade financeira europeia com licença EMI/banco emissor de cartões. As suas contas IBAN europeias **estão dentro da Norma Comum de Comunicação (CRS)** e geram, por isso, troca automática de informação para a administração fiscal do país de residência.
- **Payoneer** opera através de entidades europeias (Payoneer Europe Ltd, Irlanda) também **no âmbito do CRS** para clientes residentes em jurisdições participantes.
- **Revolut Business**: quando associado a uma **LLC norte-americana**, o esquema típico passa pela Revolut Payments USA; os IBAN europeus (lituanos, BE) **não são emitidos por defeito** a uma LLC, são emitidos a clientes europeus do banco europeu do grupo. Se lhe oferecerem um IBAN europeu, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
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

Na Exentax montamos o stack bancário por caso de uso.
<!-- /exentax:execution-v2 -->

## Como trabalhamos na Exentax

A nossa equipa é especializada em estruturas fiscais internacionais para residentes de países de língua espanhola que operam negócios online. Combinamos conhecimento local de Espanha, Andorra e América Latina com experiência operacional na constituição de entidades em Delaware, Wyoming, Estónia e outras jurisdições. Cada caso começa com uma consulta gratuita na qual avaliamos a residência, a atividade e os objetivos, e dizemos-lhe honestamente se a estrutura proposta faz sentido ou se uma alternativa mais simples é suficiente.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22A%20partir%20de%20Portugal%20e%20do%20Brasil%2C%20estamos%20habituados%20%C3%A0s%20SEPA%20em%201%20dia%20%C3%BAtil%20ou%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisão editorial pendente</strong> — As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">5%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…| Pagos internacionales grandes | | Wise | 1-2 días | 0.4-1.5% | Pagos internacionales fre…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">1%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…envío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábi…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">3%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábiles…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">4%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…FX), draw a personal vía Wise USD → IBAN EUR (3-5 días, ~0.4% spread). Esto minimiza coste…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
