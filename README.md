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

### Method 3: Reset to Default

```bash
# Reset to clean default state
npm run reset
```

Your site will be available at `http://localhost:8080/`

## 🛠️ Tally Form Integration

This system is designed to work seamlessly with Tally form exports:

1. **Create a Tally form** with fields matching the configuration schema
2. **Export responses** as JSON or Markdown to `input/site-config.json`
3. **Run generator** with `npm run generate`
4. **Preview site** with `npm run dev`

### Configuration Schema

The generator expects these fields from your Tally form:

**Required:**
- `business_name`, `business_type`, `city`, `phone`, `email`

**Optional:**
- `address`, `service_areas`, `availability`, `response_time`
- `accent_color`, `hero_title`, `hero_subtitle`, `description`
- `enable_gallery`, `enable_reviews`, `enable_pricing`
- `reviews[]`, `pricing[]` (arrays for structured data)

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
