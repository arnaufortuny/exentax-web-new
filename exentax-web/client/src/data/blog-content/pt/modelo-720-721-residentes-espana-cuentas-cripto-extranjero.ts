export default `Se és residente fiscal em Espanha e tens uma <a href="/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em">LLC americana</a>, uma conta Wise ou Mercury, um broker no estrangeiro ou qualquer saldo relevante em criptomoedas fora de uma exchange espanhola, duas declarações marcam a fronteira entre estar em ordem e ter um problema sério: o **Modelo 720** e o **Modelo 721**. Quase todos os outros artigos deste blog os referem de passagem; este é o artigo de referência para os entender a fundo.

## O que é o Modelo 720

O **Modelo 720** é a "declaração informativa sobre bens e direitos situados no estrangeiro". Foi criado pela Lei 7/2012 de prevenção e luta contra a fraude fiscal e desenvolvido pela **Ordem HAP/72/2013**, posteriormente modificada pela Ordem HFP/887/2023. Não é um imposto: não liquida quota. É um regime informativo que obriga residentes fiscais em Espanha a declarar a titularidade e o saldo de determinados bens situados fora de Espanha quando os limites legais são ultrapassados.

Cobre três blocos separados, cada um com o seu próprio limite agregado de 50.000 €:

| Bloco | Conteúdo | Limite |
| --- | --- | --- |
| Bloco I: Contas | Contas correntes, de poupança, de depósito, de crédito e quaisquer outras em entidades financeiras situadas no estrangeiro | 50.000 € (saldo a 31/12 ou saldo médio do 4.º trimestre) |
| Bloco II: Valores, direitos, seguros e rendas | Ações, participações em fundos, obrigações, direitos representativos, seguros de vida ou invalidez, rendas vitalícias ou temporárias | 50.000 € (valor a 31/12) |
| Bloco III: Imóveis e direitos sobre imóveis | Imóveis e direitos reais sobre imóveis situados no estrangeiro | 50.000 € (valor de aquisição) |

Cada bloco avalia-se separadamente. A obrigação nasce quando o limite é ultrapassado em **pelo menos um** bloco.
### O que é o Modelo 721

O **Modelo 721** é o irmão cripto do 720. É regulado pela **Ordem HFP/886/2023, de 26 de julho**, em desenvolvimento do Real Decreto 249/2023, e exige declarar as **moedas virtuais situadas no estrangeiro** cujo saldo conjunto a 31 de dezembro ultrapasse **50.000 €**. A primeira campanha já foi apresentada (sobre o exercício anterior).

Uma cripto considera-se "situada no estrangeiro" quando é custodiada por entidade ou pessoa não residente em Espanha (Coinbase US, Kraken, Binance fora da entidade espanhola, Ledger em self-custody com serviço associado de prestador estrangeiro, etc.). Se a tua cripto está em entidade **registada no Banco de Espanha** ou em **self-custody pura** sem prestador estrangeiro associado, o 721 não se aplica (mas pode aplicar-se a **Disposição Adicional 13.ª da LIRPF**: declaração interna por prestadores espanhóis).
### Quem está obrigado

Estão obrigados a apresentar o 720 e/ou o 721:

- **Pessoas singulares** residentes fiscais em Espanha (art. 9 LIRPF: 183 dias, centro de interesses económicos, núcleo de interesses vitais).
- **Pessoas coletivas** residentes em território espanhol.
- **Estabelecimentos estáveis** em Espanha de entidades não residentes.
- **Comunhões de bens e heranças jacentes** do art. 35.4 LGT.
- **Beneficiários efetivos** (controlling persons), mesmo que a titularidade jurídica formal pertença a outra pessoa ou entidade. É aqui que a LLC americana faz sentido: se és beneficiário efetivo de uma <a href="/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em">LLC americana</a> e a LLC tem uma conta Wise ou Mercury, és pessoalmente obrigado a declarar essa conta como bem situado no estrangeiro.
### Prazos e forma de apresentação

- **Modelo 720**: de 1 de janeiro a **31 de março** do ano seguinte ao exercício reportado. Apenas online (Sede Eletrónica da AEAT, certificado ou Cl@ve).
- **Modelo 721**: de 1 de janeiro a **31 de março** do ano seguinte. Apenas online.

Após a primeira apresentação, **só é preciso voltar a apresentar** se no bloco concreto houver um **aumento superior a 20.000 €** face ao saldo declarado ou se algum elemento previamente declarado tiver sido cancelado.
## A sentença TJUE C-788/19 e o regime sancionatório atual

O regime sancionatório original do 720 foi um dos mais severos da UE: 5.000 € por dado omitido (mínimo 10.000 €), imprescritibilidade dos rendimentos não declarados como ganho patrimonial não justificado (art. 39.2 LIRPF) e sanção de 150 % sobre a quota.

A **sentença do TJUE de 27 de janeiro de 2022, processo C-788/19**, declarou esse regime contrário ao Direito da União por desproporcional e por violar a livre circulação de capitais. A Lei 5/2022, de 9 de março, eliminou essas sanções específicas.

Isto **não significa** que já não haja sanções. O que se aplica hoje:

- **Sanção ordinária** do art. 198 LGT por não apresentar declaração informativa: 20 € por dado, mínimo 300 €, máximo 20.000 €. Reduzida a metade se apresentada sem requerimento prévio.
- **Regime geral da LGT** para as quotas devidas no IRPF se forem detetados rendimentos não declarados: art. 191 (sanção de 50 a 150 % da quota), com prazo geral de **prescrição de 4 anos**.
- **Via penal** (art. 305 CP) se a quota defraudada num exercício ultrapassar 120.000 €.

A sentença europeia suavizou o regime, mas não derrogou a obrigação de informar. Quem não apresenta o 720 continua a cometer infração tributária.
## Como Wise, Mercury, Revolut e a tua LLC se encaixam

É aqui que vemos mais erros. Por partes.

### Contas Wise / Revolut / N26 / Wallester (entidades europeias)

São contas em entidades financeiras situadas no estrangeiro (Bélgica, Lituânia, Alemanha, Estónia). Se a titular é a tua LLC americana e tu és o beneficiário efetivo, vão ao **Bloco I do 720** quando o limite agregado de 50.000 € for atingido. Detalhado em <a href="/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades">o que a Wise reporta às autoridades</a> e em <a href="/pt/blog/revolut-business-e-crs-o-que-e-reportado-a-sua-autoridade">Revolut Business e CRS</a>. Estas contas chegam à AEAT também via CRS, pelo que o cruzamento é automático.

### Mercury, Relay, banca americana

Os EUA não aderiram ao CRS, mas isso **não isenta do 720**. A obrigação espanhola é independente da troca internacional: se a tua conta Mercury tiver saldo ou saldo médio Q4 superior a 50.000 € agregado com outras contas estrangeiras, deves declará-la. Ver <a href="/pt/blog/as-contas-bancarias-americanas-reportam-a-sua-autoridade">as contas americanas reportam à tua autoridade fiscal</a>.

### Brokers estrangeiros (Interactive Brokers, Tastytrade, etc.)

As posições em valores vão ao **Bloco II** (limite 50.000 € a 31/12 a valor de mercado). Quando geram dividendos ou juros, esses fluxos chegam à autoridade via CRS desde a jurisdição do broker.

### Criptomoedas em exchanges estrangeiras

Coinbase, Kraken, Binance internacional, KuCoin, Bybit, etc.: prestadores não residentes. Saldo agregado a 31/12 acima de 50.000 € → **Modelo 721**. Com DAC8 a partir de hoje o cruzamento será ainda mais rápido (<a href="/pt/blog/dac8-e-criptomoedas-o-novo-reporting-fiscal-automatico-em">DAC8 e reporting cripto</a>).

### Self-custody pura

Uma hardware wallet sem prestador estrangeiro associado está tecnicamente fora do 721. Mas se os fundos geram rendimento (staking, DeFi) através de plataformas estrangeiras, essas plataformas podem ativar a obrigação.
### O que reportar exatamente

Para cada conta, valor ou cripto:

- ID do titular e, se aplicável, do beneficiário efetivo.
- ID da entidade: nome, NIF ou equivalente, morada.
- ID da conta ou ativo: IBAN, número, ISIN, ticker da cripto.
- Data de abertura ou aquisição e, se aplicável, de cancelamento ou alienação.
- Saldos: saldo a 31/12 e saldo médio Q4 (contas) ou valor a 31/12 (valores e cripto).
- Tipo de bem segundo a classificação oficial.

A apresentação faz-se por blocos, com chaves específicas por situação (titular único, cotitularidade, autorizado, beneficiário, etc.).
## Erros típicos que vemos todas as semanas

1. **"Como o meu Wise está nos EUA (Wise US Inc.), não declaro."** Só se aplicaria se a conta estivesse mesmo na Wise US Inc., o que é excecional desde a Europa. A maioria das contas Wise de residentes europeus está na Wise Europe SA (Bélgica) e vai ao 720.
2. **"A LLC é a titular, não eu."** És o beneficiário efetivo e, como residente fiscal em Espanha, a obrigação recai sobre ti.
3. **"30.000 € em Wise e 25.000 € em Mercury, não chego ao limite."** O limite é **agregado** dentro de cada bloco. 30.000 + 25.000 = 55.000 € → ambas as contas devem ser declaradas.
4. **"Já declarei uma vez, basta."** Há que voltar a declarar se houver aumento superior a 20.000 € ou se algum elemento for cancelado.
5. **"Tenho cripto na Binance mas indico Binance Spain."** Se a tua conta está na Binance internacional (e não na entidade registada no Banco de Espanha), tens de a refletir como exchange estrangeira.
6. **"Como o TJUE eliminou as sanções, deixei de apresentar."** O TJUE anulou o regime específico desproporcional, não a obrigação. Mantêm-se o art. 198 LGT e o art. 191.
7. **"Se apresentar com 3 anos de atraso, dão cabo de mim."** O razoável é apresentar **complementares sem requerimento prévio**: sanções reduzidas a metade e cenário de inspeção evitado.
### Como o tratamos na Exentax

O nosso processo para o 720/721 quando entra um cliente com LLC + fintechs europeias + cripto:

1. **Inventário completo** de contas, brokers, exchanges e wallets, com identificação clara da entidade gestora e da sua jurisdição.
2. **Determinação da obrigação** por blocos e limites, distinguindo titularidade jurídica e beneficiário efetivo.
3. **Reconciliação** com dados CRS / DAC já cruzados pela AEAT.
4. **Apresentação** do 720 e, se aplicável, do 721, com codificação correta de cada elemento.
5. **Plano de regularização** para exercícios anteriores não declarados, priorizando complementares sem requerimento.
6. **Integração** com o resto do planeamento: <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">desenho de estrutura internacional</a>, <a href="/pt/blog/tributacao-da-llc-segundo-a-atividade-economica-servicos">tributação LLC por atividade</a> e <a href="/pt/blog/crs-para-residentes-em-espanha-e-latam-implicacoes-reais">CRS para residentes em Espanha</a>.
### Em resumo

O Modelo 720 e o Modelo 721 são obrigações informativas, não impostos. Não custam dinheiro por si próprios, mas a sua omissão custa: sanção do art. 198 LGT, regularização de quotas com agravamentos do art. 191 e, em saldo não justificado, o clássico art. 39 LIRPF (atenuado pelo TJUE mas não eliminado). O cruzamento com CRS e, a partir de hoje, com DAC8, torna a pegada cada vez mais visível para a AEAT.

Se tens Wise, Mercury, Revolut, brokers estrangeiros ou cripto fora de Espanha e não estás 100 % seguro da tua posição face ao 720/721, revemos contigo e deixamos a tua situação limpa antes da próxima campanha.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:bank-balance-v1 -->
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
## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.<!-- exentax:execution-v2 -->
## Modelos 720 e 721: as duas declarações que mais sanções geram a residentes em Espanha

Os modelos 720 (bens no estrangeiro) e 721 (criptos no estrangeiro) são as duas declarações informativas que mais expedientes sancionatórios abrem a residentes espanhóis com estrutura internacional. Não geram imposto, mas a omissão ou apresentação incorrecta activa sanções formais.

- **Modelo 720: o que se declara.** Contas bancárias no estrangeiro, valores e participações em entidades estrangeiras, imóveis no estrangeiro, quando o saldo agregado em cada bloco supere 50.000 EUR a 31 de Dezembro.
- **Modelo 721: criptos.** Específico para saldos crypto custodiados por exchanges estrangeiros (Binance, Coinbase, Kraken). Limiar: 50.000 EUR. Prazo: Janeiro-Março do ano seguinte.
- **Regime sancionatório actual.** Após o acórdão TJUE de Janeiro 2022 (C-788/19) e reforma, o antigo regime específico do 720 foi declarado contrário ao direito UE. Sanções actuais: regime geral LGT.
- **O que convém saber.** Uma LLC americana cujo sócio seja residente espanhol obriga a declarar a participação (720) quando supera o limiar.

### O que mais nos perguntam

**Se a LLC for disregarded, as suas contas são "minhas" para o 720?** A AT lê-o assim em muitos casos. Melhor declarar.

**Cripto em wallet própria (Ledger, Trezor) entra no 721?** Não por defeito: 721 cobre cripto custodiada por terceiros. Self-custody: 714 (Património) acima do limiar regional.

Na Exentax revemos o que tem de declarar segundo a sua situação real.
<!-- /exentax:execution-v2 -->

## Como trabalhamos na Exentax

A nossa equipa é especializada em estruturas fiscais internacionais para residentes de países de língua espanhola que operam negócios online. Combinamos conhecimento local de Espanha, Andorra e América Latina com experiência operacional na constituição de entidades em Delaware, Wyoming, Estónia e outras jurisdições. Cada caso começa com uma consulta gratuita na qual avaliamos a residência, a atividade e os objetivos, e dizemos-lhe honestamente se a estrutura proposta faz sentido ou se uma alternativa mais simples é suficiente.

<!-- task9-2026-expansion -->
## Como apresentar o Modelo 720 passo a passo em: formulário, casas e exemplos práticos

Para além do enquadramento legal, a pergunta repete-se semanalmente em consulta: "tenho Wise, Mercury, uma corretora e cripto, como apresento isto sem erros?". Este bloco traduz a norma num tutorial aplicável à campanha de **1 de janeiro a 31 de março de 2026**.

### Acesso e limiar de obrigação

O Modelo 720 entrega-se exclusivamente online na Sede Electrónica da AEAT com certificado digital, DNIe ou Cl@ve PIN. A obrigação nasce quando, em 31 de dezembro, o **bloco de contas bancárias no estrangeiro** ultrapassa **50.000 EUR**, com a mesma regra aplicada de forma independente ao **bloco de valores, seguros e rendas** e ao **bloco de imóveis**. Nos anos seguintes, um aumento superior a 20.000 EUR num bloco já declarado reabre a obrigação. A doutrina vigente vem da Ley 7/2012 e do acórdão TJUE C-788/19 de 27 de janeiro de 2022, que derrubou o regime sancionatório desproporcionado mas manteve o dever informativo.

### Casas que mais erros geram

- **Tipo de declaração (1)**: marcar "informativa", "complementaria" ou "sustitutiva". Confundi-las obriga a refazer tudo.
- **Código do declarante (2)**: titular, autorizado, beneficiário ou representante. Para Wise Personal em EUR o código é titular; para Wise Business ou Mercury da LLC, o titular é a sociedade e assina como representante.
- **Saldo a 31/12 (V) e saldo médio do último trimestre (M)**: ambos em EUR ao câmbio oficial do Banco Central Europeu de 31 de dezembro de 2025.
- **Identificação da instituição e do país**: NIF da instituição se existir, código BIC e código ISO do país. Wise aparece como Wise Payments Limited (UK) ou Wise US Inc. consoante o produto; Mercury opera via Choice Financial Group e Column N.A. nos EUA.

### Exemplo numérico, bloco a bloco

Freelancer residente em Madrid com: Wise EUR saldo 18.400 EUR, Mercury Personal Savings 22.300 USD, Interactive Brokers carteira 41.000 EUR, Kraken com 6.200 EUR em BTC e ETH. Bloco contas: 18.400 mais 22.300 USD ao câmbio BCE dão aproximadamente 39.000 EUR, abaixo do limiar, **sem obrigação**. Bloco valores: 41.000 EUR, abaixo do limiar, **sem obrigação**. Bloco cripto (Modelo 721): 6.200 EUR, abaixo de 50.000 EUR, **sem obrigação**. Se no ano seguinte aterrarem 35.000 EUR na Mercury, o bloco contas sobe a 74.000 EUR e dispara um Modelo 720.

### Erros que mais sanções produzem em

1. Esquecer as contas Wise Business e Mercury da LLC quando o sócio é beneficiário efetivo.
2. Não voltar a declarar após um aumento superior a 20.000 EUR face ao último 720.
3. Confundir o saldo médio do último trimestre com a média anual.
4. Apresentar tarde voluntariamente: as sanções são leves, mas aplicam-se as majorações do artigo 27 LGT.

> **O seu stack roça os 50.000 EUR por bloco?** Passe os saldos pela <strong>calculadora fiscal da Exentax</strong> e veja se mudar para uma LLC bem declarada compensa a complexidade atual.

Para a camada bancária a montante do 720 leia <a href="/pt/blog/as-contas-bancarias-americanas-reportam-a-sua-autoridade">o que os bancos americanos reportam de facto ao seu fisco</a>, e para a estratégia global <a href="/pt/blog/caminhos-legais-para-minimizar-impostos">os caminhos legais para pagar o mínimo de impostos</a>. Para delegar a apresentação, <strong>agende uma sessão com a equipa Exentax</strong> e fechamos numa semana.

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Se%20%C3%A9s%20residente%20fiscal%20em%20Espanha%20e%20tens%20uma%20LLC%20americana%2C%20uma%20conta%20Wise%20ou%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisão editorial pendente</strong> — As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…re tres bloques separados, cada uno con su propio umbral de 50.000 € agregados: | Bloque |…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">20.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…bloque concreto se ha producido un **incremento superior a 20.000 €** respecto al saldo de…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">5.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…el 720 fue uno de los más severos del ordenamiento europeo: 5.000 € por dato omitido (míni…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">10.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…del ordenamiento europeo: 5.000 € por dato omitido (mínimo 10.000 €), imprescriptibilidad …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">150%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…patrimonial no justificada (art. 39.2 LIRPF) y sanción del 150% sobre la cuota. La **Sente…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">120.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…(art. 305 CP) si la cuota defraudada en un ejercicio supera 120.000 €. La sentencia europe…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">30.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…de la LLC no cambia la obligación informativa. 3. **&quot;Tengo 30.000 € en Wise y 25.000 € en …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…a la obligación informativa. 3. **&quot;Tengo 30.000 € en Wise y 25.000 € en Mercury, no llego …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">55.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…al es **agregado** dentro de cada bloque. 30.000 + 25.000 = 55.000 € → obligado a declarar…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">100%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ut, brokers extranjeros o cripto fuera de España y no estás 100% seguro de tu posición fre…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…r&quot;&gt;OCDE&lt;/a&gt; con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">18.400</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…de un freelancer residente en Madrid con: Wise EUR balance 18.400 €, Mercury Personal Savi…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">22.300</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…id con: Wise EUR balance 18.400 €, Mercury Personal Savings 22.300 USD, broker Interactive…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">41.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…Savings 22.300 USD, broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">6.200</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en BTC y ETH. Bloque c…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">39.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…H. Bloque cuentas: 18.400 + 22.300 USD convertidos al BCE = 39.000 € aprox., por debajo de…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">35.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…mbral de 50.000 €, **no obliga**. Si al año siguiente añade 35.000 € a Mercury, el bloque …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">74.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…iguiente añade 35.000 € a Mercury, el bloque cuentas pasa a 74.000 € y dispara la obligaci…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…superior a 50.000 € → **Modelo 721**. Si además operas con DAC8 recientemente, el cruce se…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
