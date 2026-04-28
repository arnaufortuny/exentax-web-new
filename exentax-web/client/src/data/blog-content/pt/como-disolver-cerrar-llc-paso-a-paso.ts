export default `

Encerrar bem uma LLC é tão importante como abri-la. A maioria dos conteúdos sobre LLCs fala de constituição, escolha de estado, abertura no Mercury ou Wise Business... mas quase ninguém explica como se **encerra** correctamente. E uma LLC mal dissolvida continua a gerar obrigações, sanções, comissões e, no pior dos casos, uma sombra fiscal nos EUA que pode persegui-lo durante anos.

Este guia conta o processo real e completo para **dissolver e encerrar a sua LLC americana**: quando faz sentido, como ordenar o encerramento estado a estado, que declarações finais espera o <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, o que acontece com o seu EIN, o que se faz com o BOI Report, como cancelar as contas bancárias e por que existe uma ordem estrita que não se deve alterar. Se já não opera com a sua LLC e quer esquecê-la sem surpresas a três anos, este é o caminho.

## Por que encerrar formalmente uma LLC em vez de "deixá-la morrer"

A fantasia clássica de quem se cansou da sua LLC: *"se não a uso, deixo-a, as obrigações extinguem-se sozinhas"*. Não é assim. Uma LLC, enquanto **activa ou em estado "delinquent"** no registo estatal, continua a gerar:

- **Annual report fees** estatais (50 a 800 USD consoante o estado).
- **Franchise tax** no Delaware (300 USD/ano) e Califórnia (800 USD/ano), entre outros.
- **Registered Agent fees** anuais (50-150 USD/ano).
- **Form 5472 + 1120 pro forma** perante o IRS se a LLC tiver proprietário estrangeiro único, com a **sanção de 25 000 USD por formulário não apresentado** (Internal Revenue Code §6038A(d)).
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>)** se a sua LLC continuar abrangida pela norma em vigor.
- Eventuais comissões de contas em Mercury, Wise Business, Relay ou Slash.

Se a LLC passa a *delinquent* ou *administratively dissolved* por incumprimento do annual report, isso **não o isenta** das obrigações IRS nem das sanções já vencidas. Apenas complica a vida quando finalmente tentar encerrar bem ou, pior, quando quiser montar outra LLC anos depois e descobrir que figura como proprietário de uma entidade com sanções acumuladas. A melhor estratégia, de longe, é um **encerramento formal e limpo** na ordem correcta.
### Antes de começar: só se encerra quando há clareza

Nem toda a "vontade de encerrar" é vontade real. Antes de iniciar, verifique se faz mais sentido do que as alternativas:

- **Pausar operações temporariamente**, manter a LLC viva mas com zero actividade, apresentando 5472 + 1120 a zeros e BOI report se aplicável. Faz sentido se prevê voltar a usá-la em menos de dois anos.
- **Mudar estrutura** (single-member para multi-member, ou constituir nova entidade e transferir contratos) se o que muda é o modelo de negócio, não a vontade.
- **Mudar de estado** via *domestication* ou *conversion* se o que pesa são taxas ou reporting do estado actual.

Se ainda assim quer encerrar, este é o procedimento. Cada caso é individual, reveja com um consultor antes de executar.
### Visão geral: a ordem importa

O encerramento de uma LLC compõe-se de **sete blocos** nesta ordem. Saltar um ou inverter ordem produz custos desnecessários ou janelas em que a LLC continua a gerar obrigações sem que esteja já a geri-la:

1. Decisão formal de dissolver (interna).
2. Liquidação operacional (clientes, contratos, dívidas, activos).
3. Encerramento de contas bancárias e gateways de pagamento.
4. Apresentação de declarações finais perante o IRS (Form 1120 + 5472 marcados *Final return*).
5. Dissolução estatal (Articles of Dissolution ou Certificate of Cancellation).
6. Encerramento do EIN perante o IRS e baixa do BOI Report perante FinCEN se aplicável.
7. Cancelamento do Registered Agent e ficheiro documental pessoal.

Em detalhe:
## Pontos-chave

### 1. Decisão interna e Operating Agreement

Mesmo *single-member*, a decisão formal de dissolver tem de ser documentada. Um operating agreement bem redigido exige-o:

- **Resolution to dissolve**: documento interno onde o membro único decide dissolver a LLC, com data efectiva.
- Em *multi-member*, voto segundo a percentagem exigida pelo operating agreement (habitualmente unanimidade ou maioria qualificada).

Não se apresenta perante IRS nem estado, mas é a prova interna de que a decisão existe e o encerramento corre de boa-fé. Se mais tarde lhe perguntarem quando deixou de operar, é esta a data válida.
### 2. Liquidação operacional: clientes, dívidas e activos

Antes de tocar no IRS ou no estado, **esvaziar a LLC**:

- **Encerramento de contratos com clientes e fornecedores.** Notificar a cessação. Emitir as últimas facturas. Cobrar pendentes.
- **Cancelar subscrições** (Stripe, PayPal, ferramentas SaaS, domínios facturados à LLC, alojamento).
- **Pagar dívidas pendentes** (impostos estatais, Registered Agent, facturas, royalties, comissões).
- **Distribuir os activos restantes ao membro** (transferir o cash residual da conta da LLC para a conta pessoal). Numa single-member tributada como disregarded entity, isto não é evento fiscal para o IRS, **mas tem de ser documentado** como retirada do membro.
- **Conservar a contabilidade** (facturas emitidas e recebidas, extractos bancários, comprovativos) durante pelo menos **sete anos**. Horizonte razoável para auditorias, juros e eventuais pedidos.

Com a LLC vazia e sem contratos vivos, passamos ao encerramento bancário.
### 3. Encerrar contas bancárias e gateways de pagamento

O encerramento bancário é o ponto mais sujeito a erros. Regra prática:

- **Mover todo o cash para uma conta pessoal do membro** antes de pedir o encerramento.
- **Solicitar o encerramento por escrito** desde o painel do banco/fintech. Mercury, Wise Business, Relay e Slash têm fluxos online. Wallester gere via suporte.
- **Aguardar o encerramento confirmado** antes de apresentar a dissolução estatal. Se a banca descobrir uma entidade já legalmente extinta, costuma bloquear movimentos pendentes.
- **Descarregar todos os extractos** (pelo menos sete anos) antes do encerramento. Depois fica impossível ou caro recuperá-los.
- **Cancelar Stripe, PayPal e gateways** ligados à LLC e exportar histórico.

> Se a sua arquitetura actual é Wise Business + Relay + Slash com Mercury de apoio, é exactamente a ordem inversa de encerramento: primeiro gateways, depois fintechs secundárias, e por fim a conta principal por onde passa o último cash. Wallester com IBAN europeu costuma ser dos últimos a fechar e deve rever-se à luz das suas obrigações CRS em Espanha.
### 4. Declarações finais perante o IRS

É aqui que muitos encerramentos partem. Antes de morrer, a LLC tem de apresentar a sua **última época IRS**, marcando os formulários como **Final return**:

- **Form 1120 + Form 5472 (Final)** se single-member com proprietário estrangeiro. A casa *"Final return"* do Form 1120 marcada e a informação reportável do Form 5472 com a **distribuição final** de cash ao membro.
- **Form 1065 (Final)** se multi-member tributada como partnership.
- **Form 1120 ou 1120-S (Final)** se elegeu C-corp ou S-corp.
- **Form 966 (Corporate Dissolution or Liquidation)** dentro dos **30 dias** seguintes à resolução de dissolução, se a LLC tributava como corporação.
- **Form 941 / 940 final** se tinha empregados.
- Qualquer formulário informativo pendente (1099, W-2, 8804/8805 se aplicável).

Data-chave: apresentar as declarações finais **antes** de pedir o encerramento do EIN. Caso contrário, o IRS não fecha o EIN e pode gerar notice de non-filer no ano seguinte.

Se arrasta anos com a LLC e acumulou atrasos no 5472, **regularize antes de encerrar**, não use o encerramento para tapar. Detalhe no <a href="/pt/blog/o-que-acontece-se-nao-apresentar-o-form-5472-multas-irs-e">guia de sanções do Form 5472</a>. Encerrar uma LLC com 5472 pendentes não extingue as sanções vencidas; apenas as congela e o IRS mantém-nas contra si como pessoa singular associada ao EIN.
### 5. Dissolução estatal: Articles of Dissolution ou Certificate of Cancellation

Com cash distribuído, contas encerradas e declarações finais apresentadas, segue-se o **encerramento estatal**. O nome do documento depende do estado:

- **Wyoming**: *Articles of Dissolution* perante o Wyoming Secretary of State. Antes, **annual report** e **license tax** em dia. Custo habitual: 60 USD.
- **Novo México**: *Articles of Dissolution* perante a New Mexico Secretary of State. Custo habitual: 25 USD.
- **Delaware**: *Certificate of Cancellation* perante a Delaware Division of Corporations. Pagar **franchise tax pendente e a do ano de encerramento** antes de cancelar. Cancelamento: 200 USD; franchise tax (300 USD/ano) acrescenta.
- **Florida**: *Articles of Dissolution* perante a Florida Division of Corporations.
- **Califórnia**: havendo nexus, pagar a **franchise tax mínima de 800 USD do ano do encerramento** mais Form 568 final.
- **Outros estados**: cada um com formulário e taxas próprias; lógica idêntica.

Detalhe importante: se a sua LLC está **registada como foreign LLC noutros estados** (por *foreign qualification* para vender em CA, TX, NY, etc.), antes de encerrar no estado *home* tem de **cancelar cada foreign registration**. Caso contrário, esses estados continuarão a cobrar annual reports e franchise taxes.
### 6. Encerramento do EIN e baixa do BOI Report

Uma vez extinta legalmente a LLC (estado dissolvido + declarações finais), o último passo IRS é **encerrar o EIN**. O IRS não "elimina" um EIN: marca-o como inactivo. Para isso, **carta assinada ao Internal Revenue Service** identificando a entidade por nome legal, EIN, morada e motivo, juntando cópia da *Notice CP-575* original ou, em alternativa, os dados de atribuição.

Em paralelo, rever o **BOI Report perante FinCEN**. A normativa BOI vigente, **após a interim final rule do FinCEN de março de 2025**, exige reports apenas a **foreign reporting companies** (entidades constituídas fora dos EUA e registadas num estado). Se a LLC se constituiu nos EUA está hoje fora dessa obrigação. Se entra no âmbito e se dissolve, actualizar o report dentro dos prazos FinCEN. **Verifica a regra em FinCEN.gov à data exacta do encerramento.**

Eventuais ITINs próprios ou de sócios associados à LLC não se "encerram" com a LLC: continuam válidos para a sua actividade pessoal nos EUA enquanto forem usados periodicamente (ver <a href="/pt/blog/como-obter-um-itin-numero-fiscal-irs">guia do ITIN</a>).
### 7. Registered Agent, domínios e ficheiro pessoal

Para fechar o ciclo:

- **Cancelar o Registered Agent**: notificar por escrito, pedir confirmação. Evita factura surpresa por renovação automática no ano seguinte.
- **Cancelar domínios e serviços** facturados em nome da LLC.
- **Arquivar a documentação final** em local seguro: operating agreement original, articles of organization, articles of dissolution selados, EIN confirmation, cópias das declarações finais (1120, 5472, 1065, 966), extractos bancários, contratos encerrados. Mínimo sete anos.

A LLC fica clinicamente encerrada.
### Erros típicos que vemos ao encerrar uma LLC

Na Exentax já vimos dezenas de encerramentos executados ao contrário. Os seis mais caros:

1. **Encerrar o banco antes de apresentar o 5472 final.** Documentar a última distribuição passa a ser difícil.
2. **Pedir a dissolução estatal sem pagar a franchise tax pendente** (Delaware e Califórnia são os mais estritos).
3. **Esquecer de cancelar foreign qualifications** noutros estados.
4. **Não marcar Final return no 1120 / 1065.** O IRS continua à espera da declaração no ano seguinte.
5. **Não actualizar o BOI Report** quando a norma o exige.
6. **Não conservar extractos bancários** descarregados antes do encerramento.

Cada um destes erros traduz-se em facturas, sanções ou pedidos meses ou anos depois.
## Como o fazemos na Exentax

O nosso processo de **encerramento de LLC chave na mão** segue exactamente os sete passos deste guia. Dá-nos o contexto (estado, ano de constituição, situação bancária, declarações apresentadas, eventuais atrasos), desenhamos a ordem do encerramento, executamos as declarações finais, coordenamos com o Registered Agent e os bancos, apresentamos a dissolução estatal, encerramos o EIN e, se aplicável, actualizamos o BOI Report. Se arrasta 5472 atrasados, **fase prévia** de regularização para não levar exposição connosco.

Se quer encerrar a sua LLC com segurança, peça uma consulta gratuita: revemos a sua situação, dizemos honestamente se faz mais sentido encerrar ou pausar, e se avançarmos entregamos plano com datas e orçamento fechado. Se ao contrário pensa que a LLC continua a fazer sentido mas quer baixar custos e obrigações, experimente antes a nossa <strong>calculadora fiscal</strong> e compare a situação actual com o cenário de a manter activa com a arquitetura adequada: <a href="/pt/blog/wise-bancos-e-llc-a-stack-bancaria-completa-que-ninguem">Wise Business, Relay e Slash como contas operacionais, Mercury como apoio, e Wallester apenas quando aplicar IBAN europeu</a> com a respectiva análise CRS.
## Prazos realistas e custos do encerramento

Muitos clientes subestimam o tempo necessário para encerrar uma LLC bem feita. Da decisão interna até à dissolução efectiva no estado passam, conforme estado e banco, entre oito e dezasseis semanas. O Wyoming confirma a dissolução em duas a três semanas após cancelar Annual Report e Registered Agent. Delaware é mais lento porque a franchise tax acumula até ao próprio dia da dissolução e a Division of Corporations só emite o Certificate of Cancellation depois de quitar todos os montantes pendentes. Novo México e Florida ficam no meio.

Nas declarações ao IRS o timing é decisivo: o **Final 1120 + 5472** apresenta-se no ano fiscal em que a LLC teve a sua última actividade. Não o adie para o ano seguinte na esperança de poupar, surgem multas automáticas por não apresentação. Se a distribuição ao sócio estrangeiro ocorrer num ano fiscal diferente do da dissolução, são necessários dois 5472 finais: um pela distribuição e outro como relatório formal de encerramento.

Os custos principais de um encerramento são: franchise tax pendente e taxas de dissolução estatal (entre 50 e 250 USD conforme estado), declaração final 1120 + 5472 (se a delegar num especialista, entre 600 e 1.200 USD aproximadamente), actualização do BOI Report quando aplicável, e a carta de confirmação de encerramento do EIN. No total, encerrar uma LLC activa que esteja em dia ronda os 1.000 a 2.000 USD com acompanhamento profissional incluído. Encerramentos com atrasos custam mais, porque exigem regularização prévia.

A tentação de simplesmente deixar a LLC inactiva sem dissolver é compreensível, mas perigosa. Uma LLC **administrativamente dissolvida** (cancelada à força pelo estado por falta de pagamento) não desaparece para o IRS: o Form 5472 continua devido todos os anos enquanto o EIN estiver activo e existirem ou tenham existido transacções com partes relacionadas estrangeiras, e as multas de 25.000 USD continuam a acumular em segundo plano. Encerrar bem é, por isso, o seguro contra essa acumulação silenciosa.

Encerrar bem uma LLC é um acto de higiene fiscal: arruma o passado e liberta o futuro. Vale a pena fazê-lo na ordem certa e com quem o fez centenas de vezes.
## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos

Uma LLC americana é uma ferramenta legal e reconhecida internacionalmente. Mas o cumprimento não termina ao constituí-la: como proprietário residente fiscal noutro país, a sua administração tributária local mantém o direito de tributar o que a LLC gera. O importante é saber **sob que regime**.

### Por jurisdição

- **Espanha (LIRPF/LIS).** Se a LLC for uma *Single-Member Disregarded Entity* operacional (serviços reais, sem passividade significativa), o fisco trata-a normalmente por **atribuição de rendimentos (art. 87 LIRPF)**: os lucros líquidos são imputados ao sócio no exercício em que se geram e integram-se na base geral do IRPF. Se a LLC optar por tributar como *corporation* (Form 8832) e ficar controlada por residente espanhol com rendimentos maioritariamente passivos, pode ativar-se a **transparência fiscal internacional (art. 91 LIRPF para pessoas singulares, art. 100 LIS para sociedades)**. A diferença não é opcional: depende da substância económica, não do nome.
- **Declarações informativas.** Contas bancárias nos EUA com saldo médio ou final >50.000 € no exercício: **Modelo 720** (Lei 5/2022 após o acórdão TJUE C-788/19, 27/01/2022, sanções agora no regime geral LGT). Operações vinculadas com a LLC e dividendos repatriados: **Modelo 232**. Criptoativos custodiados nos EUA: **Modelo 721**.
- **CDT Espanha–EUA.** A convenção (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo em vigor 27/11/2019) regula a dupla tributação sobre dividendos, juros e royalties. Uma LLC sem estabelecimento estável em Espanha não constitui por si só EE do sócio, mas a direção efetiva pode criá-lo se toda a gestão for feita a partir de território espanhol.
- **México, Colômbia, Argentina e outros LATAM.** Cada jurisdição tem o seu próprio regime CFC (México: Refipres; Argentina: rendimentos passivos do exterior; Chile: art. 41 G LIR). Princípio comum: o que a LLC retém como lucro considera-se recebido pelo sócio se a entidade for considerada transparente ou controlada.
Regra prática: uma LLC operacional, com substância, declarada corretamente na residência, é **planeamento fiscal legítimo**. Uma LLC usada para ocultar rendimentos, simular não residência ou deslocar rendimentos passivos sem justificação económica entra no campo do **art. 15 LGT (abuso de direito)** ou, no pior cenário, do **art. 16 LGT (simulação)**. Os factos decidem, não o papel.

<!-- exentax:lote30-native-v1:como-disolver-cerrar-llc-paso-a-paso-pt -->
## Como ler o encerramento da LLC como uma sequência documentada em vez de um fim súbito

O encerramento da LLC lê-se de forma mais útil como uma sequência documentada — declarações finais, dissolução junto do Estado, arquivamento dos registos — em vez de um fim súbito. A sequência não muda com a dimensão da LLC, e uma nota curta e datada no ficheiro da LLC que registe cada passo com a sua referência de confirmação torna o encerramento defensável em poucos minutos numa conversa posterior com um consultor ou numa interação com uma administração.
<!-- /exentax:lote30-native-v1:como-disolver-cerrar-llc-paso-a-paso-pt -->

<!-- exentax:lote30-native-v1-bis:como-disolver-cerrar-llc-paso-a-paso-pt -->
## Porque a nota se organiza por passo da sequência e não pela data de encerramento

A nota organiza-se por passo da sequência — declarações finais, dissolução, arquivamento — e não pela data de encerramento, porque a sequência mantém-se igual independentemente do calendário escolhido, e esta visão torna cada passo verificável de forma independente.

Uma nota curta e datada por passo no ficheiro da LLC chega para reconstruir o processo de encerramento em poucos minutos, sem depender da memória.
<!-- /exentax:lote30-native-v1-bis:como-disolver-cerrar-llc-paso-a-paso-pt -->

Antes de avançar, põe números ao teu caso: a <a href="/pt#calculadora">calculadora Exentax</a> compara, em menos de 2 minutos, a tua carga fiscal atual com a que terias com uma LLC americana corretamente declarada no teu país de residência.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

Na Exentax, montamos a estrutura para encaixar no primeiro cenário e documentamos cada passo para que a sua declaração local seja defensável perante uma eventual revisão.

<!-- exentax:legal-refs-v1 -->
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a FinCEN).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** BOE de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).

A aplicação concreta de qualquer destas normas ao seu caso depende da sua residência fiscal, da atividade da LLC e da documentação que mantenha. Este conteúdo é informativo e não substitui aconselhamento profissional personalizado.

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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## A sequência exacta para fechar uma LLC sem deixar pontas soltas

Dissolver mal uma LLC custa mais do que constituí-la. Há três planos a fechar em simultâneo - estadual, federal e bancário - e a ordem importa. Esta é a sequência que aplicamos na Exentax quando um cliente decide fechar.

- **Passo 1 - Decisão documentada.** Acta de dissolução assinada pelos membros, com data clara e motivo. Se a LLC tem Operating Agreement, seguir o procedimento; senão, aplica-se a lei do estado. Sem acta nada mais fecha em condições.
- **Passo 2 - Articles of Dissolution ao estado.** Wyoming: 50 USD; New Mexico: 25 USD; Delaware: 200 USD mais franchise tax pendente. A dissolução produz efeito na data aprovada pelo Secretary of State, não antes. A partir daí a LLC entra em wind-up: pode liquidar mas não operar novo negócio.
- **Passo 3 - Liquidação operacional.** Cobrar facturas pendentes, pagar fornecedores, devolver depósitos, cancelar SaaS, fechar cartões, esvaziar Mercury/Wise dentro do wind-up. Fechar contas bancárias após o último pagamento, não antes - sem conta não há última cobrança.
- **Passo 4 - Final Form 5472 + 1120 pro forma.** Assinalar "Final Return" em ambos. Sem isto, o IRS continua a esperar 5472 todos os anos com multa de 25.000 USD por omissão. O erro mais caro e mais frequente.
- **Passo 5 - BOI Final Report.** O FinCEN exige relatório final de BOI à cessação da entidade, dentro de 30 dias após dissolução estadual. Sem isto, possíveis sanções civis.
- **Passo 6 - Cancelamento de EIN (opcional).** Carta ao IRS a pedir fecho da conta EIN. Não é estritamente obrigatório (EIN persiste mas fica inerte), mas recomendado para limpeza administrativa.

### O que mais nos perguntam

**Quanto demora fechar uma LLC?** Entre 6 e 14 semanas desde a decisão até o último trâmite. A dissolução estadual processa-se em 2-4 semanas; o 5472 final apresenta-se na próxima janela fiscal (15 de Abril em ano civil).

**E se levo anos sem apresentar o 5472 e quero fechar?** Há que regularizar primeiro os anos em atraso via voluntary disclosure. A dissolução sem regularização não extingue as multas - ficam a nome do responsible party. Tratamos com protocolo conjunto de regularização + encerramento.

Na Exentax fechamos LLCs todos os meses e entregamos o dossier completo (acta, articles, 5472 final, BOI final, encerramento EIN) assinado e arquivado para que o cliente possa demonstrar a dissolução limpa perante qualquer requerimento futuro.
<!-- /exentax:execution-v2 -->

## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram nos últimos anos; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.

Quer aplicar este protocolo ao seu caso? <a href="/pt/agendar">Agende uma sessão com a equipa Exentax</a> e revemos a sua LLC com números reais em trinta minutos, sem compromisso.


<!-- exentax:cross-refs-v1 -->
## Para continuar a leitura

- [Erros críticos se já tem uma LLC americana e ninguém te explicou isto](/pt/blog/erros-criticos-se-ja-tens-uma-llc-e-ninguem-tas-explicou)
- [Manutenção anual da LLC: obrigações que não pode ignorar](/pt/blog/manutencao-anual-da-llc-obrigacoes-que-nao-pode-ignorar)
- [Mudar fornecedor de manutenção da LLC sem perder histórico](/pt/blog/mudar-de-fornecedor-de-manutencao-da-llc-sem-perder)
<!-- /exentax:cross-refs-v1 -->

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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22como%20disolver%20cerrar%20llc%20paso%20a%20paso%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
