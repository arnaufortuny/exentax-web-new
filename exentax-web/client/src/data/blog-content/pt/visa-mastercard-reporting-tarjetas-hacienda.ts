export default `O Modelo 991 obriga a Visa, Mastercard e American Express a reportar à AEAT espanhola qualquer cobrança ou pagamento por cartão superior a 25.000 € por titular e ano, bem como as contas associadas no estrangeiro.

Quando alguém pergunta "o Fisco vê o que eu pago com o cartão?", a resposta curta é: depende de quem emitiu o cartão, onde está domiciliado o comerciante e em que país é residente fiscal. A resposta longa exige entender como funciona realmente o ecossistema de cartões e que declarações informativas existem de facto. Há muito mito em torno de Visa e Mastercard, e vale a pena separá-lo do que realmente acontece com o seu <a href="/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades">cartão Wise associado a uma LLC</a>, com o seu cartão de banco português ou brasileiro ou com o seu <a href="/pt/blog/revolut-business-e-crs-o-que-e-reportado-a-sua-autoridade">cartão Revolut</a>.

Este artigo percorre quem é quem numa transação com cartão, o que cada ator reporta às autoridades fiscais e quais as declarações informativas país a país que afetam o consumo e o saldo de cartões (Modelo 196 e 171 em Espanha, DAS2 em França, Modelo 38 em Portugal, entre outras).

<!-- exentax:crs2-update-v1 -->
## Atualização CRS 2.0, CARF e DAC8 (pacote OCDE)

O que o pacote OCDE NÃO cobre é o consumo puro com cartão: o CRS 2.0 alarga o perímetro às EMI e aos produtos de moeda eletrónica, o CARF acrescenta os criptoativos, mas o fluxo Visa/Mastercard de pagamento fica fora da troca automática fiscal e é governado por regras distintas (KYC do emissor mais cooperação administrativa caso a caso).

A OCDE aprovou o pacote integrado de **CRS 2.0** (a revisão do Common Reporting Standard, que traz as EMI e os produtos especificados de moeda eletrónica para dentro do perímetro e reforça a due diligence sobre as controlling persons) e **CARF** (Crypto-Asset Reporting Framework, que estende a troca automática a exchanges, custodiantes e plataformas de derivados cripto). A União Europeia transpô-lo através da **Diretiva (UE) 2023/2226 (DAC8)**, aprovada a 17 de outubro de 2023, que altera a 2011/16/UE para incorporar ambas as peças. A data de aplicação material é **1 de janeiro de 2026** e a **primeira troca efetiva** ocorre em **janeiro de 2027, sobre dados do exercício de 2026**.

Fontes oficiais: <a href="https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/" target="_blank" rel="noopener nofollow">OCDE — CRS</a>, <a href="https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework-and-amendments-to-the-common-reporting-standard.htm" target="_blank" rel="noopener nofollow">OCDE — CARF</a>, <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226" target="_blank" rel="noopener nofollow">EUR-Lex — Diretiva (UE) 2023/2226 (DAC8)</a>.

A narrativa a reter é a de sempre: **os EUA ficam fora do perímetro CRS por arquitetura, não por opacidade**. Washington tem o seu próprio regime (FATCA), não assinou o CRS 1.0 nem irá assinar o 2.0, e é precisamente por isso que a sua LLC norte-americana continua a ser uma estrutura plenamente declarável no seu país de residência. Desenvolvemos o tema em <a href="/pt/blog/crs-2-0-carf-por-que-os-eua-nunca-vao-assinar-llc">CRS 2.0 e CARF: porque os EUA nunca irão assinar e o que muda para a sua LLC</a>.
<!-- /exentax:crs2-update-v1 -->

## O modelo de quatro partes: emissor, rede, adquirente, comerciante

Cada vez que passa um cartão, intervêm quatro atores muito distintos:

- **Emissor (issuer)**: a entidade que lhe emitiu o cartão e mantém a conta de onde sai o dinheiro. Pode ser um banco tradicional (Millennium BCP, Caixa Geral de Depósitos), uma EMI (Wise Europe SA, Revolut Bank UAB) ou um emissor pré-pago.
- **Rede de processamento (network ou scheme)**: Visa, Mastercard, American Express, JCB, UnionPay. Não mantêm a sua conta nem a do comerciante: encaminham a mensagem de autorização entre o emissor e o adquirente e orquestram a liquidação.
- **Adquirente (acquirer)**: a entidade financeira que contratou o comerciante e lhe credita o recebimento. Em Portugal e Brasil são nomes como Adyen, Stripe, Worldline, SIBS, Cielo, Stone, Rede.
- **Comerciante (merchant)**: o negócio que recebe. Identificado por um Merchant Category Code (MCC) e um identificador único na rede.

Compreender esta cadeia é fundamental: nenhum ator "vê" todo o filme. Cada um vê apenas o seu segmento.
### O que vê e o que não vê cada ator

| Ator | O que conhece em detalhe |
| --- | --- |
| Emissor | A sua identidade, a sua conta, cada débito com montante, divisa, data, MCC e nome do comerciante |
| Rede (Visa/Mastercard) | Mensagens de autorização entre emissor e adquirente, dados agregados para liquidação, fraude e disputa |
| Adquirente | Identidade do comerciante, cada recebimento, montante, divisa, marca de cartão e BIN do emissor |
| Comerciante | O seu próprio recebimento, últimos 4 dígitos, marca, país emissor e, se pedir fatura, os seus dados |

O que **nenhum** deles faz por sistema é enviar em tempo real cada transação ao Fisco do país de cada cliente. Isso simplesmente não é o seu papel.
## A ideia mais difundida (e errada) sobre Visa e Mastercard

Circula a ideia de que "como Visa e Mastercard são americanas e tudo passa por elas, já estão a reportar tudo a todos os fiscos". Não é assim:

- **Visa Inc.** e **Mastercard Inc.** são **redes de processamento de pagamentos**, não entidades depositárias. Não mantêm contas de clientes finais e, portanto, não são "instituições financeiras reportantes" no sentido do CRS ou de FATCA.
- **Não reportam** os consumos individuais de cada portador à Autoridade Tributária portuguesa, à AEAT espanhola, à DGFiP francesa, à Receita Federal brasileira nem a qualquer outra autoridade fiscal nacional como fluxo automático.
- Cooperam sim com autoridades fiscais e judiciais em investigações pontuais, via requisições formais, como qualquer outra empresa que custodia dados.

Quem está sujeito a obrigações de informação é o **emissor do cartão** (nas suas declarações nacionais) e, no lado do comerciante, o **adquirente** dentro da sua própria contabilidade e das declarações que lhe forem aplicáveis no seu país.
## O que reporta realmente o emissor em Portugal e em Espanha

Em **Portugal**, os emissores e os bancos reportam à Autoridade Tributária através de várias declarações relevantes para contas e cartões: a comunicação de **transferências transfronteiriças** (incluindo o Modelo 38 quando aplica), o **Modelo 40** para valores mobiliários e a comunicação de saldos e contas com relevância fiscal nos termos do regime de troca automática de informação. O detalhe transação a transação não é enviado de ofício; o que é coberto é, sobretudo, o saldo, a titularidade e os movimentos para o exterior.

Em **Espanha**, os emissores nacionais apresentam à AEAT várias declarações:

- **Modelo 196**: declaração anual de contas em entidades de crédito, com titulares, autorizados e saldos a 31 de dezembro.
- **Modelo 171**: declaração anual de depósitos, levantamentos e pagamentos com cartão acima de determinados limiares.
- **Modelo 170**: declaração das operações realizadas por empresários ou profissionais aderentes a um sistema de cobrança por cartão. Aqui, os **adquirentes** declaram os recebimentos creditados aos comerciantes, não os pagamentos que faz como consumidor.
- **Modelo 199**: identificação de contas com transcendência tributária.
## O equivalente noutros países europeus

- **França – DAS2**: declaração anual que recolhe honorários, comissões e outros rendimentos pagos a terceiros. Para cartões, o trabalho de fundo é feito pela **DGFiP** combinando esta declaração com os dados de cada banco. A França obriga ainda a declarar **contas no estrangeiro** (formulário 3916), o que tipicamente inclui IBANs Wise ou Revolut.
- **Alemanha**: não existe um equivalente direto ao Modelo 196, mas os bancos alemães operam o Kontenabrufverfahren, que permite ao Bundeszentralamt für Steuern consultar a titularidade de contas e depósitos de qualquer residente.
- **Itália**: o Anagrafe dei Rapporti Finanziari recolhe anualmente saldos, movimentos agregados e dados de cartões que os intermediários financeiros italianos enviam à Agenzia delle Entrate.
- **Reino Unido**: a HMRC recebe dados agregados dos bancos via esquemas como o Bulk Data Gathering, além do CRS para não residentes.

A regra geral é que **a conta e a titularidade estão bem cobertas**, enquanto o **detalhe transação a transação** não é enviado de ofício: é reconstruído apenas numa inspeção concreta. E se chegar uma notificação, na Exentax mantemos o dossiê pronto para responderes em horas, não em semanas.
## O caso do emissor estrangeiro: Wise, Revolut e similares

Quando o seu cartão é emitido por uma EMI europeia que não é um banco português ou espanhol (tipicamente Wise Europe SA na Bélgica ou Revolut Bank UAB na Lituânia), a situação muda:

- Esses emissores **não apresentam as declarações informativas portuguesas ou espanholas** (Modelo 38, 196, 171, 170, 199). Essas declarações são obrigações das entidades financeiras residentes ou com sucursal no respetivo país.
- Estão sujeitos ao **CRS** desde a sua jurisdição de origem. A Wise Europe SA reporta à autoridade fiscal belga e a Revolut Bank UAB à lituana, que reenviam para o país de residência do titular o saldo a 31 de dezembro e os rendimentos, como descrevemos em <a href="/pt/blog/crs-e-as-suas-contas-bancarias-llc-o-que-e-partilhado-com-o">CRS para contas bancárias de LLC</a>.
- O **detalhe de cada compra com o cartão não viaja por CRS**. O que viaja é o saldo de fecho, a identidade do titular e, se a conta pertencer a uma entidade classificada como Passive NFE, os controlling persons.

Isto explica uma observação frequente: uma compra com cartão de um banco português aparece, agregada com tudo o resto, nos dados que a Autoridade Tributária pode consultar; a mesma compra com cartão Wise ou Revolut não é declarada diretamente à AT, mas o saldo da conta será reportado por CRS desde a Bélgica ou Lituânia.

A conclusão razoável não é "o cartão estrangeiro torna-me invisível", mas que **o rasto existe noutra camada**: a conta fica identificada, os saldos são reportados e, em caso de procedimento, os movimentos podem ser pedidos.
### E o adquirente do comerciante: o outro extremo do fio

Esquecemos frequentemente o adquirente. Quando um comerciante português recebe por cartão, o seu adquirente reporta agregados de recebimentos, e em Espanha o adquirente apresenta o **Modelo 170** com o agregado anual. Se esse comerciante for uma pessoa singular que sub-declara rendimentos, a autoridade fiscal cruza os dados com a sua declaração e a incoerência aparece. Isso não afeta o consumidor, mas explica por que os comerciantes que sub-declaram recebimentos por cartão são detetados tão depressa.

Para um empreendedor com LLC que recebe de clientes finais via Stripe US ou um Merchant of Record como DoDo Payments, o fluxo é diferente: o adquirente está fora da Europa, não há Modelo 170 nem reporte equivalente em Portugal, e os rendimentos chegam a Mercury ou Wise. A rastreabilidade passa então pelo saldo e rendimentos via CRS, não pelo adquirente.
## O que o Fisco pode realmente ver dos seus pagamentos com cartão

Para um residente fiscal em Portugal ou Espanha que combina banca local com fintech estrangeira e, eventualmente, uma <a href="/pt/blog/llc-estados-unidos-guia-completo-nao-residentes-2026">LLC americana</a>:

O que a autoridade fiscal pode consultar de forma recorrente:

- Contas bancárias nacionais com a sua titularidade ou autorização.
- Recebimentos por cartão agregados de um comerciante nacional (Modelo 170 em Espanha, regimes equivalentes em Portugal).
- Saldos a 31 de dezembro e rendimentos de contas no estrangeiro recebidos via CRS desde o país do emissor.
- Contas no estrangeiro declaradas por si (em Espanha o Modelo 720, em Portugal a obrigação acessória ao <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>).

O que não recebe automaticamente:

- O detalhe de cada compra que faz com qualquer cartão.
- A lista de comerciantes onde compra como consumidor.
- Montantes individuais abaixo dos limiares aplicáveis.

O que pode pedir num procedimento:

- O extrato completo da conta diretamente ao emissor no país e, no estrangeiro, por troca pontual.
- Informação concreta à rede de cartões ou ao comerciante em investigações avançadas.
## Erros comuns que vemos todas as semanas

1. **"Visa e Mastercard reportam tudo em direto ao Fisco."** Falso. São redes de processamento; não são entidades reportantes nem emissoras finais.
2. **"Se pago com cartão estrangeiro, as minhas compras são invisíveis."** O detalhe não é declarado automaticamente, mas a conta é visível via CRS e o rasto é perfeitamente reconstruível.
3. **"O Modelo 171 faz com que o Fisco veja cada compra minha."** Não: cobre operações acima de limiares e agregados de recebimentos, não cada consumo pessoal abaixo desses limiares.
4. **"Se a minha LLC recebe por Stripe, isso já está declarado em Portugal."** Não diretamente: a Stripe US não apresenta Modelo 170 nem reporte equivalente português, e a informação sobre a sua LLC chega ao Fisco por outras vias (Mercury via FATCA é assimétrica, Wise via CRS, a sua própria declaração de contas no estrangeiro se aplicar).
5. **"Melhor pagar sempre com o cartão estrangeiro para não deixar rasto."** O rasto existe e, sobretudo, operar de forma claramente desenhada para não deixar rasto é exatamente o padrão que mais depressa dispara alertas numa inspeção. Fechamos isto contigo a partir da Exentax: uma chamada, submissão feita, ficheiro pronto, o risco fica no papel.
6. **"O adquirente do comerciante europeu onde compro reporta o meu consumo ao Fisco."** Não: o adquirente reporta os recebimentos do seu próprio cliente comerciante, não os dados do consumidor.
## Por que isto importa para a sua estrutura

Se combina uma LLC americana, uma conta Mercury, um Wise Business com cartão, um Revolut Business e um cartão do seu banco português para o dia a dia, não tem um problema de "ocultação": tem um mapa de rastos distintos, cada um com a sua própria visibilidade fiscal. A pergunta certa não é "que cartão usar para que o Fisco não dê por isso?" mas "como é que estas peças encaixam com a minha residência fiscal, com as minhas declarações e com a doutrina administrativa aplicável à minha LLC?". Desenvolvemos isto em <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">Desenho de uma estrutura fiscal internacional sólida</a> e, para o cruzamento concreto com o <a href="/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades">cartão Wise sobre LLC</a>, no seu artigo dedicado.

Se já opera com cartões em várias jurisdições e não tem claro o que é reportado onde, revemos isto consigo e dizemos-lhe o que corrigir antes de ser o Fisco a marcar o ritmo.
### Em resumo

As redes Visa e Mastercard não são quem avisa o Fisco dos seus consumos: o seu papel é processar pagamentos. O que chega às autoridades fiscais é informação do **emissor** (via declarações nacionais como Modelo 196 ou 171, DAS2, Modelo 38) e do **adquirente** (recebimentos agregados do comerciante). Quando o emissor está fora do seu país, as declarações nacionais não se aplicam, mas o saldo e a titularidade viajam por CRS desde a jurisdição do emissor.

Os pagamentos com cartão não estão a ser retransmitidos em direto ao Fisco, mas deixam um rasto perfeitamente visível quando alguém decide olhar. A diferença entre ter ou não ter problemas não está no cartão que usa, mas em ter uma estrutura coerente com a sua residência fiscal e com as suas declarações.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

<!-- exentax:lote26-native-v1:visa-mastercard-reporting-tarjetas-hacienda-pt -->
## Como ler a questão do reporting Visa e Mastercard como um mapeamento estável em vez de um rumor recorrente

A questão do reporting Visa e Mastercard à administração fiscal espanhola lê-se de forma mais serena como um mapeamento estável entre o tipo de cartão, o emissor do cartão, o país do emissor e o canal pelo qual a informação pode chegar à administração, do que como um rumor recorrente. As redes Visa e Mastercard não decidem por si próprias o que é reportado e a quem — o canal jurídico que efetivamente leva a informação é definido pela jurisdição do emissor e pelos acordos que lhe são aplicáveis. Esse mapeamento não muda de mês para mês.

Uma nota curta no ficheiro pessoal que registe o tipo de cartão detido, o emissor, o país de emissão e o titular legal da conta subjacente transforma essa mesma questão em algo relevável em poucos minutos da próxima vez que voltar a aparecer.
<!-- /exentax:lote26-native-v1:visa-mastercard-reporting-tarjetas-hacienda-pt -->

Antes de avançar, põe números ao teu caso: a <a href="/pt#calculadora">calculadora Exentax</a> compara, em menos de 2 minutos, a tua carga fiscal atual com a que terias com uma LLC americana corretamente declarada no teu país de residência.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.
Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:legal-refs-v1 -->
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** BOE de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).

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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## Visa, Mastercard e reporting à AT: o que se sabe do uso do seu cartão de empresa

A AT não recebe lista detalhada de transacções do seu cartão business US - mas recebe agregados cruzados com declarações.

- **O que a AT NÃO recebe directamente.** Lista de transacções individuais, categorias Visa/Mastercard, localizações POS. Redes de cartões não são interface de reporting fiscal.
- **O que RECEBE via CRS e FATCA.** Saldo fim de ano + total movimentos brutos + UBO. Se saldo médio ou fluxo alto sem coerência com declaração, cruzamento.
- **O que deixa rasto através de comerciantes.** Pagar em PT com cartão Mercury US: comerciante declara venda normalmente.
- **O que o seu banco residente vê.** Recarregar do conta PT é visível.

### O cruzamento típico

Via CRS: Mercury 80k€ saldo médio, 300k€ movimentos brutos anuais. Em IRS declara 25k€. Incoerência evidente.

### O que mais nos perguntam

**Se pago tudo pessoal com cartão da LLC, evito visibilidade?** Não. Misturar quebra separação.

**Há cartão US "não reportável"?** Não.

Na Exentax estruturamos uso com bookkeeping e declaração correcta em residência.
<!-- /exentax:execution-v2 -->

## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram nos últimos anos; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS. Tranquilo: na Exentax isto é a nossa rotina semanal, fechamos antes de a carta chegar à tua caixa de correio.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
### Lembrete prático

Cada situação fiscal depende da sua residência, da atividade exercida e dos contratos em vigor. As informações aqui apresentadas são gerais e não substituem aconselhamento personalizado; analise o seu caso específico antes de tomar decisões estruturais.

<!-- exentax:lote9-native-v1:visa-mastercard-reporting-tarjetas-hacienda -->
## O que o reporting Visa e Mastercard significa para a LLC

O reporting de cartões é frequentemente confundido com o
reporting CRS, mas são realidades distintas. As transacções Visa
e Mastercard geram um fluxo detalhado de dados — comerciante,
país, montante, momento — usado para análise de risco, disputas
e prevenção de fraude. Este fluxo não é transmitido
automaticamente às administrações fiscais.

O que pode ser transmitido depende da conta a que o cartão está
ligado, não do cartão em si. Um cartão ligado a uma conta
sujeita a CRS na Europa entra no relatório anual dessa conta. Um
cartão ligado a uma conta US da LLC segue o regime americano,
que não faz parte do CRS.

## Uma nota final

Para a LLC, a pergunta correcta não é "o meu cartão é
reportado?", mas sim "a que conta está ligado e qual o regime
de reporting dessa conta?". Esta distinção transforma a decisão
sobre cartões empresariais numa decisão serena e fundamentada.

<!-- /exentax:lote9-native-v1:visa-mastercard-reporting-tarjetas-hacienda -->

<!-- exentax:lote15-native-v1:visa-mastercard-reporting-tarjetas-hacienda-pt -->
## Como a informação dos cartões chega efetivamente à administração fiscal espanhola

O fluxo de informação das redes de cartões para a administração fiscal espanhola é mais concreto do que por vezes parece. O ponto de partida é o banco ou instituição de pagamento espanhol que emite ou processa o cartão; a rede em si é o carril, não a parte que declara. Os emissores e adquirentes espanhóis enviam declarações informativas à Agencia Tributaria em ciclos regulares, e essas declarações contêm movimentos agregados por titular em vez do detalhe linha a linha, restaurante ou comércio, que os consumidores veem nos seus extratos. A informação que circula é portanto numérica e estrutural: totais, contrapartes ao nível do agregador de comerciantes e identificadores que permitem ligar os registos a uma pessoa ou empresa.

Um segundo fluxo corre pelos canais internacionais de troca de informação, onde os dados sobre contas mantidas no estrangeiro são partilhados em formatos normalizados uma vez por ano. Um cartão associado a uma conta estrangeira participa indiretamente neste segundo fluxo porque a conta subjacente é reportável. Para um membro de LLC residente em Espanha, a conclusão prática é que existem dois canais paralelos, que se sobrepõem na mesma pessoa e que se reconciliam a médio prazo. A higiene mais simples é guardar os extratos dos cartões da LLC junto da contabilidade do ano, de forma a que qualquer questão posterior possa ser resolvida com uma página impressa e um número, sem ter de reconstituir o movimento de memória.
<!-- /exentax:lote15-native-v1:visa-mastercard-reporting-tarjetas-hacienda-pt -->

<!-- exentax:cross-refs-v1 -->
## Para continuar a leitura

- [Contas bancárias US: o que reporta cada entidade e como estruturar](/pt/blog/as-contas-bancarias-americanas-reportam-a-sua-autoridade)
- [Wise, IBAN e LLC: o que é realmente reportado às autoridades fiscais](/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades)
- [DAC8 e criptomoedas: o novo reporting fiscal automático em 2026](/pt/blog/dac8-e-criptomoedas-o-novo-reporting-fiscal-automatico-em)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:defensa-fiscal-v1 -->
## E se as Finanças me perguntarem pela minha LLC?

  É a pergunta mais frequente na primeira consulta, e a resposta curta é: a tua LLC não é opaca e, corretamente declarada, uma inspeção fecha-se em formulários standard. As Finanças portuguesas, a Receita Federal brasileira ou a SEFAZ estadual podem pedir o Certificate of Formation do estado (Wyoming, Delaware ou Novo México), o EIN emitido pelo <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o Operating Agreement assinado, os extratos da Mercury ou Wise do exercício, o Form 5472 com 1120 pro-forma apresentado e a contabilidade que reconcilia receitas, despesas e movimentos. Se tudo isso existir e for entregue ordenado, a inspeção não escala. Respira: na Exentax isto é rotina, pomos-te em dia e a próxima revisão fecha-se numa volta, sem sobressaltos.

  O que as autoridades fiscais perseguem com razão são os testas-de-ferro, a residência fiscal de papel e a não declaração de contas estrangeiras. Uma LLC bem montada é exatamente o contrário: tu apareces como **beneficial owner** no BOI Report quando aplicável (verificável em <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tu assinas as contas bancárias e declaras o rendimento onde efetivamente vives. A estrutura está registada no Secretary of State do estado, nos ficheiros do IRS e, sempre que envolve um banco europeu, dentro do perímetro CRS do padrão da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  O erro que descarrila mesmo uma inspeção não é ter uma LLC; é não ter atribuído o rendimento corretamente no IRS pessoal (Anexo J do Modelo 3 em Portugal, Carnê-Leão Web e DAA no Brasil), não ter declarado as contas no estrangeiro (Modelo 58 ao Banco de Portugal a partir de 1 milhão €, DCBE ao Bacen a partir de 1 milhão USD) ou não ter documentado as operações entre o sócio e a LLC. Esses três frentes fecham-se antes do pedido, não depois. É por isso que na Exentax mantemos o teu calendário em ordem — tu deixas de pensar em prazos e nós fechamo-los antes que mordam.

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Quando%20algu%C3%A9m%20pergunta%20o%20Fisco%20v%C3%AA%20o%20que%20eu%20pago%20com%20o%20cart%C3%A3o%3F%2C%20a%20resposta%20cur%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
