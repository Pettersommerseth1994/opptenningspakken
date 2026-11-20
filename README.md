# Opptenningspakken

Nettsiden for Opptenningspakken. Fronten er en statisk side (HTML, CSS og litt JavaScript) som kan ligge på GitHub Pages. Kjøpet skjer i Shopify.

## Innhold

| Fil / mappe | Hva |
|---|---|
| `index.html`, `style.css`, `script.js` | Selve nettsiden |
| `config.js` | **Her setter du adressen til Shopify-butikken** og e-postadressen |
| `assets/logo/` | Fire logoforslag (A–D) som SVG, ikoner og favicon |
| `assets/illu/` | Håndtegnede illustrasjoner |
| `assets/img/` | Bildene dine, optimalisert som WebP |
| `assets/fonts/` | DM Sans og DM Serif Display (SIL Open Font License), lagret lokalt så siden ikke henter noe fra Google |
| `shopify/kjop.liquid` | Koden du limer inn i en Custom Liquid-seksjon i Shopify |

## Se siden lokalt

```bash
python3 -m http.server 8123
```

Åpne deretter http://localhost:8123 i nettleseren.

## Slik henger det sammen

1. Kunden trykker «Kjøp 10-pakk» på GitHub Pages-siden.
2. Knappen sender kunden til `{shopBase}{buyPath}?pakke=10`, altså siden `/pages/kjop` i Shopify.
3. Der ligger Custom Liquid-koden fra `shopify/kjop.liquid`. Den viser pakkene, forhåndsvelger riktig størrelse og sender kunden til kassen i Shopify.

## Oppsett i Shopify

1. **Produkt.** Opprett ett produkt med tittelen «Opptenningspakken» og handle `opptenningspakken` (Handle står under «Søkemotoroppføring»). Legg til en opsjon «Størrelse» med tre varianter: `5-pakk` (349 kr), `10-pakk` (649 kr) og `20-pakk` (1 199 kr). Variantnavnene må starte med antallet.
2. **Side.** Nettbutikk → Sider → Legg til side. Tittel «Kjøp», og adressen blir `/pages/kjop`.
3. **Custom Liquid.** Nettbutikk → Temaer → Tilpass. Åpne siden «Kjøp», legg til en seksjon «Custom Liquid» og lim inn hele `shopify/kjop.liquid`. Bytt ut adressen på linjen merket `HJEM` med GitHub Pages-adressen din.
4. **Frakt.** Innstillinger → Frakt og levering. Lag en fast fraktpris på 199 kr for Norge. Navngi den gjerne «Frakt, sendes første søndag i måneden».
5. **Gratis henting.** Innstillinger → Lokasjoner: legg til «Sandefjord» og «Oslo». Slå på «Lokal henting» for begge under Frakt og levering, og skriv i meldingen når og hvor de kan hentes.
6. **Betaling.** Sjekk hvilke betalingsmåter som er tilgjengelige for norske butikker (Vipps er viktig for norske kunder).
7. **Vilkår.** Fyll ut kjøpsvilkår og personvern under Innstillinger → Retningslinjer. Lenkene i bunnen av nettsiden peker dit.

Når alt fungerer: sett riktig adresse i `config.js`.

## Publisere på GitHub Pages

Dette er ikke gjort ennå. Når du har godkjent forslaget:

```bash
gh repo create opptenningspakken --public --source=. --push
gh api -X POST repos/{owner}/opptenningspakken/pages -f "source[branch]=main" -f "source[path]=/"
```

Siden blir tilgjengelig på `https://<brukernavn>.github.io/opptenningspakken/`. Eget domene legges inn under Settings → Pages.

## Åpne spørsmål

- Hvilken logo velger du (A–D)?
- Hva er siste frist for å bestille før månedens utsendelse? Siden viser nå neste første søndag etter dagens dato.
- Hvor og når kan kundene hente pakken i Sandefjord og Oslo?
- E-postadressen `hei@opptenningspakken.no` er en plassholder.
- Sjekk med transportøren at pakken (voks, næver og tennull) kan sendes som vanlig gods.
