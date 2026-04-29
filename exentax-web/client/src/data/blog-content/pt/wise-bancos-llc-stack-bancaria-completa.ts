export default `Quando alguém abre uma LLC desde fora dos EUA, a conversa bancária reduz-se quase sempre a uma única pergunta: "Mercury ou Wise?". Essa pergunta é **o sintoma do problema, não a solução**. Uma LLC operativa não se sustenta numa só conta, nem sequer em duas. Precisa de uma **arquitetura bancária** pensada como sistema. Neste artigo explicamos como se desenha uma arquitetura que aguenta o dia a dia, o que acontece quando uma peça falha, e por que 80 % dos bloqueios que vemos na Exentax chegam precisamente por não ter nada disto montado.

Este não é um artigo sobre Wise vs Mercury (para isso já tens o nosso <a href="/pt/blog/wise-business-com-sua-llc-o-guia-completo-de-gestao-multi">guia completo de Wise Business</a>, o <a href="/pt/blog/como-abrir-uma-conta-mercury-para-sua-llc-de-qualquer-pais">guia de Mercury</a> e a <a href="/pt/blog/bancos-tradicionais-vs-fintech-para-sua-llc-onde-abrir-a">comparativa banco vs fintech</a>). É o artigo que ordena as peças anteriores numa arquitectura coerente.

## O erro mental: pensar a conta como "a conta"

Quem vem da Europa ou da América Latina traz um modelo bancário muito concreto: **uma conta por pessoa, uma conta por sociedade**. Ponto. Se essa conta é bloqueada, vais à agência, falas com o gestor, resolve-se. O sistema assume que o banco tem incentivos para não te perder.

No **ecossistema fintech americano**, esse modelo não existe. Mercury, Wise, Brex, Relay, Revolut Business e companhia são **plataformas tecnológicas**, não bancos. A conta abre-se por API, fecha-se por API, e as decisões tomam-se por um sistema de scoring + uma equipa de compliance que tu não conheces e que não podes telefonar. Se o sistema decide rever a tua conta, o teu acesso fica **congelado durante 30, 60 ou 90 dias**, e ninguém te garante a recuperação dos fundos a curto prazo.

Primeira mudança mental: **uma conta não é a conta. É um fornecedor mais, substituível como um hosting ou um domínio**. E como qualquer fornecedor crítico, precisa de redundância.
## A arquitetura mínima viável de uma LLC operativa

A partir do segundo ano de actividade real, a arquitetura mínima de uma LLC bem gerida parece-se com isto:

1. **Conta operativa principal em USD** (Mercury, Brex ou banco tradicional tipo Bank of America/Chase se conseguiste abrir presencialmente).
2. **Conta secundária em USD** do mesmo perfil (tipicamente Relay se a principal é Mercury, ou inverso). Não para uso diário, mas como **failover real** se a primeira é bloqueada.
3. **Conta multi-divisas com IBAN europeu** (Wise Business tipicamente). Para cobrar a clientes europeus em EUR sem SWIFT e ter porta de entrada no sistema bancário europeu.
4. **Gateway de pagamentos** ligado a uma das duas contas USD (Stripe, PayPal Business, Dodo Payments). Ver a <a href="/pt/blog/gateways-de-pagamento-para-sua-llc-stripe-paypal-e-dodo">comparativa de gateways</a>.
5. **Cartão corporativo físico + cartões virtuais** para subscrições SaaS e compras pontuais.
6. **Reservas separadas** para impostos, FX e operativa (desenvolvido abaixo).

Se parece exagerado: é, no primeiro mês. É **estritamente o mínimo** para não perder operativa quando algo falha. E algo falha sempre.
## Por que Mercury sozinho não chega

Mercury é provavelmente o melhor produto do mercado para uma LLC de não residente: onboarding online, sem custo mensal, integração decente com contabilidade e suporte razoável. Mas Mercury **não é um banco**: é uma camada software por cima de bancos partner (Choice Financial, Column N.A., Evolve). Se um partner decide cortar contigo, Mercury **não pode reabrir-te a conta** nem mover os fundos para outro partner sem a tua intervenção.

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

A arquitetura é só hardware. As regras de operação evitam os problemas reais:

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

Pergunta trimestral: "se Mercury cai amanhã, o que faço em 72 horas?". Resposta "não sei" → arquitetura mal montada.
## O que se passa quando bloqueiam (não é "se", é "quando")

Verdade operacional: **toda LLC com 18+ meses já teve pelo menos um evento de bloqueio**. O que muda é a magnitude. Respira: na Exentax isto é rotina, pomos-te em dia e a próxima revisão fecha-se numa volta, sem sobressaltos.

Bloqueio típico. É o momento de pedir ajuda. Na Exentax abrimos o caso, submetemos o que falta e respondemos à administração por ti.
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

- A pergunta correcta não é "Mercury ou Wise", é "**que arquitetura monto**".
- Mínimo: **2 contas USD + 1 multi-divisas + gateway + cartões segmentados + reservas**.
- IBAN Wise é belga, não local. Continua sujeito a declaração.
- Bloqueios são rotina previsível. A arquitetura faz a diferença entre chatice e crise.
- **Nunca misturar pessoal e LLC**, segmentar por risco, tax buffer 25-35 %, FX buffer e documentação pré-pagamento: cinco regras que poupam cinco algarismos.

Se tens uma LLC e queres que desenhemos contigo a arquitetura bancária correcta para o teu volume e perfil de risco, **vemos isto contigo** numa consulta gratuita de 30 minutos. Montar bem é barato. Montar a meio e descobrir no dia em que Mercury manda o primeiro "under review" é caro.
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).

<!-- exentax:lote26-native-v1:wise-bancos-llc-stack-bancaria-completa-pt -->
## Como ler a arquitetura bancária da LLC como um mapeamento estável em vez de uma comparação aberta de produtos

A arquitetura bancária da LLC lê-se de forma mais útil como um mapeamento estável entre papel operacional, titular da conta e país do IBAN, do que como uma comparação aberta de produtos. Entre os fornecedores operacionalmente compatíveis com perfis de LLC americana — Mercury, Wise, Stripe e Relay — cada um ocupa um papel discreto: Mercury e Relay como conta operacional dos EUA, Wise como camada multimoeda e Stripe como ingest comercial quando aplicável.

Uma nota curta no ficheiro da LLC que registe que fornecedor desempenha que papel na arquitetura atual, com a data em que a configuração foi fixada, torna a arquitetura relevável em poucos minutos sempre que uma contraparte pede dados bancários ou um conselheiro fiscal pede uma conciliação.
<!-- /exentax:lote26-native-v1:wise-bancos-llc-stack-bancaria-completa-pt -->

Antes de avançar, põe números ao teu caso: a <a href="/pt#calculadora">calculadora Exentax</a> compara, em menos de 2 minutos, a tua carga fiscal atual com a que terias com uma LLC americana corretamente declarada no teu país de residência.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

A aplicação concreta de qualquer destas normas ao seu caso depende da sua residência fiscal, da atividade da LLC e da documentação que mantenha. Este conteúdo é informativo e não substitui aconselhamento profissional personalizado.

<!-- exentax:bank-balance-v1 -->
## Arquitetura bancária equilibrada: Mercury, Relay, Slash e Wise

Não existe a conta perfeita para uma LLC. Existe a **arquitetura** correta, onde cada ferramenta cobre um papel:

- **Mercury** (operada como fintech com bancos parceiros (Choice Financial Group e Evolve Bank & Trust principalmente; Column N.A. em contas legadas), FDIC via sweep network até ao limite em vigor). Conta principal operacional para não residentes com boa UX, ACH e wires. Continua a ser uma das opções mais comprovadas para abrir a partir de fora dos EUA.
- **Relay** (suportada pela Thread Bank, FDIC). Excelente como **conta de backup** e para gestão "envelope budgeting": permite criar até 20 subcontas e 50 cartões de débito, integração profunda com QuickBooks e Xero. Se a Mercury bloquear ou pedir revisão KYC, a Relay evita que a sua operativa pare.
- **Slash** (suportada pela Column N.A. (banco com licença federal, FDIC)). Banca desenhada para operadores online: emissão instantânea de cartões virtuais por fornecedor, controlos de gasto granulares, cashback em publicidade digital. É o complemento natural quando gere Meta Ads, Google Ads ou subscrições SaaS.
- **Wise Business** (EMI multi-divisa, não é banco). Para receber e pagar em EUR, GBP, USD e outras divisas com dados bancários locais e conversão à *mid-market rate*. Não substitui uma conta US real, mas é imbatível para tesouraria internacional.
- **Wallester / Revolut Business.** Wallester traz cartões corporativos com BIN próprio para alto volume. Revolut Business funciona como complemento europeu, não como conta principal da LLC.
A recomendação realista: **Mercury + Relay como backup + Slash para operativa publicitária + Wise para tesouraria FX**. É a configuração que minimiza risco de bloqueio e reduz custo real. Na Exentax abrimos e configuramos esta arquitetura como parte da constituição.

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
- **Revolut Business**: quando associado a uma **LLC norte-americana**, opera sob **Revolut Technologies Inc.** com **Lead Bank** como banco parceiro nos EUA. A conta entregue é uma conta dos EUA (routing + account number); **não é emitido IBAN europeu** a uma LLC. Os IBAN europeus (lituanos, BE) são da **Revolut Bank UAB** e são emitidos a clientes europeus do grupo. Se lhe oferecerem um IBAN europeu associado à sua LLC, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.

<!-- exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-pt -->
## Porque é que uma arquitetura bancária com vários carris traz estabilidade operacional

Construir uma arquitetura bancária com vários carris para uma LLC não é uma questão de redundância teórica; é uma questão de continuidade operacional. Quando um único fornecedor centraliza todos os fluxos, qualquer revisão interna ou simples manutenção técnica pode interromper a atividade durante vários dias. Em contrapartida, uma arquitetura que separa os carris de receção, os carris de pagamento a fornecedores e os carris de câmbio reduz a exposição a um único ponto de falha e suaviza o planeamento de tesouraria.

Um esquema simples e duradouro consiste em atribuir a cada carril uma função clara e evitar sobreposições: um carril principal para os fluxos operacionais, um carril secundário de câmbio para os pagamentos internacionais e uma conta dedicada exclusivamente às distribuições ao membro. Esta repartição acelera as reconciliações, facilita as conversas com a contabilidade e limita as surpresas quando um dos fornecedores introduz uma alteração de tarifário ou de política de aceitação.
<!-- /exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-pt -->

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS evoluíram nos últimos anos; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS. Respira: na Exentax isto é rotina, pomos-te em dia e a próxima revisão fecha-se numa volta, sem sobressaltos.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## O que deve levar consigo

Leia esta secção como uma checklist exigente: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Factos bancários e fiscais que convém precisar

## Factos jurídicos e processuais

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

<!-- exentax:execution-v2 -->
## Wise + bancos para LLC: a arquitetura bancária completa que qualquer não residente devia ter

A pergunta "Mercury ou Wise?" está mal colocada. A resposta correcta é "ambos, mais Stripe, mais alternativa".

- **Camada 1: conta operativa principal (Mercury).** Recebe Stripe payouts, paga vendors via ACH gratuito, cartão USD, integra QuickBooks.
- **Camada 2: backup e multi-moeda (Wise Business).** USD/EUR/GBP. Recebe clientes UE directamente em EUR (SEPA local, não SWIFT). Se Mercury fecha, Wise continua.
- **Camada 3: gateway de pagamento (Stripe + alternativo).** Stripe US conectado a Mercury. Lemon Squeezy/Dodo como MoR para vendas digitais UE.
- **Camada 4: tesouraria e FX optimizado.** Conta Wise EUR para reservas.

### Arquitetura completa típica

LLC Wyoming + EIN + Mercury + Wise Business + Stripe + Lemon Squeezy + PayPal. Custo mensal ~50-100$ para volume &lt;100k$/ano.

### O que mais nos perguntam

**Mercury ou Wise para Stripe payout?** Mercury algo mais rápido.

**Brex/Ramp para LLC pequena?** Tipicamente não abaixo de 500k$/ano.

Na Exentax montamos a arquitetura completa como um pacote chave-na-mão.
<!-- /exentax:execution-v2 -->

## O seu próximo passo com a Exentax

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

  ### Arquitetura bancária de uma LLC americana: enquadramento para residentes em Portugal e Brasil

  Para um residente fiscal em **Portugal**, a arquitetura bancária típica de uma LLC americana combina **Wise Business Europe SA** (registada na Bélgica sob BCE 0708.022.075, supervisionada pelo **Banco Nacional da Bélgica** como instituição de moeda eletrónica nos termos da DSP2, transposta para o direito português pelo **DL 91/2018**) com uma conta operacional nos EUA — tipicamente **Mercury** (que opera através das partner banks **Column N.A.** e **Choice Financial Group**, FDIC #14583, garantindo a cobertura FDIC de USD 250.000 por depositante e categoria nos termos do **12 CFR §330**).

  **Obrigações declarativas em Portugal:**

  A titularidade de contas em instituições financeiras estrangeiras deve ser comunicada à **Autoridade Tributária** através do **Anexo J do Modelo 3 do IRS** (rendimentos obtidos no estrangeiro), nos termos do **art. 63.º-A da LGT** e do **DL 64/2016**. Saldos superiores a €50.000 desencadeiam adicionalmente a obrigação de comunicação no **Modelo 38** (instituições financeiras) por reciprocidade CRS. As normas de **prevenção do branqueamento de capitais** seguem a **Lei 83/2017** que transpõe a Diretiva (UE) 2015/849, com **CDD reforçada** acima de €15.000 e Source-of-Funds obrigatório.

  **Estrutura para residentes no Brasil:**

  Brasileiros residentes devem cumprir a **Declaração de Capitais Brasileiros no Exterior (DCBE)** ao Banco Central do Brasil quando o saldo agregado das aplicações no exterior superar **USD 1.000.000** em 31 de dezembro (anual) ou **USD 100.000.000** trimestralmente, nos termos da **Resolução BCB 4.973/2021** e do novo **marco cambial da Lei 14.286/2021** em vigor desde 31/12/2022. A LLC americana é declarada como pessoa jurídica controlada no exterior através da **Declaração de Imposto de Renda Pessoa Física (DIRPF)** ficha de Bens e Direitos código 31. A **Solução de Consulta COSIT 14/2018** confirma a transparência fiscal das LLCs unipessoais para fins de IRPF brasileiro, com tributação direta dos rendimentos ao sócio pela Tabela Progressiva (alíquota máxima 27,5 %).

<!-- exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa -->
## A arquitetura bancária vista de dentro da LLC

Quando se olha para a arquitetura bancária de uma LLC ao longo de doze
meses, em vez de no momento da abertura, três padrões surgem. O
primeiro é a complementaridade entre Mercury e Wise Business: o
Mercury serve como conta operacional em USD com routing americano,
o Wise serve como recetáculo multi-moeda para clientes fora do USD.
O segundo é o lugar do Stripe quando a atividade ganha volume: o
gateway de pagamento vive sobre a conta americana e alimenta o
Mercury, que por sua vez alimenta o Wise para a parte em EUR, GBP
e MXN. O terceiro é o uso do Relay como alternativa ao Mercury
quando o perfil do sócio e o estado de constituição encaixam melhor
do lado do Relay.

Nenhuma destas escolhas é definitiva. O reflexo sóbrio do sócio
não residente é escrever numa página a cartografia dos fluxos de
entrada e saída previstos para os próximos doze meses, e ler essa
página em voz alta. Se a frase que dela sai for clara — por
exemplo "o Stripe US recebe, o Mercury guarda o float operacional,
o Wise distribui em EUR" — a arquitetura está correta. Se hesita, é
porque está uma camada a mais ou uma camada a menos. Esta
documentação honesta da decisão protege a LLC melhor da que
qualquer arquitetura sofisticada.

Uma segunda observação: tanto o Mercury como o Wise produzem
exportações contabilísticas muito limpas, o que torna a
reconciliação mensal num exercício praticamente automático assim
que as contas estão bem separadas no plano de contas. Escrevemos
com cada cliente uma directriz interna curta sobre a prática de
conversão (quando ficar em EUR, quando voltar para USD), para que
a decisão cambial seja baseada em regras e não discricionária e
para que as conversas de fecho de ano sejam mais curtas.

<!-- /exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa -->

<!-- exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa-bis -->
## Uma última observação sobre Mercury, Wise e Stripe

Os setups de LLC mais serenos que acompanhamos combinam três
princípios simples. Primeiro: cada conta tem um propósito claro
que pode ser expresso numa frase ("Mercury guarda o float US",
"Wise distribui EUR e GBP", "Stripe recolhe pagamentos por
cartão US"). Segundo: nenhuma camada se abre "para mais tarde";
abre-se quando a actividade efectivamente a justifica. Terceiro:
a reconciliação mensal faz parte da rotina, não é um projecto de
fim de ano.

<!-- /exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa-bis -->

<!-- exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa-ter -->
## Uma última recomendação prática

Recomendamos abrir uma vez por trimestre todas as contas activas
— Mercury, Wise e eventualmente Stripe ou Relay — junto com a
exportação contabilística, verificar a morada registada e rever o
documento de mandato actual. Esta breve sessão poupa mais tempo
no futuro do que custa hoje.

<!-- /exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa-ter -->

<!-- exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-pt-bis -->
## Como posicionar Mercury e Wise na arquitetura sem os colocar em concorrência

Mercury e Wise ocupam na arquitetura funções distintas e não concorrentes: Mercury serve habitualmente como carril de receção e pagamentos em USD, ao passo que Wise serve como carril de câmbio multi-divisa para pagamentos internacionais. Esta repartição funcional evita pedir a um único fornecedor que cubra casos de uso que não são o seu núcleo e facilita a conversa com cada equipa de conformidade, que vê assim um perfil coerente.
<!-- /exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-pt-bis -->

<!-- exentax:cross-refs-v1 -->
## Para continuar a leitura

- [Wise Business com a sua LLC: o guia multi-moeda completo](/pt/blog/wise-business-com-sua-llc-o-guia-completo-de-gestao-multi)
- [Wise IBAN e LLC: o que é realmente reportado às autoridades fiscais](/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades)
- [Trocar divisas para a sua LLC: melhores opções e como evitar taxas ocultas](/pt/blog/trocar-divisas-para-sua-llc-melhores-opcoes-e-como-evitar)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:defensa-fiscal-v1 -->
## E se as Finanças me perguntarem pela minha LLC?

  É a pergunta mais frequente na primeira consulta, e a resposta curta é: a tua LLC não é opaca e, corretamente declarada, uma inspeção fecha-se em formulários standard. As Finanças portuguesas, a Receita Federal brasileira ou a SEFAZ estadual podem pedir o Certificate of Formation do estado (Wyoming, Delaware ou Novo México), o EIN emitido pelo <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o Operating Agreement assinado, os extratos da Mercury ou Wise do exercício, o Form 5472 com 1120 pro-forma apresentado e a contabilidade que reconcilia receitas, despesas e movimentos. Se tudo isso existir e for entregue ordenado, a inspeção não escala. Fechamos isto contigo a partir da Exentax: uma chamada, submissão feita, arquivo pronto, o risco fica no papel.

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Quando%20algu%C3%A9m%20abre%20uma%20LLC%20desde%20fora%20dos%20EUA%2C%20a%20conversa%20banc%C3%A1ria%20reduz-se%20q%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;