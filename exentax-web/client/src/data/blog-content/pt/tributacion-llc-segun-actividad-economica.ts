export default `

Falar de "fiscalidade da LLC" no abstrato leva a erros graves: a fiscalidade real depende muito estreitamente do **tipo de atividade económica** que a LLC desenvolve, porque cada atividade ativa regras distintas de IVA, qualificação dos rendimentos, fonte do rendimento, CDI aplicável e, sobretudo, exposição à transparência fiscal internacional e às regras anti-elisão. Vamos ver as cinco grandes famílias que vemos na Exentax.

## Pontos-chave

### 1. Serviços profissionais (consultoria, desenvolvimento, design, marketing)

É o caso mais comum e o mais simples. A sua LLC fatura serviços a clientes B2B internacionais (EUA, UE, América Latina). Características:

- **Natureza do rendimento**: atividade económica.
- **Qualificação em Portugal (residente)**: rendimento da categoria B (atividade profissional ou empresarial), imputado ao sócio através do regime de transparência aplicado à LLC unipessoal (linha próxima da <a href="/pt/blog/doutrina-administrativa-espanhola-sobre-a-llc-americana">doutrina DGT/TEAC em Espanha</a> para o vizinho peninsular).
- **IVA**: faturação B2B com cliente comunitário, **inversão do sujeito passivo** (o cliente autoliquida o IVA no seu país); com cliente dos EUA ou outro terceiro, **operação não sujeita** a IVA português (regra de localização dos serviços B2B). Aprofundado em <a href="/pt/blog/iva-em-servicos-digitais-internacionais-quando-se-aplica-e">IVA em serviços digitais internacionais</a>.
- **IRS em Portugal**: integração no rendimento global pelas taxas progressivas (de 13,25 % a 48 % com a sobretaxa de solidariedade aplicável).
- **Risco principal**: simulação se a substância operativa for prestada exclusivamente pelo sócio residente em Portugal sem qualquer substância real nos EUA.

**Otimização legítima**: maximizar gastos dedutíveis corretos na LLC (software, ferramentas, subcontratação, formação, marketing). O líquido imputado ao sócio diminui e a taxa média efetiva cai substancialmente face à do trabalhador independente puro português.

### 2. E-commerce físico (Amazon, Shopify, dropshipping)

Vende bens físicos a consumidores finais internacionais. Características:

- **Natureza do rendimento**: atividade económica de venda.
- **IVA e alfândegas**: complexo. Se vende a consumidores europeus, a LLC pode ter obrigação de **registo de IVA** em países da UE individualmente ou de usar o **regime OSS / IOSS**. Se ultrapassar determinados limiares por país, deve registar-se localmente. Marketplaces como a Amazon agem como **deemed supplier** em muitos casos e retêm o IVA, mas não em todos.
- **DAC7**: como vendedor na Amazon, Etsy ou eBay europeias, a Amazon Europa reportará os seus rendimentos à autoridade fiscal do Luxemburgo, que reenvia à do país dos beneficiários efetivos. Ver <a href="/pt/blog/dac7-o-novo-reporting-de-plataformas-digitais-em-2026">DAC7</a>.
- **Alfândegas**: se a LLC importar stock para a UE para distribuição (FBA), precisa de **EORI europeu**, importador oficial e eventualmente IOR (Importer of Record).
- **Sales tax nos EUA**: se vende a consumidores em estados com economic nexus, possível obrigação de registo e cobrança de sales tax. Mais em <a href="/pt/blog/vender-na-amazon-com-sua-llc-americana-guia-completo">Amazon e e-commerce com LLC</a>.

**Risco principal**: ignorar o IVA UE ou o sales tax dos EUA pode gerar uma fatura retroativa muito significativa.

### 3. SaaS e subscrições digitais

Vende acesso a software ou conteúdo digital, B2C ou B2B, em subscrição ou pagamento único. Características:

- **Natureza do rendimento**: atividade económica + cessão de uso de software (fronteira com royalties).
- **Serviços prestados por via eletrónica (TBE)**: se vende a consumidores europeus, sujeitos a IVA no país do consumidor. Regime **OSS não-UE** (a LLC regista-se num Estado-Membro de identificação) ou utilização de plataformas Merchant of Record (Paddle, FastSpring, DoDo Payments, Lemon Squeezy) que tratam do IVA por si.
- **B2B**: regra geral de inversão do sujeito passivo.
- **Qualificação em Portugal**: rendimentos de atividade económica se houver desenvolvimento ativo; se ceder uma licença passiva sobre código preexistente sem atividade operativa relevante, pode haver discussão sobre a **transparência fiscal internacional** (art. 66 CIRC, com remissão prevista para sujeitos passivos pessoas singulares).
- **Risco CFC/TFI**: se a LLC gerar maioritariamente rendimentos passivos (licenças) e carecer de meios materiais e humanos nos EUA, a Autoridade Tributária pode aplicar a transparência fiscal internacional.

Detalhe em <a href="/pt/blog/llc-americana-para-desenvolvedores-de-software-e-fundadores">LLC para programadores de software e SaaS</a>.

### 4. Royalties e propriedade intelectual

A sua LLC titulariza direitos (marca, software, conteúdo) e licencia-os a terceiros ou a outra entidade relacionada. Características:

- **Natureza do rendimento**: rendimentos passivos (royalties).
- **Qualificação CDI**: art. 12 CDI Portugal-EUA (royalties). Em geral, o Estado da fonte pode tributar (com o limite percentual da convenção), e o Estado da residência tributa com crédito de imposto.
- **Risco CFC**: alto. Os rendimentos passivos são o caso típico da transparência fiscal internacional. Se a sua LLC gerar maioritariamente rendimentos passivos e o trabalhador independente residir em Portugal e a controlar, o art. 66 CIRC e disposições conexas para pessoas singulares podem ser ativados.
- **Tributação efetiva**: aplicada a TFI, é tributado em Portugal como se os rendimentos lhe coubessem diretamente, com dedução de qualquer imposto pago pela LLC (tipicamente 0$ federal em Disregarded Entity).
- **Cláusula LOB do CDI**: dificulta o acesso aos benefícios convencionais a estruturas híbridas ou sem substância.

**Conclusão**: uma LLC pura de royalties com sócio residente em Portugal deve ser desenhada com substância real (meios materiais, pessoal, decisões tomadas nos EUA) ou assumir desde o início que ficará sob TFI.

### 5. Trading (ações, futuros, cripto)

A sua LLC opera nos mercados financeiros com conta na Interactive Brokers, Tradovate ou Kraken. Características:

- **Natureza do rendimento**: depende do ativo e do regime. Trading FX e futuros: mais-valias e menos-valias mobiliárias em muitos países; em Portugal, se a atividade for habitual e profissional, pode ser requalificada como atividade económica da categoria B.
- **Ações**: dividendos (rendimentos de capitais, taxa liberatória de 28 % em entidade opaca; em entidade transparente, imputação direta) e mais-valias de cessão (categoria G, 28 % ou agregação opcional).
- **Cripto**: enquadra-se no regime introduzido pela Lei do Orçamento do Estado de 2023 (mais-valias categoria G a 28 % se detenção inferior a 365 dias; isenção se igual ou superior, ressalvadas exceções), ou atividade económica (categoria B) se trading frequente e profissional.
- **DAC8**: aplicável recentemente se opera com plataformas europeias. Ver <a href="/pt/blog/dac8-e-criptomoedas-o-novo-reporting-fiscal-automatico-em">DAC8 e criptomoedas</a>.
- **Risco CFC**: muito alto. Os rendimentos de carteira são o exemplo paradigmático de rendimento passivo sujeito a TFI.
- **CDI**: art. 10 (dividendos), art. 11 (juros), art. 13 (mais-valias). As cláusulas LOB do Protocolo 2019 são especialmente restritivas para estruturas de investimento sem substância.

Detalhe em <a href="/pt/blog/criptomoedas-e-trading-com-llc-guia-fiscal-completo-para">criptomoedas e trading com LLC</a>.

### Quadro-resumo por atividade

| Atividade | Qualificação Portugal (típica) | IVA | Risco CFC/TFI | Risco simulação | Adequação LLC pura |
| --- | --- | --- | --- | --- | --- |
| Serviços profissionais B2B | Atividade económica imputada | Inversão sujeito passivo | Baixo | Médio | Alta |
| E-commerce | Atividade económica imputada | Complexo (OSS/IOSS, sales tax) | Baixo | Médio | Alta com cuidado |
| SaaS B2B | Atividade económica imputada | Inversão sujeito passivo | Médio | Médio | Alta |
| SaaS B2C TBE | Atividade económica imputada | OSS não-UE / MoR | Médio-alto | Médio | Média-alta |
| Royalties | Rendimento passivo | Geralmente isento ou ISP | Alto | Alto | Baixa sem substância |
| Trading financeiro | Rendimento passivo / mais-valias | n/a | Muito alto | Alto | Baixa sem substância |

### Como decidir a sua estrutura ótima

Optar pela LLC sem mais não é sempre a resposta correta. Para atividades de baixo risco CFC (serviços, e-commerce, SaaS B2B), uma **Single-Member LLC** com sócio residente em Portugal, declarando bem e com substância razoável, é eficiente e defensável. Para atividades de alto risco CFC (royalties, trading), ou se dota a LLC de **substância real nos EUA** ou se considera estruturar de outra forma (sociedade portuguesa operativa + LLC com atividade limitada, planeamento de residência, etc.). Quadro completo em <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">desenho de estrutura internacional sólida</a>.

### Erros típicos por atividade

- **Serviços**: esquecer o IVA intracomunitário e o registo no VIES.
- **E-commerce**: ignorar OSS/IOSS e o sales tax dos EUA até chegar a liquidação.
- **SaaS**: não usar Merchant of Record e acabar com obrigação de registo de IVA em cada país da UE.
- **Royalties**: não documentar a criação, titularidade e manutenção dos ativos intangíveis.
- **Trading**: confundir trading pessoal com trading a partir da LLC e misturar contas.

Mais sobre como evitar erros típicos em <a href="/pt/blog/riscos-fiscais-de-uma-ma-estruturacao-internacional">riscos fiscais</a>.

### Em resumo

Uma LLC não tributa "de uma única maneira": tributa segundo o que faz, onde o faz e a partir de onde é controlada. A conversa séria de planeamento fiscal começa por entender a sua atividade real, não por escolher um país num mapa.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/servicos">Começa hoje, 100% online</a>
<!-- /exentax:calc-cta-v1 -->

Quer que analisemos exatamente como tributa a sua atividade e que lhe desenhemos a estrutura mais eficiente e defensável? Marque a sua consulta gratuita.

Para continuar a aprofundar, <a href="/pt/blog/por-que-freelancers-espanhois-estao-deixando-o-trabalho">Por que deixar de ser trabalhador independente em Portugal (e que alternativas tem)</a> complementa o que acabámos de ver com pormenores que mereciam o seu próprio artigo.

<!-- exentax:cta-mid -->
**Antes de constituir uma LLC para a sua atividade, veja como trabalhamos.** <a href="/pt/como-trabalhamos">A nossa metodologia</a> detalha o que analisamos e por que ordem, do diagnóstico de atividade ao routing de IVA e CFC mais adequado.

<!-- exentax:cta-final -->
**Falemos do seu caso, não do manual.** Reserve 30 minutos e adaptamos «Tributação da LLC segundo a atividade económica» à sua atividade concreta.

<!-- exentax:legal-refs-v1 -->
## Referências: fontes técnicas e normativa aplicável

Os números, modelos e limiares mencionados apoiam-se nas seguintes referências, atualmente em vigor:

- **Tributação da atividade.** IRC §864 e §882 (efetivamente conectado com atividade nos EUA, ECI), Treas. Reg. §301.7701-3 (classificação da LLC) e Form 5472 + 1120 pro-forma para LLC unipessoais não residentes.
- **IVA e vendas internacionais.** Diretiva 2006/112/CE do IVA, Regulamento de Execução 282/2011, regime OSS/IOSS e Balcão Único para serviços digitais B2C na UE; instruções do Modelo 369 da AEAT em Espanha e declaração equivalente em Portugal (declaração trimestral OSS/IOSS via Portal das Finanças).
- **Plataformas marketplace.** Termos publicados pela Amazon Seller Central (incluindo o VAT Calculation Service e a responsabilidade pelo IVA na UE conforme art. 14 bis Diretiva 2006/112), Stripe Tax, Paddle (Merchant of Record), DoDo Payments e PayPal Business.
- **DAC7.** Diretiva (UE) 2021/514 de cooperação administrativa em plataformas digitais, transposta para a ordem jurídica portuguesa pela Lei n.º 36/2023 e respetivo decreto regulamentar, e em Espanha pelo RD 117/2024.
- **Portugal residentes.** CIRS (categorias B, E, G), CIRC (art. 66 CFC), CIVA (art. 6.º localização de serviços), CDI Portugal-EUA, RGIT.
- **Espanha residentes (referência comparativa).** Ley 35/2006 LIRPF (art. 100 TFI), Ley 27/2014 LIS e Ley 37/1992 do IVA.

Informação divulgativa; o tratamento concreto depende do país de residência do titular e do país dos seus clientes.

<!-- exentax:execution-v2 -->
## Tributação da LLC segundo a atividade económica: por que um SaaS, uma agência e um e-commerce não são a mesma coisa

A fiscalidade federal dos EUA para uma LLC de não residente não depende apenas da sua residência, depende também do que a LLC faz. A regra "non-effectively connected = 0 %" não é uniforme: o <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> aplica regras de sourcing diferentes consoante o tipo de rendimento, e isso classifica a sua LLC como ETBUS (engaged in trade or business in US) ou como passive foreign vehicle. Eis o aspeto de cada atividade típica.

- **SaaS e software (subscrições digitais).** Rendimento classificado como business income, sourced consoante o local onde o software é desenvolvido e operado. Se o founder não residir nos EUA e os servidores não forem obrigatoriamente americanos (cloud regional indistinto), default = foreign-source income → 0 % federal. Risco: se contratar um dependent agent nos EUA (VP of Sales assalariado nos EUA, não contractor independente), a LLC passa a ETBUS.
- **Agência digital (serviços profissionais).** Rendimento classificado como personal services income, sourced no local onde os serviços são fisicamente prestados. Se está em Portugal a trabalhar para clientes dos EUA, a fonte é Portugal (onde se realiza o serviço), NÃO os EUA, embora o cliente seja americano. Default: 0 % federal. Exceção: se a sua equipa estiver nos EUA ou tiver office nos EUA, sourcing US e passa a ETBUS.
- **E-commerce (produtos físicos).** Tripla análise: (1) Stock nos EUA (Amazon FBA, 3PL US): pode criar ETBUS conforme a substância. (2) Stock fora dos EUA dropshipped para os EUA: usualmente foreign-source e 0 %. (3) Marketplaces (Amazon Seller US): recebe já líquido de sales tax retida pela Amazon, mas o income federal segue o seu sourcing. FBA + dependent agent = risco ETBUS muito alto.
- **Investimento e trading (capital gains, dividendos).** Mais-valias da bolsa americana para LLC de não residente: 0 % federal por exceção específica (capital gains de portfolio investment isentos para não residentes sem trade or business). Dividendos US: 30 % de retenção por defeito, reduzida a 15 %/0 % sob treaty com W-8BEN-E. Cripto: tratada como property, mesmas regras que capital gains; foreign-source e 0 % se não for ETBUS.

### O que mais nos perguntam

**Se vendo cursos digitais a clientes dos EUA, é US-source income?** Não por defeito. Os cursos digitais são personal services + intellectual property licence, sourced onde são desenvolvidos (a sua residência). Vender a um cliente dos EUA não converte o rendimento em US-source. Continua a ser 0 % federal se não houver ETBUS.

**A Amazon FBA torna-me automaticamente ETBUS?** Há debate técnico. Posição conservadora: sim, porque o stock no warehouse Amazon US pode ser interpretado como dependent agent + fixed place of business. Posição mais permissiva: depende do controlo efetivo. A prática séria é assumir ETBUS e planear em conformidade ou passar a fulfillment fora dos EUA.

Na Exentax modelamos cada atividade pelas regras de sourcing e pelo teste ETBUS antes de constituir, para não descobrir ao fim de dois anos que paga 21 % federal quando julgava 0 %.
<!-- /exentax:execution-v2 -->

## Montamos tudo sem que perca um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100 % legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações IRS e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.

_Veja também: [Riscos fiscais de uma má estruturação internacional](/pt/blog/riscos-fiscais-de-uma-ma-estruturacao-internacional)._

<!-- related-inline-stripped-2026-04 -->

Quer aplicar este protocolo ao seu caso? <a href="/pt/agendar">Reserve uma sessão com a equipa Exentax</a> e revemos a sua LLC com números reais em trinta minutos, sem compromisso.


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

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Precisa de falar já? Ligue-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreva-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20venho%20do%20artigo%20%22tributacion%20llc%20segun%20actividad%20economica%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje mesmo.</p>

Se queres ver todo o processo em detalhe, vê a nossa <a href="/pt/servicos">página de serviços</a> com tudo o que cobrimos.

<!-- exentax:conv-fill-v1 -->
Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Constituição, EIN, BOI, banca e manutenção: uma única equipa que entende o seu caso do início ao fim. <a href="/pt/servicos">Ver todos os serviços</a>.
<!-- /exentax:cta-v1 -->

`;
