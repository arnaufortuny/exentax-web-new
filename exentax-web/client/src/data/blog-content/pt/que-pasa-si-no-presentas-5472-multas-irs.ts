export default `Há uma declaração na vida fiscal de uma LLC unipessoal com sócio estrangeiro que separa de forma clara quem a gere bem de quem está a caminhar para um problema de cinco dígitos: o **Form 5472**. Não é um imposto. É uma declaração informativa. E precisamente por ser "só informativa", muita gente ignora-a, apresenta-a fora de prazo, apresenta-a com dados partidos ou nem sabe que existe. O <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> raramente perdoa esse esquecimento: a sanção base é de **25.000 USD por formulário não apresentado, por ano**, e acumula.

Este artigo não é o guia passo-a-passo (para isso já tens o nosso <a href="/pt/blog/form-5472-o-que-e-quem-deve-apresenta-lo-e-como-cumprir">guia completo do Form 5472</a> e a peça sobre <a href="/pt/blog/irs-1120-e-5472-o-que-realmente-sao-e-quando-se-aplicam">quando o 1120 e o 5472 realmente se aplicam</a>). É o que acontece **quando já não o apresentaste**, e como sair daí sem destruir a LLC nem a tua situação pessoal.

## O que o IRS sanciona exactamente

A regra vive na **section 6038A(d) do Internal Revenue Code**, reforçada em 2017 pelo Tax Cuts and Jobs Act. A base actualmente em vigor é de **25.000 USD por formulário não apresentado, apresentado tarde ou substancialmente incompleto**. Até 2018 a sanção era de 10.000 USD; desde então está fixada em 25.000 USD e, salvo alteração legislativa, é o número contra o qual vais bater.

A esta base somam-se três elementos que a maioria não vê chegar:

1. **Sanção por persistência.** Se o IRS te notifica formalmente da falta e não regularizas em **90 dias**, somam-se **25.000 USD adicionais por cada 30 dias** (ou fracção) que continues sem apresentar. Sem tecto publicado: vimos casos reais a seis dígitos.
2. **Uma sanção por ano, não uma só.** Três anos sem apresentar = três formulários. Três × 25.000 = **75.000 USD** antes de juros.
3. **Cascata com o Form 1120.** A tua LLC unipessoal com sócio estrangeiro deve apresentar **Form 1120 pro forma + Form 5472 conjuntamente**. Se falhaste o 5472, quase sempre falhaste o 1120, o que adiciona exposição adicional por late filing do 1120 sob §6651, embora a sanção monetária do §6651 se calcule sobre o imposto devido, pelo que numa LLC pro forma sem tax due o valor costuma ser zero ou residual; o risco principal continua a ser o 5472.

A tudo isto soma **juros sobre as sanções** desde a data de exigibilidade, calculados pelo IRS ao federal short-term rate + 3 pontos, actualizados trimestralmente.
## Como o IRS descobre

A pergunta quase universal na primeira reunião: *"mas como é que o IRS vai saber que existo se nunca apresentei nada?"*. Resposta curta: **sabe, e cada ano é mais fácil saber**. Os cinco canais concretos atualmente:

- **EIN sob controlo.** Se pediste EIN, já estás nos sistemas deles. O IRS cruza periodicamente EINs activos com declarações recebidas. Uma LLC unipessoal com EIN activo e sem 1120/5472 ano após ano aparece como **non-filer** nas listagens.
- **Bancos americanos e reporte de terceiros.** Mercury, Brex, Wise USD, Relay e similares fazem KYC sobre a LLC, mantêm informação de cliente acessível ao IRS e, conforme o fluxo e tipo de cliente, podem gerar reporte de terceiros (Form 1099, retenções, FATCA quando aplicável). Uma LLC operacional que move fundos sem nada apresentado é o padrão que activa revisões.
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).** Sob a normativa <a href="/pt/blog/boi-report-2026-guia-completo-para-a-declaracao-fincen">BOI Report</a> em vigor, a FinCEN tem mapeada a titularidade real das LLC obrigadas, e o quadro prevê partilha de dados com o IRS sujeita às regras de acesso aplicáveis (regime sujeito a alterações normativas).
- **CRS e DAC ao contrário.** Quando o teu país de residência recebe informação de contas ligadas à LLC e o IRS pede para auditar, o cruzamento sai sozinho. Algumas jurisdições já o fazem por defeito.
- **As tuas próprias contrapartes.** Quando um fornecedor americano emite Form 1099 à tua LLC, ou uma contraparte declara uma reportable transaction, a tua LLC aparece reflectida no sistema sem nada teres feito.

A ideia "como nunca apresentei, não me vêem" ficou enfraquecida com os reforços de 2017 e, sob a normativa BOI em vigor, é praticamente insustentável. A baseline correcta é assumir que o IRS pode abrir um exame a qualquer momento e desenhar o teu plano em consequência.
## Os três perfis típicos de quem chega tarde

Na prática, as situações que vemos na Exentax são três e cada uma se gere de forma diferente:

### Perfil A: nunca apresentaste o 5472

Tens a LLC há dois, três, cinco anos. Tens EIN, conta bancária, facturaste. Mas nunca tocaste no 1120 nem no 5472 porque "alguém te disse que a LLC não paga impostos". Exposição potencial: **25.000 USD × número de anos não apresentados**, mais possível late filing do 1120, mais juros.

### Perfil B: apresentaste tarde

Apercebeste-te, apresentaste tarde, mas **antes do IRS te notificar formalmente**. Aqui abre-se o debate sobre a late-filing penalty do 5472: oficialmente continuam 25.000 USD, mas a prática consolidada é que **apresentação tardia espontânea com reasonable cause** abre porta a **abatement**. É onde fechamos mais casos a sanção zero.

### Perfil C: apresentaste mas mal

Apresentaste 1120 e 5472 mas com dados substancialmente incompletos: faltou uma **reportable transaction**, puseste mal o TIN do foreign related party, omitiste um empréstimo do sócio à LLC, não declaraste uma capital contribution. A regra 6038A(d) é estrita: uma **declaração substancialmente incompleta equivale a não apresentação**, mesma sanção. Boa notícia: a correcção amigável com explicação escrita resolve-se em geral melhor que as duas anteriores.
### O que é realmente uma "reportable transaction"

Esta é a causa número um de Form 5472 tecnicamente mal apresentados. Uma **reportable transaction** é qualquer movimento monetário ou não monetário entre a LLC e o seu foreign related party (tu, na maioria dos casos), incluindo coisas que as pessoas não associam a "transacção":

- Entradas de capital do sócio para a LLC.
- Empréstimos do sócio para a LLC e da LLC para o sócio (sim, ambos os sentidos).
- Distribuições da LLC para o sócio.
- Pagamentos por serviços, royalties, juros.
- Cessões de uso de activos (incluindo software, marcas, domínios).
- Reembolsos de despesas quando o sócio paga pessoalmente e é reembolsado.
- Qualquer lançamento contabilístico que represente um direito ou obrigação entre LLC e sócio.

Quando alguém me diz "eu não tive transacções com a minha LLC", normalmente o que há são **cinco ou seis reportable transactions não documentadas**. Isso é exactamente o Perfil C.
## O ciclo real de uma notificação IRS

Convém ter mapeado o que acontece quando a máquina arranca, porque cada passo tem prazos e opções diferentes:

1. **CP15 / CP215 (notice of penalty).** Notificação da sanção inicial de 25.000 USD por formulário.
2. **Prazo de resposta (~30 dias).** Decides pagar, pedir abatement por reasonable cause, contestar o cálculo ou escalar para o Office of Appeals.
3. **Exame alargado.** Se a resposta não convence, o IRS abre normalmente exame sobre anos adicionais. Onde havia uma sanção aparecem três.
4. **90 dias após notificação formal.** Se o formulário não foi apresentado e a situação não resolvida, arranca o relógio dos **25.000 USD por cada 30 dias adicionais**.
5. **Liquidação final + juros.** Uma vez fixada, juros até ao pagamento.

Quem passou por aqui sabe que o momento decisivo é **o prazo do passo 2**. Uma resposta bem construída nesse momento é a diferença entre fechar a 0 e arrastar seis dígitos durante anos.
### Reasonable cause: o que de facto funciona

O IRS prevê uma **reasonable cause exception** ao abrigo do 6038A. Não é magia: é doutrina com critérios. O que tipicamente **funciona**:

- Demonstrar que agiste com **diligência ordinária** e que o erro veio de causa razoável, não negligência.
- Apresentar correspondência com consultores anteriores que te asseguraram que não havia obrigação.
- Demonstrar que assim que tomaste conhecimento da obrigação, **regularizaste imediatamente**.
- Mostrar que a informação estava disponível e que apresentaste declarações correctas e completas ao regularizar.

O que **não funciona** (e muitos tentam):

- "Não sabia que existia o 5472." Insuficiente.
- "O meu banco / Stripe / contabilista não me disse." Insuficiente.
- "A LLC não teve actividade relevante." Se houve qualquer reportable transaction, irrelevante.
- Pedir o abatement **depois** de uma regularização incompleta ou errada.

É aqui que um escrito profissional, formalmente estruturado, com referências ao IRM 20.1.9 e ao regulation §1.6038A-4, faz a diferença.
### Streamlined não, mas há caminhos

Muita gente confunde os **Streamlined Filing Compliance Procedures** (programa para **US persons com contas estrangeiras não declaradas**) com um Form 5472 falhado. **Não é o mesmo e não se aplica.** O que se aplica ao 5472 são três rotas reais:

- **Delinquent international information return submission.** Procedimento padrão para apresentar tarde declarações informativas internacionais com reasonable cause. Rota habitual dos Perfis A e B.
- **Voluntary Disclosure Practice.** Só quando há **conduta dolosa** ou risco penal. Não é normal numa LLC unipessoal.
- **Quiet disclosure.** Apresentar tarde sem explicação. Tecnicamente possível, praticamente desaconselhado: o IRS trata como late filing puro e aplica sanção.

A diferença entre rota correcta e ir às cegas é, literalmente, dezenas de milhares de USD.
## O plano de regularização passo a passo

Quando chega um cliente com 5472 falhado, a ordem de trabalho é sempre a mesma:

1. **Inventário real**: quantos anos, que reportable transactions cada ano, que documentação bancária e contabilística existe, BOI apresentado, 1120 apresentado, declarações no país de residência.
2. **Reconstrução das reportable transactions** ano a ano, incluindo entradas, empréstimos e distribuições.
3. **Preparação do pacote**: pro forma 1120 de cada ano pendente + 5472 de cada ano pendente + reasonable cause statement detalhado.
4. **Envio por correio registado** (estes pacotes não vão por e-file; endereço operacional: Service Center de Ogden).
5. **Plano de resposta antecipado** para a sanção inicial: rascunho de resposta e prazos preparados antes mesmo de o aviso chegar.
6. **Limpeza dos adjacentes**: <a href="/pt/blog/boi-report-2026-guia-completo-para-a-declaracao-fincen">BOI</a>, situação bancária, declarações no teu país e sobretudo <a href="/pt/blog/tenho-uma-llc-estou-a-gerir-bem-checklist-real">a checklist anual</a> para que não volte a acontecer.

Feito nesta ordem, em muitos casos o resultado realista é **sanção zero ou residual**, mas depende de factos, documentação e resposta do agente do IRS. Mal feito: cinco dígitos e exame alargado.
### Erros que multiplicam a factura

Para fechar no concreto, estes são os erros que na Exentax vemos repetir mês a mês e que **multiplicam o custo**:

- Apresentar o 5472 sem o 1120 pro forma associado. Inválido.
- Apresentar o 5472 por e-file: salvo casos pontuais, vai por correio e assinado.
- Reasonable cause genérico copiado da internet. O IRS arquiva como rejeição.
- Apresentar só os últimos anos "para não chamar a atenção". Se a obrigação existia antes, a sanção está viva.
- Fechar a LLC achando que isso apaga a obrigação. **Não apaga**: a sanção sobrevive à dissolução até prescrever.
- Mudar de Registered Agent ou de morada sem actualizar o IRS. As notificações perdem-se e os prazos correm.
- Assumir que o teu país de residência te protege. A sanção é do IRS contra a LLC; nenhuma convenção bilateral a apaga.

---
### Conclusão e próximo passo

O Form 5472 é um dos poucos casos onde o custo de **não fazer nada** é geometricamente superior ao custo de fazer bem. A base de 25.000 USD por ano não se discute; o que se discute é **como regularizas, em que ordem, com que argumentação e que riscos colaterais fechas em simultâneo**.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Fala com a nossa equipa</a>
<!-- /exentax:calc-cta-v1 -->

Se tens uma LLC e achas que podes estar em qualquer um dos três perfis, não apresentei, apresentei tarde, apresentei mas mal, o razoável é **mapear a situação com números reais antes de o IRS o fazer**. Numa consulta gratuita de 30 minutos revemos contigo, dizemos-te em que perfil estás, que exposição tens e que rota de regularização é realista. É a movida mais barata que podes fazer hoje sobre este tema.
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a FinCEN).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
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
- **Revolut Business**: quando associado a uma **LLC norte-americana**, o esquema típico passa pela Revolut Payments USA; os IBAN europeus (lituanos, BE) **não são emitidos por defeito** a uma LLC, são emitidos a clientes europeus do banco europeu do grupo. Se lhe oferecerem um IBAN europeu, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram em recent years; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações IRS e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.<!-- exentax:execution-v2 -->
## O que acontece se NÃO apresenta o 5472: como é a multa do IRS e como regularizar

O 5472 é a obrigação mais cara que um dono de LLC não residente pode falhar. Sanção civil, automática, arranca em $25.000 por formulário por ano.

- **Sanção exacta e aplicação.** $25.000 por cada 5472 não apresentado, incompleto ou tardio (IRC §6038A(d)). Se 90 dias após aviso IRS ainda não apresenta, $25.000 adicionais por cada período de 30 dias, sem tecto explícito. Multa NÃO depende do revenue da LLC.
- **Como o IRS se apercebe.** Três vias: troca CRS/FATCA com país de residência, cruzamento com banco US, auditoria aleatória. Probabilidade não nula e crescente.
- **Como regularizar antes de abrirem processo.** Apresentação tardia voluntária do 5472 + 1120 + carta de "reasonable cause". Programa First-Time Penalty Abatement pode eliminar totalmente a multa.
- **Como regularizar após aviso IRS.** 30 dias para responder: apresentação imediata, pagamento sob protesto, pedido formal de abatement. 4-6 meses. Sucesso em first-equipa + reasonable cause: 60-80%.

### O que mais nos perguntam

**Se 3 anos em atraso, são $75.000?** Sim, no pior caso. Regularização voluntária com reasonable cause pode reduzir ou eliminar.

**Posso fechar a LLC e "que esqueçam"?** Não. Obrigação dos anos activos persiste após dissolução.

Na Exentax fazemos regularizações de 5472 atrasados.
<!-- /exentax:execution-v2 -->

## Como trabalhamos na Exentax

A nossa equipa é especializada em estruturas fiscais internacionais para residentes de países de língua espanhola que operam negócios online. Combinamos conhecimento local de Espanha, Andorra e América Latina com experiência operacional na constituição de entidades em Delaware, Wyoming, Estónia e outras jurisdições. Cada caso começa com uma consulta gratuita na qual avaliamos a residência, a atividade e os objetivos, e dizemos-lhe honestamente se a estrutura proposta faz sentido ou se uma alternativa mais simples é suficiente.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22H%C3%A1%20uma%20declara%C3%A7%C3%A3o%20na%20vida%20fiscal%20de%20uma%20LLC%20unipessoal%20com%20s%C3%B3cio%20estrangeiro%20%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se queres ver todo o processo em detalhe, vê a nossa <a href="/pt/servicos">página de serviços</a> com tudo o que cobrimos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Revemos BOI, EIN, agente registado e obrigações federais para que nenhuma multa o apanhe de surpresa. <a href="/pt/servicos">Pedir revisão de compliance</a>.
<!-- /exentax:cta-v1 -->

`;
