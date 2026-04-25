export default `É a pergunta que mais se repete quando um cliente fecha a sua LLC connosco: "será que a Mercury, a Wise ou a Slash contam à Autoridade Tributária aquilo que tenho?". A resposta curta poucos a dão com clareza. Aqui vai: **uma conta financeira aberta nos Estados Unidos por uma LLC de não residente não é trocada automaticamente com a tua autoridade fiscal local**. E esse ponto, bem entendido, é um dos pilares que faz com que uma estrutura LLC bem desenhada funcione com o silêncio operativo que se espera dela.

Isto não significa "esconder". Significa que a tua estrutura está montada numa jurisdição que opera com regras próprias, e que o teu compliance é o que tu decides cumprir no teu país, sem surpresas externas.

## O que as pessoas pensam que acontece (e não acontece)

> "Se a Mercury é americana e eu sou europeu, os meus saldos acabam na Autoridade Tributária através de algum acordo automático."

Falso. Vamos explicar porquê com o enquadramento real, não com o enquadramento do medo.
## Como funciona a troca internacional de informação (os factos)

Existem dois sistemas globais que se confundem constantemente. Convém separá-los.

### CRS (Common Reporting Standard)

É o standard da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>. Mais de 100 países o aplicam. Os seus bancos identificam contas de não residentes e reportam saldos e rendimentos às autoridades fiscais do país de residência do titular.

**Os Estados Unidos não participam no CRS. Não são signatários. Não reportam CRS. Não recebem CRS.**

Qualquer instituição financeira 100 % americana, abrindo uma conta a uma LLC US, fica fora do circuito CRS. Não há fluxo automático para o teu país.

### FATCA

É a lei americana. Funciona num único sentido: obriga os bancos estrangeiros (europeus, asiáticos, latino-americanos) a reportar ao <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> as contas de **US persons** (cidadãos e residentes fiscais americanos).

O FATCA **não exporta automaticamente dados de contas US para a autoridade fiscal local de um residente europeu ou latino-americano**. É um sistema de reporte para os Estados Unidos, não a partir dos Estados Unidos. Alguns países assinaram IGAs recíprocos em teoria, mas na prática o fluxo do IRS para autoridades fiscais estrangeiras ao nível conta-a-conta de pessoas singulares não US é inexistente para o perfil típico de um titular de LLC.
### Mercury, Slash e Relay: instituições US, fora do CRS

As três são fintechs registadas nos EUA com bancos US como custodiantes:

- **Mercury** opera com Choice Financial Group, Column NA e Evolve Bank & Trust como bancos parceiros.
- **Slash** opera como conta corporativa US com produto de tesouraria em obrigações do Tesouro e rendimento competitivo.
- **Relay** opera com o Thread Bank como custodiante.

As três são instituições financeiras americanas. **As três estão fora do CRS** porque os EUA não participam. Cumprem com as suas obrigações de reporting ao IRS (formulários 1099 quando aplicável, etc.), mas não enviam informação automática para a Autoridade Tributária portuguesa, para a AEAT espanhola, para o SAT mexicano nem para qualquer outra autoridade fiscal estrangeira.

O que isto significa, em termos práticos: **o saldo da tua LLC na Mercury não cruza automaticamente com o teu IRS**. A rastreabilidade existe, mas permanece dentro do sistema US.
## Wise: o detalhe importante

A Wise opera com várias entidades em diferentes jurisdições. É isto que muda o reporting:

- **Wise US Inc.** (conta US para LLC americanas, IBAN/ACH/wire em USD): é entidade americana. **Está fora do CRS.** Tal como a Mercury.
- **Wise Europe SA** (conta multi-divisa europeia com IBAN belga): é entidade UE. Uma **Wise Business titularidade de uma LLC dos EUA fica FORA do CRS** (a LLC é entidade dos EUA, e os EUA não são jurisdição CRS); por outro lado, uma **Wise Personal em nome de um indivíduo residente fiscal numa jurisdição CRS** sim reporta saldos ao país de residência fiscal do titular via Wise Europe SA (Bélgica).

Para uma LLC aberta hoje com Wise Business e residência operacional nos EUA, a conta principal vai por Wise US Inc. Isso deixa-te fora do CRS para essa conta. Se também operas a conta multi-divisa europeia, então aí sim há reporting CRS sobre essa parte.

**Conclusão limpa: Wise US Inc. não reporta CRS. Wise Europe SA reporta.** Saber isto permite estruturar a operação com critério.
### Wallester: caso diferente, é preciso dizê-lo claramente

A Wallester é emissor europeu de cartões (Estónia/UE). Está dentro do enquadramento CRS europeu. Quando emites cartões Wallester ligados a uma conta operacional, o reporting da conta subjacente depende de onde está a conta. Se ligares a Wallester a uma conta US (Mercury, Wise US, Relay), a conta continua fora do CRS; se a ligares a uma conta EMI europeia, entra no circuito CRS.

É uma ferramenta operativa potente, mas tem de se desenhar sabendo que entidade emite cada peça.
### Gateways de pagamento: Stripe, PayPal, Whop, Hotmart, Adyen

As gateways não são contas bancárias. São processadores de transações que liquidam para a conta bancária que lhes indicares. **Não estão dentro do CRS** e não reportam saldos. Reportam fluxos ao fisco da sua jurisdição quando a regulamentação o exige (1099-K nos EUA para a Stripe US, por exemplo), mas os fundos vivem na tua conta bancária, não na gateway.

Uma LLC que cobra por Stripe US e liquida na Mercury opera todo o ciclo dentro do sistema financeiro americano. Limpo, eficiente, sem reporting CRS automático para o teu país.
### Aceder à informação de uma LLC US: como é realmente

Uma LLC bem constituída em Wyoming, Novo México ou Delaware tem **anonimato registral**:

- O proprietário não consta nos registos públicos.
- O **registered agent** figura como ponto de contacto legal.
- O **BOI Report** (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>) identifica o beneficial owner perante o regulador federal, **não perante o público** nem perante autoridades fiscais estrangeiras de forma automática.

Para que uma autoridade estrangeira queira saber quem está por trás de uma LLC, é preciso um pedido formal por canais bilaterais (assistência mútua, requerimento judicial). Não é automático, não é trivial e não se faz por curiosidade. É isso que, na prática, protege a operação de um cliente Exentax que tem a sua LLC bem estruturada.
### DAC7 e DAC8: diretivas europeias, não aplicam aos EUA

A DAC7 (plataformas digitais) e a DAC8 (cripto) são diretivas da União Europeia. Impõem obrigações a plataformas e exchanges com presença europeia, não a uma LLC americana nem às suas contas US. A tua LLC não entra na DAC7 nem na DAC8 pelo facto de existir ou de operar com clientes internacionais.

Como residente fiscal europeu tens as tuas próprias obrigações declarativas (Modelo 720/721 em Espanha, declaração de contas no estrangeiro em Portugal, equivalentes em França, Alemanha), e isso geres ao teu ritmo e com o teu consultor local. A LLC não acrescenta nem retira aqui: acrescentas o ativo se ultrapassar o limite, declaras, continuas a operar.
## O que vemos cada semana na Exentax

Três padrões reais:

**1. O cliente que chega com dúvidas**: passou anos a ler no YouTube versões contraditórias e abre a conversa esperando o pior. Mostramos-lhe como o sistema funciona realmente: conta US fora do CRS, FATCA bilateral mas sem fluxo conta-a-conta para o seu país, anonimato registral real. Sai a perceber que, bem estruturada e declarada, a operativa é perfeitamente sólida.

**2. O cliente que já transfere para a sua conta pessoal em Portugal todos os meses**: aqui sim há um ponto operativo a corrigir. Não porque a LLC reporte (não reporta), mas porque as transferências recebidas na sua conta portuguesa estão dentro do sistema CRS local. O que desenhamos é um fluxo mais limpo: cartão corporativo para despesas, distribuições planeadas e documentadas, em vez de gotejamento aleatório para a conta local.

**3. O cliente que tem Wise multi-divisa europeia + Mercury**: explicamos-lhe que entidade reporta o quê. Habitualmente reorganizamos para que a operação principal viva em Wise US ou Mercury e o módulo europeu seja usado apenas para casos pontuais.
### Como se faz bem

Uma estrutura financeira Exentax tipo:

- **Conta principal da LLC** em Mercury ou Wise US Inc. → fora do CRS, ACH e wire em USD, integrações contabilísticas.
- **Tesouraria com rendimento** em Slash → obrigações do Tesouro US, capital ocioso produtivo, mesmo perímetro US.
- **Cartões corporativos** Wallester → controlo granular da despesa operacional.
- **Gateways** Stripe US, PayPal Business, Whop, Hotmart consoante o produto → liquidação na Mercury, ciclo fechado em US.
- **Brokers** consoante o objetivo: Interactive Brokers (ações/ETFs/opções, abre a LLC de não residentes com W-8BEN-E), Tradovate (futuros), Kraken (cripto, opera com LLC).
- **Conta pessoal local separada** apenas para gasto pessoal final, alimentada por distribuições planeadas, não por torneira permanente.

Com este desenho, a operação fiscal é coerente: a LLC vive nos EUA, move-se dentro dos EUA, e tu decides quando e como distribuis para a tua vida pessoal com a documentação certa.
### Porquê a Exentax

Porque desenhamos isto desde o primeiro dia e não como remendo. A conta US, a tesouraria, o cartão, a gateway, o broker e o fluxo para a tua conta pessoal são pensados como um sistema, não como peças soltas que depois não encaixam. Quando tudo está estruturado bem:

- Não há incerteza sobre o reporting porque sabes exatamente que entidade reporta o quê.
- A rastreabilidade está limpa, o que te protege perante qualquer requerimento.
- A tua separação patrimonial real funciona: a LLC é a LLC, a tua vida pessoal é a tua vida pessoal.
- O compliance US (Form 5472, BOI, manutenção do agente) tratamos nós.

---
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a FinCEN).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / OCDE.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

A aplicação concreta de qualquer destas normas ao seu caso depende da sua residência fiscal, da atividade da LLC e da documentação que mantenha. Este conteúdo é informativo e não substitui aconselhamento profissional personalizado.
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
- **Revolut Business**: quando associado a uma **LLC norte-americana**, o esquema típico passa pela Revolut Payments USA; os IBAN europeus (lituanos, BE) **não são emitidos por defeito** a uma LLC, são emitidos a clientes europeus do banco europeu do grupo. Se lhe oferecerem um IBAN europeu, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram em recent years; eis o estado atual:
### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.<!-- exentax:execution-v2 -->
## O que as contas USA da sua LLC reportam e o que não reportam

A discrição real das contas americanas não é mito nem promessa absoluta: é uma assimetria documentada do sistema financeiro internacional, com limites concretos e um manual de uso se quiser aproveitar bem. Estes são os factos, sem teorias.

- **Os EUA não participam no CRS.** Único G20 que não assinou o Common Reporting Standard. Consequência prática: Mercury, Relay, Choice Financial, Evolve e Column N.A. não têm obrigação de enviar saldos automaticamente ao país de residência do titular. Não é truque, é a arquitectura do sistema desde 2014.
- **FATCA inverso é parcial.** O IGA Modelo 1 com Espanha (em vigor desde 2013) exige que os EUA enviem à AEAT informação sobre contas detidas por residentes espanhóis em bancos americanos, mas o alcance real é: contas de pessoas físicas residentes em titularidade directa, com depósitos geradores de juros. As contas de entidade (LLC) em bancos como a Mercury não caem neste fluxo automático com a mesma intensidade.
- **O que a AEAT pode pedir.** Via MAP do convénio EUA-Espanha, a AEAT pode solicitar informação específica sobre uma conta concreta quando há indício razoável. O processo leva 12-24 meses, requer motivação e é usado para casos de quantia relevante. Não é automático nem massivo.
- **O erro que quebra a assimetria.** Receber transferências da conta da LLC americana directamente para a sua conta pessoal em Espanha gera traço de origem visível para o seu banco espanhol, que reporta à AEAT. A discrição da conta USA preserva-se se o fluxo entrar via Wise multi-divisa com motivação coerente (member draw, salário, dividendo conforme qualificação), não como transferência bruta sem contexto.

### O que mais nos perguntam

**Então, posso não declarar a minha conta USA?** Não: tem obrigação declarativa própria (Modelo 720 se saldo combinado >50.000 €). A assimetria CRS não isenta; o que faz é eliminar o cruzamento automático que delata as omissões em jurisdições CRS. A sua obrigação de declarar permanece intacta.

**Quanto tempo durará esta assimetria?** Sem sinal de assinatura USA do CRS a curto prazo (5 anos). Há sinais de intensificação progressiva do FATCA inverso. A estrutura continua a funcionar hoje e previsivelmente toda a década, mas convém declarar correctamente para não depender da sua persistência.

Na Exentax deixamos a operativa Mercury + Wise desenhada com fluxos coerentes, declaração Modelo 720 limpa e documentação pronta para qualquer requerimento futuro, aproveitando a assimetria sem a converter em omissão declarativa.
<!-- /exentax:execution-v2 -->

## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações IRS e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.

<!-- task9-2026-expansion -->
## Fluxo regulatório em: do banco americano ao IRS e daí à AEAT via FATCA IGA Modelo 1

Esta secção desmonta o mito "os bancos americanos não reportam nada" e descreve o fluxo real de dados entre os EUA e Espanha ao abrigo do Acordo Intergovernamental FATCA Modelo 1 assinado em 14 de maio de 2013, em vigor desde 9 de dezembro de 2013 e refinado pelos memorandos de cooperação administrativa posteriores.

### Diagrama textual do fluxo

1. **Banco ou EMI dos EUA (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: cada instituição financeira classificada como FFI recíproca reporta anualmente ao IRS os saldos e rendimentos de fim de ano de contas cujo titular seja pessoa ou entidade espanhola sujeita a FATCA. Se a conta pertence à sua LLC, o reporte usa o GIIN da entidade e o TIN do beneficiário efetivo declarado no W-9 ou W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: o IRS agrupa os dados do ano civil e envia-os à AEAT entre **setembro e outubro do ano seguinte** no formato FATCA XML 2.0 vigente desde julho de 2024.
3. **AEAT → cruzamento interno**: a AEAT confronta esses registos com as suas declarações (Modelo 100, Modelo 720, Modelo 721). As divergências entram no "Plan Anual de Control Tributario" do ano.

### O que se transmite e o que NÃO se transmite

**Transmite-se** (campos FATCA XML): nome do titular ou da LLC, morada, TIN espanhol ou NIF, número de conta, saldo a 31 de dezembro, juros brutos pagos no ano, dividendos e outros rendimentos brutos, produtos brutos de venda de ativos financeiros e GIIN da instituição.

**Não se transmite automaticamente**: movimentos diários, beneficiários indiretos abaixo de 25 % de controlo, contraparte de cada operação ou classificação interna da atividade económica subjacente. Estão também excluídas contas abaixo de **50.000 USD** detidas por pessoas singulares norte-americanas sem indícios US segundo a due diligence FATCA, embora más recientemente a prática de Mercury e Wise US Inc. seja reportar todas as contas associadas a um TIN espanhol acima de zero.

### Datas críticas em

- 31 de março de: as FFIs têm de enviar ao IRS o reporte FATCA anual.
- 30 de setembro de: janela habitual de troca IRS-AEAT del último ejercicio cerrado.
- Outubro a dezembro de: os dados aparecem no Renta Web da AEAT e disparam eventuais pedidos de informação.

### Como se preparar sem surpresas

Mantenha o seu W-8BEN-E alinhado com a estrutura real, fature e receba sempre pela conta da LLC, guarde extratos mensais em PDF e, se chegar um pedido de informação do 720, terá cinco dias úteis para responder. Passe o seu caso pela <strong>calculadora fiscal da Exentax</strong> para ver o custo líquido de declarar limpo face a permanecer numa zona cinzenta.

Para ver como estes dados se cruzam com a apresentação do 720 continue com <a href="/pt/blog/modelo-720-e-modelo-721-guia-para-residentes-em-espanha-com">o guia passo a passo do Modelo 720 e 721</a>, e para uma auditoria completa do setup <strong>agende uma chamada com a equipa Exentax</strong>.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22%C3%89%20a%20pergunta%20que%20mais%20se%20repete%20quando%20um%20cliente%20fecha%20a%20sua%20LLC%20connosco%3A%20s%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
