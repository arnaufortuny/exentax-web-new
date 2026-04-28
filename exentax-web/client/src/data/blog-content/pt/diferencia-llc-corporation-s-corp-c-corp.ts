export default `

Quando alguém diz "empresa americana", a maioria pensa numa LLC; outros, numa "corporation". A realidade é que nos EUA existem quatro veículos principais para fazer negócios: **LLC**, **Corporation**, **S-Corporation** e **C-Corporation**. Cada um tem o seu próprio regime fiscal federal e estadual, restrições de propriedade e casos de uso. Para um empreendedor lusófono (Portugal, Brasil, Angola, Moçambique), nem todos são acessíveis nem convenientes. Este guia aterra a diferença real entre as quatro figuras, o que encaixa em cada perfil e por que a LLC continua a ser, hoje, a escolha por defeito para freelancers, agências e projetos digitais que não procuram investidores institucionais.

## LLC: a opção flexível e por defeito para não residentes

A **LLC (Limited Liability Company)** é uma figura híbrida criada pelas leis estaduais dos EUA (cada estado tem o seu próprio LLC Act; o **Wyoming foi o primeiro, em 1977**, com o Wyoming LLC Act). Juridicamente é uma entidade com responsabilidade limitada que protege o património pessoal dos seus membros face às dívidas e responsabilidades do negócio. Fiscalmente, **por defeito é transparente**: a **Treas. Reg. §301.7701-3 ("check-the-box")** trata a single-member LLC como **"disregarded entity"** e a multi-member LLC como **partnership** salvo opção em contrário com o **Form 8832** (election to be classified as an association taxable as a corporation).

Para um não residente sem **ETBUS** (Effectively Connected Trade or Business in the United States) e sem **US-source FDAP income**, a LLC disregarded **não gera obrigação de Form 1040-NR substantivo** nem paga imposto federal sobre o rendimento: a regra básica do **IRC §§871 e 882** sujeita não residentes apenas a (a) US-source FDAP com retenção de 30 % (ou taxa de tratado) e (b) rendimentos efetivamente conectados a um trade or business nos EUA. Sem esses dois elementos, a LLC paga **0 % federal**. A nível estadual, **Wyoming, Novo México, Florida, Texas e Dakota do Sul** não têm imposto sobre o rendimento corporativo estadual, o que adiciona **0 % estadual** quando não há nexus.

A obrigação prática que permanece: anual **Form 5472 + Form 1120 pro-forma** (Treas. Reg. §1.6038A-1, em vigor desde 2017) para SMLLC propriedade de não residente com qualquer *reportable transaction* com o seu único membro. Sanção base: **25.000 USD por formulário e ano** (IRC §6038A(d)) mais **25.000 USD por cada 30 dias adicionais** após notificação do IRS.

## Corporation: por defeito C-Corporation

Quando alguém constitui uma "Inc." ou "Corp." ao abrigo da *General Corporation Law* de um estado (por exemplo, **Delaware General Corporation Law** ou **Nevada Revised Statutes Chapter 78**), é tratada por defeito como **C-Corporation**: paga imposto federal sobre os seus lucros a **21 % (IRC §11(b), taxa única introduzida pela Tax Cuts and Jobs Act de 2017)**, mais o imposto estadual correspondente (Delaware tributa 8,7 % sobre rendimento gerado no estado, Califórnia 8,84 %, Texas 0 % de income tax mas franchise tax). Quando distribui dividendos, os sócios são tributados **uma segunda vez** no rendimento pessoal: para US persons, dividendos qualificados a 0 % / 15 % / 20 % federal (IRC §1(h)(11)); para sócios estrangeiros, retenção FDAP de **30 %** salvo CDT aplicável (a **Convenção Portugal-EUA, Decreto n.º 19/96, em vigor desde 18/12/1995**, reduz a retenção sobre dividendos para **15 % ou 5 %** consoante participação; o **Brasil não tem CDT em vigor com os EUA** — só acordo recíproco limitado, pelo que a retenção FDAP de 30 % aplica plenamente para residentes brasileiros). É a dupla tributação clássica.

A C-Corp é **obrigatória de facto** para quem queira levantar capital de venture capital ou ir a bolsa: os investidores institucionais (fundos VC, family offices, plataformas como AngelList, Y Combinator) exigem quase sempre uma **Delaware C-Corp** porque conhecem a sua jurisprudência (Court of Chancery), pode emitir várias classes de ações (preferenciais com liquidation preferences, Series A/B/C), permite stock options para empregados (planos 409A) e permite ofertas públicas. Não tem limite de número de acionistas nem restrições de nacionalidade.

## S-Corporation: a opção que um não residente não pode usar

A **S-Corporation** não é uma forma jurídica nova: é uma **eleição fiscal federal** definida no **subcapítulo S do Internal Revenue Code (IRC §§1361-1378)** que uma corporação ou LLC pode solicitar mediante **Form 2553**. Uma vez aceite a S-election, a entidade **não paga imposto federal corporativo**; os lucros passam aos sócios e são reportados nas declarações pessoais (Schedule K-1). Ao contrário da LLC, os sócios podem cobrar um **salário razoável** (W-2) e receber o resto como **distribuições não sujeitas a self-employment tax** (15,3 %), o que reduz a carga FICA para residentes US. Esta é a razão principal pela qual os americanos escolhem S-Corp.

O problema para não residentes: **IRC §1361(b)** estabelece requisitos estritos. Máximo **100 acionistas**, todos devem ser **pessoas singulares residentes ou cidadãos americanos** (não se admitem estrangeiros, sociedades nem LLCs), uma única classe de ações (com a única exceção de diferenças em direitos de voto). Por estes requisitos, uma **S-Corp é completamente inviável para um empreendedor não residente**. Mencionamo-la para que entenda que, quando lê "S-Corp" em fóruns norte-americanos ou em livros de tax planning de Robert Kiyosaki ou Mark Kohler, raramente se aplica ao seu caso.

## Quando uma C-Corp faz sentido para um não residente

Uma C-Corp pode compensar para um não residente em cenários concretos:

- **Vai procurar investimento venture capital**: os fundos exigem Delaware C-Corp com cap table limpa.
- **Planeia ir a bolsa** ou ser adquirido por uma empresa cotada (M&A tipicamente exige C-Corp).
- **Vai ter empregados com stock options** nos EUA (planos ISO/NSO requerem corporação).
- **O seu negócio tem ETBUS** (escritório, empregados, servidores próprios, armazém) e por isso pagaria imposto federal de qualquer modo sob IRC §882: o diferencial fiscal vs LLC desaparece e a C-Corp aporta governança mais sólida.
- **Quer aproveitar o QSBS (Qualified Small Business Stock)** definido em **IRC §1202**: se mantiver ações de uma C-Corp qualificada (ativos ≤ 50 M USD à emissão, atividade operacional, não serviços profissionais) durante **5 anos**, pode excluir até ao **maior de 10 M USD ou 10x base** em mais-valias na venda.

A dupla tributação atenua-se com planeamento: salários ao fundador (dedutíveis para a corp, tributados como ordinary income ao indivíduo), retenção de lucros para reinvestir em vez de distribuir dividendos, planos de compensação diferida e bom aproveitamento do QSBS.

## Tabela comparativa de tributação efetiva

Para um lucro de **100.000 USD** gerado por um não residente sem ETBUS, sem US-source income, residente fiscal em Portugal:

| Veículo | Federal US | Estadual US | Retenção dividendos | Total US | Tributação Portugal |
|---|---|---|---|---|---|
| **LLC disregarded** (WY/NM) | 0 USD | 0 USD | N/A | **0 USD** | Categoria B do IRS (rendimentos empresariais e profissionais) sobre lucro líquido, taxas progressivas até 48 % + sobretaxa de solidariedade até 5 % |
| **C-Corp Delaware** sem distribuição | 21.000 USD | 0 USD se não opera em DE | 0 USD | **21.000 USD** | Sem tributação imediata se não distribuir (sujeito a regras CFC do art. 66 CIRC e art. 73-A CIRS sobre transparência de entidades em regime fiscal claramente mais favorável) |
| **C-Corp Delaware** com distribuição completa | 21.000 USD | 0 USD | 11.850 USD (15 % CDT PT-USA) | **32.850 USD** | Tributação à taxa liberatória de 28 % sobre dividendo bruto, com crédito de imposto sobre retenção US |
| **S-Corp** | Não disponível para não residentes (IRC §1361(b)) |

A diferença é enorme: para perfis operacionais sem pretensão de investimento institucional, **a LLC é claramente mais eficiente**. A C-Corp só ganha quando o plano estratégico requer venture capital, ida a bolsa ou aproveitamento de QSBS.

## LLC US vs alternativas portuguesas e brasileiras: quando cada uma encaixa?

Se está em Portugal, as suas opções locais principais são:

- **Empresário em nome individual (recibos verdes)**: inscrição na Autoridade Tributária e na Segurança Social, sem entidade jurídica separada, responsabilidade pessoal ilimitada. IRS Categoria B com regime simplificado (coeficientes 0,75 para serviços ou 0,15 para vendas, aplicado ao rendimento bruto) ou contabilidade organizada. Segurança Social: **21,4 %** sobre 70 % do rendimento relevante (ou 21,4 % sobre rendimento contributivo escolhido, mínimo IAS 522,50 €/mês em 2024). IVA: isenção até **15.000 € (2025)** de volume de negócios anual.
- **Sociedade Unipessoal por Quotas (Lda)**: capital mínimo **1 €** desde 2011 (Decreto-Lei n.º 33/2011), responsabilidade limitada. IRC **21 %** sobre lucro tributável (taxa reduzida **17 %** sobre primeiros 50.000 € para PME — art. 87.º CIRC), **derrama municipal** até 1,5 %, **derrama estadual** progressiva acima de 1,5 M € de lucro. Distribuições tributadas a 28 % no sócio.
- **Sociedade por Quotas (Lda) plurissocietária**: capital mínimo 1 € por sócio, mínimo dois sócios.

Se está no Brasil, as opções principais são:

- **MEI (Microempreendedor Individual)**: limite de faturação **81.000 R$/ano (2024)**, inscrição simplificada, contribuição mensal fixa (~70 R$ INSS + ICMS/ISS). Perfil restritivo, nem toda a atividade qualifica.
- **Empresário Individual / EIRELI** (extinta em 2021, substituída por Sociedade Limitada Unipessoal — SLU): SLU sem capital mínimo, responsabilidade limitada.
- **Sociedade Limitada (Ltda)**: forma mais comum no Brasil, capital livre, responsabilidade limitada às quotas. IRPJ **15 %** + adicional 10 % sobre lucros acima de 240 mil R$/ano + CSLL **9 %** + PIS/COFINS conforme regime (Simples Nacional, Lucro Presumido ou Lucro Real).

Uma LLC US detida desde Portugal é tipicamente analisada pela **Autoridade Tributária portuguesa** segundo o seu regime de tributação efetivo. Se for SMLLC disregarded, pode ser tratada como entidade transparente, com lucros imputados ao sócio em sede de IRS Categoria B. A **Convenção Portugal-EUA (Decreto n.º 19/96)** rege a dupla tributação. Para residentes brasileiros, a **ausência de CDT plena entre Brasil e EUA** complica o crédito de imposto e exige análise caso a caso. **Uma LLC US pode ser vantajosa para um residente português ou brasileiro com forte componente internacional**, mas exige planeamento cuidadoso e cumprimento das obrigações declarativas locais (Modelo 3 IRS Anexo J em PT, DCTF/SCS no Brasil).

## Que escolher segundo o seu perfil

- **Freelancer, agência digital, consultor, infoprodutor, pequeno ecommerce, SaaS bootstrapped**: **LLC** sem dúvida se faturar maioritariamente ao internacional. Wyoming ou Novo México pelo custo; Delaware se prevê crescer muito.
- **Startup com ronda seed ou série A planeada**: **Delaware C-Corp** desde o primeiro dia, assumindo a dupla tributação como custo de acesso a capital.
- **Negócio físico nos EUA com empregados e operação local**: provavelmente C-Corp se prevê crescer muito; LLC se for pequeno negócio.
- **Profissional regulamentado (advogado, médico, arquiteto)**: muitos estados exigem **Professional LLC (PLLC)** ou **Professional Corporation (PC)** com licença estatal.

Se já tem uma LLC e precisa de a converter em C-Corp, é possível via **statutory conversion** (DE, NV, WY) ou via **check-the-box election (Form 8832)**. Sob **IRC §351**, a incorporação pode ser tax-free se cumprir requisitos (controlo 80 % pós-incorporação, exclusivamente ativos por ações), mas qualquer desvio dispara eventos tributáveis imediatos.

## Quadro regulatório aplicável

- **Internal Revenue Code (Title 26 USC)**: §11(b) C-Corp 21 %; §§1361-1378 regime S-Corp; §1202 QSBS; §§871, 881, 882, 1441 tributação de não residentes; §6038A Form 5472; §351 incorporações tax-free.
- **Treasury Regulations**: §301.7701-3 check-the-box; §1.6038A-1/2 Form 5472 disregarded entities.
- **IRS Publications**: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/business-structures">Business Structures</a>; Pub. 519 (US Tax Guide for Aliens); Pub. 542 (Corporations).
- **Quadro estadual US**: Delaware General Corporation Law; Wyoming Business Corporation Act; New Mexico Limited Liability Company Act.
- **Quadro português**: Código do IRS (Decreto-Lei n.º 442-A/88) Categoria B; Código do IRC (Decreto-Lei n.º 442-B/88), arts. 66.º (CFC) e 87.º (taxa reduzida PME); Código das Sociedades Comerciais; <a href="https://info.portaldasfinancas.gov.pt">Portal das Finanças</a>; Convenção Portugal-EUA (Decreto n.º 19/96).
- **Quadro brasileiro**: Lei das Sociedades Limitadas (Lei n.º 10.406/2002, Código Civil arts. 1.052-1.087); Regulamento do Imposto de Renda (Decreto n.º 9.580/2018); Receita Federal do Brasil.

Para não residentes, a LLC continua a ser a opção mais comum porque combina proteção patrimonial, fiscalidade limpa (0 % federal sem ETBUS) e carga administrativa baixa. A C-Corp reserva-se para quem procura capital institucional ou ida a bolsa.

## Erros frequentes ao escolher veículo

- **Pensar que a S-Corp é "uma LLC melhorada"**: não é. É uma eleição fiscal exclusiva para US persons. Se é não residente, nem a considere.
- **Constituir uma C-Corp "porque soa mais sério"** sem necessidade real de capital: paga 21 % federal desnecessariamente.
- **Converter LLC em C-Corp sem assessoria**: se não cumprir IRC §351, disparo imediato de eventos tributáveis.
- **Escolher Delaware "porque é famoso"** quando WY/NM custam cinco vezes menos em manutenção anual e oferecem o mesmo blindagem fiscal para um freelancer não residente.

A escolha correta depende do seu plano a 3-5 anos, não da moda do fórum do dia.

<!-- exentax:cross-refs-v1 -->
## Sobre o mesmo tema

- [Tributação pass-through para LLC: como funciona e por que é importante](/pt/blog/tributacao-pass-through-para-llc-como-funciona-e-por-que)
- [Como constituir uma LLC americana passo a passo: guia completo](/pt/blog/como-constituir-uma-llc-americana-passo-a-passo-guia)
- [Tributação da LLC segundo a atividade económica: serviços, e-commerce, SaaS](/pt/blog/tributacao-da-llc-segundo-a-atividade-economica-servicos)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/servicos">Descobre se uma LLC é para ti</a>
<!-- /exentax:calc-cta-v1 -->

Na Exentax revemos o seu caso com dados reais e dizemos-lhe se compensa LLC, C-Corp ou nenhuma estrutura US. <a href="/pt/agendar">Agende uma consulta gratuita</a> de 30 minutos e saímos com um plano claro.

<!-- exentax:execution-v2 -->
## Como o resolvemos com o método Exentax

O que vemos cada semana nos casos que nos chegam é o mesmo padrão: a dúvida fica em ideias soltas, a decisão adia-se e, quando chega o fecho do exercício, pagam-se mais impostos do que os necessários ou assumem-se riscos que não compensam. O problema quase nunca é a norma; é a falta de um plano por escrito com números reais, assinado por alguém que entenda o seu caso de ponta a ponta.

**O que as pessoas fazem mal**
- Copiam estruturas vistas em redes sem modelar o seu próprio caso com receitas, residência e clientes na mão.
- Misturam dinheiro pessoal com o da atividade e perdem o rasto documental que qualquer inspeção exige.
- Confiam a operação a contabilistas que só preenchem formulários, sem pensar na estratégia anual nem no custo total.

**O que funciona de verdade**
- Modelar a sua situação na <strong>calculadora Exentax</strong> antes de mover uma única peça, para ver o custo total anual e não só a fatura de hoje.
- Separar desde o primeiro dia os fluxos de dinheiro, com contas distintas e uma checklist viva de comprovativos.
- Trabalhar com um consultor que olhe as peças juntas: estrutura, banca, conformidade e residência — não cada uma por si.

Se quer passar da dúvida ao plano, agende 30 minutos com a Exentax e saímos da chamada com os números fechados e o calendário operacional.
<!-- /exentax:execution-v2 -->


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
<p data-testid="cta-action-row">Precisa de falar já? Ligue-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreva-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20venho%20do%20artigo%20%22Diferen%C3%A7a%20entre%20LLC%2C%20Corporation%2C%20S-Corp%20e%20C-Corp%22%20e%20quero%20falar%20com%20um%20consultor.">WhatsApp</a> e respondemos hoje mesmo.</p>

Se o seu plano é montar a LLC no Delaware, consulte a nossa página de serviço <a href="/pt/servicos/llc-delaware">LLC no Delaware</a> com custos, prazos e próximos passos concretos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Comparamos Novo México, Wyoming, Delaware e Florida sobre o seu caso real — sem lhe vender o estado da moda. <a href="/pt/servicos/llc-delaware">Comparar o meu caso com um consultor</a>.
<!-- /exentax:cta-v1 -->
`;
