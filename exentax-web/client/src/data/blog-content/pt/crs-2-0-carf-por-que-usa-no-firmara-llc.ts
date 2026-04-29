export default `

De tempos a tempos surge uma versão "definitiva" do intercâmbio automático de informação fiscal e, com ela, a pergunta que mais recebemos na Exentax: se a OCDE aperta novamente o cerco com o CRS 2.0 e o CARF, o que é que acontece exatamente a uma <a href="/pt/blog/llc-estados-unidos-guia-completo-nao-residentes-2026">LLC americana</a> propriedade de um europeu ou de um latino-americano não residente? A resposta curta é que o cerco aperta fora dos Estados Unidos, não dentro. A resposta longa, que é a que importa, exige perceber por que motivo Washington nunca assinou o CRS, por que também não vai assinar o CRS 2.0 e como isso afeta a sua estrutura hoje e o seu planeamento dos próximos anos.

> **Ponha números no seu caso.** A <a href="/pt#calculadora">calculadora Exentax</a> compara a sua carga fiscal atual com a que teria a operar uma LLC bem estruturada e devidamente declarada no seu país de residência.

## Resumo executivo

O CRS 2.0 (a versão revista do Common Reporting Standard da OCDE) e o CARF (Crypto-Asset Reporting Framework) ampliam aquilo que bancos e exchanges declaram às administrações fiscais das jurisdições aderentes. Mais dados, mais entidades obrigadas e, sobretudo, muito mais cripto dentro do perímetro. Os Estados Unidos não estão nessa fotografia e nada na sua política fiscal da última década indica que venham a estar: têm o seu próprio regime, FATCA, que é bilateral e de saída, e captam biliões de dólares de capital estrangeiro precisamente porque oferecem a única jurisdição relevante fora do CRS. Para o titular não residente de uma LLC, isto não é um atalho para "esconder" nada; é um facto técnico que molda a escolha do estado, a arquitetura bancária e a coerência com a sua declaração no país de residência.

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
- **A arquitetura bancária é o fator decisivo.** Se trabalha exclusivamente com contas nos EUA (Mercury, Relay, banca regional) em nome da LLC, a pegada CRS para o seu fisco é praticamente nula. Assim que adiciona uma camada europeia (Wise Business, Revolut Business europeu, N26, Wallester, Payoneer Europe), aceita que essa informação chegue à sua administração. Não é bom nem mau: é informação que o seu planeamento tem de absorver para que o declarado e o reportado coincidam.
- **A cripto muda de regime com o CARF.** Se gere saldos relevantes em exchanges com sede europeia ou em jurisdições aderentes, parta do princípio de que a sua autoridade fiscal receberá essa informação de forma automática a curto prazo.
- **O estado de constituição importa por motivos operacionais, não fiscais**. Wyoming e Novo México continuam a ganhar para perfis freelancer e de serviços; Delaware continua a ganhar para SaaS com vocação de levantar capital ou para holdings; Florida tem encaixe para residentes hispânicos com nexus físico nos EUA. Nenhuma decisão depende do CRS.
- **Residência fiscal do titular como variável-mestra**. A residência não se escolhe, determina-se por factos (dias de presença, centro de interesses económicos, núcleo familiar). Pretender ocultar a residência real ao abrigo da assimetria FATCA-CRS é, além de um erro técnico, uma infração tipificada na maioria das jurisdições europeias e latino-americanas, com sanções severas.

<!-- exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-pt -->
## Porque é que a posição dos EUA quanto ao CRS é estrutural e não política

A razão pela qual os Estados Unidos não aderiram ao CRS é estrutural e não uma questão de humor político que possa mudar com cada administração. Os EUA já dispõem do seu próprio regime de informação através de FATCA e de uma infraestrutura declarativa interna construída em torno dos mesmos identificadores utilizados pelo IRS. Aderir a um intercâmbio multilateral paralelo duplicaria o trabalho sem acrescentar visibilidade do lado americano, e é precisamente essa lógica que se mantém estável entre administrações e que torna a posição americana previsível.
<!-- /exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-pt -->

<!-- exentax:lote34-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-pt -->
## Como ler o alcance do CRS 2.0 e do CARF como um mapeamento jurisdicional estável em vez de um alvo em movimento

O alcance do CRS 2.0 e do CARF lê-se de forma mais útil como um mapeamento jurisdicional estável entre o país da instituição financeira, o país de residência do beneficiário e o quadro aplicável entre os dois, em vez de um alvo em movimento. O mapeamento não muda com tendências de marketing, e uma nota curta no ficheiro torna a posição relevável.
<!-- /exentax:lote34-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-pt -->

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
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
- **Desenho da arquitetura alinhada com a sua residência.** Banco principal (Mercury ou Relay), gateways, contas multimoeda e, se aplicável, exchange cripto coerente com o seu volume e país. Cada peça tem de ter sentido fiscal e operacional.
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

Cada estrutura tem nuances: o país de residência, o tipo de atividade, a presença ou não de cripto, o volume, a antiguidade da LLC, as obrigações acumuladas. Na Exentax revemos a sua situação, dimensionamos a exposição real ao CRS 2.0 e ao CARF e desenhamos a estrutura LLC e a arquitetura bancária que encaixam consigo. Acompanhamo-lo todos os anos na manutenção para que o calendário e as declarações continuem coerentes com a realidade do seu negócio.

<!-- exentax:defensa-fiscal-v1 -->
## E se as Finanças me perguntarem pela minha LLC?

  É a pergunta mais frequente na primeira consulta, e a resposta curta é: a tua LLC não é opaca e, corretamente declarada, uma inspeção fecha-se em formulários standard. As Finanças portuguesas, a Receita Federal brasileira ou a SEFAZ estadual podem pedir o Certificate of Formation do estado (Wyoming, Delaware ou Novo México), o EIN emitido pelo <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o Operating Agreement assinado, os extratos da Mercury ou Wise do exercício, o Form 5472 com 1120 pro-forma apresentado e a contabilidade que reconcilia receitas, despesas e movimentos. Se tudo isso existir e for entregue ordenado, a inspeção não escala. É por isso que na Exentax mantemos o teu calendário em ordem — tu deixas de pensar em prazos e nós fechamo-los antes que mordam.

  O que as autoridades fiscais perseguem com razão são os testas-de-ferro, a residência fiscal de papel e a não declaração de contas estrangeiras. Uma LLC bem montada é exatamente o contrário: tu apareces como **beneficial owner** no BOI Report quando aplicável (verificável em <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tu assinas as contas bancárias e declaras o rendimento onde efetivamente vives. A estrutura está registada no Secretary of State do estado, nos ficheiros do IRS e, sempre que envolve um banco europeu, dentro do perímetro CRS do padrão da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  O erro que descarrila mesmo uma inspeção não é ter uma LLC; é não ter atribuído o rendimento corretamente no IRS pessoal (Anexo J do Modelo 3 em Portugal, Carnê-Leão Web e DAA no Brasil), não ter declarado as contas no estrangeiro (Modelo 58 ao Banco de Portugal a partir de 1 milhão €, DCBE ao Bacen a partir de 1 milhão USD) ou não ter documentado as operações entre o sócio e a LLC. Esses três frentes fecham-se antes do pedido, não depois. É aqui que entra a Exentax: apresentamos o formulário, arquivamos o comprovativo e, se a administração perguntar, a resposta já está pronta.

  ## O que uma LLC NÃO faz

  - **Não te isenta de tributar no teu país de residência.** Se vives em Portugal ou no Brasil, tributas aí o rendimento mundial. A LLC organiza o lado americano (zero imposto federal na SMLLC pass-through sem ECI); não desliga a tributação doméstica. O IRS é calculado sobre o lucro atribuído, não sobre as distribuições efetivamente recebidas.
  - **Não é um veículo offshore nem um esquema BEPS.** É uma entidade americana reconhecida pelo IRS, registada num estado concreto com morada física, agente registado e obrigações informativas anuais. Jurisdições offshore clássicas (BVI, Belize, Seychelles) não deixam rasto público; uma LLC deixa em cinco sítios.
  - **Não te protege se houver confusão patrimonial.** O *pierce the corporate veil* aciona-se assim que um juiz vê a LLC e o sócio funcionarem como a mesma carteira: contas misturadas, despesas pessoais pagas pela LLC, sem Operating Agreement, sem contabilidade. Três movimentos suspeitos bastam. Ver também jurisprudência comparada espanhola publicada no <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> sobre abuso de direito.
  - **Não te poupa contribuições para a Segurança Social.** Recibos verdes em Portugal, MEI ou autônomo no Brasil: a quota mensal continua a ser a mesma. A LLC opera a atividade face a clientes internacionais; a contribuição pessoal é independente.
  - **Não te dispensa de declarar as contas estrangeiras.** Portugal: Anexo J do Modelo 3 IRS + Modelo 58 ao BdP. Brasil: DCBE ao Bacen + e-Financeira via instituição financeira. Essas obrigações são da pessoa, não da LLC.

  Na Exentax fechamos estas cinco frentes todos os anos em paralelo com o calendário federal americano (Form 5472, 1120 pro-forma, FBAR, Annual Report estadual, BOI Report quando aplicável). O objetivo é que nenhuma inspeção encontre uma ponta solta e que a estrutura aguente uma revisão retroativa a 5-7 anos.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->

<!-- exentax:conv-fill-v1 -->
Ou escreve-nos por <a href="https://wa.me/34614916910">WhatsApp para +34 614 916 910</a> e respondemos hoje mesmo.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-pt-bis -->
## Como aproveitar esta estabilidade na prática

Para um membro de LLC que opera a partir de uma jurisdição CRS, esta estabilidade estrutural significa que o planeamento da documentação pode assentar em horizontes longos, sem ter de reagir anualmente a alterações de política. O mesmo ficheiro de trabalho serve durante vários anos consecutivos sem necessidade de revisão profunda.
<!-- /exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-pt-bis -->

<!-- exentax:cross-refs-v1 -->
## Sobre o mesmo tema

- [CRS e as suas contas bancárias da LLC: o que é partilhado com o seu país](/pt/blog/crs-e-as-suas-contas-bancarias-llc-o-que-e-partilhado-com-o)
- [DAC8 e criptomoedas: o novo reporting fiscal automático em 2026](/pt/blog/dac8-e-criptomoedas-o-novo-reporting-fiscal-automatico-em)
- [IBAN Wise com a sua LLC: o que realmente é reportado às finanças](/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
