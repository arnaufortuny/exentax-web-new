export default `Quando começas a movimentar dinheiro com a tua LLC, vais encontrar três siglas que aparecem uma e outra vez: **IBAN**, **SWIFT** (ou BIC) e **Routing Number**. São como o endereço postal da tua conta bancária, mas para o dinheiro.

Vamos explicar cada um de forma clara para que nunca mais fiques a pensar "qual dou a este cliente?"

## Routing Number (ABA Number)

É o código que identifica um banco dentro dos Estados Unidos. Tem **9 dígitos** e é usado exclusivamente para transferências domésticas dentro dos EUA.

**Exemplo:** 084106768

### Quando precisas dele?

- Para receber pagamentos **ACH** de clientes americanos
- Para receber **wires domésticos** dentro dos EUA
- Para configurar pagamentos automáticos (folhas de pagamento, subscrições)
- Para conectar a tua conta com Stripe, PayPal, Amazon

### Onde o encontras?

No Mercury: Dashboard → Account Details → "Routing Number"

**Nota importante:** Mercury tem **dois routing numbers**: um para ACH e outro para Wire. Certifica-te de dar o correto conforme o tipo de transferência.

## SWIFT / BIC Code

O **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) ou **BIC** (Bank Identifier Code) é o código que identifica um banco a nível internacional. Tem entre **8 e 11 caracteres** (letras e números).

**Exemplo:** CHASUS33 (JPMorgan Chase)

### Quando precisas dele?

- Para receber **wire transfers internacionais** de fora dos EUA
- Para que um cliente na Europa, América Latina ou Ásia te envie dinheiro

### Por que é diferente do Routing Number?

O Routing Number é para o sistema doméstico americano (ACH/Fedwire). O SWIFT é para o sistema internacional. São duas redes de pagamentos diferentes.

## IBAN (International Bank Account Number)

O **IBAN** é um formato padronizado de número de conta que se usa na Europa, Médio Oriente e partes da América Latina. Tem entre **15 e 34 caracteres** (varia por país) e contém o código do país, o banco e a conta.

**Exemplo:** ES91 2100 0418 4502 0005 1332 (Espanha)

### As contas americanas têm IBAN?

**Não.** Os Estados Unidos não usam o sistema IBAN. As contas americanas usam Routing Number + Account Number.

Se um cliente europeu te pede o teu IBAN para te pagar, a resposta é: "Não tenho IBAN. aqui tens o meu Routing Number, Account Number e SWIFT Code para wire internacional."

### E se precisares de receber pagamentos da Europa?

Aqui é onde o **Wise Business** brilha. O Wise dá-te um IBAN europeu (com prefixo BE ou DE) vinculado à tua conta. Os clientes europeus podem pagar-te por SEPA como se fosse uma transferência local, sem comissões de wire internacional.

## Resumo rápido

| Código | O que é | Dígitos | Usa-se em | Para quê |
|---|---|---|---|---|
| Routing Number | ID do banco nos EUA | 9 | EUA | ACH e Wires domésticos |
| SWIFT/BIC | ID do banco internacional | 8-11 | Mundial | Wires internacionais |
| IBAN | Nº de conta internacional | 15-34 | Europa, MENA, LatAm | Transferências SEPA |
| Account Number | Nº da tua conta | 10-17 | EUA | Identificar a tua conta |

## Que dados dar a cada tipo de cliente?

### Cliente americano
- **Routing Number** (ACH ou Wire conforme o tipo de pagamento)
- **Account Number**
- **Nome da LLC** (como beneficiário)

### Cliente europeu
- **SWIFT Code** + **Account Number** + **Routing Number** para wire internacional
- Ou melhor: **IBAN europeu do Wise** para que pague por SEPA (mais barato e rápido)

### Cliente latino-americano
- **SWIFT Code** + **Account Number** + **Routing Number** para wire internacional
- Ou: **dados locais do Wise** se o país tiver conta local disponível

## O truque para cobrar mais barato: contas locais

Aqui vai um conselho que vale ouro: se tens clientes na Europa que te pagam regularmente, **NÃO lhes dês os teus dados de wire internacional**. Dá-lhes o teu **IBAN europeu do Wise Business**.

Porquê? Um wire internacional EUA→Europa pode custar ao pagador 20-50€ e demorar 2-5 dias. Um SEPA a partir da conta Wise da tua LLC custa 0-1€ e chega em 1 dia.

O Wise (que é uma EMI, não um banco) gera-te contas locais em múltiplos países:
- **IBAN europeu** (prefixo BE ou DE) para cobranças SEPA
- **Dados USD** para clientes americanos (routing + account number)
- **Sort code** britânico para clientes UK
- **BSB** australiano para clientes na Austrália

Os teus clientes pagam como se fosse uma transferência local. tu recebes no teu saldo multi-divisa do Wise e depois transferes para o Mercury quando te convier.

Se ficaram pontos desta estrutura por aprofundar, <a href="/pt/blog/ach-vs-transferencia-bancaria-prazos-de-pagamento-e-impacto-no-fluxo-de-caixa-da">ACH vs transferência bancária: prazos de pagamento e impacto no fluxo de caixa da LLC</a> e <a href="/pt/blog/como-escalar-seu-negocio-digital-com-uma-llc-americana">Como escalar seu negócio digital com uma LLC americana</a> detalham peças vizinhas que costumamos reservar para artigos dedicados.

## Mercury: dados bancários que precisas

Para o Mercury, os dados que darás aos clientes são:

- **Routing Number ACH:** Para cobranças ACH domésticas (pagamentos de clientes US, depósitos de Stripe/PayPal)
- **Routing Number Wire:** Para wires domésticos (atenção: é diferente do de ACH)
- **Account Number:** O teu número de conta
- **SWIFT Code:** Para wires internacionais recebidos
- **Endereço do banco:** Column NA, San Francisco, CA

Mercury tem $0 em comissões de wire, tanto nacionais como internacionais. Os teus fundos estão custodiados na Column NA com seguro FDIC.

Na Exentax configuramos todos os canais de cobrança desde o primeiro dia. Dizemos-te exatamente que dados dar a cada tipo de cliente para que o dinheiro chegue rápido e sem surpresas. Agenda a tua assessoria gratuita.`;
