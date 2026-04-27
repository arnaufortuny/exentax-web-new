export default `Se tens a tua LLC há tempo e o Mercury, o Wise ou a tua passarela te pedem de repente documentação adicional sobre a origem dos fundos, não estás sozinho. É um dos pedidos que mais ansiedade gera e quase sempre um dos mais fáceis de resolver bem se for abordado com ordem.

Chave: não é suspeita. É processo regulamentar de revisão periódica. O que decide o desfecho não é o que tens, é **como o apresentas**.

## O que é uma segunda ronda KYC

Revisão periódica re-verifica: beneficiário efectivo, natureza do negócio, origem dos fundos, coerência com o que foi declarado na abertura.

Disparadores: volume acumulado, mudança de padrão, renovação periódica (12-36 meses), info pontual.
### O que será tipicamente pedido

- **Identificação actualizada**.
- **Articles of Organization** actuais.
- **EIN Confirmation Letter** ou 147C.
- **BOI Report confirmation**.
- **OA assinado**.
- **Descrição do negócio**.
- **Justificativos de rendimentos**: facturas, contratos, extractos das passarelas.
- **Origem dos fundos iniciais** se a pergunta apontar a aporte de capital.
- **Declarações fiscais** em alguns casos.
### Princípio rector: narrativa coerente

As instituições procuram **coerência** entre o que disseste na abertura, o BOI, os extractos e o que dizes agora.
## Procedimento

### Passo 1. Ler o email com calma
A maioria dos pedidos é específica (4-7 documentos, prazo 7-14 dias).

### Passo 2. Recolher pacote actual
Articles, EIN Letter, OA, BOI confirmation, passaporte e prova de morada vigentes, 5-10 facturas representativas.

### Passo 3. Preparar descrição do negócio numa página
O que faz a LLC, a quem vende, como cobra, quanto factura, origem dos fundos iniciais.

### Passo 4. Justificar origem dos fundos
- Serviços profissionais: facturas + contratos + extractos.
- SaaS: dashboard Stripe/Paddle + payouts conciliados.
- E-commerce: Shopify/Amazon + payouts + facturas de fornecedores.
- Aportes iniciais: extracto da conta de origem.
- Cripto: histórico do exchange + on-chain.

### Passo 5. Enviar pacote completo num único envio
Com email de introdução enumerando os anexos por ordem.

### Passo 6. Manter disponibilidade
Responder em 24-48h às clarificações.
### O que NÃO fazer

- Responder à pressa sem coerência.
- Mover dinheiro "para alívio".
- Mentir ou exagerar.
- Mudar morada ou dados do perfil durante a revisão.
- Ignorar o email.
### Quando o apoio profissional compensa

- Volumes altos.
- Operativa multi-país/multi-divisa complexa.
- Histórico com incidentes prévios.
### Como o abordamos na Exentax

Na Exentax acompanhamos rondas KYC com regularidade. Agenda uma sessão inicial gratuita na nossa página de agendamento.
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

### Notas por provedor

- **Mercury** opera com vários bancos parceiros com licença federal e cobertura **FDIC** via sweep network: principalmente **Choice Financial Group** e **Evolve Bank & Trust**, e ainda **Column N.A.** em algumas contas legadas. Mercury não é um banco; é uma plataforma fintech suportada por esses partner banks. Se a Mercury encerrar uma conta, o saldo é normalmente devolvido **por cheque em papel enviado para a morada registada do titular**, o que pode ser um problema operacional sério para não residentes; convém manter uma conta secundária (Relay, Wise Business, etc.) como contingência.
- **Wise** tem dois produtos claramente distintos: **Wise Personal** e **Wise Business**. Para uma LLC abre-se **Wise Business**, não a conta pessoal. A entidade europeia é **Wise Europe SA (Bélgica)**, que emite IBAN BE para EUR; os IBAN lituanos só persistem em contas europeias herdadas. **Wise Business titularidade de uma LLC dos EUA fica FORA do CRS** porque a titular é uma entidade dos EUA e os EUA não são jurisdição participante do CRS; o lado USD opera via Wise US Inc. (perímetro FATCA, não CRS). Apenas uma **Wise Personal aberta por um indivíduo residente fiscal numa jurisdição CRS** (p. ex. Espanha) é reportada via Wise Europe SA (Bélgica) sobre esse indivíduo.
- **Wallester** (Estónia) é uma entidade financeira europeia com licença EMI/banco emissor de cartões. As suas contas IBAN europeias **estão dentro da Norma Comum de Comunicação (CRS)** e geram, por isso, troca automática de informação para a administração fiscal do país de residência.
- **Payoneer** opera através de entidades europeias (Payoneer Europe Ltd, Irlanda) também **no âmbito do CRS** para clientes residentes em jurisdições participantes.
- **Revolut Business**: quando associado a uma **LLC norte-americana**, opera sob **Revolut Technologies Inc.** com **Lead Bank** como banco parceiro nos EUA. A conta entregue é uma conta dos EUA (routing + account number); **não é emitido IBAN europeu** a uma LLC. Os IBAN europeus (lituanos, BE) são da **Revolut Bank UAB** e são emitidos a clientes europeus do grupo. Se lhe oferecerem um IBAN europeu associado à sua LLC, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> e do <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> mudaram em recent years; eis o estado atual:
### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

<!-- exentax:execution-v2 -->
## Justificar origem de fundos em KYC bancário: a "segunda ronda" que quase ninguém prepara

A primeira ronda de KYC passa-se com passaporte e morada. A segunda ronda - que chega aos 3-9 meses com a primeira entrada significativa - é onde caem 30% das contas. É a fase do "queremos entender de onde vem este dinheiro".

- **O que lhe vão pedir.** Source of Wealth (como construiu o seu património em geral) e Source of Funds (origem específica do dinheiro que entra hoje). Documentos típicos: declarações de IRS dos últimos 2-3 anos, contratos de venda de activos anteriores, extractos bancários com acumulação, contratos dos clientes que geram os rendimentos actuais.
- **O que passa o filtro sem discussão.** Rastreabilidade linear: declaração ano X mostra rendimento, banco origem mostra acumulação, transferência entrante de cliente identificado com contrato de serviços e factura emitida pela sua LLC. Cada euro tem papel atrás.
- **O que dispara um alerta.** Depósitos em dinheiro recentes, transferências de contas terceiras sem justificar relação, cripto convertido sem rastreabilidade on-chain documentada, "empréstimos familiares" sem contrato notarial.
- **Quando preparar.** Antes da primeira entrada >25.000 EUR/USD, não depois do pedido do banco. Pasta digital pronta = resposta em 24 horas; sem ela, 3-6 semanas e possível encerramento.

### O que mais nos perguntam

**Cripto convertido em fiat é problemático?** Sim, salvo rastreabilidade on-chain completa: carteiras próprias, transacções identificáveis, declaração do ano da mais-valia e da conversão. Sem isto, quase todos os bancos classificam como risco.

**E se os fundos vierem de uma venda de empresa há anos?** Passa o filtro desde que tenha: contrato de venda, escritura de cancelamento de participação, extractos do banco original, declaração do ano (com mais-valia) e rastreabilidade até à conta actual.

Na Exentax preparamos o dossier de Source of Wealth/Funds antes da primeira operação significativa: documentos, narrativa coerente e tradução juramentada quando aplica - para que a segunda ronda não congele a sua operativa.
<!-- /exentax:execution-v2 -->

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

## Factos jurídicos e processuais

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

### Leituras adicionais relacionadas

Detalhe prático a fixar antes de agir. A maioria do dano evitável que vemos neste ponto vem de saltar a documentação, não da lógica fiscal subjacente.
### O que vão tipicamente pedir-lhe

Nota de campo de quem corre isto mês a mês com clientes: a regra é simples, é na execução que rebenta. Planeie o operacional antes do jurídico.

### Princípio orientador: narrativa coerente

Detalhe prático a fixar antes de agir. A maioria do dano evitável que vemos neste ponto vem de saltar a documentação, não da lógica fiscal subjacente.

### Passo 1. Ler o e-mail com calma e em detalhe

### Passo 2. Reunir o seu pacote atual

### Passo 3. Preparar a descrição do negócio numa página

Este é um dos pontos que auditamos primeiro quando assumimos um processo. Se não estiver limpo aqui, qualquer hipótese a jusante torna-se negociável perante a autoridade.

## O caso específico do residente fiscal em Portugal

  A AT portuguesa, em sintonia com as obrigações KYC dos bancos europeus e americanos, exige na segunda ronda de due diligence cópia da **última declaração Modelo 3 do IRS** com anexo correspondente à categoria B ou G, comprovativos bancários portugueses dos últimos 12 meses, e declaração da AT sobre situação tributária regularizada (artigo 64.º do CPPT).

  ### Considerações práticas adicionais para o residente em Portugal

  A AT pode emitir, mediante pedido formal apresentado no portal das Finanças, uma declaração de situação tributária regularizada ao abrigo do artigo 64.º do CPPT no prazo de cinco dias úteis. Esta declaração é frequentemente solicitada por Mercury, Relay e Wise como prova adicional de cumprimento fiscal local.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Se%20tens%20a%20tua%20LLC%20h%C3%A1%20tempo%20e%20o%20Mercury%2C%20o%20Wise%20ou%20a%20tua%20passarela%20te%20pedem%20de%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
