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

Para aprofundar, leia também <a href="/pt/blog/llc-como-alternativa-a-ser-autonomo-em-espanha">LLC como alternativa a ser autónomo na Espanha</a> e <a href="/pt/blog/w8-ben-e-w8-ben-e-o-guia-completo">Guia completa dos formulários W8-BEN e W8-BEN-E</a>.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (BOE 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

<!-- exentax:calc-cta-v1 -->
> **Coloque números no seu caso.** A <a href="/pt#calculadora">calculadora fiscal Exentax</a> compara a sua carga tributária atual com o que pagaria operando uma LLC norte-americana corretamente declarada no seu país de residência.
<!-- /exentax:calc-cta-v1 -->

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.
Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram em recent years; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act.** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida a "foreign reporting companies"** (entidades constituídas fora dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA por um não residente está, hoje, fora dessa obrigação**. O estado regulatório pode mudar de novo: **reverificar em FinCEN.gov no momento da submissão**. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo e monitoriza atualizações.
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

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Quando%20algu%C3%A9m%20v%C3%AA%20pela%20primeira%20vez%20a%20combina%C3%A7%C3%A3o%20LLC%20nos%20EUA%20e%20residente%20fisca%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisão editorial pendente</strong> — As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">0%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ente en EE.UU. y dueño residente en España: - **En EE.UU.: 0% federal, 0% estatal** (en NM…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">19%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ómica en régimen de atribución, según tu marginal personal (19% al 47%). Es decir, **pagas…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">47%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…n régimen de atribución, según tu marginal personal (19% al 47%). Es decir, **pagas en Esp…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">30%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…---------------| | Servicios prestados desde fuera de USA | 30% retención | 0% (Art. 7, si…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">10%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…Royalties (software estándar, copyright cultural) | 30% | 0-10% según tipo (Art. 12) | | D…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">15%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…según tipo (Art. 12) | | Dividendos de empresas USA | 30% | 15% general / 10% en participa…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…egado de cuentas, valores o criptos en el extranjero supera 50.000 €. - **Certificado de r…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">120.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…onsultor de software con clientes USA y EU - LLC factura **120.000 USD/año** por servicios…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">30.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…D/año** por servicios prestados desde España. - Gastos LLC: 30.000 USD (software, hardware…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">90.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…are, viajes, registered agent, asesoría). - Beneficio neto: 90.000 USD ≈ 82.000 €. - USA: …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">82.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…registered agent, asesoría). - Beneficio neto: 90.000 USD ≈ 82.000 €. - USA: **0%** retenc…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">2.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…tención (W-8BEN-E activo, sin EP). Coste de mantenimiento ≈ 2.000 €. - España: IRPF margin…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">40%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…mantenimiento ≈ 2.000 €. - España: IRPF marginal aprox. 35-40% efectivo sobre 82.000 €. Cu…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…arginal aprox. 35-40% efectivo sobre 82.000 €. Cuota IRPF ≈ 25.000-28.000 €. - **Total tri…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">28.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…aprox. 35-40% efectivo sobre 82.000 €. Cuota IRPF ≈ 25.000-28.000 €. - **Total tributario:…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">27.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…00 €. Cuota IRPF ≈ 25.000-28.000 €. - **Total tributario:** 27.000-30.000 €. Frente a 38.0…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">38.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…28.000 €. - **Total tributario:** 27.000-30.000 €. Frente a 38.000-45.000 € que pagaría co…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">45.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…€. - **Total tributario:** 27.000-30.000 €. Frente a 38.000-45.000 € que pagaría como autó…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">10.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…a en Interactive Brokers. - Dividendos americanos cobrados: 10.000 USD/año. - Sin convenio…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">3.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…brados: 10.000 USD/año. - Sin convenio: retención del 30% → 3.000 USD al IRS. - Con W-8BEN…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.500</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…S. - Con W-8BEN-E + convenio: retención del 15% (Art. 10) → 1.500 USD al IRS. - En España:…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">5%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…e califica como royalty (Art. 12), la retención puede ser **5%** según subtipo y subbloque…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…r&quot;&gt;OCDE&lt;/a&gt; con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">30 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…. Sin esta documentación, los pagadores americanos retienen 30 % por defecto. **¿El conven…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">15 %</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ndos y plusvalías?** Sí, pero con tipos máximos diferentes (15 % dividendos, 0-21 % intere…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…. - En EE.UU. la LLC solo cumple obligaciones informativas (Form 5472 + 1120 pro forma, BO…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1042</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…sidentes que cobren a su nombre, no a nombre de la LLC. - **Form 1042-S:** lo emite el pag…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…como impuesto satisfecho en el extranjero. - **Form 5472 + Form 1120 pro forma:** declarac…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1040</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…encia. 2. **Solicitud de devolución al IRS:** mediante el **Form 1040-NR** (persona física…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio &lt;a …»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
