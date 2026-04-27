export default `Quando se fala de Wise, IBAN estrangeiros e LLC nos Estados Unidos, circulam dois discursos igualmente errados: por um lado, o "Wise não reporta nada e a Autoridade Tributária nunca vai saber", por outro, o medo de que cada movimento seja transmitido em direto à AT, à Receita Federal ou à autoridade fiscal do seu país. A realidade está bastante mais matizada e vale a pena entendê-la antes de montar a sua estrutura, especialmente se combinar uma <a href="/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em">LLC americana</a> com uma conta Wise e os cartões associados.

Este artigo foca o que acontece de facto: que tipo de informação sai da Wise para a sua autoridade fiscal, o que não sai, e onde está a fronteira entre uso legítimo e exposição fiscal. Para a análise técnica detalhada do fluxo CRS da Wise Business desde a Bélgica, aprofundamos em <a href="/pt/blog/wise-business-e-crs-o-que-e-reportado-a-sua-autoridade">Wise Business e CRS: o que é reportado à sua autoridade fiscal</a>.

## Como a Wise funciona por baixo

A Wise não é um banco tradicional, nem uma gateway opaca, nem uma conta offshore. É um grupo de entidades reguladas que opera em jurisdições distintas:

- **Wise Europe SA**, com sede na Bélgica, autorizada como Electronic Money Institution pelo National Bank of Belgium. É a entidade que serve a maioria dos clientes europeus e a maior parte das LLC com representação europeia.
- **Wise Payments Limited**, no Reino Unido, regulada pela FCA. Continua a servir clientes UK e alguns legados.
- **Wise US Inc.**, regulada nos EUA como Money Services Business. É a entidade para clientes residentes e entidades americanas.
- Filiais em Singapura, Austrália, Índia e outras jurisdições, com os seus próprios reguladores locais.

Quando abre uma conta Wise (pessoal ou Business) recebe "dados bancários locais" em várias divisas: um **IBAN belga (BE) emitido pela Wise Europe SA** para EUR (alguns clientes europeus antigos podem ainda ter IBAN lituanos herdados; para uma **LLC norte-americana aberta hoje através da Wise Business**, o IBAN EUR vem sempre da entidade belga, nunca da Lituânia), um **sort code e account number em GBP**, um **routing number e account number em USD**, e equivalentes em AUD, NZD, SGD, etc. Esses IBAN não fazem da Wise um banco belga ou lituano comum: são contas de cliente segregadas dentro do esquema EMI europeu.

O que importa para fiscalidade: ainda que veja um IBAN belga ou lituano, **a entidade que custodia os seus fundos e reporta sobre a sua conta é a Wise Europe SA (Bélgica)** na grande maioria dos casos europeus. É essa entidade que aciona os fluxos CRS.
## O que é o CRS e quando se aplica

O **Common Reporting Standard (CRS)** é o padrão da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> que obriga as instituições financeiras de mais de 100 jurisdições a identificar os seus clientes não residentes e a reportar anualmente os seus saldos e rendimentos à autoridade fiscal local, que por sua vez troca os dados com a autoridade fiscal do país de residência do titular. Na UE foi transposto pela **Diretiva 2011/16/UE (DAC2)** e, na Bélgica, pela lei de 16 de dezembro de 2015 sobre troca automática de informação financeira. Em Portugal aplica-se através do Decreto-Lei n.º 64/2016 e legislação subsequente; no Brasil, através da Receita Federal e dos acordos multilaterais.

Para a Wise:

- **Wise Europe SA (Bélgica)** está totalmente sujeita a CRS. Reporta ao Service Public Fédéral Finances belga, que reencaminha para a autoridade fiscal do país de residência do titular.
- **Wise Payments Limited (UK)** também está sujeita a CRS, sendo o canal formal o HMRC.
- **Wise US Inc.** não está sujeita a CRS, porque os EUA não aderiram ao padrão (usam o seu próprio quadro assimétrico, FATCA, que afeta sobretudo US persons).

Em concreto: se a sua conta Wise está sob a Wise Europe SA, parta do princípio de que o saldo a 31 de dezembro e a informação do titular chegam à sua autoridade fiscal nacional. Se está sob a Wise US Inc., o CRS não se aplica, mas essa conta só está disponível para residentes e entidades realmente americanas, não para um não residente que opera uma LLC a partir da Europa ou da América Latina.
## O que a Wise reporta de facto

O bloco de informação que viaja por CRS é muito concreto e não inclui, ao contrário do que se costuma temer, "todos os movimentos em tempo real":

| Bloco | O que inclui |
| --- | --- |
| Titular pessoa singular | Nome, morada, residência fiscal declarada, número de identificação fiscal (TIN), data e local de nascimento |
| Titular entidade | Designação, morada, EIN/NIF da LLC, classificação CRS (Active NFE, Passive NFE, Investment Entity) |
| Beneficiários efetivos | Se a entidade for classificada como Passive NFE: dados das controlling persons (limiar de 25% direto ou indireto, ou controlo efetivo) |
| Conta | IBAN por divisa, número interno da conta Wise |
| Saldo | Saldo agregado a 31 de dezembro, normalmente em EUR convertido ao fecho |
| Rendimentos | Juros, se houver (Wise Interest), dividendos brutos e produto bruto de reembolso em produtos como Wise Assets |

O que **não** é reportado por CRS:

- O detalhe de cada movimento operacional do ano.
- O nome e os dados dos seus clientes.
- As suas faturas, contratos ou margens.
- Compras concretas feitas com o cartão Wise.

Isso não significa que essa informação seja invisível: se a sua autoridade fiscal abrir um procedimento, pode pedi-la diretamente a si e, em investigações mais avançadas, solicitar informação pontual à Wise pelos canais de cooperação fiscal. O que significa é que o fluxo automático anual não é uma exportação total: é saldo + rendimentos + identidade.
## Cartões Visa e Mastercard: a matização importante

Existe a ideia muito difundida de que "como os cartões são Visa ou Mastercard, as redes já enviam tudo às autoridades fiscais". Vale a pena clarificar:

- Visa e Mastercard são **redes de processamento de pagamentos**, não instituições financeiras que mantêm a sua conta. A sua função é liquidar transações entre o banco emissor e o banco adquirente do comerciante.
- **Visa e Mastercard não reportam os seus consumos diretamente a nenhuma autoridade fiscal** como fluxo automático periódico. Não é esse o seu papel.
- A obrigação declarativa recai sobre **o emissor do cartão** (aqui, a Wise Europe SA) e sobre o **comerciante adquirente** na sua própria contabilidade.
- Dentro dos sistemas nacionais, existem obrigações específicas para instituições financeiras domésticas (em Portugal, o Modelo 38 e outras declarações da AT; em Espanha, modelos como o 196 e 171), mas esse quadro não se aplica com a mesma intensidade a um EMI estrangeiro emissor do cartão.

Se quiser o mapa completo de quem reporta o quê do seu consumo com cartão país a país (Modelo 196, 171, DAS2, Modelo 38), desenvolvemo-lo em <a href="/pt/blog/visa-mastercard-reporting-o-que-as-autoridades-fiscais-veem">Visa e Mastercard: o que as autoridades fiscais veem realmente do seu cartão</a>.

Conclusão razoável: usar o cartão Wise para despesas pessoais como residente fiscal em Portugal, Espanha ou Brasil não gera um reporte automático em tempo real de cada transação à autoridade fiscal. O que se gera, junto com o resto da conta, é o reporte CRS anual do saldo e dos rendimentos. E, sobretudo, deixa um rasto perfeitamente reconstituível se a autoridade fiscal pedir explicações sobre a origem dos fundos.
## O caso típico: LLC não residente com Wise Business

É aqui que circulam mais mitos. Um empreendedor com residência fiscal em Portugal (ou em LATAM) constitui uma <a href="/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em">LLC nos Estados Unidos</a>, abre Mercury como conta principal e Wise Business como conta secundária multidivisa. Ao preencher a auto-certificação CRS da Wise para a LLC, tem de indicar:

- Residência fiscal da LLC: EUA.
- Classificação CRS: a maioria das Single-Member LLC de serviços cumpre os requisitos de **Active NFE** (mais de 50% dos rendimentos são operacionais), mas a Wise tende a aplicar critérios conservadores e, perante documentação fraca, classifica como **Passive NFE**.
- Controlling persons: dados do beneficiário efetivo, incluindo a sua residência fiscal (a sua, em Portugal, no Brasil ou no país que for).

Consequência prática: ainda que a LLC seja americana e os EUA não estejam no CRS, o **dado da sua titularidade como controlling person, com a sua residência fiscal real, chega à sua autoridade fiscal a partir da Bélgica**. É a peça que muitos ignoram.

Isto não torna a LLC "ilegal": uma LLC bem estruturada e bem declarada é uma ferramenta perfeitamente legítima. O que invalida é a ideia de que pôr a Wise Business em nome da LLC bloqueia o fluxo de informação para o seu país de residência.
## O que a sua autoridade fiscal pode ver (e o que não pode)

Traduzido na prática de um residente fiscal em Portugal ou no Brasil com LLC + Wise:

O que a autoridade fiscal pode ver de forma automática e recorrente:

- Que existe uma conta Wise associada à LLC e a si como controlling person.
- O saldo a 31 de dezembro de cada ano.
- Os rendimentos brutos gerados (Wise Interest, Wise Assets, etc.).
- O seu nome, NIF e morada como beneficiário efetivo.

O que não recebe automaticamente:

- Cada um dos movimentos do ano.
- O detalhe dos seus clientes e faturas.
- As transações concretas com o cartão.
- O P&L interno da LLC.

O que se passa quando esses dados são cruzados com as suas declarações nacionais:

- Se a sua declaração de contas no estrangeiro (em Portugal, o Anexo J e, quando aplicável, declarações específicas de bens; em Espanha, o Modelo 720; no Brasil, a CBE do Banco Central e a DIRPF) não recolhe a conta Wise quando devia, o desfasamento é evidente.
- Se o seu <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> ou IRPF não inclui os rendimentos atribuíveis à LLC, no cenário em que o seu país a trata como entidade transparente, como analisamos em <a href="/pt/blog/crs-para-residentes-em-espanha-e-latam-implicacoes-reais">CRS para residentes em Espanha e LATAM</a>, surge outra incoerência.
- Se os saldos não baterem certo com os rendimentos declarados, a autoridade fiscal tem uma alavanca natural para abrir uma inspeção.

O problema raramente é o reporting em si, mas a **incoerência documental** entre o que se declara em casa, o que sai da Bélgica via CRS e o que mostra a operação real.
## Erros comuns que vemos todas as semanas

1. **"A Wise não reporta nada."** Falso. A Wise Europe SA reporta por CRS desde a Bélgica.
2. **"Se a conta está em nome da LLC, não me reportam a mim."** Falso para Passive NFE: reportam-se as controlling persons. E a maioria das Single-Member LLC acaba assim classificada.
3. **"Como o meu saldo médio é baixo, não entro no CRS."** O saldo reportado é o de fecho, independentemente das flutuações ao longo do ano, e não há limiar mínimo em contas novas.
4. **"Tenho Wise USD sob Wise US Inc., não é reportado."** Verdade quanto ao CRS, mas essa configuração só é coerente para residentes e entidades realmente americanas; usá-la a partir da Europa com uma LLC operada por um não residente expõe-no noutra frente (residência, gestão efetiva, due diligence interna da Wise).
5. **"Pago tudo com o cartão Wise, não fica rasto."** Fica rasto: na Wise, no comerciante e no saldo de fecho que é reportado. E é perfeitamente reconstituível se for aberto um procedimento.
6. **"A LLC protege-me automaticamente da declaração de contas no estrangeiro."** Não: se é residente fiscal e beneficiário efetivo de contas no estrangeiro, a obrigação aplica-se a partir dos limiares agregados.
## Por que isto importa para a sua estrutura

A conclusão razoável não é "a Wise é má" nem "a LLC é perigosa". A conclusão é que **a sua estrutura só funciona se as peças forem coerentes entre si**: a sua residência fiscal, a entidade que custodia a sua conta, a classificação CRS da LLC, as suas declarações informativas nacionais, o seu IRS ou IRPF e os contratos com clientes. Quando uma dessas peças não encaixa, os problemas não aparecem no dia em que move o dinheiro. Aparecem três ou quatro anos depois, sob a forma de notificação fiscal.

Na Exentax trabalhamos exatamente nessa fronteira: estruturar a <a href="/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em">LLC americana</a>, escolher <a href="/pt/blog/bancos-tradicionais-vs-fintech-para-sua-llc-onde-abrir-a">que banco ou fintech</a> faz sentido como principal e qual como secundário, antecipar o que se reporta via <a href="/pt/blog/crs-para-residentes-em-espanha-e-latam-implicacoes-reais">CRS</a> para a sua autoridade fiscal nacional, e desenhar o conjunto para que a peça Wise (ou <a href="/pt/blog/revolut-business-e-crs-o-que-e-reportado-a-sua-autoridade">Revolut Business</a>, ou qualquer outra) encaixe sem surpresas. Aprofundamos em <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">Desenho de uma estrutura fiscal internacional sólida</a>.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

Na Exentax trabalhamos exatamente nessa fronteira: estruturar a <a href="/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em">LLC americana</a>, escolher <a href="/pt/blog/bancos-tradicionais-vs-fintech-para-sua-llc-onde-abrir-a">que banco ou fintech</a> faz sentido como principal e qual como secundário, antecipar o que se reporta via <a href="/pt/blog/crs-para-residentes-em-espanha-e-latam-implicacoes-reais">CRS</a> para a sua autoridade fiscal nacional, e desenhar o conjunto para que a peça Wise (ou <a href="/pt/blog/revolut-business-e-crs-o-que-e-reportado-a-sua-autoridade">Revolut Business</a>, ou qualquer outra) encaixe sem surpresas. Aprofundamos em <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">Desenho de uma estrutura fiscal internacional sólida</a>.
Se não tem certeza de como a Wise encaixa na sua estrutura ou se está exposto a um cruzamento que não controla, revemos consigo e dizemos-lhe o que ajustar antes que seja a autoridade fiscal a marcar o ritmo.
### Em resumo

A Wise é uma excelente fintech multidivisa, totalmente regulada e totalmente ligada à troca automática de informação quando opera sob a Wise Europe SA. Não é um atalho para esconder dinheiro, mas também não é uma câmara que transmite cada movimento em direto à autoridade fiscal. O que viaja por CRS é saldo, rendimentos e identidade do titular e do beneficiário efetivo. O que não viaja por defeito é o detalhe operacional, embora fique perfeitamente disponível se a autoridade fiscal o pedir.

A diferença entre ter problemas ou não tê-los não está em usar a Wise, mas em como a Wise se enquadra dentro de uma estrutura coerente com a sua LLC, a sua residência e as suas declarações. É essa a conversa que vale a pena ter antes, não depois.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.

Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:legal-refs-v1 -->
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** BOE de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / OCDE.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).

A aplicação concreta de qualquer destas normas ao seu caso depende da sua residência fiscal, da atividade da LLC e da documentação que mantenha. Este conteúdo é informativo e não substitui aconselhamento profissional personalizado.<!-- exentax:execution-v2 -->
## O IBAN belga da Wise para a sua LLC: o que é, o que reporta e porque a AT o vê

Quando activa a sub-conta EUR de Wise Business, recebe um IBAN belga BE. Operativamente excelente; fiscalmente sob regime CRS belga.

- **Natureza do IBAN BE.** Wise Europe SA é instituição de crédito autorizada pelo Banco Nacional da Bélgica. O IBAN BE é juridicamente conta belga, mesmo que o titular seja a sua LLC US.
- **Dados transmitidos anualmente.** Identificação LLC titular, UBO, saldo 31 Dezembro, total movimentos brutos anuais, identificador conta. Não transacções individuais.
- **Cruzamento com declaração em residência.** PT: declaração de contas estrangeiras no IRS. Se a AT recebe via CRS o saldo e não declarou, procedimento de imputação.
- **Diferença vs sub-conta USD.** USD operado por Wise USD Inc., reporta via FATCA-IGA. Canal diferente, resultado fiscal equivalente.

### Como declarar correctamente em PT

IRS anexo J para contas estrangeiras e atribuição da LLC.

### O que mais nos perguntam

**Se UBO declarado no KYC é outro, vai à AT do declarado?** Sim, CRS reporta à residência do UBO real.

**Posso ter Wise sem activar EUR?** Sim, mas perde a vantagem principal.

Na Exentax estruturamos Wise por necessidade e declaramos correctamente.
<!-- /exentax:execution-v2 -->

## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações IRS e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Quando%20se%20fala%20de%20Wise%2C%20IBAN%20estrangeiros%20e%20LLC%20nos%20Estados%20Unidos%2C%20circulam%20%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->`;
