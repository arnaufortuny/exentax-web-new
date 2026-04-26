# CTA-LIBRARY — Patrones canónicos de cierre y mid-article

> Fuente única de verdad: `client/src/data/blog-cta-library.ts` (post-article) y `client/src/data/blog-mid-cta-copy.ts` (mid-article).  
> Este documento exporta los patrones verbatim para que el equipo editorial los copie sin re-redactar.  
> **Prohibido inventar copy nuevo.** Si necesitas un patrón que no existe, primero abrir tarea de extender la library, después usar.

## 1. Patrones post-article (cierre)

Cada artículo cierra con uno de estos 6 patrones. La elección depende del ángulo del artículo (ver tabla "Cuándo usar").

### Tabla resumen

| Pattern ID | Cuándo usar |
|---|---|
| `book_consultation` | Default genérico — artículo no encaja en ningún ángulo más específico (LLC general, fiscalidad mixta, comparativa España vs LLC). |
| `llc_florida_specific` | Artículos sobre Florida, Miami, presencia física en EE. UU., empleados en suelo americano. |
| `llc_state_compare` | Comparativas explícitas entre estados (NM vs WY vs DE, "qué estado elegir"). |
| `itin_help` | Artículos sobre ITIN, W-7, Certifying Acceptance Agent, retenciones recuperables. |
| `services_overview` | Cómo trabajamos / proceso / EIN / BOI / Registered Agent / mantenimiento anual. |
| `compliance_checkup` | BOI / CTA / Form 5472 / Form 1120 / FBAR / notificaciones del IRS / auditoría rápida. |

### Copy verbatim por patrón (6 idiomas)


#### book_consultation

**Cuándo usar:** Default genérico — artículo no encaja en ningún ángulo más específico (LLC general, fiscalidad mixta, comparativa España vs LLC).

```ts
es: {
      title: "¿Sigues con dudas sobre tu LLC?",
      desc: "Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido.",
      primary: "Agendar consulta gratuita",
      whatsappMsg: "Hola, estoy considerando una LLC y me gustaría saber si tiene sentido en mi situación. ¿Podemos hablar?",
    },
    en: {
      title: "Still unsure whether an LLC fits your case?",
      desc: "Book a free 30-minute consultation. We review your real situation and tell you what actually fits.",
      primary: "Book a free consultation",
      whatsappMsg: "Hi, I'm considering a US LLC and I'd like to know if it makes sense for my situation. Can we talk?",
    },
    fr: {
      title: "Vous hésitez encore sur la LLC ?",
      desc: "Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens.",
      primary: "Réserver une consultation gratuite",
      whatsappMsg: "Bonjour, j'envisage une LLC américaine et j'aimerais savoir si cela a du sens pour ma situation. Pouvons-nous en parler ?",
    },
    de: {
      title: "Noch unsicher, ob eine LLC zu Ihnen passt?",
      desc: "Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist.",
      primary: "Kostenlose Beratung buchen",
      whatsappMsg: "Hallo, ich überlege, eine US-LLC zu gründen, und möchte wissen, ob das zu meiner Situation passt. Können wir sprechen?",
    },
    pt: {
      title: "Ainda tem dúvidas sobre a sua LLC?",
      desc: "Marque uma consulta gratuita de 30 minutos: analisamos o seu caso real e dizemos-lhe o que faz sentido.",
      primary: "Marcar consulta gratuita",
      whatsappMsg: "Olá, estou a considerar uma LLC americana e gostaria de saber se faz sentido para a minha situação. Podemos falar?",
    },
    ca: {
      title: "Encara tens dubtes sobre la teva LLC?",
      desc: "Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit.",
      primary: "Reservar consulta gratuïta",
      whatsappMsg: "Hola, estic considerant una LLC americana i m'agradaria saber si té sentit en la meva situació. Podem parlar?",
    },
```

#### llc_florida_specific

**Cuándo usar:** Artículos sobre Florida, Miami, presencia física en EE. UU., empleados en suelo americano.

```ts
es: {
      title: "¿Vas a operar en EE. UU. desde Miami?",
      desc: "Constituye tu LLC en Florida con presencia real, EIN, BOI y banca en español. Consulta gratuita de 30 min.",
      primary: "Constituye tu LLC en Florida",
      whatsappMsg: "Hola, quiero abrir una LLC en Florida. ¿Podemos hablar?",
    },
    en: {
      title: "Going to operate in the US from Miami?",
      desc: "Form your Florida LLC with real US presence, EIN, BOI and Spanish-speaking banking. Free 30-min consultation.",
      primary: "Start your Florida LLC",
      whatsappMsg: "Hi, I want to open a Florida LLC. Can we talk?",
    },
    fr: {
      title: "Vous allez opérer aux États-Unis depuis Miami ?",
      desc: "Créez votre LLC en Floride avec une présence réelle, EIN, BOI et banque hispanophone. Consultation gratuite de 30 min.",
      primary: "Créer votre LLC en Floride",
      whatsappMsg: "Bonjour, je souhaite ouvrir une LLC en Floride. Pouvons-nous en parler ?",
    },
    de: {
      title: "Sie wollen aus Miami heraus in den USA operieren?",
      desc: "Gründen Sie Ihre Florida-LLC mit echter US-Präsenz, EIN, BOI und spanischsprachigem Banking. Kostenlose 30-Minuten-Beratung.",
      primary: "Florida-LLC gründen",
      whatsappMsg: "Hallo, ich möchte eine LLC in Florida eröffnen. Können wir sprechen?",
    },
    pt: {
      title: "Vai operar nos EUA a partir de Miami?",
      desc: "Constitua a sua LLC na Florida com presença real, EIN, BOI e banca em português/espanhol. Consulta gratuita de 30 min.",
      primary: "Constituir LLC na Florida",
      whatsappMsg: "Olá, quero abrir uma LLC na Florida. Podemos falar?",
    },
    ca: {
      title: "Operaràs als EUA des de Miami?",
      desc: "Constitueix la teva LLC a Florida amb presència real, EIN, BOI i banca en castellà. Consulta gratuïta de 30 min.",
      primary: "Constitueix la teva LLC a Florida",
      whatsappMsg: "Hola, vull obrir una LLC a Florida. Podem parlar?",
    },
```

#### llc_state_compare

**Cuándo usar:** Comparativas explícitas entre estados (NM vs WY vs DE, "qué estado elegir").

```ts
es: {
      title: "¿No sabes qué estado encaja con tu negocio?",
      desc: "Comparamos Nuevo México, Wyoming, Delaware y Florida sobre tu caso real, sin venderte el estado de moda.",
      primary: "Comparar mi caso con un asesor",
      whatsappMsg: "Hola, dudo entre varios estados para mi LLC y me gustaría una comparativa para mi caso. ¿Podemos hablar?",
    },
    en: {
      title: "Not sure which US state fits your business?",
      desc: "We compare New Mexico, Wyoming, Delaware and Florida against your real case — no trendy-state pitch.",
      primary: "Compare my case with an advisor",
      whatsappMsg: "Hi, I'm hesitating between several US states for my LLC and would love a tailored comparison. Can we talk?",
    },
    fr: {
      title: "Vous ne savez pas quel État correspond à votre activité ?",
      desc: "Nous comparons le Nouveau-Mexique, le Wyoming, le Delaware et la Floride sur votre cas réel — sans vous vendre l'État à la mode.",
      primary: "Comparer mon cas avec un conseiller",
      whatsappMsg: "Bonjour, j'hésite entre plusieurs États pour ma LLC et j'aimerais une comparaison adaptée à mon cas. Pouvons-nous en parler ?",
    },
    de: {
      title: "Sie wissen nicht, welcher US-Bundesstaat zu Ihrem Geschäft passt?",
      desc: "Wir vergleichen New Mexico, Wyoming, Delaware und Florida anhand Ihres konkreten Falls — ohne den gerade angesagten Bundesstaat zu pushen.",
      primary: "Meinen Fall mit einem Berater vergleichen",
      whatsappMsg: "Hallo, ich schwanke zwischen mehreren US-Bundesstaaten für meine LLC und hätte gern einen Vergleich für meinen Fall. Können wir sprechen?",
    },
    pt: {
      title: "Não sabe que estado encaixa no seu negócio?",
      desc: "Comparamos Novo México, Wyoming, Delaware e Florida sobre o seu caso real — sem lhe vender o estado da moda.",
      primary: "Comparar o meu caso com um consultor",
      whatsappMsg: "Olá, estou em dúvida entre vários estados para a minha LLC e gostaria de uma comparação para o meu caso. Podemos falar?",
    },
    ca: {
      title: "No saps quin estat encaixa amb el teu negoci?",
      desc: "Comparem Nou Mèxic, Wyoming, Delaware i Florida sobre el teu cas real, sense vendre't l'estat de moda.",
      primary: "Comparar el meu cas amb un assessor",
      whatsappMsg: "Hola, dubto entre diversos estats per a la meva LLC i m'agradaria una comparativa per al meu cas. Podem parlar?",
    },
```

#### itin_help

**Cuándo usar:** Artículos sobre ITIN, W-7, Certifying Acceptance Agent, retenciones recuperables.

```ts
es: {
      title: "¿Necesitas tu ITIN sin enviar el pasaporte?",
      desc: "Tramitamos tu ITIN ante el IRS con un Certifying Acceptance Agent: nada de enviar el original.",
      primary: "Tramitar mi ITIN",
      whatsappMsg: "Hola, necesito tramitar mi ITIN. ¿Podemos hablar?",
    },
    en: {
      title: "Need your ITIN without mailing your passport?",
      desc: "We file your ITIN with the IRS through a Certifying Acceptance Agent — your original passport stays with you.",
      primary: "Get my ITIN",
      whatsappMsg: "Hi, I need to apply for my ITIN. Can we talk?",
    },
    fr: {
      title: "Vous avez besoin de votre ITIN sans envoyer votre passeport ?",
      desc: "Nous déposons votre demande d'ITIN auprès de l'IRS via un Certifying Acceptance Agent : votre passeport reste avec vous.",
      primary: "Obtenir mon ITIN",
      whatsappMsg: "Bonjour, j'ai besoin de demander mon ITIN. Pouvons-nous en parler ?",
    },
    de: {
      title: "Brauchen Sie Ihre ITIN, ohne den Reisepass einzuschicken?",
      desc: "Wir reichen Ihre ITIN beim IRS über einen Certifying Acceptance Agent ein — Ihr Original-Reisepass bleibt bei Ihnen.",
      primary: "Meine ITIN beantragen",
      whatsappMsg: "Hallo, ich muss meine ITIN beantragen. Können wir sprechen?",
    },
    pt: {
      title: "Precisa do seu ITIN sem enviar o passaporte?",
      desc: "Tratamos do seu ITIN junto do IRS com um Certifying Acceptance Agent — o passaporte original fica consigo.",
      primary: "Tratar do meu ITIN",
      whatsappMsg: "Olá, preciso de pedir o meu ITIN. Podemos falar?",
    },
    ca: {
      title: "Necessites el teu ITIN sense enviar el passaport?",
      desc: "Tramitem el teu ITIN davant l'IRS amb un Certifying Acceptance Agent: l'original es queda amb tu.",
      primary: "Tramitar el meu ITIN",
      whatsappMsg: "Hola, necessito tramitar el meu ITIN. Podem parlar?",
    },
```

#### services_overview

**Cuándo usar:** Cómo trabajamos / proceso / EIN / BOI / Registered Agent / mantenimiento anual.

```ts
es: {
      title: "Mira cómo trabajamos",
      desc: "Constitución, EIN, BOI, banca y mantenimiento: un único equipo que entiende tu caso de principio a fin.",
      primary: "Ver todos los servicios",
      whatsappMsg: "Hola, me gustaría entender cómo es vuestro proceso de constitución y mantenimiento de LLC. ¿Podemos hablar?",
    },
    en: {
      title: "See how we work",
      desc: "Formation, EIN, BOI, banking and ongoing maintenance — one team that understands your case end to end.",
      primary: "Explore all services",
      whatsappMsg: "Hi, I'd like to understand how your LLC formation and maintenance process works. Can we talk?",
    },
    fr: {
      title: "Découvrez notre méthode",
      desc: "Création, EIN, BOI, banque et maintenance : une seule équipe qui comprend votre dossier de bout en bout.",
      primary: "Voir tous les services",
      whatsappMsg: "Bonjour, j'aimerais comprendre votre processus de création et de maintenance de LLC. Pouvons-nous en parler ?",
    },
    de: {
      title: "Sehen Sie, wie wir arbeiten",
      desc: "Gründung, EIN, BOI, Banking und laufender Betrieb — ein Team, das Ihren Fall von Anfang bis Ende versteht.",
      primary: "Alle Leistungen ansehen",
      whatsappMsg: "Hallo, ich möchte verstehen, wie Ihr LLC-Gründungs- und Betriebsprozess funktioniert. Können wir sprechen?",
    },
    pt: {
      title: "Veja como trabalhamos",
      desc: "Constituição, EIN, BOI, banca e manutenção: uma única equipa que entende o seu caso do início ao fim.",
      primary: "Ver todos os serviços",
      whatsappMsg: "Olá, gostaria de perceber como é o vosso processo de constituição e manutenção de LLC. Podemos falar?",
    },
    ca: {
      title: "Mira com treballem",
      desc: "Constitució, EIN, BOI, banca i manteniment: un sol equip que entén el teu cas de cap a peus.",
      primary: "Veure tots els serveis",
      whatsappMsg: "Hola, m'agradaria entendre com és el vostre procés de constitució i manteniment de LLC. Podem parlar?",
    },
```

#### compliance_checkup

**Cuándo usar:** BOI / CTA / Form 5472 / Form 1120 / FBAR / notificaciones del IRS / auditoría rápida.

```ts
es: {
      title: "¿Tu LLC está realmente al día?",
      desc: "Revisamos BOI, EIN, agente registrado y obligaciones federales para que no te sorprenda una multa.",
      primary: "Pedir revisión de compliance",
      whatsappMsg: "Hola, quiero revisar el compliance (BOI, agente registrado, obligaciones federales) de mi LLC. ¿Podemos hablar?",
    },
    en: {
      title: "Is your LLC actually up to date?",
      desc: "We review BOI, EIN, registered agent and federal obligations so a fine never catches you by surprise.",
      primary: "Request a compliance review",
      whatsappMsg: "Hi, I want to review my LLC compliance (BOI, registered agent, federal obligations). Can we talk?",
    },
    fr: {
      title: "Votre LLC est-elle vraiment à jour ?",
      desc: "Nous vérifions BOI, EIN, agent enregistré et obligations fédérales pour qu'aucune amende ne vous surprenne.",
      primary: "Demander une revue de conformité",
      whatsappMsg: "Bonjour, je souhaite faire le point sur la conformité (BOI, agent enregistré, obligations fédérales) de ma LLC. Pouvons-nous en parler ?",
    },
    de: {
      title: "Ist Ihre LLC wirklich auf dem aktuellen Stand?",
      desc: "Wir prüfen BOI, EIN, Registered Agent und Bundespflichten, damit Sie keine Strafe überrascht.",
      primary: "Compliance-Check anfragen",
      whatsappMsg: "Hallo, ich möchte die Compliance meiner LLC (BOI, Registered Agent, Bundespflichten) überprüfen. Können wir sprechen?",
    },
    pt: {
      title: "A sua LLC está mesmo em dia?",
      desc: "Revemos BOI, EIN, agente registado e obrigações federais para que nenhuma multa o apanhe de surpresa.",
      primary: "Pedir revisão de compliance",
      whatsappMsg: "Olá, quero rever a compliance (BOI, agente registado, obrigações federais) da minha LLC. Podemos falar?",
    },
    ca: {
      title: "La teva LLC està realment al dia?",
      desc: "Revisem BOI, EIN, agent registrat i obligacions federals perquè cap multa et pugui sorprendre.",
      primary: "Demanar revisió de compliance",
      whatsappMsg: "Hola, vull revisar el compliance (BOI, agent registrat, obligacions federals) de la meva LLC. Podem parlar?",
    },
```

## 2. Variantes mid-article (`<!-- exentax:calc-cta-v1 -->`)

| Variante | Frase ES | Cuándo usar |
|---|---|---|
| `free_consult` | Consulta gratuita sin compromiso | Default; artículos de servicios y consulta. |
| `start_today` | Empieza hoy 100% online | Constitución, EIN, BOI, "cómo empezar". |
| `talk_to_team` | Habla con nuestro equipo | Casos complejos, fiscalidad internacional, residencia. |
| `discover_llc` | Descubre si una LLC es para ti | Comparativas autónomo vs LLC, "es para mí". |

El mapeo `PATTERN_TO_VARIANT` está fijado en `client/src/data/blog-mid-cta-copy.ts` y NO debe duplicarse manualmente: cada patrón post-article ya tiene asociada su variante mid-article.

## 3. Bloque WhatsApp (`<!-- exentax:cta-conv-v1 -->`)

Patrón verbatim, sólo para slugs de **alta intención** (precio, plazos, sanciones, "tengo problema con mi LLC"):

```html
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22{slug}%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si quieres ver el detalle del proceso completo, repasa nuestra <a href="/es/servicios">página de servicios</a> con todo lo que incluimos.
<!-- /exentax:cta-conv-v1 -->
```

Sustituir `{slug}` por el slug del artículo (URL-encoded). Para artículos no-ES, traducir el wa.me text al idioma local pero mantener la estructura.

## 4. Lo que NO se puede hacer

- ❌ Inventar copy CTA fuera de la library.
- ❌ "Contáctanos", "no dudes en escribirnos", "estamos aquí para ti": prohibido. Es CTA-petición y baja conversión (categoría `cta-peticion`).
- ❌ Mezclar 2 patrones en el mismo artículo (sólo uno post-article + uno mid + opcionalmente WhatsApp).
- ❌ Modificar wording por idioma sin pasar por la library: el linter `lint:blog` lo detecta.
- ❌ Hardcodear URLs de booking distintas a las del patrón (la URL la resuelve `blog-cta-routes.ts`).

## 5. Política de mención WhatsApp

Whatsapp aparece sólo cuando:
- Topic = "tengo problema ahora" (recuperar LLC, 5472 atrasados, BOI fuera de plazo).
- Topic = "duda terminal antes de contratar" (cuánto cuesta, cuánto tarda, qué pasa si...).
- Topic = "auditoría rápida" / "checklist" (lectores con LLC ya operativa).

Para artículos puramente educativos (qué es un EIN, cómo funciona pass-through), **omitir** el bloque WhatsApp y dejar sólo el cierre canónico.
