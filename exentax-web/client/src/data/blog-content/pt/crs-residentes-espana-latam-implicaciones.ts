export default `Este artigo foi escrito a pensar em Espanha e América Latina, mas toca numa ferida que afeta diretamente quem vive em Portugal ou no Brasil: a partir do momento em que tens uma LLC com conta em USD, apareçem obrigações acessórias (Anexo J do <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, Modelo 58 do Banco de Portugal, DIRF/e-Financeira no Brasil) que muita gente só descobre com o primeiro aviso.

## O que é o CRS

Aprovado pelo Conselho da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> em julho de 2014. Mais de 100 jurisdições trocam anualmente informação sobre contas de não-residentes. Na UE incorporado pela **Diretiva 2014/107/UE (DAC2)**. Em Espanha transposto via **Real Decreto 1021/2015** e Ordem HAP/1695/2016 (Modelo 289). Em LATAM aplicado por México (desde 2017), Argentina, Colômbia, Chile, Brasil, Uruguai, etc. Os **EUA não aderiram ao CRS**: usam FATCA, unilateral e só de saída. Veja <a href="/pt/blog/as-contas-bancarias-americanas-reportam-a-sua-autoridade">contas EUA reportam à sua autoridade fiscal?</a>.
### Que se reporta

Anualmente cada Instituição Financeira Reportante reporta: identificação do titular (nome, morada, residência fiscal, NIF/TIN), de entidade (com **beneficiários efetivos** se NFE passiva), número de conta, **saldo a 31 de dezembro** e rendimentos brutos.
## A sua LLC americana

1. **Os EUA não enviam dados via CRS.** Mercury, Relay não comunicam à AT, AEAT, SAT, DIAN.
2. **Contas em fintechs europeias** (Wise BE, Revolut LT, N26 DE, Wallester EE) em nome da LLC **são reportadas**. Veja <a href="/pt/blog/revolut-business-e-crs-o-que-e-reportado-a-sua-autoridade">Revolut e CRS</a> e <a href="/pt/blog/wise-business-e-crs-o-que-e-reportado-a-sua-autoridade">Wise e CRS</a>.
3. **A sua LLC é provavelmente classificada como NFE passiva** e a fintech reporta os **controlling persons** ao seu país de residência.
### Determinação da residência fiscal

A instituição aplica due diligence (auto-certificação + indícios objetivos: morada, IP, NIF, transferências recorrentes). Falsa auto-certificação é infração e pode ser crime.
### Implicações em Espanha

Contas estrangeiras > 50.000 € em fim de ano: **Modelo 720**. Cripto > 50.000 €: **Modelo 721**. O acórdão do TJUE C-788/19 anulou o regime sancionatório desproporcionado mas a obrigação de declarar continua plena.
### Como planear corretamente

Uma LLC bem estruturada com banca exclusivamente Mercury/Relay (US) tem **pegada CRS mínima**. Adicionar camada europeia significa que a informação chega à autoridade. Estratégia profissional: declarar corretamente, conceber estrutura eficiente (veja <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">quadro de desenho</a>), manter documentação, conhecer riscos (<a href="/pt/blog/riscos-fiscais-de-uma-ma-estruturacao-internacional">riscos</a>).
### Erros típicos

- "Mercury é nos EUA", falso para Wise/Revolut/N26 da mesma LLC.
- "Residência em Andorra" mas vive em Espanha, residência determina-se por factos.
- "Se a LLC factura, estou seguro", **transparência fiscal internacional** (art. 100 LIS via art. 91 LIRPF) ativa-se com rendimentos passivos.
### Conclusão e próximos passos

### Em resumo

CRS planeia-se, não se evita. Uma LLC continua extraordinariamente útil; o desenho do banking stack e a residência determinam a coerência informacional.

Na Exentax encaixamos estas obrigações logo na constituição. Marca a tua consultoria gratuita: identificamos as declarações acessórias que realmente te afetam e deixamo-las em ordem.

Se ficou algum ponto desta estrutura por aprofundar, <a href="/pt/blog/por-que-freelancers-espanhois-estao-deixando-o-trabalho">Por que freelancers espanhóis estão a deixar o trabalho autónomo por uma LLC americana</a> detalha uma peça vizinha que costumamos reservar para um artigo dedicado.
### Próximos passos

Se quer validar se esta estratégia encaixa na sua situação concreta, na Exentax revemos o seu caso de forma personalizada e propomos a estrutura legal e eficiente que realmente lhe convém. Reserve uma sessão inicial sem compromisso a partir da nossa página de contacto.

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
## Como planificar corretamente

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Em resumo

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.
## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

<!-- exentax:calc-cta-v1 -->
> **Coloque números no seu caso.** A <a href="/pt#calculadora">calculadora fiscal Exentax</a> compara a sua carga tributária atual com o que pagaria operando uma LLC norte-americana corretamente declarada no seu país de residência.
<!-- /exentax:calc-cta-v1 -->

## Referências: enquadramento legal e regulamentação

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.

## Falemos sobre a sua estrutura

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

## Que informação se reporta exatamente

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.<!-- exentax:execution-v2 -->
## O que o CRS significa hoje para residentes em Espanha e Latam

O CRS funciona em piloto automático: 110+ jurisdições trocam dados todos os Setembros sobre saldos a 31 de Dezembro do ano anterior. Se é residente fiscal em Espanha, México, Colômbia, Chile, Peru, Argentina, Uruguai ou Brasil, os bancos onde tem contas no estrangeiro já estão a reportar ou farão em breve. Isto é o que importa, sem paranoia.

- **O que se reporta.** Saldos a 31 de Dezembro, rendimentos brutos do ano (juros, dividendos), nome do titular, residência fiscal declarada ao banco e, para entidades transparentes, dados da controlling person. A informação chega ao país de residência e cruza-se com a declaração fiscal.
- **O que não se reporta.** Movimentos detalhados da conta, contrapartes específicas, informação transaccional. CRS = saldos + rendimentos brutos + identificação; não rastreabilidade de cada operação. A percepção "sabem tudo" é exagerada literalmente mas certa em consequência: com saldos e rendimentos brutos constrói-se presunção suficiente para abrir requerimento.
- **Espanha, Modelo 720 e Modelo 721.** O residente fiscal espanhol tem obrigação própria de declarar contas no estrangeiro (>50.000 € combinado, Modelo 720) e cripto-activos no estrangeiro (>50.000 €, Modelo 721). Independente do CRS, dependente da sua obrigação. O CRS só ajuda a AEAT a cruzar e detectar omissões.
- **Latam - ritmos diferentes.** México (SAT) troca desde 2018 com cobertura extensa; Colômbia (DIAN) desde 2017 com depuração progressiva; Chile (SII) desde 2018; Argentina (AFIP) desde 2018 mas com uso operacional em construção; Uruguai activo mas com regime tax-haven nuançando o fluxo. A intensidade do uso varia, a disponibilidade do dado é generalizada.

### O que mais nos perguntam

**Se tenho Mercury na minha LLC, o meu país sabe via CRS?** Não directamente: os EUA não participam no CRS. O que entra são contas Wise (via Bélgica) e, se a LLC operasse via banco europeu ou asiático, esses sim. A Mercury fica fora do fluxo automático, não fora de toda obrigação declarativa.

**Como regularizo se tenho anos sem declarar?** Com declaração complementar 720/721 antes que chegue requerimento. O Acórdão TJUE C-788/19 limitou as multas espanholas; regulariza-se com custo muito menor que há 5 anos. Avaliamos caso a caso.

Na Exentax mapeamos que contas suas entram no CRS, que obrigações declarativas dispara cada uma e desenhamos a entrada limpa ou a regularização ordenada quando aplicável.
<!-- /exentax:execution-v2 -->

## O que é o CRS e porque existe

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Este%20artigo%20foi%20escrito%20a%20pensar%20em%20Espanha%20e%20Am%C3%A9rica%20Latina%2C%20mas%20toca%20numa%20f%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisão editorial pendente</strong> — As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…E)**, salvo que demuestre actividad operativa real (más del 50% de sus ingresos son operat…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…uentas en el extranjero** con saldo individual o conjunto &gt; 50.000 € a 31 de diciembre o s…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">20.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…zo del año siguiente; sucesivas, solo si hay variación de + 20.000 € en cualquier rúbrica.…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…nvenio OCDE con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1021/2015</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…os CRS La entidad financiera aplica una **due diligence** (RD 1021/2015 y Anexo I del CRS)…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…6/UE de cooperación administrativa (DAC), modificada por la DAC2 (Directiva 2014/107/UE) q…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio OCD…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
