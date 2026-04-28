export default `Há dois formulários do <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> que geram mais confusão do que qualquer outro entre donos de LLC: o **Form 1120** e o **Form 5472**. A maioria das pessoas com LLC ouve-os nomeados juntos, não percebe bem o que é cada um e, sobretudo, **não sabe quando se aplicam exactamente ao seu caso**.

Este artigo não é mais um guia passo a passo. Se queres o procedimento de apresentação, já tens o nosso <a href="/pt/blog/form-5472-o-que-e-quem-deve-apresenta-lo-e-como-cumprir">guia operacional do Form 5472</a>. Aqui explicamos o que são **realmente** os dois formulários, como se relacionam, quando aplicam por perfil e que erros custam dinheiro.

## O que é realmente o Form 1120

O **Form 1120, U.S. Corporation Income Tax Return** é a declaração federal de imposto sobre sociedades das corporations americanas. No uso "normal", uma **C-Corporation** apresenta-o para liquidar o seu imposto (21 % federal atualmente, mais impostos estaduais).

Primeira nuance que quase ninguém te explica: o Form 1120 também se usa **vazio, como envelope**, para que certas LLCs cumpram obrigações de informação. É o chamado **1120 pro-forma**, que vemos abaixo.

Mapa rápido:
- **C-Corporation operacional** → Form 1120 com números reais.
- **Single-Member LLC de não residente** → **Form 1120 pro-forma** (a maioria dos campos em branco) com Form 5472 anexado.
- **Single-Member LLC de residente americano** → em geral não apresenta 1120; rendimentos no Schedule C do 1040 pessoal.
- **Multi-Member LLC** → também não usa 1120 por defeito; apresenta Form 1065 (partnership), salvo opção por tributação como corporation.
## O que é realmente o Form 5472

O **Form 5472, Information Return of a 25% Foreign-Owned U.S. Corporation or a Foreign Corporation Engaged in a U.S. Trade or Business** é uma **declaração informativa, não tributária**. Não paga qualquer imposto. A sua missão é informar o IRS das **transacções entre a entidade americana e partes relacionadas estrangeiras**.

Para a maioria dos nossos clientes na Exentax, essa "entidade americana" é uma **Single-Member LLC** propriedade de um não residente, e a "parte relacionada estrangeira" é **o próprio dono**. As "transacções" são qualquer movimento de dinheiro entre ti e a LLC: contribuições iniciais, transferências da LLC para a tua conta pessoal, pagamentos pontuais, empréstimos.

Porque importa? Porque desde 2017 as **disregarded entities propriedade de estrangeiros** são tratadas como corporations para efeitos do 5472. Isto significa que mesmo a tua LLC não pagar imposto federal, **está obrigada a reportar quem a possui e como moveu dinheiro contigo**. Sem apresentar, a sanção base é de **25 000 USD por formulário e ano**.
### A armadilha do "1120 pro-forma"

É aqui que as pessoas se perdem. A tua Single-Member LLC de não residente:

1. **Não paga imposto federal sobre sociedades** sobre rendimentos sem ligação efectiva com os EUA.
2. Mas **tem de apresentar um Form 1120 por ano, em branco**, para que sirva de envelope ao Form 5472.

Chama-se **Form 1120 pro-forma**. Só se preenchem os campos identificativos no topo ("Foreign-owned U.S. DE"), escreve-se à mão "Form 1120, Foreign-owned U.S. DE" no topo e anexa-se o Form 5472. O resto do 1120 fica em branco (sem Schedule M, sem balanço, sem cálculo de imposto).

Se o teu fornecedor te disse "não tens de apresentar nada porque não pagas imposto", **está a confundir "não pagar" com "não informar"**. São coisas diferentes.
### Quando se aplicam exactamente? Tabela por perfil

| Perfil | Form 1120? | Form 5472? | Comentário |
|---|---|---|---|
| Single-Member LLC, dono não residente, sem movimentos | Sim, pro-forma | Não | Muito raro: abrir o banco já gera movimento |
| Single-Member LLC, dono não residente, com movimentos | **Sim, pro-forma** | **Sim** | Caso típico Exentax |
| Single-Member LLC, dono residente nos EUA | Não | Não | Schedule C do 1040 |
| Multi-Member LLC, todos não residentes | Não (Form 1065) | Sim, anexado ao 1065 | Partnership por defeito |
| LLC com opção C-Corp (Form 8832) | **Sim, real** | Sim, se houver foreign related party | 21 % federal |
| C-Corp americana de não residente | Sim, real | Sim, se houver foreign related party | Estrutura diferente |

Quase todos os clientes Exentax com LLC caem na linha 2: **1120 pro-forma + 5472 anuais**.
### "Reportable transactions": o que conta e o que não

O Form 5472 pede para reportar as **reportable transactions** entre a LLC e a parte relacionada estrangeira:

- Contribuições de capital iniciais ou posteriores → reportadas.
- Distribuições ou "draws" da LLC para a tua conta pessoal → reportadas.
- Pagamentos da LLC a empresas/pessoas relacionadas no estrangeiro → reportados.
- Empréstimos entre ti e a LLC → reportados.
- Pagamentos por serviços prestados por ti (se facturas como pessoa singular desde outro país à LLC) → reportados.

Não se reportam pagamentos a fornecedores **não relacionados** (freelancer externo, SaaS, banco). O critério é **relação**, não nacionalidade.

Na maioria dos arranques, uma única contribuição inicial (a transferência para fundar a LLC) já activa a obrigação. A partir daí, estás dentro do regime.
### Prazos, prorrogações e onde enviar

- **Prazo padrão:** 15 de Abril de cada ano, para o exercício anterior fechado a 31 de Dezembro.
- **Prorrogação:** seis meses com Form 7004, novo prazo 15 de Outubro.
- **Forma de apresentação:** uma LLC de não residente sem obrigação de e-file envia normalmente por **correio registado ao IRS Service Center de Ogden, Utah** ou por **fax** ao número específico publicado pelo IRS para foreign-owned DEs. Confirmar sempre morada/fax vigentes do ano em causa.
- **EIN obrigatório:** sem EIN não há apresentação. A obter previamente (Form SS-4).

Atrasos não são baratos. A sanção de 25 000 USD por 5472 não apresentado **aplica-se também por informação incompleta ou inexacta**, não só por ausência total.
### Erros típicos ao preparar 1120 + 5472

1. **Preencher o 1120 pro-forma como se fosse um 1120 real.** O IRS processa-o como C-Corp e instala-se o caos.
2. **Esquecer que o 5472 vai anexado ao 1120**, não enviado sozinho. Enviado solto, não conta como apresentado.
3. **Sem Operating Agreement claro** e reporte de transacções sem documentação. Quando o IRS pede, nada para mostrar.
4. **Misturar conta pessoal e da LLC** e tentar reconstruir "reportable transactions" no fim do ano. Caro e mal feito.
5. **Confiar em "não chegou nada do IRS, está tudo bem".** O IRS não avisa antes de sancionar.
6. **Apresentar 5472 sem TIN/EIN do dono estrangeiro.** Mesmo não residente, o formulário exige identificação.
### Quem NÃO está obrigado (os poucos casos)

- LLC com vários membros, classificada como **partnership**, sem foreign related parties com reportable transactions (raro se és estrangeiro).
- És residente fiscal nos EUA e a tua Single-Member LLC reporta directamente em Schedule C do 1040. Não há "foreign-owned DE".
- A tua LLC optou por **C-Corp** e apresenta 1120 real, sem transacções com partes relacionadas estrangeiras (raro).

Fora destes casos, presumir isenção é uma aposta que não compensa: o custo de boa preparação é **muito inferior** à sanção mínima.
### Como isto encaixa no teu dia a dia

Se levas correctamente a operativa da LLC durante o ano (conta separada, registo de contribuições e levantamentos, Operating Agreement assinado, contabilidade mínima), preparar o 1120 pro-forma + 5472 no fim de ano é tranquilo. Se chegas a 31 de Dezembro com a conta da LLC misturada com a pessoal, sem documentação e sem saber que movimentos são reportáveis, custo e risco disparam.

Por isso na Exentax tratamos estes formulários como **subproduto natural** de uma boa gestão anual, não como drama de Março. A diferença está em seguir o <a href="/pt/blog/manutencao-anual-da-llc-obrigacoes-que-nao-pode-ignorar">calendário anual de obrigações</a> e manter separação efectiva entre o teu património e o da LLC.
### O que deves levar deste artigo

- **Form 1120** = declaração de imposto sobre sociedades. Na tua LLC de não residente usa-se **vazio, como envelope** do Form 5472.
- **Form 5472** = declaração informativa de transacções entre a LLC e tu (ou qualquer parte relacionada estrangeira).
- **Aplicam-se quase sempre** se és não residente com Single-Member LLC e moveste dinheiro entre ti e a LLC.
- **Não se paga imposto** com estes formulários, mas **não os apresentar custa 25 000 USD por ano**.
- Erro mais caro: preencher mal ou chegar ao fecho sem documentação que sustente o reportado.

Se tens dúvidas se o teu caso está bem montado, sobre exercícios passados ou como regularizar apresentações em atraso, **vemos isto contigo** numa consulta gratuita de 30 minutos. Melhor entender bem uma vez do que pagar sanções evitáveis todos os anos.
## Referências legais e regulamentares

Este artigo apoia-se em normativa em vigor à data de hoje. Citamos as fontes principais para verificação:

- **EUA.** Treas. Reg. §301.7701-3 (classificação de entidades / *check-the-box*); IRC §882 (imposto sobre rendimentos de estrangeiros conexos com US trade or business); IRC §871 (FDAP e retenções a não residentes); IRC §6038A e Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* e *foreign-owned disregarded entities*); IRC §7701(b) (residência fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report perante a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanha.** Lei 35/2006 (LIRPF), arts. 8, 9 (residência), 87 (atribuição de rendimentos), 91 (CFC pessoas singulares); Lei 27/2014 (LIS), art. 100 (CFC sociedades); Lei 58/2003 (LGT), arts. 15 e 16; Lei 5/2022 (regime sancionatório do Modelo 720 após TJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 e 720); Ordem HFP/887/2023 (Modelo 721 cripto).
- **Convenção Espanha–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDT original); Protocolo em vigor desde 27/11/2019 (rendimento passivo, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Diretiva (UE) 2011/16, alterada pela DAC6 (mecanismos transfronteiriços), DAC7 (Diretiva (UE) 2021/514, plataformas digitais) e DAC8 (Diretiva (UE) 2023/2226, criptoativos); Diretiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, assimetrias híbridas); Padrão Comum de Comunicação (CRS) da OCDE.
- **Quadro internacional.** Modelo de Convenção OCDE, art. 5 (estabelecimento estável) e Comentários; Ação 5 BEPS (substância económica); Recomendação 24 do GAFI (beneficiário efetivo).
A aplicação concreta de qualquer destas normas ao seu caso depende da sua residência fiscal, da atividade da LLC e da documentação que mantenha. Este conteúdo é informativo e não substitui aconselhamento profissional personalizado.

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da FinCEN e do IRS mudaram nos últimos anos; eis o estado atual:

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Fala com a nossa equipa</a>
<!-- /exentax:calc-cta-v1 -->

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

## Factos jurídicos e processuais

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

## O seu próximo passo com a Exentax

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.
## Quando se aplicam exatamente? Tabela por perfil

Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.

<!-- exentax:execution-v2 -->
## Form 1120 e Form 5472: o que são e quando uma LLC de não residente os apresenta

A combinação 1120 + 5472 é a obrigação informativa central de qualquer single-member LLC detida por não residente com "reportable transactions" com o seu sócio estrangeiro. Não gera imposto, mas a omissão activa uma multa de 25.000 USD por ano e entidade.

- **Form 1120 (pro-forma).** Não é o 1120 corporativo típico: uma versão simplificada usada pela LLC disregarded como "veículo" para acompanhar o 5472. Apenas dados identificativos (EIN, morada, ano fiscal). Sem cálculo de imposto. Prazo: 15 de Abril (ou 15 de Outubro com extensão 7004).
- **Form 5472.** O formulário informativo real. Reporta qualquer "reportable transaction" entre a LLC e o sócio estrangeiro (25%+ ownership): entradas de capital, distribuições, empréstimos intercompanhias, pagamentos por serviços prestados ou recebidos, vendas de bens. O montante reportado não gera imposto mas permite ao IRS rastrear fluxos transfronteiriços.
- **Quando aplica.** Single-member LLC detida por não residente (pessoa singular ou entidade estrangeira) com pelo menos uma transacção reportável durante o ano fiscal. Se o ano não houve movimento, tecnicamente sem 5472 - mas convém apresentar com "0" para manter histórico limpo.
- **Multa por omissão.** 25.000 USD por ano fiscal e entidade omitida. Multa adicional de 25.000 USD se após aviso do IRS não for corrigido em 90 dias. A multa informativa mais cara para LLCs de não residente e a mais fácil de prevenir apresentando a tempo.

### O que mais nos perguntam

**Tenho de pagar imposto federal com isto?** Não, salvo se a LLC tiver rendimentos efectivamente conectados com trade or business nos EUA (ETBUS). Sem ETBUS e sem US-source income, o resultado federal é 0 e o 1120/5472 é apenas informativo.

**Posso apresentá-los eu próprio?** Tecnicamente sim, mas um erro na categorização das transacções reportáveis ou um dia de atraso activa a multa. A maioria dos clientes prefere delegar.

Na Exentax preparamos e apresentamos o 1120 + 5472 da sua LLC dentro do prazo, guardamos o comprovativo e mantemos o histórico limpo para futuras inspecções ou due diligence.
<!-- /exentax:execution-v2 -->

## "Reportable transactions": o que conta e o que não

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.


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
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22H%C3%A1%20dois%20formul%C3%A1rios%20do%20a%20href%3Dhttps%3A%2F%2Fwww%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se queres ver todo o processo em detalhe, vê a nossa <a href="/pt/servicos">página de serviços</a> com tudo o que cobrimos.

<!-- exentax:conv-fill-v1 -->
Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.

Para detalhes por estado, consulta a nossa <a href="/pt/servicos/llc-wyoming">página de LLC no Wyoming</a> com custos e prazos fechados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

  ### Formulários 1120 + 5472 : enquadramento para residentes em Portugal

  Para residentes fiscais em Portugal com participações em LLCs americanas, à arquitetura americano (Form 1120 + Form 5472 com sanção de **USD 25.000 por incumprimento** ao abrigo do **IRC §6038A(d)(1)** agravado pela **Sec. 13301 do TCJA — Pub. L. 115-97 de 22/12/2017**) acresce uma arquitetura português: (a) **Modelo 22 do IRC** se a LLC for considerada não residente com estabelecimento estável; (b) **Anexo G ao Modelo 22** para entidades estrangeiras controladas; (c) **art. 121.º do CIRC** sobre obrigações declarativas; (d) regime CFC do **art. 66.º do CIRC** quando a LLC esteja em jurisdição de tributação privilegiada. A **ficha doutrinária 2018003278 da AT** confirma a transparência fiscal das LLCs com dois ou mais sócios. O intercâmbio CRS via **DAC2 desde 2017** garante o cruzamento automático de dados entre o IRS e a AT.

<!-- exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->
## O que 1120 + Form 5472 reportam realmente (e o que não)

Para uma single-member LLC detida por uma pessoa não-US e tratada
como disregarded para efeitos fiscais nos US, o IRS exige uma
envelope pro-forma 1120 utilizada apenas como suporte do Form 5472.
Este par não apura imposto US sobre uma LLC disregarded detida por
estrangeiro; documenta que certas transacções reportáveis entre a
LLC e o seu proprietário estrangeiro (ou partes relacionadas)
ocorreram efectivamente. O IRS quer visibilidade sobre estes
fluxos, não necessariamente receita.

| Item             | O que reporta                                           |
|------------------|---------------------------------------------------------|
| Pro-forma 1120   | Envelope de identificação: nome da LLC, EIN, morada,    |
|                  | ano                                                     |
| Form 5472        | Cada transacção reportável com a parte relacionada      |
|                  | estrangeira (entradas de capital, distribuições,        |
|                  | empréstimos, serviços, etc.)                            |

Se o ano não teve transacções reportáveis, o par é, em geral,
entregue na mesma com valores a zero para que o IRS veja o estatuto
de actividade explicitamente. Saltar a entrega é o que despoleta a
conhecida exposição a coimas previstas no regulamento.

## Três padrões reais de entrega que aplicamos

Uma single-member LLC com uma entrada de capital na constituição,
uma pequena retirada mensal ao proprietário estrangeiro e nenhum
outro fluxo relacionado. O 5472 reporta a entrada e as retiradas;
o pro-forma 1120 leva a envelope. A época de entrega leva umas
horas de trabalho estruturado, incluindo a reconciliação
contabilística.

Uma single-member LLC que emprestou dinheiro a uma sociedade
relacionada estrangeira, mais tarde reembolsado, com taxa de juro
normal. O 5472 reporta a concessão do empréstimo e o reembolso; a
acumulação de juros faz parte dos livros da LLC e reflecte-se na
declaração do proprietário no seu país. A documentação é aliada
aqui: o contrato de empréstimo e o quadro de amortização estão na
pasta de compliance da LLC.

Uma LLC plurianual sem actividade no ano corrente. Entregamos
ainda assim o pro-forma 1120 + 5472 a zeros, anexamos um curto
memorando interno a explicar o ano dormente, e mantemos o processo
pronto para o momento em que a LLC reactive.

## Erros que levam a cartas de coima

- Tratar o par como declaração fiscal que "nada deve" e saltá-lo. É
  uma entrega declarativa; a ausência de imposto não retira a
  obrigação.
- Misturar despesas pessoais do proprietário nos livros da LLC e
  depois tentar reconciliar à hora da entrega. Manter a fronteira
  limpa mensalmente.
- Esquecer que uma retirada ao proprietário estrangeiro é uma
  transacção reportável. É-o muitas vezes, conforme a sua natureza
  (devolução de capital, distribuição, etc.).
- Entregar tarde. A coima por um Form 5472 falhado é substancial e
  aplica-se mesmo sem imposto US devido.

## Checklist de pré-entrega

- A EIN da LLC corresponde à carta IRS (CP575).
- Ano de exercício confirmado (ano civil por defeito para uma
  single-member disregarded LLC).
- Contabilidade fechada e reconciliada com os bancos.
- Fluxos entre partes relacionadas mapeados às categorias de linhas
  do 5472.
- Documento de identificação do proprietário em ficheiro coerente
  com a declaração BOI.
- Canal de entrega pronto (papel ou e-file via prestador
  autorizado).

Tratamos 1120 + 5472 como o aperto de mão anual da LLC com o IRS:
calmo, previsível, estruturado. Uma entrega arrumada este ano
torna o ano seguinte ainda mais calmo.

<!-- /exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->

<!-- exentax:cross-refs-v1 -->
## Sobre o mesmo tema

- [O que acontece se não apresentar o Form 5472: multas do IRS e como corrigir](/pt/blog/o-que-acontece-se-nao-apresentar-o-form-5472-multas-irs-e)
- [W-8BEN e W-8BEN-E: um guia completo e tranquilo](/pt/blog/w8-ben-e-w8-ben-e-o-guia-completo)
- [O que é o IRS e como afeta realmente a sua LLC americana](/pt/blog/o-que-e-o-irs-e-como-afeta-a-sua-llc-americana)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
Revemos BOI, EIN, agente registado e obrigações federais para que nenhuma multa o apanhe de surpresa. <a href="/pt/servicos">Pedir revisão de compliance</a>.
<!-- /exentax:cta-v1 -->

`;
