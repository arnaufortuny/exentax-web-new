export default `Quando alguém abre uma LLC desde fora dos EUA, a conversa bancária reduz-se quase sempre a uma única pergunta: "Mercury ou Wise?". Essa pergunta é **o sintoma do problema, não a solução**. Uma LLC operativa não se sustenta numa só conta, nem sequer em duas. Precisa de uma **stack bancária** pensada como sistema. Neste artigo explicamos como se desenha uma stack que aguenta o dia a dia, o que acontece quando uma peça falha, e por que 80 % dos bloqueios que vemos na Exentax chegam precisamente por não ter nada disto montado.

Este não é um artigo sobre Wise vs Mercury (para isso já tens o nosso <a href="/pt/blog/wise-business-com-sua-llc-o-guia-completo-de-gestao-multi">guia completo de Wise Business</a>, o <a href="/pt/blog/como-abrir-uma-conta-mercury-para-sua-llc-de-qualquer-pais">guia de Mercury</a> e a <a href="/pt/blog/bancos-tradicionais-vs-fintech-para-sua-llc-onde-abrir-a">comparativa banco vs fintech</a>). É o artigo que ordena as peças anteriores numa arquitectura coerente.

## O erro mental: pensar a conta como "a conta"

Quem vem da Europa ou da América Latina traz um modelo bancário muito concreto: **uma conta por pessoa, uma conta por sociedade**. Ponto. Se essa conta é bloqueada, vais à agência, falas com o gestor, resolve-se. O sistema assume que o banco tem incentivos para não te perder.

No **ecossistema fintech americano**, esse modelo não existe. Mercury, Wise, Brex, Relay, Revolut Business e companhia são **plataformas tecnológicas**, não bancos. A conta abre-se por API, fecha-se por API, e as decisões tomam-se por um sistema de scoring + uma equipa de compliance que tu não conheces e que não podes telefonar. Se o sistema decide rever a tua conta, o teu acesso fica **congelado durante 30, 60 ou 90 dias**, e ninguém te garante a recuperação dos fundos a curto prazo.

Primeira mudança mental: **uma conta não é a conta. É um fornecedor mais, substituível como um hosting ou um domínio**. E como qualquer fornecedor crítico, precisa de redundância.
## A stack mínima viável de uma LLC operativa

A partir do segundo ano de actividade real, a stack mínima de uma LLC bem gerida parece-se com isto:

1. **Conta operativa principal em USD** (Mercury, Brex ou banco tradicional tipo Bank of America/Chase se conseguiste abrir presencialmente).
2. **Conta secundária em USD** do mesmo perfil (tipicamente Relay se a principal é Mercury, ou inverso). Não para uso diário, mas como **failover real** se a primeira é bloqueada.
3. **Conta multi-divisas com IBAN europeu** (Wise Business tipicamente). Para cobrar a clientes europeus em EUR sem SWIFT e ter porta de entrada no sistema bancário europeu.
4. **Gateway de pagamentos** ligado a uma das duas contas USD (Stripe, PayPal Business, Dodo Payments). Ver a <a href="/pt/blog/gateways-de-pagamento-para-sua-llc-stripe-paypal-e-dodo">comparativa de gateways</a>.
5. **Cartão corporativo físico + cartões virtuais** para subscrições SaaS e compras pontuais.
6. **Reservas separadas** para impostos, FX e operativa (desenvolvido abaixo).

Se parece exagerado: é, no primeiro mês. É **estritamente o mínimo** para não perder operativa quando algo falha. E algo falha sempre.
## Por que Mercury sozinho não chega

Mercury é provavelmente o melhor produto do mercado para uma LLC de não residente: onboarding remoto, sem custo mensal, integração decente com contabilidade e suporte razoável. Mas Mercury **não é um banco**: é uma camada software por cima de bancos partner (Choice Financial, Column N.A., Evolve). Se um partner decide cortar contigo, Mercury **não pode reabrir-te a conta** nem mover os fundos para outro partner sem a tua intervenção.

O que vemos na Exentax quase semanalmente:

- Conta Mercury bloqueada por uma transferência entrante "atípica".
- Email automático Mercury a pedir documentação (factura, contrato, justificação).
- 7 a 14 dias sem operativa enquanto compliance revê.
- Em 70 % dos casos, conta restabelecida. Em 30 %, **encerramento com devolução de fundos em 30-60 dias**.

Se toda a operação depende dessa conta, durante essas semanas não pagas a equipa, não facturas a clientes ACH, e não manténs as subscrições SaaS críticas. Ter uma secundária pré-autorizada e operativa transforma uma **crise empresarial** numa **chatice de 48 horas**.
### Por que Wise sozinho não chega

Wise Business é excelente para multi-divisas, IBAN europeu e conversão FX. Mas Wise **não é uma conta operativa americana**. O routing e account number USD são tecnicamente "details", não conta bancária nominal à tua LLC num banco USA. Três implicações práticas:

1. **Stripe USA, Amazon US, certos marketplaces e grandes empresas** aceitam os details USD do Wise sem problemas, mas alguns rejeitam-nos ao detectar que o receptor é EMI e não banco.
2. **O fluxo Stripe → Wise → IBAN local** funciona, mas soma um actor à cadeia compliance.
3. **Wise reporta ao teu fisco via CRS** desde a Bélgica. Se julgas que Wise te dá privacidade, lê primeiro <a href="/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades">o que o Wise reporta</a> e <a href="/pt/blog/wise-business-e-crs-o-que-e-reportado-a-sua-autoridade">como Wise encaixa em CRS</a>.

Conclusão: Wise é **peça imprescindível** do puzzle europeu, mas não substitui conta operativa USD nominal à tua LLC.
### A armadilha do IBAN belga (e do IBAN não-local)

Ao abrir Wise Business como LLC americana, atribuem-te um **IBAN belga** (BE...). Surpreende quem esperava IBAN do país de residência. Consequência dupla:

- Operacionalmente, o IBAN funciona perfeitamente para SEPA na zona euro.
- Fiscalmente e para a **declaração de bens no estrangeiro** (Modelo 720 Espanha, **declaração no Anexo J/Modelo 38** Portugal, 3916 França), esse IBAN belga é **conta no estrangeiro a nome de entidade estrangeira**. Se ultrapassas limites e és residente fiscal, **tens de declarar**.

Erro típico: "como o IBAN começa por BE, não é minha, é da LLC, não declaro". Falso. A norma olha para o beneficiário efectivo (tu). Mais em <a href="/pt/blog/as-contas-bancarias-americanas-reportam-a-sua-autoridade">contas USA e fisco</a> e no <a href="/pt/blog/crs-e-as-suas-contas-bancarias-llc-o-que-e-partilhado-com-o">guia CRS para contas LLC</a>.
## Regras internas que te poupam 5 algarismos

A stack é só hardware. As regras de operação evitam os problemas reais:

### 1. Nunca, jamais misturar pessoal e LLC

Óbvio, mas erro mais caro e frequente. Pagar Netflix pessoal com cartão da LLC **rompe o corporate veil** e oferece ao fisco + <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> a LLC como extensão patrimonial. Zero excepções.

### 2. Segmentar por risco

Clientes B2B grandes vs. payouts de marketplaces cripto: **separa fluxos em contas distintas**.

### 3. Tax buffer de 25-35 %

Cada entrada: **separa automaticamente 25-35 %** para "tax reserve". Cobre o imposto que pagarás em casa (sim, pagarás, ver <a href="/pt/blog/a-tua-llc-nao-paga-imposto-nos-eua-o-que-se-passa-no-teu">por que a tua LLC não paga nos EUA mas tu sim</a>).

### 4. Buffer FX separado

Negócio em USD, gastos/declaração em EUR: buffer FX evita conversões no pior momento.

### 5. Documentar contratos antes do primeiro pagamento

Transferência >5 000 USD de novo cliente → mais cedo ou mais tarde compliance pede "purpose of payment, contract, invoice". Contrato e factura **antes** reduz revisão de 14 dias para 24 horas.

### 6. Backup absoluto: "se isto cai amanhã"

Pergunta trimestral: "se Mercury cai amanhã, o que faço em 72 horas?". Resposta "não sei" → stack mal montada.
## O que se passa quando bloqueiam (não é "se", é "quando")

Verdade operacional: **toda LLC com 18+ meses já teve pelo menos um evento de bloqueio**. O que muda é a magnitude.

Bloqueio típico:
- **Dia 0**: email automático "under review".
- **Dias 1-3**: enviar documentos.
- **Dias 4-14**: silêncio, acesso só a entradas.
- **Dia 14-30**: reabertura ou encerramento com devolução em 30-60 dias.

Minimização: secundária activa desde dia 1, ambas em uso ligeiro contínuo, extractos PDF mensais guardados, mini-dossier por cliente.
### Conversa dos gateways: Stripe e companhia

Stripe é o default, mas tem regime próprio de bloqueios: **rolling reserves de 5-10 %** durante 90-120 dias e possibilidade de congelar fundos.

- **Não ligues Stripe a uma só conta**.
- **Descritor Stripe** com nome comercial real.
- **Alertas de churn** + buffer de 30 dias de payout.

PayPal Business: complemento sim, canal único não.
### Cartões: físicos, virtuais e a regra "um por categoria"

- **Um físico**: gasto físico (coworking, viagens, refeições com cliente).
- **Virtual "SaaS"**: subscrições recorrentes.
- **Virtual "Ads"**: campanhas pagas.
- **Virtual "single-use"**: compras pontuais em fornecedores duvidosos.
### O que deves levar

- A pergunta correcta não é "Mercury ou Wise", é "**que stack monto**".
- Mínimo: **2 contas USD + 1 multi-divisas + gateway + cartões segmentados + reservas**.
- IBAN Wise é belga, não local. Continua sujeito a declaração.
- Bloqueios são rotina previsível. A stack faz a diferença entre chatice e crise.
- **Nunca misturar pessoal e LLC**, segmentar por risco, tax buffer 25-35 %, FX buffer e documentação pré-pagamento: cinco regras que poupam cinco algarismos.

Se tens uma LLC e queres que desenhemos contigo a stack bancária correcta para o teu volume e perfil de risco, **vemos isto contigo** numa consulta gratuita de 30 minutos. Montar bem é barato. Montar a meio e descobrir no dia em que Mercury manda o primeiro "under review" é caro.
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

A aplicação concreta de qualquer destas normas ao seu caso depende da sua residência fiscal, da atividade da LLC e da documentação que mantenha. Este conteúdo é informativo e não substitui aconselhamento profissional personalizado.

<!-- exentax:bank-balance-v1 -->
## Stack bancário equilibrado: Mercury, Relay, Slash e Wise

Não existe a conta perfeita para uma LLC. Existe o **stack** correto, onde cada ferramenta cobre um papel:

- **Mercury** (operada como fintech com bancos parceiros (Choice Financial Group e Evolve Bank & Trust principalmente; Column N.A. em contas legadas), FDIC via sweep network até ao limite em vigor). Conta principal operacional para não residentes com boa UX, ACH e wires. Continua a ser uma das opções mais comprovadas para abrir a partir de fora dos EUA.
- **Relay** (suportada pela Thread Bank, FDIC). Excelente como **conta de backup** e para gestão "envelope budgeting": permite criar até 20 subcontas e 50 cartões de débito, integração profunda com QuickBooks e Xero. Se a Mercury bloquear ou pedir revisão KYC, a Relay evita que a sua operativa pare.
- **Slash** (suportada pela Column N.A. (banco com licença federal, FDIC)). Banca desenhada para operadores online: emissão instantânea de cartões virtuais por fornecedor, controlos de gasto granulares, cashback em publicidade digital. É o complemento natural quando gere Meta Ads, Google Ads ou subscrições SaaS.
- **Wise Business** (EMI multi-divisa, não é banco). Para receber e pagar em EUR, GBP, USD e outras divisas com dados bancários locais e conversão à *mid-market rate*. Não substitui uma conta US real, mas é imbatível para tesouraria internacional.
- **Wallester / Revolut Business.** Wallester traz cartões corporativos com BIN próprio para alto volume. Revolut Business funciona como complemento europeu, não como conta principal da LLC.
A recomendação realista: **Mercury + Relay como backup + Slash para operativa publicitária + Wise para tesouraria FX**. É a configuração que minimiza risco de bloqueio e reduz custo real. Na Exentax abrimos e configuramos este stack como parte da constituição.

## Próximos passos

Agora que tem o contexto completo, o passo seguinte natural é confrontá-lo com a sua própria situação: o que encaixa, o que não encaixa e onde estão as nuances que dependem da sua residência, da sua actividade e do seu volume. Uma revisão rápida do seu caso costuma poupar muito ruído antes de qualquer decisão estrutural.

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

- **BOI / Corporate Transparency Act.** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida a "foreign reporting companies"** (entidades constituídas fora dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA por um não residente está, hoje, fora dessa obrigação**. O estado regulatório pode mudar de novo: **reverificar em FinCEN.gov no momento da submissão**. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo e monitoriza atualizações.
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## O que deve levar consigo

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Factos bancários e fiscais que convém precisar

## Factos jurídicos e processuais

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

<!-- exentax:execution-v2 -->
## Wise + bancos para LLC: o stack bancário completo que qualquer não residente devia ter

A pergunta "Mercury ou Wise?" está mal colocada. A resposta correcta é "ambos, mais Stripe, mais alternativa".

- **Camada 1: conta operativa principal (Mercury).** Recebe Stripe payouts, paga vendors via ACH gratuito, cartão USD, integra QuickBooks.
- **Camada 2: backup e multi-moeda (Wise Business).** USD/EUR/GBP. Recebe clientes UE directamente em EUR (SEPA local, não SWIFT). Se Mercury fecha, Wise continua.
- **Camada 3: gateway de pagamento (Stripe + alternativo).** Stripe US conectado a Mercury. Lemon Squeezy/Dodo como MoR para vendas digitais UE.
- **Camada 4: tesouraria e FX optimizado.** Conta Wise EUR para reservas.

### Stack completo típico

LLC Wyoming + EIN + Mercury + Wise Business + Stripe + Lemon Squeezy + PayPal. Custo mensal ~50-100$ para volume <100k$/ano.

### O que mais nos perguntam

**Mercury ou Wise para Stripe payout?** Mercury algo mais rápido.

**Brex/Ramp para LLC pequena?** Tipicamente não abaixo de 500k$/ano.

Na Exentax montamos o stack completo em setup packageado.
<!-- /exentax:execution-v2 -->

## O seu próximo passo com a Exentax

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Quando%20algu%C3%A9m%20abre%20uma%20LLC%20desde%20fora%20dos%20EUA%2C%20a%20conversa%20banc%C3%A1ria%20reduz-se%20q%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisão editorial pendente</strong> — As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">80 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…el día a día, qué pasa cuando una pieza falla, y por qué el 80 % de los bloqueos que vemos…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">70 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…a 14 días sin operativa mientras compliance revisa. - En el 70 % de los casos, cuenta rest…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">30 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…visa. - En el 70 % de los casos, cuenta restablecida. En el 30 %, **cierre con devolución …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">35 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ípico, la primera sigue operando. ### 3. Tax buffer del 25-35 % Cada vez que entra dinero …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">25 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…o en la cuenta operativa, **separa automáticamente entre un 25 % y un 35 %** a una cuenta …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">10 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…aras en EUR/GBP/MXN, las fluctuaciones FX te pueden comer 5-10 % de margen en un mal trime…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">5.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…legue el primer pago Cada vez que entra una transferencia &gt;5.000 USD de un cliente nuevo, …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">4%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…Mercury cierra mañana, Wise sigue operando 24h. FX típico 0.4% (vs 1%-3% de bancos tradici…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">1%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…cierra mañana, Wise sigue operando 24h. FX típico 0.4% (vs 1%-3% de bancos tradicionales).…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">3%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…erra mañana, Wise sigue operando 24h. FX típico 0.4% (vs 1%-3% de bancos tradicionales). T…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">5%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…tú vives en EUR, optimizar el momento de conversión vale 0.5%-1% anual sobre el flujo tota…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">95%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…recurrente ~$50-$100 si volumen &lt;100k$/año. Con esto cubres 95% de escenarios sin tener qu…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
