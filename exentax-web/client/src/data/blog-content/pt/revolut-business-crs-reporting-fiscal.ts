export default `A Revolut Business é operada a partir da Lituânia para a UE e aplica o CRS por defeito: os teus saldos e movimentos chegam às Finanças todos os anos. Muitos clientes lusófonos abrem Revolut Business para a LLC sem perceber que com isso anulam parte do que julgavam ter ganhado do lado dos EUA.

## Que entidades Revolut e onde reportam

**Revolut Bank UAB** (Lituânia, banco licenciado pelo Lietuvos Bankas, principal entidade EEE desde 2021, reporta CRS à **VMI** lituana), que reencaminha à AT/AEAT/SAT/DIAN/AFIP. **Revolut Ltd** (UK, EMI FCA), **Revolut Payments UAB** (EMI EEE). **Revolut Technologies Inc.** (entidade norte-americana do grupo sob a qual é oferecido **Revolut Business a clientes com LLC dos EUA**, com **Lead Bank** como banco parceiro nos EUA — Lead Bank é um banco com licença federal dos EUA e, como tal, fica **fora do CRS**, perímetro FATCA).
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
- **Revolut Business**: quando associado a uma **LLC norte-americana**, opera sob **Revolut Technologies Inc.** com **Lead Bank** como banco parceiro nos EUA. A conta entregue é uma conta dos EUA (routing + account number); **não é emitido IBAN europeu** a uma LLC. Os IBAN europeus (lituanos, BE) são da **Revolut Bank UAB** e são emitidos a clientes europeus do grupo. Se lhe oferecerem um IBAN europeu associado à sua LLC, confirme a que entidade jurídica está associada e sob que regime essa entidade reporta.
- **Tributação zero**: nenhuma estrutura LLC consegue "zero impostos" se vives num país com regras CFC/transparência fiscal ou atribuição de rendimentos. O que se consegue é **não duplicar tributação** e **declarar corretamente na residência**, não eliminá-la.
## Compliance fiscal no seu país: CFC, TFI e atribuição de rendimentos

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.
## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Referências: fontes e regulamentação bancária

## O seu próximo passo com a Exentax

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
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

## O caso específico do residente fiscal em Portugal e no Brasil

  **Para residentes em Portugal**, ter uma conta Revolut Business UAB associada a uma LLC americana implica três obrigações em paralelo.

  A primeira é a **comunicação de IBAN estrangeiro à Autoridade Tributária e Aduaneira** através do **Modelo 3 do IRS, Anexo J, quadro 8**: deves declarar a existência da conta e identificar a entidade financeira (Revolut Bank UAB, Lituânia). A omissão é punível com coima entre **150 € e 3 750 €** ao abrigo do **artigo 119.º do Regime Geral das Infrações Tributárias (RGIT)**.

  A segunda obrigação resulta do regime das **sociedades estrangeiras controladas (CFC)** previsto no **artigo 66.º do CIRC**, aplicável quando residentes detêm mais de **25 %** dos direitos numa entidade não residente sujeita a regime fiscal claramente mais favorável (taxa efetiva inferior a 50 % da taxa portuguesa, atualmente abaixo de 10,5 %). Os lucros da LLC podem ser imputados ao sócio residente independentemente de distribuição.

  A terceira é a **comunicação obrigatória de operações suspeitas e transferências internacionais** ao Banco de Portugal pela própria Revolut Bank UAB enquanto entidade financeira da União Europeia, em cumprimento do **Aviso 1/2022 do Banco de Portugal** sobre prevenção de branqueamento de capitais.

  **Para residentes no Brasil**, o cenário inclui obrigações complementares. A **Declaração de Capitais Brasileiros no Exterior (CBE)** ao **Banco Central do Brasil** é obrigatória para residentes com ativos no exterior superiores a **USD 1 000 000** em 31 de dezembro, com periodicidade trimestral acima de **USD 100 000 000**. A omissão é punida com multa até **R$ 250 000**, conforme **Resolução BCB n.º 281/2022**. Adicionalmente, a **Lei 14.754/2023** instituiu a tributação automática anual de lucros de **entidades controladas no exterior** (mais de 50 % de participação) à alíquota de **15 %**, mesmo sem distribuição efetiva, conforme regulamentado pela **Instrução Normativa RFB n.º 2.180/2024**, exceto para LLCs com substância económica comprovada.

  ### Implicações práticas adicionais para residentes em Portugal e no Brasil

  Em Portugal, a Autoridade Tributária cruza desde 2018 os dados CRS recebidos do VMI lituano com a declaração Modelo 3 do IRS. Discrepâncias geram notificação para esclarecimentos no prazo de quinze dias, ao abrigo do artigo 59.º da LGT. A reincidência é considerada agravante para efeitos de qualificação como fraude fiscal qualificada (artigo 104.º do RGIT, com pena de prisão de 1 a 5 anos). No Brasil, a Receita Federal aplica também a **DCBE** (Declaração de Capitais Brasileiros no Exterior) com sanção autónoma e, desde a Lei 14.754/2023, a **DAA-PF** (Declaração de Ajuste Anual da Pessoa Física) inclui ficha específica para entidades controladas no exterior.

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22A%20Revolut%20Business%20%C3%A9%20operada%20a%20partir%20da%20Litu%C3%A2nia%20para%20a%20UE%20e%20aplica%20o%20CRS%20po%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
