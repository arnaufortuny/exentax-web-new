export default `

Se vive fora dos Estados Unidos mas o IRS espera algo de si, retenções a recuperar, impostos federais a declarar, dividendos americanos, uma LLC com um Form 1040-NR pendente, uma venda de imóvel na Flórida com retenção FIRPTA, royalties de um livro na Amazon KDP, há um trâmite do qual não vai conseguir escapar: o **ITIN**. É a peça fiscal que o identifica perante o IRS quando não é residente e, portanto, não pode ter um Social Security Number (SSN). Sem ITIN o ciclo não fecha: nem há reembolsos, nem se aplica de forma limpa o acordo USA-Espanha, nem se completam as declarações que o sistema americano exige quando o seu nome aparece como contribuinte.

E é simultaneamente um dos trâmites pior explicados de todo o universo americano. O site do IRS leva-o a um PDF, o PDF leva-o a outro PDF, no caminho pedem passaportes originais, falam-lhe de um Certifying Acceptance Agent (CAA), aparecem escritórios TAC com marcação, documentos que vão para Austin (Texas) e, se errar uma casa do **Form W-7**, recebe seis meses depois uma **CP-566 Notice** com pedido rejeitado. Sem ITIN, sem reembolso e, em muitos casos, sem possibilidade prática de apresentar o modelo americano de que precisava.

Na **Exentax** já fechámos centenas de processos de ITIN para residentes em Espanha e na América Latina. Este guia é a versão real: para que serve, quando precisa, como se solicita, quanto demora, quais os erros típicos e por que motivo ter uma equipa americana a tratar do W-7 evita a maioria das rejeições. Se depois de ler tiver claro que precisa de um, podemos fazê-lo por si, do início ao fim.

## O que é exactamente o ITIN

O **ITIN (Individual Taxpayer Identification Number)** é um número fiscal de nove dígitos, formato **9XX-XX-XXXX**, emitido pelo **IRS** a pessoas singulares com **obrigação ou direito de apresentar uma declaração ou formulário fiscal nos EUA** e que **não são elegíveis** para um Social Security Number. Vive na base **TIN** do IRS junto ao SSN e ao **EIN** (este último é para entidades, como a sua LLC).

O que o ITIN **não é**:

- Não permite trabalhar legalmente nos EUA.
- Não dá direito a benefícios sociais (Social Security, Medicare).
- Não é autorização de residência nem visto.
- Não isenta a sua LLC de propriedade estrangeira do Form 5472.

O que o ITIN **faz**:

- Identifica-o como contribuinte pessoa singular perante o IRS.
- Permite apresentar o **Form 1040-NR** (declaração de não residente).
- Habilita a **reclamar reembolsos** de retenções excessivas (por exemplo, os 30 % retidos em dividendos, royalties, vendas de imóveis ou prémios).
- Permite a brokers, bancos e plataformas americanas aplicar correctamente o seu **W-8BEN**.
- É o número que figura em qualquer **K-1** que a sua LLC receba com sócios estrangeiros.
- É obrigatório para **dependentes/cônjuges** declarados numa declaração americana.

> Para entender o papel do W-8BEN e por que se articula tão bem com um ITIN bem emitido, veja o <a href="/pt/blog/w8-ben-e-w8-ben-e-o-guia-completo">guia completo do W-8BEN e W-8BEN-E</a>.
## Quando precisa de um ITIN: os seis casos típicos

Nem toda a gente precisa de ITIN. Antes de gastar tempo e dinheiro, convém verificar se a sua situação encaixa num dos seis cenários seguintes. São os que vemos toda a semana na Exentax:

### Os casos típicos em detalhe

1. **Reclamação de retenção excessiva sobre dividendos USA.** Reside em Espanha, tem acções americanas através de um broker (IBKR, Charles Schwab, Fidelity) e recebe dividendos. Sem W-8BEN funcional com TIN estrangeiro válido, o broker retém 30 %. Com ITIN e W-8BEN, baixa normalmente para 15 % por convenção. Se já lhe retiveram a mais, o reembolso passa por um Form 1040-NR + W-7.
2. **Royalties da Amazon KDP, Apple, plataformas SaaS ou YouTube.** Plataformas como Amazon KDP, Apple Books, Adobe Stock ou alguns programas de afiliados americanos retêm 30 % se não receberem um W-8BEN válido com TIN. Um ITIN bem emitido baixa a retenção para 0 %, 5 % ou 10 % consoante o tipo de rendimento e a convenção aplicável.
3. **Venda de imóvel nos EUA com retenção FIRPTA.** Se vende um imóvel americano sendo não residente, FIRPTA retém 15 % sobre o preço bruto. Para recuperar a diferença entre retenção e imposto real (frequentemente milhares ou dezenas de milhares de dólares), apresenta-se um Form 1040-NR. Sem ITIN, não se apresenta.
4. **Sócio estrangeiro numa entidade americana com K-1.** Se faz parte de uma **multi-member LLC** ou **partnership** americana, recebe anualmente um Schedule K-1 com a sua quota nos lucros, e a entidade tem de reter (Form 8804/8805). Para reportar correctamente e, se aplicável, recuperar excessos, precisa de ITIN.
5. **Cônjuge ou dependente declarado numa declaração USA.** Quando alguém declara nos EUA e quer incluir cônjuge ou filhos não residentes, esse cônjuge/filho precisa de ITIN.
6. **Prémios, bolsas, conferências pagas nos EUA.** Se recebeu um prémio, uma bolsa de programa universitário americano, ou rendimentos pontuais por dar uma conferência, é provável que lhe tenham retido 30 % e precise de ITIN para recuperar o que for recuperável.

Há um sétimo perfil mais subtil: o **proprietário de LLC unipessoal** que, em sentido estrito, **não precisa de ITIN para apresentar Form 5472 + 1120 pro forma** (a LLC identifica-se com EIN e, na casa do foreign owner, basta nome, morada e país de residência fiscal). Mas se essa mesma pessoa tiver actividades pessoais que originem Form 1040-NR (FIRPTA, dividendos, K-1 de outra estrutura), o ITIN deixa de ser opcional.
## A pilha documental: W-7, declaração fiscal, identificação

O processo ITIN gira à volta de três elementos. Saltar um é praticamente garantia de rejeição:

- **Form W-7 (Application for IRS Individual Taxpayer Identification Number).** É a solicitação propriamente dita. Tem uma casa decisiva, o **Reason for submitting**, que deve estar marcada com o código correcto (a, b, c, d, e, f, g, h). Cada motivo acompanha-se de documentação de suporte distinta. Marcar a casa errada é o erro mais frequente.
- **Declaração fiscal americana que justifique o ITIN.** Salvo excepções tipificadas (tipicamente: aplicar uma convenção fiscal sobre rendimentos passivos via W-8BEN perante um pagador americano), o W-7 apresenta-se **juntamente com** a declaração fiscal que motiva a solicitação (1040-NR, 1040 conjunto com cônjuge americano, 1042-S, 8288 FIRPTA, etc.). Sem essa declaração, o ITIN é rejeitado por falta de causa.
- **Identidade comprovada com documento original ou cópia certificada.** O IRS exige verificação de identidade com passaporte (o único documento que sozinho cobre ambas as provas: identidade e "foreign status"). Há três vias válidas: (a) enviar o original por correio para Austin (Texas), (b) deslocar-se a um escritório TAC do IRS nos EUA, ou (c) fazê-lo através de um **CAA (Certifying Acceptance Agent)** autorizado, que verifica o passaporte presencialmente e emite um Certificate of Accuracy.

É aqui que a maioria dos solicitantes residentes em Espanha encalha. Mandar o passaporte original por correio para o Texas durante semanas não é uma opção razoável para quase ninguém. Viajar aos EUA até um TAC também não. Por isso a via **CAA** é a que faz sentido.
## Como fazemos na Exentax: ITIN chave na mão

Na Exentax operamos com a rede **CAA** e gerimos o ITIN como um processo fechado. A sua única tarefa é entregar-nos os documentos pedidos e assinar o W-7 quando estiver pronto. O resto fazemos nós:

1. **Diagnóstico prévio.** Antes de tocar em nada, verificamos que precisa do ITIN (nem todos os casos precisam) e, sobretudo, **sob que motivo** do W-7 vai aplicar. Marcar bem a casa "Reason for submitting" é o que separa um pedido aprovado de uma CP-566 Notice seis meses depois.
2. **Preparação da declaração fiscal de suporte.** Se o seu motivo exige Form 1040-NR (FIRPTA, dividendos, K-1, etc.), preparamo-la. Se o seu caso é uma das vias excepcionais via W-8BEN, documentamo-lo correctamente.
3. **Verificação de identidade por CAA.** Coordenamos a verificação do passaporte através da rede CAA. Não envia o passaporte original para o Texas. A verificação é segura.
4. **Envio e seguimento.** Empacotamos W-7 + declaração + Certificate of Accuracy + documentação de suporte e enviamos ao IRS. Acompanhamos o expediente e avisamo-lo quando o ITIN for emitido.
5. **Notificações IRS.** Se chegar uma CP-566, CP-567 ou qualquer comunicação do IRS, respondemos por si.
6. **Aplicação posterior do ITIN.** Uma vez emitido, entregamos um pequeno plano de acção: como aplicá-lo no seu broker, na Amazon KDP, no Stripe, no seu W-8BEN e em qualquer formulário onde antes punha "applied for" ou "N/A".
## Prazos reais atualmente

O prazo oficial publicado pelo IRS é de **7 a 11 semanas** desde a recepção. A realidade dos últimos doze meses, sobretudo entre Janeiro e Junho (época alta), está mais perto de **3 a 5 meses**. Pedidos enviados entre Julho e Novembro tendem a andar mais depressa, voltando à faixa das 8-12 semanas.

Três factores aceleram ou atrasam o processo:

- **Qualidade do W-7.** Um pedido completo, motivo correcto, declaração bem preparada e verificação CAA, quase nunca recebe notice de subsanação. Um W-7 com casas mal marcadas é o motivo número um de atraso.
- **Época de submissão.** Enviar entre Fevereiro e Abril significa fila.
- **Documentos físicos.** Se for pela via de enviar passaporte por correio, some o tempo de ida e volta (semanas). Por isso recomendamos sempre a via CAA.
## Custos e erros comuns

O IRS **não cobra taxa** para emitir um ITIN. Os custos no processo são os do CAA e, se aplicável, os do preparador do 1040-NR. Na Exentax trabalhamos com orçamento fechado para o processo ITIN chave na mão, comunicado antes de começar, sem surpresas. Os seis erros típicos quando alguém tenta sozinho são sempre os mesmos:

1. Marcar o motivo errado no W-7 (especialmente confundir motivo "b" com "h" ou aplicar "a" sem convenção aplicável).
2. Enviar o W-7 sem a declaração de suporte quando esta era obrigatória.
3. Enviar fotocópias simples do passaporte em vez de original ou cópia certificada.
4. Pôr uma morada estrangeira mal formatada (códigos postais não americanos, abreviaturas de país não padrão).
5. Não assinar o W-7 à mão, a tinta, com a data correcta.
6. Pedir ITIN para perfis que não precisam (tipicamente, proprietários de single-member LLC sem actividade pessoal nos EUA).

Qualquer destes erros leva a uma **CP-566** ou **CP-567 Notice** e, no pior caso, a refazer o processo do zero no ano seguinte.
## ITIN, banca e stack operacional da sua LLC

Quando já tem ITIN, todo o ecossistema americano funciona melhor: brokers como Interactive Brokers aplicam a convenção aos seus dividendos, plataformas como Amazon KDP retêm o correcto, e os gateways que recolhem um W-8BEN actualizado deixam de reter 30 % por defeito. Do lado da sua LLC, integra-se naturalmente no stack bancário que recomendamos: **Wise Business**, **Relay** e **Slash** como contas operacionais principais, **Mercury** como secundária de apoio, e **Wallester** apenas quando precisa de um IBAN europeu em nome da LLC, sempre considerando o seu tratamento sob CRS e o reporting que isso pode activar para a Autoridade Tributária.

Se está a começar e ainda não tem a LLC montada, o lógico é trabalhar as duas peças em paralelo: <a href="/pt/blog/llc-como-alternativa-a-ser-autonomo-em-espanha">a LLC como alternativa ao autónomo</a>, o <a href="/pt/blog/ein-o-que-e-o-numero-fiscal-da-sua-llc-e-como-obte-lo">EIN</a> e, quando aplicável à sua situação pessoal, o ITIN. E se já tem LLC mas está a receber retenções americanas que não compreende, quase sempre a peça que falta para limpar a situação é esta.
### Renovação e caducidade: cuidado com ITINs adormecidos

Um ITIN pode **caducar**. A regra histórica do IRS é que um ITIN não usado em declaração durante **três anos consecutivos** fica inactivo. Os ITINs emitidos antes de 2013 têm sido renovados por blocos consoante os dígitos do meio. Na prática, se o seu ITIN dormiu anos e voltou a precisar dele (vendeu um imóvel, voltou a ter dividendos americanos), verifique se continua activo antes de o aplicar. Se não estiver, reactiva-se com um W-7 marcando "renew an existing ITIN".
## Por que ter a Exentax atrás muda o resultado

O ITIN parece um trâmite menor até se tentar fazer sozinho e descobrir que o IRS não devolve chamadas, que o formulário tem nuances que só se aprendem após dezenas de casos, e que uma rejeição pode custar outro ano inteiro sem recuperar a sua retenção. O que a nossa equipa traz é exactamente o oposto: um processo conhecido, uma verificação CAA segura, uma declaração de suporte preparada por contabilistas americanos, e a tranquilidade de que se chegar qualquer notice, respondemos a tempo.

Se acha que precisa de um ITIN, para o seu broker, para a Amazon, para uma venda FIRPTA, para uma K-1, para um reembolso pendente, ou para limpar de vez a sua situação com o IRS, peça uma consulta gratuita e analisamos o seu caso em 30 minutos. Se depois fizer sentido avançar, enviamos orçamento fechado e arrancamos nessa mesma semana. E se quiser primeiro comparar o custo fiscal real de continuar como autónomo face a operar via LLC com o seu W-8BEN/ITIN bem montados, experimente antes a nossa <strong>calculadora fiscal</strong>: em dois minutos vê os números do seu próprio cenário.

Cada caso é individual. A legislação americana muda e o IRS aperta critérios de validação a cada poucos anos. Mas o princípio mantém-se: **sem ITIN o ciclo fiscal com os Estados Unidos não fecha**, e fechá-lo bem é o que separa quem recupera as suas retenções de quem as perde silenciosamente todos os anos.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (BOE 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Fala com a nossa equipa</a>
<!-- /exentax:calc-cta-v1 -->

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.
Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:legal-refs-v1 -->
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a FinCEN).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** BOE de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / OCDE.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).

A aplicação concreta de qualquer destas normas ao seu caso depende da sua residência fiscal, da atividade da LLC e da documentação que mantenha. Este conteúdo é informativo e não substitui aconselhamento profissional personalizado.

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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## O procedimento ITIN que evita as rejeições mais comuns

O ITIN obtém-se com o Form W-7 acompanhado de prova de identidade e de motivo válido reconhecido pelo IRS. O que rejeita a maioria dos pedidos não é o formulário, são três erros documentais que se repetem. Este é o guia que aplicamos para que o primeiro pedido não seja rejeitado.

- **Motivo válido bem argumentado.** O W-7 pede motivo ITIN das opções a-h. Os dois mais habituais são "b) Non-resident alien filing a U.S. tax return" (quando se apresenta 1040-NR por venda de imóvel, royalties ou rendimentos sujeitos a withholding) e "h) Other" com explicação detalhada (recuperação de retenções, isenção por convénio). Marcar mal é a causa #1 de rejeição.
- **Documentação de identidade apostilada.** O IRS aceita passaporte (suficiente por si só) ou DNI nacional + factura de serviços. Se enviar cópia, deve ser certified copy emitida pela autoridade emissora do passaporte (em Portugal: PSP/SEF ou Embaixada dos EUA). As cópias notariadas portuguesas comuns não cumprem - causa #2.
- **Tax return em anexo quando aplica.** Para os motivos a, b e c exige-se anexar o 1040-NR completo no mesmo pedido. Só os motivos d (dependent), e (spouse), f (student treaty), g (renewal) e h (outros com isenção específica) admitem W-7 sem tax return. Enviar W-7 isolado quando deveria ir com 1040-NR é a causa #3.
- **Via de apresentação.** Três opções: correio para Austin TX, via Certifying Acceptance Agent (CAA - recomendado, valida localmente sem enviar passaporte), ou marcação presencial num TAC do IRS. Tempos: CAA 7-12 semanas, correio directo 9-14 semanas, TAC presencial 6-9 semanas mas com marcações escassas.

### O que mais nos perguntam

**Preciso de ITIN se só tenho uma LLC e residência fiscal na Europa?** Não automaticamente. Precisa se apresentar 1040-NR pessoal (venda de imóvel, rendimentos efectivamente vinculados, royalties), não pelo simples facto de ter a LLC. O responsible party do 5472 pode ser identificado por passaporte sem ITIN.

**O ITIN caduca?** Sim: se não for usado numa declaração durante 3 anos consecutivos ou se pertencer a determinados intervalos numéricos. Renovação via W-7 marcando "Renewal" - mais rápido que a primeira vez.

Na Exentax preparamos o W-7, a documentação apostilada e a apresentação via CAA próprio para que o ITIN chegue na primeira ronda sem viagens nem envio de passaporte original.
<!-- /exentax:execution-v2 -->

## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram em recent years; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act.** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida a "foreign reporting companies"** (entidades constituídas fora dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA por um não residente está, hoje, fora dessa obrigação**. O estado regulatório pode mudar de novo: **reverificar em FinCEN.gov no momento da submissão**. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo e monitoriza atualizações.
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.


Quer aplicar este protocolo ao seu caso? <a href="/pt/agendar">Agende uma sessão com a equipa Exentax</a> e revemos a sua LLC com números reais em trinta minutos, sem compromisso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22como%20obtener%20itin%20numero%20fiscal%20irs%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se ainda não tens ITIN, vê o nosso guia de serviço <a href="/pt/servicos/obtenha-seu-itin">obtém o teu ITIN passo a passo</a> e começa o processo hoje.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Tratamos do seu ITIN junto do IRS com um Certifying Acceptance Agent — o passaporte original fica consigo. <a href="/pt/servicos/obtenha-seu-itin">Tratar do meu ITIN</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisão editorial pendente</strong> — As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">30%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…amar reembolsos** de retenciones excesivas (por ejemplo, el 30% retenido en dividendos, ro…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">15%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…e retiene 30%. Con un ITIN y el W-8BEN, normalmente bajas a 15% por convenio. Si ya te ret…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">0%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…N válido con TIN. Un ITIN bien emitido baja la retención al 0%, 5% o 10% según el tipo de …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">5%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…lido con TIN. Un ITIN bien emitido baja la retención al 0%, 5% o 10% según el tipo de rent…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">10%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…con TIN. Un ITIN bien emitido baja la retención al 0%, 5% o 10% según el tipo de renta y e…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1040</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…derales que declarar, dividendos americanos, una LLC con un Form 1040-NR pendiente; una ve…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…es un permiso de residencia ni un visado. - No te exime del Form 5472 si tienes una LLC un…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8804</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…rticipación en los beneficios, y la entidad debe retenerte (Form 8804/8805). Para reportar…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
