# 🚀 Local Service Website Generator

**Professional website generator for local service businesses** - Create stunning, conversion-optimized landing pages in minutes!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Eleventy](https://img.shields.io/badge/eleventy-3.1.2-orange.svg)

> Perfect for locksmiths, electricians, auto repair, and other emergency services

## 🚀 Quick Start

### Method 1: Tally Form Integration (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Export your Tally form results to input/site-config.json
# (See input/site-config.sample.json for format)

# 3. Generate site from config
npm run generate

# 4. Start development server
npm run dev
```

### Method 2: Interactive CLI

```bash
# Use the legacy interactive generator
npm run generate:cli
```

### Method 3: Generate 3 Commercial Offers

```bash
# From a single Tally submission, generate 3 pricing tiers
npm run generate:offers
```

This creates:
- **LITE** (250€, 48h) - Essential site with basic modules
- **STANDARD** (399€, ~3 jours) - Professional site + 2 modules choix
- **PREMIUM** (499€, 3-5 jours) - Complete site with all features + rédaction

Opens `offers/comparatif.html` to show client all 3 options!

## 📦 Pack System

### Pack Tiers

#### LITE - 250€ (48h)
- 1 page template: Hero, 3 Services max, Zones, Contact
- `TEXT_MODE: "simple"` (textes courts génériques)
- Modules OFF (bandeau, galerie, avis, tarifs, garanties, certifs)
- 1 révision légère

#### STANDARD - 399€ (~3 jours)
- Tout le Lite + 2 modules au choix parmi:
  - `bandeau_urgence`
  - `galerie` (≤8 photos)
  - `avis` (≤3 avis)
  - `tarifs` (≤6 prix)
  - `descriptions` (≈250 mots/section)
- `TEXT_MODE: "simple"` (par défaut)
- 2 révisions

#### PREMIUM - 499€ (3-5 jours)
- Tout le Standard + tous les modules activés
- `TEXT_MODE: "detail"` (≈400-600 mots: à-propos étendu + micro-descriptions)
- Caps augmentées: galerie(≤16), avis(≤6), tarifs(≤10)
- Sections garanties & certifications
- 3 révisions

### Pack Configuration

Set `PACK` in `input/site-config.json`:

```json
{
  "PACK": "standard",
  "MODULES": ["bandeau", "galerie"],
  "NICHE": "serrurier",
  "CITY": "Toulouse"
}
```

## 🎯 Niche Presets

### Available Niches

Three professional presets with vendeur French copy:

#### Serrurier
- Accent: `#f39c12` (orange)
- Services: Ouverture, Remplacement cylindre, Sécurisation
- Copy optimized for locksmith services

#### Depanneur
- Accent: `#e74c3c` (rouge)
- Services: Dépannage sur place, Remorquage, Ouverture véhicule
- Copy optimized for auto services

#### Electricien
- Accent: `#1e90ff` (bleu)
- Services: Dépannage électrique, Mise aux normes, Urgences 24/7
- Copy optimized for electrician services

### Automatic Placeholders

If Tally data is missing, presets auto-fill:
- Hero title with city injection (`{{CITY}}`)
- Services, FAQ, Pricing per niche
- Default images per niche
- Logo placeholder
- Trust guarantees

### Usage

```bash
# With minimal config
echo '{"PACK":"lite","NICHE":"serrurier","CITY":"Toulouse"}' > input/site-config.json
npm run generate
npm run dev
```

✅ **Result:** Fully functional MVP even with minimal client input!

## 🎨 Design & Branding

Page `/offres/` with tekNa Studio dark theme:
- Font Inter (from tekna.studio)
- Dark background (#0F0F0F) with rose gold accents (#F99395)
- Mobile-first responsive design
- 3 pricing cards with hover effects

### Method 4: Reset to Default

```bash
# Reset to clean default state
npm run reset
```

Your site will be available at `http://localhost:8080/`

## 🛠️ Tally Form Integration

This system integrates directly with Tally forms via API for seamless client onboarding.

### 🔑 Setup

1. **Create `.env.local`** (copy from `.env.example`):
```bash
TALLY_API_KEY=your_api_key_here
TALLY_FORM_ID=your_form_id_here
```

2. **Get your Tally credentials**:
   - API Key: https://tally.so/settings/api
   - Form ID: From your Tally form URL

### 🚀 Usage

#### Path A: Tally API Import (Recommended)

```bash
# Import submission by ID
npm run tally:pull -- --id=SUBMISSION_ID

# Import with image downloads (logo, hero)
npm run tally:pull -- --id=SUBMISSION_ID --download

# Generate site
npm run generate

# Preview
npm run dev
```

#### Path B: Manual JSON

1. Export Tally response or create `input/site-config.json` manually
2. Run `npm run generate`
3. Run `npm run dev`

### 📋 Tally Form Field Mapping

Create a Tally form with these fields (labels can vary, script will match):

| Tally Field Label | Config Key | Type | Required |
|------------------|------------|------|----------|
| Nom de l'entreprise | `business_name` | Text | ✅ |
| Type d'activité | `business_type` | Choice | ✅ |
| Ville | `city` | Text | ✅ |
| Téléphone | `phone` | Phone | ✅ |
| Email | `email` | Email | ✅ |
| Adresse | `address` | Text | - |
| Zones d'intervention | `service_areas` | Text | - |
| Disponibilité | `availability` | Choice | - |
| Temps de réponse | `response_time` | Text | - |
| Couleur | `accent_color` | Text | - |
| Logo | `logo` | File Upload | - |
| Image Hero | `image-hero` | File Upload | - |
| Activer Galerie | `enable_gallery` | Yes/No | - |
| Activer Avis | `enable_reviews` | Yes/No | - |
| Activer Tarifs | `enable_pricing` | Yes/No | - |

**Business Type Options**: `depanneur`, `serrurier`, `electricien`

**For Reviews** (optional, repeat for 3 reviews):
- `avis-1-nom`, `avis-1-texte`, `avis-1-note`
- `avis-2-nom`, `avis-2-texte`, `avis-2-note`
- `avis-3-nom`, `avis-3-texte`, `avis-3-note`

**For Pricing** (optional, repeat for 5 items):
- `tarif-1-service`, `tarif-1-prix`, `tarif-1-note`
- `tarif-2-service`, `tarif-2-prix`, `tarif-2-note`
- etc.

### 🎨 Image Handling

**With `--download` flag:**
- Downloads logo and hero images locally
- Saves to `assets/clients/<business-slug>-<id>/`
- Updates config with local paths

**Without `--download` flag:**
- Uses remote Tally URLs directly
- Faster import, but images hosted by Tally

### 🔄 Reset to Default

```bash
npm run reset
```

This will:
- ✅ Reset `src/_data/site.json` to default preset
- ✅ Reset `input/site-config.json` to sample template
- ✅ Preserve downloaded client assets in `assets/clients/`

### 🐛 Troubleshooting

**Error: TALLY_API_KEY required**
- Create `.env.local` with your API credentials

**Error: Submission not found**
- Verify the submission ID is correct
- Check that the form ID in `.env.local` matches

**Error: Missing fields**
- The generator uses sensible defaults for missing fields
- Only `business_name`, `business_type`, `city`, `phone`, `email` are required

**Images not showing**
- If using `--download`, check `assets/clients/` folder
- Ensure file extensions are supported (jpg, png, svg, webp)
- Verify paths in `input/site-config.json`

See `input/README.md` for complete field documentation.

## 📁 Project Structure

```
starter-kit-core/
├── .eleventy.js              # Eleventy configuration
├── package.json              # Dependencies and scripts
├── assets/
│   └── styles.css           # Main stylesheet
├── src/
│   ├── index.njk            # Homepage template
│   ├── _includes/
│   │   ├── base.njk         # Base HTML layout
│   │   ├── partials/        # Core page sections
│   │   │   ├── hero.njk
│   │   │   ├── services.njk
│   │   │   ├── zones.njk
│   │   │   ├── faq.njk
│   │   │   └── contact.njk
│   │   └── modules/         # Optional modules
│   │       ├── module-gallery.njk
│   │       ├── module-reviews.njk
│   │       └── module-pricing.njk
│   └── _data/
│       └── site.json        # Global site data
├── presets/                 # Business type presets
│   ├── depanneur/
│   │   └── preset.json
│   └── serrurier/
│       └── preset.json
└── tools/
    └── generate.js          # Configuration generator CLI
```

## 🎛️ Configuration

All site content is controlled via `src/_data/site.json`. Key sections:

### Core Settings
- `BUSINESS_NAME`, `CITY`, `PHONE_TEL`, `EMAIL`
- `ACCENT` - Primary color (hex)
- `IS_24_7` - Show 24/7 availability badge

### Content Sections
- `SERVICES[]` - Service offerings
- `AREAS[]` - Service areas
- `FAQ[]` - Frequently asked questions

### Optional Modules
Toggle with `ENABLE_*` flags:
- `ENABLE_GALLERY` - Photo gallery
- `ENABLE_REVIEWS` - Customer testimonials  
- `ENABLE_PRICING` - Pricing table

## 🎨 Customization

### Colors
Set your brand color in `site.json`:
```json
{
  "ACCENT": "#e74c3c"
}
```

### Adding Content
Edit arrays in `site.json`:
```json
{
  "SERVICES": [
    {
      "title": "Service Name",
      "desc": "Service description"
    }
  ]
}
```

### Layout Modifications
- Edit partials in `src/_includes/partials/`
- Modify modules in `src/_includes/modules/`
- Update styles in `assets/styles.css`

## 📱 Features

- ✅ Fully responsive design
- ✅ Modern CSS Grid/Flexbox layouts
- ✅ Semantic HTML structure
- ✅ Fast loading (minimal dependencies)
- ✅ SEO-friendly markup
- ✅ Accessible components
- ✅ French language optimized

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Push to GitHub  
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `_site`

### Manual
```bash
npm run build
# Upload _site/ folder to your web server
```

## 🔧 Development

### Directory Mapping
Eleventy is configured with:
- Input: `src/`
- Includes: `_includes/`
- Data: `_data/`
- Output: `_site/`

### Template Engine
Uses Nunjucks templating with:
- Layout inheritance via front matter
- Conditional includes for modules
- Global data access from `site.json`

## 📋 Business Presets

### Dépanneur (Towing/Roadside)
- Red accent color
- 24/7 availability emphasis
- Vehicle-specific services
- Emergency response messaging

### Serrurier (Locksmith)
- Orange accent color
- Security-focused services
- "No damage" guarantees
- Professional certifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run dev`
5. Submit a pull request

## 📄 License

MIT License - feel free to use for commercial projects.

---

Built with ❤️ using [Eleventy](https://11ty.dev)
