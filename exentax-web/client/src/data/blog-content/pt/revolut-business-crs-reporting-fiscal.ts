export default `A Revolut Business é operada a partir da Lituânia para a UE e aplica o CRS por defeito: os teus saldos e movimentos chegam às Finanças todos os anos. Muitos clientes lusófonos abrem Revolut Business para a LLC sem perceber que com isso anulam parte do que julgavam ter ganhado do lado dos EUA.

## Que entidades Revolut e onde reportam

**Revolut Bank UAB** (Lituânia, banco licenciado pelo Lietuvos Bankas, principal entidade EEE desde 2021, reporta CRS à **VMI** lituana), que reencaminha à AT/AEAT/SAT/DIAN/AFIP. **Revolut Ltd** (UK, EMI FCA), **Revolut Payments UAB** (EMI EEE).
### Quadro normativo

<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> CRS; UE Diretiva 2011/16/UE com DAC2; Lituânia lei nacional CRS; Portugal/Espanha recetoras (Espanha RD 1021/2015, Modelo 720, Modelo 721). Mais em <a href="/pt/blog/crs-para-residentes-em-espanha-e-latam-implicacoes-reais">CRS para residentes</a>.
### Informação enviada

Anualmente: identificação do titular e entidade com classificação CRS (Active/Passive NFE), **controlling persons** se NFE passiva, IBAN, **saldo a 31/12**, juros/dividendos/produtos brutos.
### LLC com Revolut Business

Revolut aplica due diligence CRS sobre a LLC e, sem documentação robusta, classifica como **Passive NFE**. Reporta os controlling persons () ao país de residência. Mesmo que a LLC seja americana e os EUA não estejam no CRS, os seus dados chegam à autoridade nacional via Lituânia.
### Auto-certificação CRS

Na abertura preenche o formulário CRS (residência, classificação, controlling persons). LLC unipessoal de serviços pode ser Active NFE; Revolut tende a Passive NFE conservadora.
### Residência mal declarada

Se IP, morada de cartão, telefone e transferências apontam Espanha apesar de declarar Andorra: pedido de certificado ou dupla declaração. Falsa auto-certificação = infração.
### Como planear

1. Não usar Revolut como **conta principal** se quer minimizar pegada CRS, Mercury é o ótimo.
2. Se usa, declarar corretamente. Veja <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">desenho da estrutura</a>.
3. Coerência documental.
4. Conhecer riscos: <a href="/pt/blog/riscos-fiscais-de-uma-ma-estruturacao-internacional">riscos</a>.
### Comparativo

| Plataforma | Jurisdição | CRS | Reporta a |
| --- | --- | --- | --- |
| Mercury | EUA | Não | Ninguém via CRS |
| Revolut Business | Lituânia | Sim | AEAT via VMI |
| Wise Business | Bélgica | Sim | AEAT via SPF Finances BE |
| Wallester | Estónia | Sim | AEAT via autoridade EE |
### DAC7 e DAC8

Vendas em plataformas: <a href="/pt/blog/dac7-o-novo-reporting-de-plataformas-digitais-em-2026">DAC7</a>; cripto via exchanges UE: <a href="/pt/blog/dac8-e-criptomoedas-o-novo-reporting-fiscal-automatico-em">DAC8</a>.
### Em resumo

Revolut Business é excelente; conhecer o perfil CRS é essencial. Declare corretamente e desenhe stack coerente.

Na Exentax avaliamos caso a caso se o Revolut Business encaixa. Marca a tua consultoria gratuita: olhamos para todo o mapa bancário e dizemos-te o que manter, o que mover.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.

Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

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
## Compliance fiscal no seu país: CFC, TFI e atribuição de rendimentos

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.
## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Referências: fontes e regulamentação bancária

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

## O seu próximo passo com a Exentax

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

<!-- exentax:calc-cta-v1 -->
> **Coloque números no seu caso.** A <a href="/pt#calculadora">calculadora fiscal Exentax</a> compara a sua carga tributária atual com o que pagaria operando uma LLC norte-americana corretamente declarada no seu país de residência.
<!-- /exentax:calc-cta-v1 -->

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

## Que informação concreta a Revolut envia

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.<!-- exentax:execution-v2 -->
## Revolut Business e CRS: o que reporta à AT e como se vê do outro lado

Revolut Business é prático, multi-moeda e barato - e reporta sistematicamente sob o Common Reporting Standard.

- **Regime CRS de Revolut Business.** Revolut Bank UAB é instituição financeira reportante CRS desde a licença bancária lituana. Reporta anualmente ao Banco da Lituânia, que partilha com as restantes jurisdições CRS - incluindo a residência fiscal do UBO declarado.
- **Dado exacto transmitido.** Identificação do titular, saldo a 31 Dezembro, total movimentos brutos, identificador de conta (IBAN LT). Não transacções individuais, agregados.
- **Porque a AT cruza.** Se saldo acima de limiar e sem declaração de contas estrangeiras, AT recebe via CRS e compara. Diferença = processo automático.
- **O que muda vs banco US tradicional.** Revolut UE reporta CRS rápido (Q1 ano seguinte). Mercury/Wise USD reportam FATCA ao <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> e chegam também mas com mais latência.

### O que mais nos perguntam

**Se abro Revolut Business como LLC US, reporta a US ou ao meu país?** Reporta à residência fiscal do UBO declarada.

**Posso declarar residência "US" no KYC?** Declaração falsa ao banco - crime.

Na Exentax estruturamos o stack bancário tendo em conta o que CRS/FATCA reportam.
<!-- /exentax:execution-v2 -->

## Que entidades Revolut existem e onde reportam

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22A%20Revolut%20Business%20%C3%A9%20operada%20a%20partir%20da%20Litu%C3%A2nia%20para%20a%20UE%20e%20aplica%20o%20CRS%20po%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisão editorial pendente</strong> — As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ssive NFE: datos de los **controlling persons** (umbral del 25% de control directo o indir…»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…ra que la AEAT detecte si superas el umbral del Modelo 720 (50.000 €) o del Modelo 721 si …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(valor)</span> <span class="text-xs italic">— «…persons. Una **Active NFE** es aquella en la que menos del 50% de sus ingresos son rentas …»</span> <strong>[NÃO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…ury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cad…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1021/2015</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…, aplicará el procedimiento de **change in circumstances** (RD 1021/2015, art. 4 y Anexo I…»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…dos. - **UE**: Directiva 2011/16/UE (DAC) modificada por la DAC2 (Directiva 2014/107/UE), …»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…vs fintech para tu LLC&lt;/a&gt;. ### Consideraciones adicionales DAC7 y DAC8 Si tu LLC vende a …»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referência legal)</span> <span class="text-xs italic">— «…ech para tu LLC&lt;/a&gt;. ### Consideraciones adicionales DAC7 y DAC8 Si tu LLC vende a través …»</span> <strong>[REVISIÓN MANUAL — fonte sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
