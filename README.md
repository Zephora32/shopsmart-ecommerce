# E-handel - Modern E-handelsplattform

En modern, snabb och fullt fungerande e-handelsplattform inspirerad av Temu. Byggd med vanilla JavaScript och minimal kodstruktur (exakt 15 filer).

## 🚀 Funktioner

- ✅ **Produktkatalog** - 25 produkter i 5 kategorier
- ✅ **Sök & Filter** - Sök, filtrera efter kategori, pris och sortering
- ✅ **Varukorg** - Lägg till, uppdatera och ta bort produkter
- ✅ **Checkout** - Komplett kassaflöde med Stripe/PayPal integration
- ✅ **Användarkonton** - Registrering, inloggning och profil
- ✅ **Orderhistorik** - Se alla tidigare ordrar
- ✅ **Favoriter** - Spara favoritprodukter
- ✅ **Gästköp** - Handla utan konto
- ✅ **Responsiv design** - Fungerar perfekt på mobil, surfplatta och desktop
- ✅ **Säkerhet** - Input-validering och XSS-skydd

## 📁 Filstruktur (15 filer)

```
/
├── index.html          # Huvudsaklig HTML-fil
├── styles.css          # All styling (Temu-inspirerad design)
├── app.js              # Huvudapplikation och routing
├── router.js           # Client-side routing
├── state.js            # Global state management
├── api.js              # API-klient
├── auth.js             # Autentisering
├── products.js         # Produktvisning och filtrering
├── cart.js             # Varukorgsfunktionalitet
├── checkout.js         # Checkout och betalning
├── user.js             # Användarprofil och ordrar
├── utils.js            # Hjälpfunktioner
├── data.json           # Produktdata (25 produkter)
├── server.js           # Minimal backend server
└── README.md           # Denna fil
```

## 🛠️ Installation

### Förutsättningar

- Node.js (v14 eller senare)
- npm eller yarn

### Steg 1: Klona projektet

```bash
git clone <repository-url>
cd e-handel
```

### Steg 2: Installera beroenden (inga externa dependencies krävs!)

Projektet använder vanilla JavaScript utan externa dependencies. Du behöver bara Node.js för att köra servern.

### Steg 3: Starta servern

```bash
node server.js
```

Servern startar på `http://localhost:3000`

## 🌐 Deployment till GitHub Pages

### Metod 1: Statisk deployment (endast frontend)

1. Skapa ett nytt GitHub repository
2. Pusha koden:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

3. Gå till repository Settings → Pages
4. Välj "main" branch som källa
5. Klicka Save

Din webbplats kommer att vara tillgänglig på `https://<username>.github.io/<repository-name>/`

**OBS:** För full funktionalitet (backend API) behöver du deploya backend separat (se nedan).

### Metod 2: Full deployment med backend

För att få full funktionalitet med backend API, använd en av dessa tjänster:

#### Vercel (Rekommenderat)

1. Installera Vercel CLI:
```bash
npm i -g vercel
```

2. Deploya:
```bash
vercel
```

3. Följ instruktionerna i terminalen

#### Netlify

1. Installera Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploya:
```bash
netlify deploy
```

#### Railway

1. Gå till [railway.app](https://railway.app)
2. Anslut ditt GitHub repository
3. Railway deployer automatiskt

## 🔧 Konfiguration

### Betalningsleverantörer

För att aktivera riktiga betalningar, uppdatera följande:

#### Stripe

1. Skapa ett konto på [stripe.com](https://stripe.com)
2. Hämta din Public Key
3. Uppdatera i `index.html`:
```html
<script src="https://js.stripe.com/v3/"></script>
```
4. Uppdatera i `checkout.js`:
```javascript
this.stripe = window.Stripe('pk_live_YOUR_ACTUAL_KEY');
```

#### PayPal

1. Skapa ett konto på [paypal.com/developer](https://developer.paypal.com)
2. Hämta din Client ID
3. Uppdatera i `index.html`:
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=SEK"></script>
```

### Miljövariabler

För produktion, använd miljövariabler:

```bash
# .env
PORT=3000
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
```

## 📱 Användning

### Grundläggande flöde

1. **Bläddra produkter** - Startsidan visar alla produkter
2. **Sök & filtrera** - Använd sökfältet och filter för att hitta produkter
3. **Lägg till i varukorg** - Klicka på "Lägg i varukorg"
4. **Gå till kassan** - Klicka på varukorgsikonen
5. **Slutför köp** - Fyll i leveransadress och välj betalmetod
6. **Orderbekräftelse** - Se din orderbekräftelse

### Med användarkonto

1. **Registrera** - Klicka på "Konto" → "Registrera dig här"
2. **Logga in** - Använd din e-post och lösenord
3. **Se ordrar** - Gå till "Mina ordrar" för att se orderhistorik
4. **Favoriter** - Klicka på hjärtikonen för att spara favoriter

## 🏗️ Arkitektur

### Frontend

- **Vanilla JavaScript** - Ingen ramverk, ren JavaScript
- **ES6 Modules** - Modulär kodstruktur
- **Client-side routing** - SPA med router.js
- **State management** - Centraliserad state med observer pattern
- **LocalStorage** - För varukorg, favoriter och användarsession

### Backend

- **Node.js HTTP Server** - Minimal server utan Express
- **In-memory storage** - För demo (använd databas i produktion)
- **RESTful API** - Standardiserade endpoints
- **CORS-enabled** - Tillåter cross-origin requests

### API Endpoints

```
POST   /api/auth/register        # Registrera användare
POST   /api/auth/login           # Logga in
GET    /api/products             # Hämta alla produkter
GET    /api/products/:id         # Hämta en produkt
POST   /api/orders               # Skapa order
GET    /api/orders/:userId       # Hämta användarens ordrar
POST   /api/payment/stripe       # Stripe-betalning
POST   /api/payment/paypal       # PayPal-betalning
```

## 🎨 Design

Designen är inspirerad av Temu med fokus på:

- **Minimalism** - Ren och enkel design
- **Färgschema** - Orange (#FF6B35) som primärfärg
- **Typografi** - System fonts för snabb laddning
- **Responsivitet** - Mobile-first approach
- **Användarvänlighet** - Tydliga call-to-actions

## 🔒 Säkerhet

- **Input-validering** - All användarinput valideras
- **XSS-skydd** - HTML sanitization
- **Password hashing** - Lösenord hashas (använd bcrypt i produktion)
- **HTTPS** - Använd alltid HTTPS i produktion
- **CORS** - Konfigurerad för säker cross-origin access

## 📊 Prestanda

- **Minimal JavaScript** - Endast 15 filer, ingen bloat
- **Lazy loading** - Bilder laddas vid behov
- **Debouncing** - Sökfunktion optimerad
- **Caching** - Produktdata cachas
- **Optimerade bilder** - WebP-format rekommenderas

## 🧪 Testing

För att testa applikationen:

1. **Manuell testning** - Testa alla flöden manuellt
2. **Olika enheter** - Testa på mobil, surfplatta och desktop
3. **Olika webbläsare** - Chrome, Firefox, Safari, Edge

### Testscenarier

- [ ] Registrera nytt konto
- [ ] Logga in med befintligt konto
- [ ] Sök efter produkter
- [ ] Filtrera produkter efter kategori och pris
- [ ] Lägg till produkter i varukorg
- [ ] Uppdatera kvantitet i varukorg
- [ ] Ta bort produkter från varukorg
- [ ] Genomför gästköp
- [ ] Genomför köp som inloggad användare
- [ ] Se orderhistorik
- [ ] Lägg till/ta bort favoriter
- [ ] Testa responsiv design

## 🐛 Felsökning

### Servern startar inte

```bash
# Kontrollera att port 3000 är ledig
lsof -i :3000

# Eller använd en annan port
PORT=8080 node server.js
```

### Bilder laddas inte

- Kontrollera att bildlänkar i `data.json` är giltiga
- Använd lokala bilder istället för externa länkar

### Betalning fungerar inte

- Detta är en demo-implementation
- För riktiga betalningar, implementera Stripe/PayPal korrekt
- Se dokumentation på stripe.com och paypal.com

## 📝 Licens

Detta projekt är skapat för utbildningssyfte.

## 👥 Kontakt

För frågor eller support, kontakta projektägaren.

## 🎯 Framtida förbättringar

- [ ] Produktrecensioner
- [ ] Produktbetyg
- [ ] Önskelistor
- [ ] Kuponger och rabattkoder
- [ ] Produktjämförelse
- [ ] Avancerad sökning
- [ ] Produktrekommendationer
- [ ] E-postnotifikationer
- [ ] Admin-panel
- [ ] Analytics integration

---

**Byggd med ❤️ och vanilla JavaScript**
