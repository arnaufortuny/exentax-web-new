export default `Se a tua LLC opera há algum tempo e a separação entre o teu dinheiro pessoal e o da LLC não está perfeitamente documentada, tens um problema à espera. Não se manifesta hoje; manifesta-se no dia em que um banco faz revisão profunda, o <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> pede comprovativos ou o teu fisco pede rasto de fluxos.

## Porque importa a separação de fundos

### 1. Corporate veil
Misturar dinheiro pessoal e da LLC é o exemplo de manual que permite romper o véu.

### 2. Form 5472
Para SMLLC não residente, o 5472 deve reportar qualquer transacção entre ti e a LLC.

### 3. KYC e banca
Em revisão profunda, Mercury, Wise ou Relay olham primeiro se os fluxos batem com a actividade declarada.
### O que significa separar de verdade

- **Cobranças de clientes apenas para contas da LLC**.
- **Despesas business pagas apenas com cartões/contas da LLC**.
- **Movimentos entre ti e a LLC** documentados formalmente (Capital Contribution, Owner Distribution, Loan), com conceito claro no extracto.
## Reconstruir documentação

### Passo 1. Cartografar 12-24 meses
Descarregar extractos em CSV. Identificar cada movimento ti ↔ LLC com data e valor.

### Passo 2. Classificar cada movimento
Quatro categorias: Capital Contribution, Owner Distribution, Loan to/from member, Reimbursement.

### Passo 3. Gerar documentação retroactiva
- **Capital Contribution**: nota escrita à data com valor e finalidade, registada no Member's Capital Account.
- **Distribution**: nota escrita com valor, lucro de origem e beneficiário.
- **Loan**: Promissory Note simples com data, valor, calendário, juro (mínimo AFR).
- **Reimbursement**: factura original + lançamento contabilístico.

Não é mentir retroactivamente; é documentar a substância do que se fez.

### Passo 4. Ajustar a contabilidade
Cada movimento documentado registado com categoria correspondente.

### Passo 5. Regras forward-looking
- **Nenhuma despesa business no cartão pessoal**; se acontecer, documentar o reembolso na mesma semana.
- **Nenhuma despesa pessoal no cartão da LLC**.
- **Todos os movimentos ti ↔ LLC** com conceito claro.
### E o passado sem justificativos?

- **Documentar com o razoável** com base no contexto.
- **Não inventar facturas**.
- **Classificação mais conservadora em caso de dúvida** (movimento de origem pouco clara é tratado como Distribution, não como Reimbursement).
### Como o abordamos na Exentax

Na Exentax fazemos este exercício todos os meses com clientes que chegam com dívida técnica acumulada. Agenda uma sessão inicial gratuita na nossa página de contacto.
### Leituras relacionadas

- [romper o véu corporativo: como evitá-lo](/pt/blog/separar-dinheiro-pessoal-e-da-llc-por-que-e-importante)
- [contabilidade para a tua LLC: melhores práticas](/pt/blog/bookkeeping-para-sua-llc-americana-passo-a-passo)
- [Form 5472: quando apresentar e que sanção](/pt/blog/o-que-acontece-se-nao-apresentar-o-form-5472-multas-irs-e)
### Próximos passos

Se queres validar, na Exentax revemos o teu caso de forma personalizada. Reserva uma sessão inicial sem compromisso na nossa página de contacto.

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

<!-- exentax:legal-facts-v1 -->
## Factos legais e de procedimento

As obrigações junto da <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> e do IRS mudaram em recent years; eis o estado atual:

### Pontos-chave

- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah**, **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.
- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.
- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.
## Como o abordamos na Exentax

O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.
## Factos bancários e fiscais que convém precisar

Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum - a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.

<!-- exentax:calc-cta-v1 -->
> <a href="/pt/agendar">Consulta gratuita sem compromisso</a>
<!-- /exentax:calc-cta-v1 -->

## Factos jurídicos e processuais

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

<!-- exentax:execution-v2 -->
## Como construir um histórico de separação que aguente uma revisão

A separação de fundos não é um luxo contabilístico: é a linha que separa "LLC operacional" de "LLC reinterpretada como conta pessoal" por um inspector ou pelo banco. Sem histórico documentado, a doutrina do piercing the corporate veil torna-se viável e a protecção cai.

- **Origem única das entradas.** Cada crédito em Mercury, Relay ou Wise Business deve ter factura, contrato ou memo associado. Transferências internas LLC-a-LLC com descritivo explícito ("loan repayment", "intercompany services"). Uma transferência sem rastreabilidade equivale a distribuição não documentada e abre caminho à requalificação.
- **Saídas com lógica fiscal.** Pagamentos a fornecedores com factura no ERP; salários ou member draws com lançamento contabilístico e, se aplicável, retenção prevista; reembolsos de despesas do membro com expense report prévio. Sem esse rasto, a Autoridade Tributária ou o IRS podem recategorizar o fluxo como distribuição encoberta.
- **Cartões dedicados.** Um cartão pessoal passado pela conta LLC contamina o exercício inteiro. A Mercury emite virtuais por categoria: um para SaaS, outro para publicidade, outro para viagens. Se o membro precisar gastar a título pessoal, fá-lo da conta privada e reembolsa via expense report - nunca o contrário.
- **Documentação viva, não ficheiro morto.** Pasta partilhada com Operating Agreement assinado, actas anuais, expense reports, contratos de serviços intra-grupo. É a primeira coisa que um banco pede em KYC reforçado e a primeira que uma inspecção solicita.

### O que mais nos perguntam

**É válido pagar-me a mim próprio a partir da LLC?** Sim, via member draw registado em acta e reflectido na contabilidade. O que não é válido é levantar sem registo nem periodicidade, ou pagar despesas pessoais directamente da conta LLC.

**E se já levo dois anos a misturar tudo?** Reconstrução possível: extractos, recategorização, actas correctivas e expense reports retroactivos. Não é elegante, mas defensável. Melhor começar já do que continuar a agravar.

Na Exentax montamos essa estrutura documental desde o dia um e revemos cada fecho para que o histórico continue defensável.
<!-- /exentax:execution-v2 -->

## Referências: regulamentação para a gestão operacional

A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.

### Antes de começar: o princípio fundacional

Este é um dos pontos que auditamos primeiro quando assumimos um processo. Se não estiver limpo aqui, qualquer hipótese a jusante torna-se negociável perante a autoridade.

### Passo 1. Delimitar o período de mistura

Detalhe prático a fixar antes de agir. A maioria do dano evitável que vemos neste ponto vem de saltar a documentação, não da lógica fiscal subjacente.

### Passo 2. Recolher extratos completos

Este é um dos pontos que auditamos primeiro quando assumimos um processo. Se não estiver limpo aqui, qualquer hipótese a jusante torna-se negociável perante a autoridade.

### Passo 3. Classificar cada transação

Apontamento concreto dos nossos casos: é assim que acontece de facto, não como uma página comercial descreve. Os números e o calendário pesam - falhar num deles desfaz o resto.

  ### Documentação da separação de fundos: padrão português para LLC

  A documentação rigorosa da separação entre fundos pessoais do sócio e fundos da LLC americana é essencial em duas frentes: (a) a **doutrina americana do piercing the corporate veil** (caso *Kinney Shoe Corp. v. Polan*, 939 F.2d 209, 4th Cir. 1991), que protege a separação patrimonial nos EUA, e (b) o regime português de **transparência fiscal** previsto no **art. 6.º do CIRC** e confirmado pela **ficha doutrinária 2018003278 da AT** para LLCs unipessoais.

  **Obrigações contabilísticas em Portugal:** o sócio residente que receba rendimentos da LLC deve declará-los na **Categoria B do IRS** com obrigação de **contabilidade organizada** sempre que o volume anual ultrapassar €200.000 ou opte voluntariamente — nos termos do **art. 28.º do CIRS** e do **DL 158/2009 (SNC)**. A separação patrimonial deve estar refletida em conta bancária distinta, com extratos arquivados pelo prazo de **10 anos** previsto no **art. 130.º do CIRS** (e **art. 123.º do CIRC** quando aplicável).

  **Sanções por confusão patrimonial:** a falta de documentação adequada permite à AT requalificar os movimentos como rendimentos pessoais ao abrigo do **art. 38.º do CIRC** (cláusula geral antiabuso), com tributação em sede de IRS Categoria B à taxa marginal (até 48 %) acrescida de **derrama estadual** até 9 % e **derrama municipal** até 1,5 %. Em casos graves, aplica-se o **art. 104.º do RGIT (fraude fiscal qualificada)** com pena de prisão de 1 a 5 anos.

  **Quadro brasileiro paralelo:** para sócios brasileiros residentes, a separação documental atende ao **art. 51 da Lei 9.430/96** (preços de transferência) e à **IN RFB 1.520/2014** (CFC brasileira), com obrigação de informar a LLC na **DIRPF ficha de Bens e Direitos código 31**, conforme **Solução de Consulta COSIT 14/2018**.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Queres falar agora? Escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20estou%20a%20ler%20%22Se%20a%20tua%20LLC%20opera%20h%C3%A1%20algum%20tempo%20e%20a%20separa%C3%A7%C3%A3o%20entre%20o%20teu%20dinheiro%20pessoal%20%E2%80%A6%22%20e%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>

Se preferes falar diretamente, <a href="/pt/agendar">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.
<!-- /exentax:cta-conv-v1 -->

Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido. <a href="/pt/agendar">Marcar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
