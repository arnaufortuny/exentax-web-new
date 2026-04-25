export default `

De tempos a tempos surge uma versão "definitiva" do intercâmbio automático de informação fiscal e, com ela, a pergunta que mais recebemos na Exentax: se a OCDE aperta novamente o cerco com o CRS 2.0 e o CARF, o que é que acontece exatamente a uma <a href="/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em">LLC americana</a> propriedade de um europeu ou de um latino-americano não residente? A resposta curta é que o cerco aperta fora dos Estados Unidos, não dentro. A resposta longa, que é a que importa, exige perceber por que motivo Washington nunca assinou o CRS, por que também não vai assinar o CRS 2.0 e como isso afeta a sua estrutura hoje e o seu planeamento dos próximos anos.

> **Ponha números no seu caso.** A <a href="/pt#calculadora">calculadora Exentax</a> compara a sua carga fiscal atual com a que teria a operar uma LLC bem estruturada e devidamente declarada no seu país de residência.

## Resumo executivo

O CRS 2.0 (a versão revista do Common Reporting Standard da OCDE) e o CARF (Crypto-Asset Reporting Framework) ampliam aquilo que bancos e exchanges declaram às administrações fiscais das jurisdições aderentes. Mais dados, mais entidades obrigadas e, sobretudo, muito mais cripto dentro do perímetro. Os Estados Unidos não estão nessa fotografia e nada na sua política fiscal da última década indica que venham a estar: têm o seu próprio regime, FATCA, que é bilateral e de saída, e captam biliões de dólares de capital estrangeiro precisamente porque oferecem a única jurisdição relevante fora do CRS. Para o titular não residente de uma LLC, isto não é um atalho para "esconder" nada; é um facto técnico que molda a escolha do estado, o stack bancário e a coerência com a sua declaração no país de residência.

## CRS original: o que se quis corrigir e onde ficou curto

O **Common Reporting Standard** foi aprovado pelo Conselho da OCDE como resposta política ao mandato do G20 depois da crise financeira e dos escândalos de evasão fiscal da década passada (LuxLeaks, SwissLeaks, Panama Papers). Importou-se a mecânica do FATCA, que já funcionava unilateralmente para os EUA, e generalizou-se a mais de 110 jurisdições por meio de um Multilateral Competent Authority Agreement (MCAA) que ativa os fluxos bilateralmente entre cada par de países aderentes.

O standard exige que cada **Reporting Financial Institution** (banco, corretor, fintech com licença bancária, fundo de investimento, seguradora com produtos de investimento) identifique o titular cuja residência fiscal seja distinta da da conta e reporte:

- Dados do titular: nome, morada, país de residência fiscal, NIF/TIN, data e local de nascimento.
- Dados da entidade: nome, NIF, país. Em contas tituladas por **NFE passivas**, também as **pessoas controladoras** (controlling persons) beneficiárias efetivas.
- Dados da conta: número, nome e identificador da instituição financeira.
- Saldos e rendimentos: saldo a 31 de dezembro, juros brutos, dividendos brutos e, em contas de custódia, produtos brutos de venda ou reembolso de ativos financeiros.

Este fluxo é enviado anualmente, normalmente em setembro do ano seguinte ao exercício reportado, e é cruzado com a sua declaração no país de residência. Em Portugal, o regime CRS é aplicado pelo **Decreto-Lei n.º 64/2016** e pelas instruções da Autoridade Tributária; em Espanha pelo **Modelo 289**. Tratamos o lado dos residentes no nosso artigo complementar sobre <a href="/pt/blog/crs-para-residentes-em-espanha-e-latam-implicacoes-reais">CRS para residentes em Espanha e LATAM</a>.

A OCDE reconheceu que o CRS 1.0 deixava lacunas relevantes: as **EMI** ficavam em zona cinzenta consoante a jurisdição; as **carteiras cripto** e as **exchanges** estavam totalmente fora; alguns **veículos de investimento** sem custódia tradicional escapavam à classificação; e a diligência sobre as **controlling persons** das NFE passivas era heterogénea. A pressão política para fechar essas lacunas vinha sobretudo da Comissão Europeia e da Alemanha, que queriam apertar o perímetro antes que o dinheiro migrasse para formatos não cobertos.

## CRS 2.0 e CARF: o novo pacote da OCDE

A OCDE aprovou em bloco duas peças que devem ser lidas em conjunto. A primeira é a revisão integral do Common Reporting Standard, conhecida informalmente como **CRS 2.0**. A segunda é o **Crypto-Asset Reporting Framework (CARF)**, que estende a lógica do intercâmbio automático ao universo cripto. Ambas foram publicadas como um pacote único e estão a ser transpostas na UE pela **Diretiva DAC8** (a DAC8 altera a 2011/16/UE para integrar o CARF e as novidades do CRS revisto). Aprofundamos a peça europeia em <a href="/pt/blog/dac8-e-criptomoedas-o-novo-reporting-fiscal-automatico-em">DAC8 e reporting de criptoativos</a>.

As novidades operacionais mais relevantes:

1. **Alargamento do perímetro às EMI e a produtos de moeda eletrónica**, neobancos sem licença bancária plena e carteiras digitais com serviços análogos a depósitos.
2. **Criptoativos e stablecoins entram no âmbito reportável** quando o prestador de serviços cripto tem presença numa jurisdição aderente (CARF). Apanha exchanges, custodiantes, plataformas de derivados cripto e prestadores DeFi com componente centralizada.
3. **Reforço da due diligence sobre controlling persons** das NFE passivas: mais documentação, menos margem interpretativa, autodeclarações mais granulares.
4. **Tratamento mais estrito de contas conjuntas**, trusts e veículos opacos: havendo dúvida razoável sobre a residência da pessoa controladora, o reporte duplica-se para várias jurisdições por defeito.
5. **Adoção por ondas e revisão periódica**: o CARF entra em vigor por ondas conforme o calendário de transposição de cada jurisdição, com a maioria dos países da UE a arrancar primeiro e o resto do G20 a seguir.

Para um residente fiscal em Portugal, em Espanha ou em qualquer país LATAM aderente, a consequência prática é clara: a maior parte do dinheiro que move por fintechs europeias ou por exchanges com sede em jurisdições aderentes passa a estar dentro do perímetro de informação automática para a sua administração tributária. O que antes era "não reportado por defeito" passa a ser excecional.

## Por que motivo os EUA não vão assinar o CRS (a versão sem marketing)

Esta é a parte que mais confusão gera e que repetimos na Exentax todas as semanas. Os Estados Unidos não assinaram o CRS 1.0 e não vão assinar o CRS 2.0 por razões estruturais, não por descuido. Há três fatores combinados a explicar isto:

- **Já têm FATCA e não precisam do CRS.** O **Foreign Account Tax Compliance Act**, aprovado no quadro do HIRE Act, obriga as instituições financeiras estrangeiras a identificar e reportar ao IRS contas de **US persons** (cidadãos, residentes fiscais e entidades dos EUA). É um regime **bilateral** articulado por **Intergovernmental Agreements (IGAs)** Modelo 1 (intercâmbio recíproco através do fisco local) e Modelo 2 (a instituição financeira reporta diretamente ao IRS). A reciprocidade real é, contudo, muito limitada: na prática, o IRS recebe muito mais informação do estrangeiro do que devolve às autoridades estrangeiras sobre contas de não residentes nos EUA. Adotar o CRS implicaria aceitar reciprocidade multilateral plena — exatamente o que o Congresso bloqueou ao longo de toda a última década, sem distinção de maioria política.
- **Está no interesse dos EUA serem a jurisdição "não-CRS" do mundo.** Por convergência de incentivos, os EUA tornaram-se o destino preferido de capital estrangeiro que procura **o maior mercado financeiro do planeta** combinado com um perímetro de intercâmbio automático muito mais estreito do que o europeu. Estimativas como as da Tax Justice Network situam em vários biliões de dólares o saldo de capital estrangeiro alojado no sistema financeiro norte-americano que não é reportado automaticamente pelo CRS. Boa parte flui através de **trusts**, **LLCs** transparentes e contas de banca privada no Delaware, Nevada, Wyoming, Dakota do Sul ou Florida. Trocar essa posição por um ganho marginal de cobrança é, para Washington, um mau negócio.
- **O custo político interno é proibitivo.** Adotar o CRS exigiria nova legislação federal, alterações ao Internal Revenue Code, alargamento do **Form 1099** e do regime de identificação de contas e uma mudança doutrinária no tratamento das Single-Member LLC (Disregarded Entities com beneficiários efetivos estrangeiros). Há grupos de interesse muito poderosos (banca, registos estaduais, lobby de serviços fiduciários) que bloqueiam essa agenda há anos e que continuarão a fazê-lo.

A conclusão técnica, sem maximalismos: **a assimetria FATCA vs CRS é o mecanismo central, não um acidente histórico**. Qualquer planeamento profissional que parta de "os EUA acabarão por aderir ao CRS" assenta numa premissa que Washington tem rejeitado de forma consistente.

## Como os EUA ganham por ter LLCs de não residentes

À primeira vista, o modelo parece contraintuitivo. Se o IRS não cobra imposto federal sobre os lucros de uma **LLC pass-through** propriedade de não residente sem ECI dentro do território norte-americano, o que é que os EUA ganham por ter centenas de milhares de LLCs estrangeiras nos seus registos? A resposta tem três camadas:

- **Taxas estaduais de constituição e manutenção**, recorrentes e altamente eficientes. O Delaware, por exemplo, cobra anualmente uma **Annual Franchise Tax** das LLCs aí constituídas; multiplicado por centenas de milhares de entidades ativas, é uma das primeiras fontes de receita não tributária do estado. Wyoming, Novo México, Florida e Nevada concorrem em diferentes formatos de fees recorrentes (annual report, registered agent, business license) que financiam parte significativa dos seus orçamentos. Aprofundamos em <a href="/pt/blog/novo-mexico-vs-wyoming-vs-delaware-qual-estado-para-sua-llc">Novo México vs Wyoming vs Delaware</a>.
- **Captação de capital estrangeiro para o sistema financeiro**. Os neobancos americanos (Mercury, Relay), os grandes bancos comerciais e os corretores de retalho vivem em parte dos depósitos e operacional de não residentes que constituem LLCs para veicular negócios digitais e carteiras de investimento. Esse capital fica no sistema americano, gera margem para as instituições e multiplica liquidez para a economia global.
- **Tributação indireta via IRS Forms 5472 + 1120 — sem cobrança mas com dados**. Mesmo quando a LLC pass-through de um não residente não paga federal, **continua obrigada** a apresentar o Form 5472 com um Form 1120 pro-forma todos os anos (Treas. Reg. §1.6038A-2). O IRS recebe assim um mapa muito completo das **reportable transactions** entre a LLC e o seu único membro estrangeiro, dados que usa para fins de inteligência fiscal e de coordenação com autoridades estrangeiras quando há um acordo bilateral concreto. Explicamos a mecânica em <a href="/pt/blog/form-5472-o-que-e-quem-deve-apresenta-lo-e-como-cumprir">Form 5472, o que é e como apresentá-lo</a>.

Somadas as três camadas, a matemática para Washington é muito positiva: pouco custo direto em cobrança, receitas estaduais constantes, capital estrangeiro no sistema e um perímetro de inteligência que o IRS controla ponta a ponta. Não há incentivo para quebrar este equilíbrio aderindo ao CRS.

## O que tudo isto significa para a sua LLC e a sua estrutura

Aterrando o que vimos em decisões concretas que tomamos com clientes da Exentax todas as semanas, a fotografia operacional por ordem de importância:

- **A sua LLC continua a ser uma ferramenta válida e declarável.** O facto de os EUA estarem fora do CRS não a transforma numa "estrutura opaca" do ponto de vista da sua administração de residência. Tem obrigações declarativas próprias (em Portugal: Anexo J da Declaração Modelo 3, Modelo 38, eventual obrigação relativa ao IES; em Espanha: IRPF + Modelo 720 + Modelo 721) que não dependem do CRS. O que muda é o fluxo automático, não a sua obrigação.
- **O stack bancário é o fator decisivo.** Se trabalha exclusivamente com contas nos EUA (Mercury, Relay, banca regional) em nome da LLC, a pegada CRS para o seu fisco é praticamente nula. Assim que adiciona uma camada europeia (Wise Business, Revolut Business europeu, N26, Wallester, Payoneer Europe), aceita que essa informação chegue à sua administração. Não é bom nem mau: é informação que o seu planeamento tem de absorver para que o declarado e o reportado coincidam.
- **A cripto muda de regime com o CARF.** Se gere saldos relevantes em exchanges com sede europeia ou em jurisdições aderentes, parta do princípio de que a sua autoridade fiscal receberá essa informação de forma automática a curto prazo.
- **O estado de constituição importa por motivos operacionais, não fiscais**. Wyoming e Novo México continuam a ganhar para perfis freelancer e de serviços; Delaware continua a ganhar para SaaS com vocação de levantar capital ou para holdings; Florida tem encaixe para residentes hispânicos com nexus físico nos EUA. Nenhuma decisão depende do CRS.
- **Residência fiscal do titular como variável-mestra**. A residência não se escolhe, determina-se por factos (dias de presença, centro de interesses económicos, núcleo familiar). Pretender ocultar a residência real ao abrigo da assimetria FATCA-CRS é, além de um erro técnico, uma infração tipificada na maioria das jurisdições europeias e latino-americanas, com sanções severas.

<!-- exentax:calc-cta-v1 -->
> **Ponha números no seu caso.** Se quiser ver como a sua situação encaixa nesta lógica, abra a <a href="/pt#calculadora">calculadora Exentax</a> e compare com a sua carga fiscal atual antes de avançar.
<!-- /exentax:calc-cta-v1 -->

## Erros típicos que vemos todas as semanas

- "Como a minha LLC só tem conta na Mercury, a minha administração não sabe nada." Verdadeiro para o canal automático CRS, falso para a obrigação. O Anexo J / declaração de bens fora continua devido.
- "Vou usar o Revolut Business porque é mais cómodo e, sendo europeu, fica fora do CRS." Mistura de erros. O Revolut europeu está no CRS e a abertura para LLC americana nem sempre gera IBAN europeu.
- "O CARF não me afeta porque uso uma exchange offshore." Se essa exchange tem clientes europeus e opera sob licença europeia ou tem presença comercial em jurisdição aderente, afeta-o.
- "Vou pôr a LLC em nome de um terceiro para não ser identificado." É testa-de-ferro encoberto. Tem consequências penais e fiscais muito sérias.
- "Os EUA vão assinar o CRS em breve, melhor fechar a LLC antes." Premissa falsa face à trajetória política observada.

<!-- exentax:execution-v2 -->
## O método Exentax: como abordamos este planeamento

CRS 2.0 e CARF não são uma crise para uma LLC bem estruturada; são uma mudança de perímetro que se incorpora ao diagnóstico inicial e à manutenção anual. O método Exentax aplica três blocos por ordem e deixa registo escrito de cada passo para que a decisão seja defensável perante qualquer inspeção.

- **Diagnóstico CRS e CARF da sua situação atual.** Mapeamos cada conta em seu nome e em nome da LLC, identificamos que entidades reportam a que jurisdição e cruzamos essa fotografia com as suas declarações dos últimos exercícios.
- **Desenho do stack alinhado com a sua residência.** Banco principal (Mercury ou Relay), gateways, contas multimoeda e, se aplicável, exchange cripto coerente com o seu volume e país. Cada peça tem de ter sentido fiscal e operacional.
- **Calendário único de obrigações.** Annual Report estadual, Form 5472 + 1120, BOI Report, declaração no país de residência, declarações de bens no estrangeiro quando aplicáveis, tudo numa única folha com avisos prévios.

Para aplicar este método ao seu caso, abra a <a href="/pt#calculadora">calculadora Exentax</a> ou reserve trinta minutos com a equipa: sai da chamada com diagnóstico claro e, se for o caso, calendário de regularização ordenado, sem compromisso.
<!-- /exentax:execution-v2 -->

## Perguntas frequentes

**O CRS 2.0 obriga os EUA a alguma coisa?** Não. O CRS 2.0 é um standard da OCDE adotado pelas jurisdições aderentes. Os EUA não são jurisdição CRS e mantêm o FATCA como regime próprio.

**Se abrir uma LLC agora, daqui a vários anos continuará fora do CRS?** A trajetória política e económica indica que sim, pelas razões estruturais explicadas. Não é um compromisso jurídico de Washington, mas é a leitura mais sólida da sua política fiscal sustentada na última década.

**A minha LLC tem de reportar algo ao meu país por CRS?** A sua LLC, enquanto entidade dos EUA, não é Reporting Financial Institution para CRS. Quem reporta são os bancos e fintechs onde tenha contas, conforme a jurisdição de cada conta.

**O IRS partilha informação com a minha autoridade tributária sobre a minha LLC?** Apenas se existir um instrumento bilateral concreto e o pedido cumprir os requisitos formais (intercâmbio ao abrigo de CDT, IGA FATCA com reciprocidade real, cooperação administrativa específica). Não há fluxo automático equivalente ao CRS.

**Posso usar a minha LLC para investir na Europa sem que a minha autoridade saiba?** Não. Se a conta de investimento estiver numa entidade europeia, esta reporta sob CRS ao país de residência do beneficiário efetivo.

**Quando se notará o CARF na prática?** As primeiras ondas de reporte CARF estão já a chegar conforme a transposição de cada país. A regra geral é assumir que qualquer exchange com sede ou licença em jurisdição CARF reportará os seus saldos ao país de residência indicado na sua autodeclaração.

## Falemos do seu caso

Cada estrutura tem nuances: o país de residência, o tipo de atividade, a presença ou não de cripto, o volume, a antiguidade da LLC, as obrigações acumuladas. Na Exentax revemos a sua situação, dimensionamos a exposição real ao CRS 2.0 e ao CARF e desenhamos a estrutura LLC e o stack bancário que encaixam consigo. Acompanhamo-lo todos os anos na manutenção para que o calendário e as declarações continuem coerentes com a realidade do seu negócio.

<!-- exentax:cta-v1 -->
Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
