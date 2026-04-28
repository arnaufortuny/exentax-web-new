export default `Quando alguém vê pela primeira vez a combinação "LLC nos EUA" e "residente fiscal na Espanha", a pergunta imediata é sempre a mesma: **"e onde eu pago impostos?"**. A resposta é clara: **na Espanha**, sobre o lucro líquido, graças ao **tratado de dupla tributação entre EUA e Espanha**. A LLC não é usada para "não pagar", é usada para **não pagar duas vezes** e para otimizar dentro do legal.

Esta guia explica o tratado passo a passo, em linguagem clara, aplicado ao caso concreto de uma LLC de não residente com dono residente na Espanha.

## O que é e por que existe

Um **tratado de dupla tributação** é um acordo bilateral entre dois países para repartir o direito de tributar e evitar que a mesma renda seja tributada duas vezes. Sem tratado, pagaria nos EUA (porque a LLC está lá) **e** outra vez na Espanha. Isso sufocaria qualquer negócio internacional.

Por isso EUA e Espanha assinaram em **1990** um Tratado para evitar dupla tributação, modernizado pelo **Protocolo de 2013** em vigor desde **27 de novembro de 2019** (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 23 de outubro de 2019). Esse protocolo atualizou tipos de retenção, intercâmbio de informação e cláusulas anti-abuso.

Artigos chave para entender uma LLC com dono espanhol:

- **Art. 4, Residência fiscal.**
- **Art. 5, Estabelecimento permanente.**
- **Art. 7, Lucros empresariais.**
- **Art. 10, Dividendos.**
- **Art. 11, Juros.**
- **Art. 12, Royalties.**
- **Art. 17, Limitação de benefícios.**
- **Art. 24, Métodos para eliminar dupla tributação.**
### Como funciona para LLCs disregarded entity

Uma **Single-Member LLC** de não residente é por padrão **Disregarded Entity**: para o <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> não existe como contribuinte separado. Os rendimentos e despesas se imputam diretamente ao seu único membro. **Pass-through taxation**.

Para o tratado:

- A LLC **não é residente fiscal nos EUA**.
- Quem se analisa é **o membro**: se reside na Espanha, o tratado se aplica ao membro espanhol.
- Os lucros líquidos da LLC tributam **na Espanha** segundo o IRPF do membro.
- Nos EUA, a LLC só cumpre obrigações informativas (Form 5472 + 1120 pro forma, BOI Report) se não tem **ECI**.

A **<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a>** confirmou esse enfoque em consultas vinculantes como a **V0290-20**, qualificando a LLC americana como entidade transparente ou em regime de atribuição de rendas para fins espanhóis.
### Onde se pagam impostos realmente

Para o caso típico de LLC de serviços sem EP nos EUA e dono residente na Espanha:

- **Nos EUA: 0% federal, 0% estadual** (em NM/WY/DE sem atividade local). Apenas custos de manutenção.
- **Na Espanha: IRPF sobre o lucro líquido** da LLC, integrado na declaração anual como rendimento de atividade económica em regime de atribuição, conforme marginal pessoal (19% a 47%).

Ou seja, **paga na Espanha mas paga melhor**: sobre o lucro líquido após deduções amplas, sem cota mensal de autónomos, sem pagamentos trimestrais do autónomo.
### Tipos de rendimento cobertos pelo tratado

| Tipo de rendimento | Sem tratado (USA) | Com tratado USA-Espanha |
|--------------------|-------------------|--------------------------|
| Serviços prestados de fora dos EUA | 30% retenção | 0% (Art. 7, sem EP) |
| Royalties | 30% | 0-10% segundo tipo (Art. 12) |
| Dividendos de empresas USA | 30% | 15% / 10% qualificadas (Art. 10) |
| Juros bancários | 30% | 0% geralmente (Art. 11) |
| Ganhos de capital sobre ações USA | 30% / variável | Tributação principal na Espanha (Art. 13) |
| Pensões | 30% | Regras específicas (Art. 20) |
### Certificado de residência fiscal espanhola

Para ativar o tratado perante o pagador americano, precisa provar que é **residente fiscal na Espanha**. A AEAT emite um **certificado de residência fiscal para fins do tratado** pela sede eletrônica. Validade de **um ano**. Conveniente mantê-lo sempre atualizado, sobretudo com brokers ou pagadores que aplicam retenções complexas.

Na maioria dos cobramentos via Stripe, PayPal, AdSense, não vão pedir ativamente porque o W-8BEN-E já faz o trabalho. Mas perante uma fiscalização ou broker como Interactive Brokers, é a prova dura.
### Formulários necessários

- **W-8BEN-E:** apresentado pela LLC perante cada pagador USA. Veja a <a href="/pt/blog/w8-ben-e-w8-ben-e-o-guia-completo">guia completa de W-8BEN e W-8BEN-E</a>.
- **W-8BEN:** para pessoas físicas não residentes.
- **Form 1042-S:** emitido pelo pagador USA se aplicou retenção. Necessário para reclamar devolução ou creditar na Espanha.
- **Form 5472 + Form 1120 pro forma:** declaração informativa anual da LLC ao IRS.
- **BOI Report:** ao <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.
- **Modelo 100 (IRPF):** declaração anual na Espanha.
- **Modelo 720/721:** se ultrapassa 50.000 € em contas/valores/criptos no exterior.
- **Certificado de residência fiscal.**
## Casos práticos com cifras

### Caso A, Consultor de software com clientes USA e UE

- LLC fatura **120.000 USD/ano** por serviços prestados da Espanha.
- Despesas LLC: 30.000 USD.
- Lucro líquido: 90.000 USD ≈ 82.000 €.
- USA: **0%** retenção. Manutenção ≈ 2.000 €.
- Espanha: IRPF efetivo aprox. 35-40% sobre 82.000 € → ≈ 25.000-28.000 €.
- **Total tributário:** 27.000-30.000 € vs 38.000-45.000 € de um autónomo equivalente.

### Caso B, Trader/investidor com dividendos USA via LLC

- LLC titular de conta na Interactive Brokers.
- Dividendos americanos: 10.000 USD/ano.
- Sem tratado: 30% → 3.000 USD ao IRS.
- Com W-8BEN-E + tratado: 15% → 1.500 USD ao IRS.
- Na Espanha: incluir na base do poupança e aplicar **dedução por dupla tributação internacional** (Art. 80 LIRPF).

### Caso C, Royalty por software vendido nos EUA

- LLC vende licenças a empresas USA: 50.000 USD/ano.
- Se qualifica como royalty (Art. 12): retenção pode ser **5%**.
- Se qualifica como serviço/venda de cópia: Art. 7 → **0%**.
### Retenções na origem e como recuperar

Se sofrer retenções nos EUA:

1. **Reclamação direta ao pagador** se foi erro e ainda dentro do ano fiscal.
2. **Solicitação de devolução ao IRS:** via **Form 1040-NR** ou procedimentos associados ao **1042-S**. Lento (12-18 meses).

Na Espanha, retenções pagas nos EUA dentro do limite do tratado se compensam via **dedução por dupla tributação internacional (DDII)** no IRPF.
### Declaração na Espanha: Modelo 100

Na **declaração anual (Modelo 100)** integra os lucros líquidos da LLC como **rendimentos de atividade económica** em regime de atribuição:

1. Converter USD a EUR com câmbio médio anual ou do momento do recebimento, critério consistente.
2. Calcular receita total e despesas dedutíveis.
3. Imputar lucro líquido.
4. Aplicar **dedução por dupla tributação internacional**.
5. Apresentar **modelo 720/721** se ultrapassa limiares.
6. Conservar toda documentação.
### Por que precisa de assessor fiscal espanhol

Uma LLC bem constituída nos EUA é só metade do trabalho. A outra metade é **integrá-la corretamente no IRPF espanhol**:

- Qualificar corretamente a renda.
- Aplicar tratado e dedução.
- Decidir método de imputação.
- Cumprir modelos 720/721.
- Documentar despesas dedutíveis.

Um assessor fiscal espanhol que entenda estruturas internacionais com LLCs é **parte do setup completo**. Na Exentax cobrimos o lado USA e coordenamos com seu assessor espanhol, ou recomendamos um.

> Cada caso é individual. As posições da DGT podem evoluir e os protocolos do tratado se atualizam periodicamente. Esta guia é informativa, não substitui análise personalizada por profissional qualificado.
### Em resumo

- EUA e Espanha têm tratado assinado em 1990 e modernizado em 2019.
- Para LLC disregarded entity com dono espanhol, lucros empresariais tributam **na Espanha**, sem retenção USA se não há EP.
- Dividendos, juros e royalties têm tipos reduzidos.
- O **W-8BEN-E** é a ferramenta operativa.
- Retenções USA se compensam na Espanha via dedução.
- Setup completo: **Exentax + assessor fiscal espanhol**.

Se quer revisar seu caso com cifras concretas, **agende uma consultoria gratuita de 30 minutos** com a Exentax.

Para aprofundar, leia também <a href="/pt/blog/llc-como-alternativa-a-ser-autonomo-em-espanha">LLC como alternativa a ser autónomo na Espanha</a> e <a href="/pt/blog/w8-ben-e-w8-ben-e-o-guia-completo">Guia completa dos formulários W-8BEN e W-8BEN-E</a>.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (BOE 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

<!-- exentax:lote29-native-v1:convenio-doble-imposicion-usa-espana-llc-pt -->
## Como ler o convénio de dupla tributação Espanha-EUA como um mapeamento estável entre residência e fonte em vez de um atalho genérico

O convénio de dupla tributação Espanha-EUA lê-se de forma mais útil como um mapeamento estável entre o país de residência fiscal do beneficiário e o país da fonte de cada tipo de rendimento, em vez de um atalho genérico para "não pagar duas vezes". O convénio não substitui as regras de residência de cada país: organiza uma forma de coordenação, tipo de rendimento a tipo de rendimento.

Uma nota curta e datada no ficheiro pessoal, que registe o país de residência declarado no ano, os tipos de rendimento recebidos e o lado onde cada um foi tributado primeiro, torna a posição relevável em poucos minutos numa conversa com um consultor fiscal.
<!-- /exentax:lote29-native-v1:convenio-doble-imposicion-usa-espana-llc-pt -->

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.
Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram em recent years; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## Em resumo

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

## Compliance fiscal no seu país: CFC, TFI e atribuição de rendimentos

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.

## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Factos jurídicos e processuais

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

## Referências: enquadramento legal e regulamentação

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.

## Falemos sobre a sua estrutura

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.
## O que é e porque existe

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.



## Artigo 7 (lucros empresariais) em linguagem clara

O artigo 7 do tratado USA-Espanha é a peça central para a maioria das LLCs americanas detidas por residentes fiscais em Espanha. A lógica: os lucros de uma empresa só são tributáveis no Estado de residência da empresa, salvo se exercer a actividade no outro Estado através de um *estabelecimento estável* (permanent establishment).

Para uma LLC disregarded entity sem escritório, sem pessoal e sem agente permanente nos EUA, a leitura habitual é: sem estabelecimento estável americano, logo sem imposto federal sobre os lucros operacionais. A transparência fiscal faz subir os rendimentos ao sócio, que os declara no país de residência — Espanha — no Modelo 100, na categoria adequada (rendimentos de actividades económicas, na maior parte dos casos).

Três armadilhas merecem atenção cuidadosa. Primeiro: alugar um coworking fixo nos EUA ou empregar uma pessoa em solo americano cria estabelecimento estável e altera todo o equilíbrio. Segundo: revender produtos físicos com armazém nos EUA pode, segundo o volume e a estrutura, deslocar a análise para actividade comercial sujeita ao imposto federal. Terceiro: ausência de imposto federal não é ausência de obrigações declarativas — o 5472 e o 1120 pró-forma continuam devidos todos os anos.

## Se a AEAT lhe perguntar pela LLC

Acontece mais vezes do que se pensa, quase sempre após a apresentação do Modelo 100 ou do Modelo 720. O pedido é legítimo: a AEAT quer compreender a natureza da entidade, a origem dos rendimentos e a coerência com o que foi declarado. Três documentos fazem a diferença quando a carta chega.

**O dossiê da entidade.** Operating Agreement assinado, certificado EIN (CP-575 ou 147C), comprovativo do Estado de constituição, contrato com o Registered Agent, primeira submissão BOI. Este dossiê prova a existência e a regularidade da LLC; é o primeiro a ser pedido.

**O rasto bancário e operacional.** Extractos Mercury e Wise dos últimos 24 meses, facturas emitidas em nome da LLC, contratos de clientes relevantes, cópias dos Form 5472 entregues. Este rasto prova que a LLC opera de facto e que os rendimentos declarados em Espanha correspondem a fluxos documentados.

**A leitura do tratado.** Uma nota de uma a duas páginas a explicar a posição da entidade à luz do artigo 7 (sem estabelecimento estável nos EUA, transparência fiscal, tributação em Espanha). Esta nota prepara-se *antes* da carta da AEAT, no quadro normal da organização anual, e actualiza-se em caso de alteração estrutural.

A nossa equipa coordena este dossiê com o seu assessor fiscal espanhol e mantém-no sempre pronto. Uma resposta organizada e completa à AEAT em duas semanas vale mais do que uma resposta improvisada em dois meses; é o padrão que mantemos com cada cliente que acompanhamos ao ano.



### O reflexo anual que instalamos com cada cliente

Uma vez fechado o ano fiscal espanhol, datamos e arquivamos três peças: o Modelo 100 entregue, a nota actualizada de aplicação do tratado e o inventário dos extractos Mercury-Wise dos doze meses anteriores. Este trio prepara-se em menos de uma hora e poupa semanas se a AEAT abrir uma verificação dois anos depois.

### Três casos particulares da prática lusófona

**Caso 1 — Residência em Espanha, LLC e conta bancária em Portugal.** Alguns clientes mantêm uma conta pessoal em Portugal a par do Mercury. O Modelo 720 espanhol reporta ambas as contas acima do limiar; o tratado USA-Espanha não toca a conta portuguesa, que permanece uma obrigação meramente espanhola de reporte. A confusão mais comum: assumir que o tratado com os EUA cobre também as contas portuguesas. Não cobre.

**Caso 2 — Regime de Beckham em Espanha.** Sob o regime de Beckham, os rendimentos estrangeiros têm tratamento próprio. Uma LLC americana em disregarded entity gera rendimentos que este regime pode não cobrir. Antes de requerer o regime, modelamos com o assessor espanhol se inclui ou não os rendimentos da LLC; em muitos casos a resposta honesta é que o regime ordinário sai igual ou mais favorável.

**Caso 3 — Mudança de residência dentro do espaço lusófono durante a vida da LLC.** Uma transição Lisboa → Madrid → Lisboa em três anos levanta perguntas próprias porque cada Estado tem a sua leitura do tratado e das regras CFC face aos EUA. A nota de aplicação não é estática: actualiza-se após cada mudança e alinha-se com o conselheiro do novo país de residência. Esta pequena manutenção esquece-se no stress da mudança; custa depois bem mais do que a hora inicial de preparação.

<!-- exentax:execution-v2 -->
## Como o convénio EUA-Espanha se aplica à sua LLC, cláusula a cláusula

O convénio entre Espanha e Estados Unidos assinado em 1990 e modificado pelo Protocolo em vigor desde 2019 (BOE 23 de Outubro de 2019) reparte o poder tributário entre os dois países. Para uma SMLLC em atribuição de rendimentos, quatro artigos importam mesmo. Explicamo-los por ordem de impacto.

- **Artigo 7 - Lucros empresariais.** Se a LLC é transparente e não constitui estabelecimento estável nos EUA, os lucros são tributados exclusivamente em Espanha, no seu IRPF como rendimento de actividade económica. É a lógica que faz uma SMLLC pagar tipicamente zero imposto federal e todo o peso recair na residência.
- **Artigo 14 (Protocolo 2019) - Serviços pessoais independentes.** Reforçado após o Protocolo: para profissionais independentes residentes em Espanha sem base fixa nos EUA, os honorários tributam-se exclusivamente em Espanha. Combinado com o art. 7 blinda a operativa habitual de consultor ou developer.
- **Artigo 23 - Eliminação da dupla tributação.** Permite imputar em Espanha o imposto pago nos EUA (federal e estadual), com limite da quota espanhola sobre o mesmo rendimento. Para uma SMLLC com zero imposto federal, o crédito é nulo mas a dupla tributação real também.
- **Artigo 25 (Protocolo 2019) - Procedimento amigável (MAP).** Se AEAT e IRS qualificarem o mesmo rendimento de forma divergente, o MAP permite resolver via acordo entre administrações em cerca de 24 meses. Útil em requerimento divergente; a maioria dos casos não chega aqui porque a doutrina DGT é clara.

### O que mais nos perguntam

**Preciso de Form W-8BEN-E para a minha LLC?** Sim, quando um cliente americano pede certificação de não residência. A SMLLC com sócio não residente certifica como pass-through e o sócio anexa W-8BEN pessoal. Sem esta documentação, os pagadores americanos retêm 30 % por defeito.

**O convénio cobre dividendos e mais-valias?** Sim, mas com tectos diferentes (15 % dividendos, 0-21 % juros conforme o caso, mais-valias geralmente só em residência). Para uma SMLLC que distribui ao sócio, o "dividendo" é ignorado por transparência e tudo se imputa como lucro empresarial art. 7.

Na Exentax mapeamos cada fluxo da sua LLC contra o artigo aplicável do convénio, deixamos a documentação W-8 pronta e desenhamos a imputação em IRPF para que a declaração espanhola seja coerente com o tratamento federal.
<!-- /exentax:execution-v2 -->

## Como funciona para LLCs disregarded entity

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.


<!-- exentax:lote15-native-v1:convenio-doble-imposicion-usa-espana-llc-pt -->
## Como a convenção EUA–Espanha funciona na prática para uma LLC com um único membro

A convenção entre Espanha e Estados Unidos atua ao nível das pessoas, não ao nível dos veículos transparentes. Uma LLC com um único membro tratada como disregarded entity para efeitos fiscais norte-americanos é, em regra, olhada através, e as questões relevantes colocam-se ao nível da pessoa singular que dela é membro. Quando essa pessoa é residente fiscal em Espanha, Espanha tributa, segundo as suas próprias regras, o rendimento mundial imputado através da LLC, e a convenção reparte os direitos de tributação entre os dois países categoria a categoria.

Na prática, três artigos fazem o essencial do trabalho num ano calmo: o artigo da residência, que define qual o país com direitos de tributação primários quando ambos os poderiam reclamar; o artigo dos lucros das empresas, que em regra exige um estabelecimento estável no outro Estado antes que este possa tributar os lucros operacionais; e o artigo da eliminação da dupla tributação, que fixa a ordem pela qual se aplicam os créditos. Nenhum destes artigos produz por si só um resultado automático. São ferramentas que exigem documentação consistente: certificados de residência, contabilidade alinhada com o ano civil utilizado em cada país, e registo claro do sítio onde a atividade económica efetivamente ocorreu. Um ficheiro de trabalho com estas três peças, atualizado uma vez por ano, elimina a maior parte do atrito que a convenção pretende eliminar.
<!-- /exentax:lote15-native-v1:convenio-doble-imposicion-usa-espana-llc-pt -->

<!-- exentax:cross-refs-v1 -->
## Para continuar a leitura

- [Tributação pass-through para LLC: como funciona e por que importa](/pt/blog/tributacao-pass-through-para-llc-como-funciona-e-por-que)
- [Exit tax Espanha com LLC, cripto e Interactive Brokers](/pt/blog/exit-tax-espanha-llc-cripto-interactive-brokers)
- [Tributação da LLC por atividade: serviços, ecommerce, SaaS, royalties, trading](/pt/blog/tributacao-da-llc-segundo-a-atividade-economica-servicos)
<!-- /exentax:cross-refs-v1 -->

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Quando%20algu%C3%A9m%20v%C3%AA%20pela%20primeira%20vez%20a%20combina%C3%A7%C3%A3o%20LLC%20nos%20EUA%20e%20residente%20fisca%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
