# 🚀 Local Service Website Generator

**Professional website generator for local service businesses** - Create stunning, conversion-optimized landing pages in minutes!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Eleventy](https://img.shields.io/badge/eleventy-3.1.2-orange.svg)

> Perfect for locksmiths, electricians, auto repair, and other emergency services

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Your site will be available at `http://localhost:8080/`

## 🛠️ Generate Custom Configuration

Use the interactive CLI to generate a customized `src/_data/site.json`:

```bash
npm run generate
```

The generator will prompt you for:
- Business type (depanneur/serrurier)
- Business name and contact info
- Service areas
- Color scheme
- Feature toggles (gallery, reviews, pricing)

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
