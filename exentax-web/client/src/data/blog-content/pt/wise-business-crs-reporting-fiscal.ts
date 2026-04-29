export default `

Sob o CRS, são reportados saldos das contas Wise Business a mais de 120 jurisdições e, para um residente fiscal em Espanha, a informação chega à AEAT antes de 30 de setembro de cada exercício.

A Wise Business (anteriormente TransferWise) é a fintech multi-divisas que a maioria dos titulares de uma <a href="/pt/blog/llc-estados-unidos-guia-completo-nao-residentes-2026">LLC norte-americana</a> abre em primeiro lugar, a par de qualquer empresário internacional que precise de movimentar dinheiro entre países. A proposta é direta: câmbio mid-market, IBANs locais em EUR, GBP, USD e mais uma dúzia de divisas, e comissões tão baixas que quase não se notam. O que muita gente não percebe é que a Wise é também uma instituição financeira europeia plenamente regulada e, como tal, está sujeita ao **Common Reporting Standard (CRS)**. Esta peça do puzzle tem implicações muito concretas que convém conhecer antes de integrar a Wise na estrutura da sua LLC.

<!-- exentax:crs2-update-v1 -->
## Atualização CRS 2.0, CARF e DAC8 (pacote OCDE)

A Wise Europe SA é uma EMI belga e, com o CRS 2.0, as EMI e os produtos especificados de moeda eletrónica ficam claramente classificados como Reporting Financial Institutions; a due diligence sobre as controlling persons de Passive NFEs aperta e a abertura da Wise Business para a sua LLC passa a documentar-se com critérios mais exigentes.

A OCDE aprovou o pacote integrado de **CRS 2.0** (a revisão do Common Reporting Standard, que traz as EMI e os produtos especificados de moeda eletrónica para dentro do perímetro e reforça a due diligence sobre as controlling persons) e **CARF** (Crypto-Asset Reporting Framework, que estende a troca automática a exchanges, custodiantes e plataformas de derivados cripto). A União Europeia transpô-lo através da **Diretiva (UE) 2023/2226 (DAC8)**, aprovada a 17 de outubro de 2023, que altera a 2011/16/UE para incorporar ambas as peças. A data de aplicação material é **1 de janeiro de 2026** e a **primeira troca efetiva** ocorre em **janeiro de 2027, sobre dados do exercício de 2026**.

Fontes oficiais: <a href="https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/" target="_blank" rel="noopener nofollow">OCDE — CRS</a>, <a href="https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework-and-amendments-to-the-common-reporting-standard.htm" target="_blank" rel="noopener nofollow">OCDE — CARF</a>, <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226" target="_blank" rel="noopener nofollow">EUR-Lex — Diretiva (UE) 2023/2226 (DAC8)</a>.

A narrativa a reter é a de sempre: **os EUA ficam fora do perímetro CRS por arquitetura, não por opacidade**. Washington tem o seu próprio regime (FATCA), não assinou o CRS 1.0 nem irá assinar o 2.0, e é precisamente por isso que a sua LLC norte-americana continua a ser uma estrutura plenamente declarável no seu país de residência. Desenvolvemos o tema em <a href="/pt/blog/crs-2-0-carf-por-que-os-eua-nunca-vao-assinar-llc">CRS 2.0 e CARF: porque os EUA nunca irão assinar e o que muda para a sua LLC</a>.
<!-- /exentax:crs2-update-v1 -->

## Que entidade Wise opera realmente a sua conta e onde reporta

A Wise não funciona como uma única empresa global. Opera através de várias entidades reguladas, e a que detém a sua conta decide qual a autoridade fiscal que vai ver os seus dados:

- **Wise Europe SA** (Bélgica): Instituição de Moeda Eletrónica (EMI) regulada pelo **Banco Nacional da Bélgica (NBB)**. É a entidade que serve clientes europeus desde que o Reino Unido perdeu o passaporte único da UE depois do Brexit. Reporta CRS ao **Service Public Fédéral Finances** belga, que ativa de seguida a troca bilateral de informação com a autoridade fiscal do país de residência do titular.
- **Wise Payments Limited** (Reino Unido): EMI regulada pela FCA. Continua a servir clientes britânicos e algumas contas pré-existentes.
- **Wise US Inc.**: regulada nos Estados Unidos como Money Services Business (MSB). O CRS não se aplica aqui porque os EUA nunca aderiram.
- Subsidiárias em Singapura, Austrália, Índia e outros mercados, cada uma com o seu regulador local e com as suas próprias regras de reporting.

Para clientes europeus e para qualquer LLC aberta com representação europeia no KYC, a configuração por defeito é que a conta fica na **Wise Europe SA (Bélgica)**. Resultado direto: o relatório CRS sai todos os anos da Bélgica e chega à autoridade fiscal do seu país de residência, independentemente do estado onde a LLC foi constituída.

### Quadro normativo

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>**: Common Reporting Standard.
- **UE**: Diretiva 2011/16/UE com a redação dada pela DAC2.
- **Bélgica**: lei de 16 de dezembro de 2015 sobre a troca automática de informação financeira (LIAFI) e respetivos decretos reais de aplicação.
- **Espanha enquanto destinatário**: Real Decreto 1021/2015, **Modelo 720** (a declaração espanhola de bens detidos no estrangeiro: contas, títulos, imóveis) e **Modelo 721** (o equivalente para criptoativos detidos fora de Espanha). Aprofundamos o lado recetor no nosso artigo sobre <a href="/pt/blog/crs-para-residentes-em-espanha-e-latam-implicacoes-reais">CRS para residentes em Espanha e na América Latina</a>.

### Que informação a Wise envia ao abrigo do CRS

A mesma informação que qualquer Reporting Financial Institution envia ao abrigo do CRS, nem mais nem menos:

| Bloco | Detalhe |
| --- | --- |
| Titular pessoa singular | Nome, morada, residência fiscal declarada, NIF/TIN, data e local de nascimento |
| Titular entidade | Denominação social, morada, EIN/TIN, classificação CRS (Active NFE, Passive NFE, Investment Entity) |
| Controlling persons | Se a entidade for Passive NFE: dados dos beneficiários efetivos (limiar de 25% direto ou indireto, ou qualquer outra forma de controlo efetivo) |
| Conta | Cada IBAN detido por divisa, mais o identificador interno Wise |
| Saldo | Saldo agregado a 31 de dezembro (a Wise gere pools por divisa; o relatório agrega tudo) |
| Rendimentos | Juros eventuais (Wise Interest, Wise Assets), dividendos brutos, produtos brutos de reembolso (tratados como rendimentos de conta de custódia, com o programa Assets em mente) |

Tanto o produto **Wise Interest** como os produtos de investimento da Wise sobre fundos do mercado monetário caem claramente no reporting de contas de custódia. O detalhe de rendimentos brutos acrescenta-se ao saldo de fecho, não o substitui.

### Como a Wise classifica a sua LLC ao abrigo do CRS

Quando abre uma conta Wise Business para a sua LLC, a Wise aplica due diligence CRS sobre a entidade. Pedem-lhe que preencha o formulário **CRS Self-Certification** e que confirme:

- A residência fiscal da LLC: Estados Unidos.
- A classificação: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
- As controlling persons (conjunto de dados completo: nome, morada, residência fiscal, NIF/TIN, data e local de nascimento).

Na prática, uma LLC unipessoal de serviços costuma cumprir o critério **Active NFE** (mais de 50% dos rendimentos são operacionais, não passivos). Mas a Wise joga conservadora: se a documentação for fraca ou se a atividade não puder ser comprovada de forma sólida, classifica a LLC como **Passive NFE** e reporta diretamente a controlling person.

A conclusão que não se contorna: ainda que a LLC seja norte-americana e que os EUA nunca tenham aderido ao CRS, **os dados sobre quem é o proprietário e quanto está depositado chegam à sua autoridade fiscal** a partir da Bélgica.

### Quando e como o reporting acontece de facto

- Fotografia de fim de exercício: 31 de dezembro.
- A Wise envia o relatório CRS à autoridade belga normalmente entre março e junho do ano seguinte.
- A Bélgica reencaminha os dados às autoridades fiscais do país de residência de cada titular e cada controlling person, geralmente até 30 de setembro.
- A sua autoridade fiscal passa a ter os dados e cruza-os com as suas declarações (em Portugal, IRS, Modelo 3 e Anexo J relativamente a contas no estrangeiro; em Espanha, IRPF mais Modelo 720, mais Modelo 721 se também detiver criptoativos no estrangeiro).

O saldo Wise que tinha a 31/12/2025 é, portanto, cruzado com a declaração anual de rendimentos que entrega no ano seguinte e com o Modelo 720, no caso espanhol. Dois formulários diferentes, uma única reconciliação.

## Os erros mais frequentes com a Wise e a fiscalidade

1. **«A Wise é só uma passagem, ninguém vê nada.»** Falso. A Wise é uma instituição financeira regulada e está plenamente sujeita ao CRS, exatamente como qualquer banco tradicional.
2. **«Se puser a LLC, o meu nome não aparece.»** Falso para qualquer Passive NFE: as controlling persons são reportadas nominalmente. E a maioria das LLC unipessoais acaba classificada como Passive NFE simplesmente por prudência bancária.
3. **«O meu saldo médio era pequeno, por isso não vou ser reportado.»** A Wise reporta o saldo de fecho a 31 de dezembro, independentemente das oscilações ao longo do ano. O CRS não tem qualquer limiar mínimo para contas pré-existentes desde 2017, nem para contas novas.
4. **«Não pus a Wise no Modelo 720 porque era pequena.»** O limiar do Modelo 720 é a soma de todas as suas contas estrangeiras, não um limite por conta. Se Wise + Mercury + Revolut + N26 ultrapassarem em conjunto 50.000 €, todas têm de ser declaradas.
5. **«Só uso a Wise para câmbio, não para custódia.»** Mesmo que use a Wise apenas como conta operacional de depósito, continua a ser uma conta financeira reportável. A distinção depósito/custódia altera o bloco de detalhe de rendimentos, não o relatório do saldo em si.

### Como a Wise se compara com a Revolut e a Mercury

| Aspeto | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
| --- | --- | --- | --- |
| Sujeita a CRS | Sim | Sim | Não |
| Reporta beneficiário efetivo da LLC | Sim (Passive NFE típica) | Sim (Passive NFE típica) | Não |
| Produto de investimento nativo | Wise Assets, Wise Interest | Stocks, Vault | Treasury, FDIC sweep |
| Multi-divisas nativo | Excelente | Excelente | Sobretudo USD |
| Adequação como conta principal da LLC | Secundária | Secundária | Principal |

Comparação alargada em <a href="/pt/blog/wise-business-com-sua-llc-o-guia-completo-de-gestao-multi">o guia completo da Wise Business para a sua LLC</a>, em <a href="/pt/blog/revolut-business-e-crs-o-que-e-reportado-a-sua-autoridade">o nosso artigo dedicado à Revolut e ao CRS</a> e, especificamente para o IBAN belga, em <a href="/pt/blog/wise-iban-e-llc-o-que-realmente-e-reportado-as-autoridades">o que o IBAN da Wise associado à sua LLC reporta à autoridade fiscal</a>.

### Como planear isto corretamente

1. **Acerte na auto-certificação desde o primeiro dia.** Seja preciso sobre a classificação CRS da LLC e sobre quem são as controlling persons. Mentir ou omitir é uma infração e, em alguns ordenamentos, crime.
2. **Use a Wise como conta operacional secundária**, não como conta principal da LLC, se quiser minimizar a pegada CRS para o seu país. A Mercury continua a ser a conta principal natural de uma LLC norte-americana.
3. **Mantenha coerência documental.** A sua auto-certificação CRS na Wise, o seu Modelo 720 (Espanha) ou equivalente latino-americano e a sua declaração de IRS têm de contar a mesma história.
4. **Planeie o saldo de fecho.** Se sabe que vai chegar a 31/12 com saldo elevado, planeie para que esteja devidamente declarado e justificado (origem dos fundos, finalidade operacional, impostos já pagos).
5. **Olhe para o quadro completo**: <a href="/pt/blog/desenho-de-uma-estrutura-fiscal-internacional-solida-quadro">o desenho global da sua estrutura</a> é o que determina se Wise + LLC + sua residência aguenta ou rebenta.

### Em resumo

A Wise Business não é um atalho para evitar reporting fiscal. É uma fintech regulada de excelência que reporta via CRS a partir da Bélgica para a sua autoridade fiscal. Bem integrada numa estrutura coerente com a sua LLC norte-americana, é muito útil. Mal integrada, ou usada com auto-certificações que não batem certo com a realidade, transforma-se na fonte mais comum dos problemas fiscais que costumamos receber em consultoria.

## Compliance fiscal em Portugal e no Brasil: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal em Portugal (art. 16.º do CIRS) ou no Brasil (art. 12 da Lei 9.250/95), a sua administração tributária mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Em Portugal e no Brasil

- **Portugal (CIRS, CIRC, RGIT).** Uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa) é tratada pela AT como entidade fiscalmente transparente: os rendimentos imputam-se ao sócio no exercício em que se geram, como Categoria B (independentes), com possibilidade de regime simplificado ou contabilidade organizada consoante o volume. Se a LLC optar por tributar como *corporation* através do Form 5472 conjugado com **Form 8832** (o formulário de eleição da IRS) e ficar controlada por residente português com rendimentos maioritariamente passivos numa jurisdição com regime fiscal claramente mais favorável (lista da Portaria 150/2004 atualizada), aplica-se o **art. 66.º do CIRC** (imputação de lucros de sociedades residentes em paraíso fiscal). Os EUA não constam da lista negra, mas determinados Estados (Delaware, Wyoming, Nevada) podem ser considerados se cumprirem os critérios de baixa tributação efetiva.
- **Declarações informativas em Portugal.** Contas bancárias nos EUA e contas IBAN europeias em seu nome (Wise, Revolut, N26, Wallester): **Anexo J** da declaração Modelo 3 do IRS, sem limiar mínimo. **Modelo 58** ao Banco de Portugal para operações com o exterior superiores aos limiares vigentes. Para a participação na LLC: ficha **Bens e Direitos** com identificação da entidade estrangeira. Criptoativos custodiados nos EUA: declaração no Anexo J em conformidade com o regime de criptoativos do CIRS.
- **CDT Portugal–EUA (1994, Protocolo de 2000).** A convenção regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Portugal não constitui por si só EE do sócio, mas a **direção efetiva** (art. 5.º da CDT) pode criá-lo se toda a gestão for feita a partir do território português.
- **Brasil (Lei 12.973/2014, IN RFB 1.520/2014).** O regime brasileiro de **tributação de lucros no exterior (TBU)** tributa anualmente os lucros da controlada estrangeira, independentemente da distribuição, conforme a Lei 12.973/2014. A pessoa física residente fiscal no Brasil titular de LLC tem obrigação de declarar a participação na **Ficha Bens e Direitos** da DIRPF, os rendimentos auferidos na **Ficha de Rendimentos Recebidos do Exterior** com aplicação do **carnê-leão mensal** sobre o ganho, e a **DCBE** ao BACEN se a posição agregada superar USD 1.000.000.
- **Angola, Moçambique e países lusófonos.** Cada jurisdição tem o seu próprio quadro: Angola e Moçambique têm regimes mais embrionários de transparência internacional, com obrigação principal de declarar contas no exterior superiores a determinados limiares cambiais. Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.

Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.

Antes de avançar, põe números ao teu caso: a <a href="/pt#calculadora">calculadora Exentax</a> compara, em menos de 2 minutos, a tua carga fiscal atual com a que terias com uma LLC americana corretamente declarada no teu país de residência.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

Na Exentax montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:cta-mid -->
**Parece complicado?** <a href="/pt/servicos">Os nossos serviços</a> já cobrem «Wise Business e CRS: o que é reportado à sua autoridade fiscal e como integrá-la na sua estrutura», apresentado dentro do prazo, sem nada para si fazer.

<!-- exentax:cta-final -->
**Conte-nos a sua situação e dizemos por onde começar.** Reserve uma chamada de 30 minutos sobre «Wise Business e CRS: o que é reportado à sua autoridade fiscal e como integrá-la na sua estrutura» e revemos a fundo.

<!-- exentax:legal-refs-v1 --><!-- exentax:execution-v2 -->
## Wise Business e CRS: como reporta à sua autoridade fiscal e porquê declarar sempre

A Wise Business é operativamente excelente para a sua LLC — multi-divisas, FX barato, IBANs locais em várias jurisdições — e, do ponto de vista do reporting fiscal, é uma instituição financeira plenamente sujeita ao CRS. Se for residente fiscal em Portugal, Espanha, França, Itália, Alemanha ou em qualquer outro país CRS, a sua autoridade fiscal recebe a informação todos os anos. Vale a pena saber exatamente o que chega e como é cruzado.

- **Estatuto regulatório da Wise Business.** A Wise opera com várias licenças: Wise Payments Limited (UK FCA), Wise Europe SA (Bélgica NBB), Wise USD Inc. (US <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>), entre outras. Cada entidade regional reporta segundo o regime da sua jurisdição. Para utilizadores europeus de Wise Business, o reporting CRS é feito pela Wise Europe SA ao Banco Nacional da Bélgica, que partilha com o resto das jurisdições CRS — incluindo o país de residência do beneficiário efetivo.
- **Dados exatos transmitidos.** Identificação do beneficiário efetivo segundo o KYC (nome completo, identificação ou passaporte, morada, residência fiscal declarada no onboarding), saldo a 31 de dezembro por divisa (Wise multi-divisas reporta cada saldo USD, EUR e GBP em separado), total de movimentos brutos anuais e identificadores de conta (IBAN belga BE para EUR, routing number USD para USD, etc.). NÃO são transmitidas transações individuais; agregados, sim.
- **Cruzamento automático com o seu IRS ou IRC.** Em Portugal, a AT liga os dados do CRS ao seu NIF para cruzar com: (1) Anexo J (rendimentos obtidos no estrangeiro) e Anexo Q quando aplicável; (2) Modelo 30 e obrigações conexas para entidades; (3) IRS na atribuição de rendimentos da LLC. Em Espanha, ligação ao DNI para cruzar com Modelo 720, 721 e IRPF. Discrepância = alerta automático. Cadeia típica: pedido de informação seguido de procedimento de verificação caso não responda com documentação.
- **O que muda quando a sua LLC adiciona a Wise Business.** Wise Business EUR (conta belga) reporta mais rápido e de forma mais completa do que Wise USD (conta sob sub-licença norte-americana). Se tiver as duas (Wise multi-divisas), as duas reportam, mas por canais diferentes (Bélgica → CRS, EUA → FATCA-IGA). Consequência prática: a visibilidade fiscal é a mesma, só muda a latência.

### O que mais nos perguntam

**Se eu abrir Wise Business como LLC, reporta aos EUA ou ao meu país?** Reporta à residência fiscal do beneficiário efetivo — a pessoa singular por trás da entidade. Se disse «Portugal» no KYC, a informação vai para Portugal via CRS. A LLC é tratada como transparente para identificar o beneficiário efetivo; o CRS olha para a pessoa por trás.

**Posso declarar a LLC na residência sem declarar especificamente a Wise?** Não. A LLC é uma obrigação (atribuição de rendimentos ou tratamento como dividendo, conforme o país). A Wise é a conta bancária da LLC e tem de ser declarada no formulário correspondente (Anexo J em Portugal, Modelo 720 em Espanha, formulário 3916 em França, RW em Itália). Duas obrigações distintas, dois cruzamentos automáticos.

Na Exentax estruturamos as contas Wise + Mercury + Stripe tendo em conta desde o primeiro dia o que CRS e FATCA reportam, e planeamos as declarações locais (720, 721, Anexo J, 3916, RW) — para que o cruzamento automático não gere nenhum pedido de informação nem sanção por imputação.
<!-- /exentax:execution-v2 -->

## Referências: fontes e quadro bancário

A operação bancária descrita acima apoia-se em documentação pública e nas políticas em vigor de cada plataforma:

- **Bank Secrecy Act e FinCEN.** 31 U.S.C. §5318 (programas KYC/AML obrigatórios para instituições financeiras), 31 CFR Part 1010 (CIP, identificação do cliente) e 31 U.S.C. §5336 com a Reporting Rule do FinCEN em vigor desde 1 de janeiro de 2024 (Beneficial Ownership Information Report).
- **FATCA e CRS.** IRC §1471–1474 (FATCA e formulários W-8/W-9), Acordos Intergovernamentais Modelo 1 assinados pelos EUA com Espanha e vários países latino-americanos, e o Common Reporting Standard (CRS) da OCDE — em que os EUA não participam, mas que se aplica plenamente a fintechs com licença europeia (Wise Europe SA na Bélgica, Revolut Bank UAB na Lituânia).
- **Plataformas específicas.** Termos de serviço, política de privacidade e FAQ regulatória publicadas da Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB nos EUA; Wise Europe SA na UE; Wise Payments Ltd. no Reino Unido), Revolut Business e Payoneer.

Para fins informativos; cada caso bancário exige análise específica de KYC, jurisdição de residência e volume operado.

<!-- exentax:cross-refs-v1 -->
### Leituras complementares

- [Visa e Mastercard: o que as autoridades fiscais veem realmente dos seus gastos com cartão](/pt/blog/visa-mastercard-reporting-o-que-as-autoridades-fiscais-veem)
<!-- /exentax:cross-refs-v1 -->

Quer aplicar este protocolo ao seu caso? <a href="/pt/agendar">Agende uma sessão com a equipa Exentax</a> e revemos a sua LLC com números reais em trinta minutos, sem compromisso.

<!-- exentax:defensa-fiscal-v1 -->
## E se as Finanças me perguntarem pela minha LLC?

  É a pergunta mais frequente na primeira consulta, e a resposta curta é: a tua LLC não é opaca e, corretamente declarada, uma inspeção fecha-se em formulários standard. As Finanças portuguesas, a Receita Federal brasileira ou a SEFAZ estadual podem pedir o Certificate of Formation do estado (Wyoming, Delaware ou Novo México), o EIN emitido pelo <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o Operating Agreement assinado, os extratos da Mercury ou Wise do exercício, o Form 5472 com 1120 pro-forma apresentado e a contabilidade que reconcilia receitas, despesas e movimentos. Se tudo isso existir e for entregue ordenado, a inspeção não escala. Tranquilo: na Exentax isto é a nossa rotina semanal, fechamos antes de a carta chegar à tua caixa de correio.

  O que as autoridades fiscais perseguem com razão são os testas-de-ferro, a residência fiscal de papel e a não declaração de contas estrangeiras. Uma LLC bem montada é exatamente o contrário: tu apareces como **beneficial owner** no BOI Report quando aplicável (verificável em <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tu assinas as contas bancárias e declaras o rendimento onde efetivamente vives. A estrutura está registada no Secretary of State do estado, nos ficheiros do IRS e, sempre que envolve um banco europeu, dentro do perímetro CRS do padrão da <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  O erro que descarrila mesmo uma inspeção não é ter uma LLC; é não ter atribuído o rendimento corretamente no IRS pessoal (Anexo J do Modelo 3 em Portugal, Carnê-Leão Web e DAA no Brasil), não ter declarado as contas no estrangeiro (Modelo 58 ao Banco de Portugal a partir de 1 milhão €, DCBE ao Bacen a partir de 1 milhão USD) ou não ter documentado as operações entre o sócio e a LLC. Esses três frentes fecham-se antes do pedido, não depois. E se chegar uma notificação, na Exentax mantemos o dossiê pronto para responderes em horas, não em semanas.

  ## O que uma LLC NÃO faz

  - **Não te isenta de tributar no teu país de residência.** Se vives em Portugal ou no Brasil, tributas aí o rendimento mundial. A LLC organiza o lado americano (zero imposto federal na SMLLC pass-through sem ECI); não desliga a tributação doméstica. O IRS é calculado sobre o lucro atribuído, não sobre as distribuições efetivamente recebidas.
  - **Não é um veículo offshore nem um esquema BEPS.** É uma entidade americana reconhecida pelo IRS, registada num estado concreto com morada física, agente registado e obrigações informativas anuais. Jurisdições offshore clássicas (BVI, Belize, Seychelles) não deixam rasto público; uma LLC deixa em cinco sítios.
  - **Não te protege se houver confusão patrimonial.** O *pierce the corporate veil* aciona-se assim que um juiz vê a LLC e o sócio funcionarem como a mesma carteira: contas misturadas, despesas pessoais pagas pela LLC, sem Operating Agreement, sem contabilidade. Três movimentos suspeitos bastam. Ver também jurisprudência comparada espanhola publicada no <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> sobre abuso de direito.
  - **Não te poupa contribuições para a Segurança Social.** Recibos verdes em Portugal, MEI ou autônomo no Brasil: a quota mensal continua a ser a mesma. A LLC opera a atividade face a clientes internacionais; a contribuição pessoal é independente.
  - **Não te dispensa de declarar as contas estrangeiras.** Portugal: Anexo J do Modelo 3 IRS + Modelo 58 ao BdP. Brasil: DCBE ao Bacen + e-Financeira via instituição financeira. Essas obrigações são da pessoa, não da LLC.

  Na Exentax fechamos estas cinco frentes todos os anos em paralelo com o calendário federal americano (Form 5472, 1120 pro-forma, FBAR, Annual Report estadual, BOI Report quando aplicável). O objetivo é que nenhuma inspeção encontre uma ponta solta e que a estrutura aguente uma revisão retroativa a 5-7 anos.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Quer falar agora? Escreva-nos pelo <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22wise%20business%20crs%20reporting%20fiscal%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferir falar diretamente, <a href="/pt/agendar">marque uma sessão gratuita</a> e analisamos o seu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
