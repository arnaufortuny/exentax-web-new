export default `Se ou sua LLC recebem dinheiro dos Estados Unidos (Stripe, PayPal, plataformas de afiliação, AdSense, dividendos, royalties, brokers...), pode ser que te peçam um **W-8BEN** ou um **W-8BEN-E**. Nem toda plataforma exige: o banking empresarial como Mercury, Relay ou Wise só pede se uma verificação específica de compliance exigir, enquanto brokers como Interactive Brokers exigem desde a abertura da conta. Onde é exigido e não preenche (ou preenche errado), o resultado é sempre o mesmo: o pagador americano aplica uma **retenção de 30%** sobre o que te deve, "por via das dúvidas". 30% que depois é muito difícil recuperar.

Esta guia é a versão completa, em português, sem tecnicismos desnecessários mas rigorosa. vai entender o que são esses formulários, em que se diferenciam, quem deve apresentar cada um, onde, como preencher passo a passo e quais erros podem custar caro.

## O que são os W-8 e por que existem

Os formulários da série **W-8** são documentos do **<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>** (a Receita Federal americana) por meio dos quais uma pessoa ou entidade **não americana** declara ao pagador que **não é contribuinte fiscal nos EUA** e, quando aplicável, que **se acolhe a um tratado de dupla tributação** para reduzir ou eliminar a retenção padrão.

A regra geral nos EUA é que qualquer pagamento de origem americana a uma pessoa ou entidade estrangeira está sujeito a uma retenção de **30%**, salvo prova em contrário. Essa prova se faz com um W-8.

Os mais usados são dois:

- **W-8BEN:** para **pessoas físicas não americanas**.
- **W-8BEN-E:** para **entidades não americanas** (sua LLC, sua SL, sua GmbH…).

Existem outros (W-8ECI, W-8IMY, W-8EXP) para casos mais específicos.
### Diferença chave entre W-8BEN e W-8BEN-E

| | W-8BEN | W-8BEN-E |
|--|--------|----------|
| Quem assina | Pessoa física não residente nos EUA | Entidade não americana |
| Dados chave | Nome, país, endereço, data de nascimento, ID fiscal | Razão social, país de constituição, EIN/GIIN, tipo de entidade, status FATCA |
| Páginas | 1 | 8 (preenche apenas 2-3) |
| Tratado | Sim, Parte II | Sim, Parte III |
| Validade | 3 anos | 3 anos |

Uma **Single-Member LLC de não residente** é um caso interessante: embora o IRS a trate como Disregarded Entity, **o formulário apresentado normalmente é o W-8BEN-E** em nome da LLC, não o W-8BEN do titular.
## Para que servem na prática

Para **evitar a retenção de 30%** sobre pagamentos de origem USA. O tratado entre **EUA e Espanha** (e equivalentes com vários outros países) reduz essa retenção a:

- **0%** sobre a maioria de **rendimentos empresariais** (serviços prestados de fora dos EUA sem estabelecimento permanente).
- **15%** sobre **dividendos** de empresas americanas (10% em participações qualificadas).
- **0%** sobre **juros** em geral.
- **0-10%** sobre **royalties** conforme o tipo.

Sem W-8 assinado, o pagador retém 30% de tudo. Com W-8 bem feito, recebe pagamentos íntegros (caso mais comum para serviços).
### Quem deve apresentar

O formulário é apresentado por **quem recebe o dinheiro**, não por quem paga. Ou seja:

- como **pessoa física** se recebe diretamente: **W-8BEN**.
- Sua **LLC** ou outra entidade se os pagamentos vão para a conta da entidade: **W-8BEN-E**.
### Quando apresentar

- Ao **abrir qualquer conta** em banco, fintech ou broker americano.
- Ao **registar seu negócio** num gateway de pagamento.
- Quando um **cliente USA** pedir antes do primeiro pagamento.
- A cada **renovação** de 3 anos.
### Onde se entregam

Diferente de outros formulários do IRS, **o W-8 não é enviado ao IRS**. É entregue ao **pagador**, que o conserva nos ficheiros. Se a Receita americana audita o pagador, ele justifica com seu W-8 por que não aplicou os 30%.

Plataformas que exigem W-8 por padrão: **Interactive Brokers e outros brokers**, **Stripe**, **PayPal Business**, **AdSense**, **YouTube**, **Amazon KDP**, **App Store Connect**, **Twitch**. Já **Mercury, Relay, Slash e Wise Business** **não** exigem W-8 para operar; só pedem se uma verificação pontual de compliance exigir.
### Como preencher um W-8BEN passo a passo (pessoa física)

Estrutura: uma página, três partes.

**Parte I, Identificação do beneficiário:**

1. **Name of individual:** seu nome completo do passaporte.
2. **Country of citizenship:** sua nacionalidade.
3. **Permanent residence address:** endereço da sua residência fiscal real, não PO Box nem endereço nos EUA.
4. **Mailing address:** se diferente.
5. **US TIN (SSN/ITIN):** só se tiver. A maioria deixa em branco.
6. **Foreign tax identifying number:** seu NIF/NIE.
7. **Reference number:** raramente usado.
8. **Date of birth:** formato MM-DD-YYYY.

**Parte II, Tratado:**

9. País do tratado: "Spain" se residente na Espanha.
10. Detalhe especial: só se reclamar tipo reduzido específico.

**Parte III, Certificação:** assina, data e nome.
## Como preencher um W-8BEN-E passo a passo (sua LLC)

É mais longo (8 páginas) mas só preenche o que aplica. Para uma **Single-Member LLC de não residente**:

**Parte I, Identificação da entidade:**

1. **Name of organization:** razão social exata da LLC.
2. **Country of incorporation:** "United States".
3. **Disregarded entity name:** deixe em branco.
4. **Chapter 3 status:** marque **"Corporation"** se a LLC fez election; na maioria dos casos de não residentes com Single-Member, a opção prática é identificar a entidade e preencher a **Parte III** do tratado. Em dúvida, marque **"Corporation"**.
5. **Chapter 4 status (FATCA):** marque **"Active NFFE"** se a LLC fatura por serviços ou vende produtos.
6. **Permanent residence address:** endereço registado da LLC nos EUA.
7. **Mailing address:** opcional.
8. **US TIN (EIN):** EIN da sua LLC.
9. **GIIN:** deixe em branco.
10. **Foreign TIN:** ID fiscal do beneficiário final.

**Parte III, Tratado:** marque que o beneficiário é residente da **Spain**, indique cumprimento da **limitação de benefícios** (Art. 17) e o artigo do tratado aplicável.

**Parte XXV, Active NFFE:** declarar que mais de 50% dos rendimentos são ativos.

**Parte XXX, Certificação:** assina, nome, cargo e data.
### Erros comuns que custam dinheiro

1. **Endereço USA como residência permanente.**
2. **Usar W-8BEN onde caberia W-8BEN-E** ou vice-versa.
3. **Não assinar.**
4. **Esquecer o Foreign TIN** quando exigido.
5. **Não marcar Chapter 4 status.**
6. **Reclamar tipo de tratado que não corresponde.**
7. **Não renovar após 3 anos.**
### Validade e renovação

O W-8 assinado vale **3 anos calendário completos** desde a data de assinatura. Se mudarem dados substanciais, apresente novo. Coloque na agenda a renovação a tempo.
### Relação com o tratado USA-Espanha

O **Tratado entre o Reino da Espanha e os EUA para evitar a dupla tributação**, assinado em 1990 e modernizado pelo Protocolo de 2013 em vigor desde 2019, é a base legal para a maioria dos tipos reduzidos do W-8 quando é residente espanhol:

- **Lucros empresariais (Art. 7):** sem EP, tributação só na Espanha. **0% retenção** para serviços prestados de fora dos EUA.
- **Dividendos (Art. 10):** 15% (10% em participações qualificadas).
- **Juros (Art. 11):** geralmente 0%.
- **Royalties (Art. 12):** entre 0% e 10%.

Para entender como encaixa com sua LLC, leia também a <a href="/pt/blog/tratado-de-dupla-tributacao-usa-espanha-para-llcs">guia sobre o tratado USA-Espanha aplicado a LLCs</a>.
### Casos práticos por plataforma

- **Stripe:** W-8BEN-E embutido. Resultado: 0% retenção sobre serviços.
- **PayPal Business:** ao verificar a conta business.
- **Mercury / Relay / Slash:** **não** é exigido no onboarding padrão da sua LLC. Só é solicitado se uma verificação pontual de compliance exigir; sem essa solicitação, não precisa assinar nenhum para operar.
- **Wise Business:** mesmo critério que Mercury / Relay: só se for solicitado expressamente. Não é um trâmite por padrão ao registar sua LLC.
- **Interactive Brokers:** aplica 15% em dividendos americanos em vez de 30%.
- **AdSense / YouTube / Amazon KDP / App Store / Twitch:** assistente próprio.
### Como a Exentax ajuda

Na Exentax preparamos os W-8BEN-E da sua LLC onde realmente são exigidos: Stripe, IBKR e outros brokers, plataformas de afiliação, AdSense / YouTube / Amazon KDP e qualquer pagador americano que solicite um. Em Mercury, Relay, Slash ou Wise só assinamos se a plataforma pedir expressamente. Se a retenção de 30% já foi aplicada por um W-8 mal feito, avaliamos se cabe pedir devolução via 1042-S, embora seja sempre mais barato fazer certo desde o início.

> Cada caso é individual e a legislação fiscal pode mudar; estes formulários e critérios FATCA são atualizados periodicamente.

Se quer que revisemos sua situação, agende sua consultoria gratuita com a Exentax.

Para aprofundar, leia também <a href="/pt/blog/as-contas-bancarias-americanas-reportam-a-sua-autoridade">As contas bancárias nos EUA reportam ao fisco espanhol?</a> e <a href="/pt/blog/llc-como-alternativa-a-ser-autonomo-em-espanha">LLC como alternativa a ser autónomo na Espanha</a>.
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

<!-- exentax:legal-refs-v1 -->
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** BOE de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
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
- **Revolut Business**: quando associado a uma **LLC norte-americana**, opera sob **Revolut Technologies Inc.** com **Lead Bank** como banco parceiro nos EUA. A conta entregue é uma conta dos EUA (routing + account number); **não é emitido IBAN europeu** a uma LLC. Os IBAN europeus (lituanos, BE) são da **Revolut Bank UAB** e são emitidos a clientes europeus do grupo. Se lhe oferecerem um IBAN europeu associado à sua LLC, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram em recent years; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## Compliance fiscal no seu país: CFC, TFI e atribuição de rendimentos

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.

## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Factos jurídicos e processuais

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

<!-- exentax:execution-v2 -->
## W-8BEN e W-8BEN-E: guia completa para não confundir e não pagar 30% por erro

O W-8 é o documento mais importante para um não residente com qualquer payer US. Sem ele, retenção 30% por defeito.

- **W-8BEN: para pessoas singulares.** O TITULAR assina como pessoa. Útil para royalties, juros, dividendos US-source. 3 anos de validade.
- **W-8BEN-E: para entidades, a sua LLC.** Assinado pelo signatário autorizado. Identifica LLC, classificação FATCA (single-member disregarded = ponto crítico), beneficial owner, treaty claim. 3 anos.
- **Erro mais comum: marcar LLC como Corporation quando é disregarded.** Single-member LLC sem eleição C/S-Corp é "disregarded entity". Se marca Corporation por erro: 30% retido em vez de 15% (PT-US dividendos) ou 0%.
- **Treaty benefits.** Part III: país de residência com certificado, citar artigo do tratado.

### O que mais nos perguntam

**Tenho de enviar W-8BEN-E directamente ao IRS?** Não. Ao payer, não ao IRS.

**LLC disregarded: quem reclama o tratado?** O beneficial owner segundo o seu país.

Na Exentax preparamos W-8BEN-E correctos.
<!-- /exentax:execution-v2 -->

## Falemos sobre a sua estrutura

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Se%20voc%C3%AA%20ou%20sua%20LLC%20recebem%20dinheiro%20dos%20Estados%20Unidos%20(Stripe%2C%20PayPal%2C%20plata%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
