# Input Configuration

This directory contains configuration files exported from Tally forms.

## Supported Formats

### JSON Format (`site-config.json`)
Standard JSON format with all configuration options.

### Markdown Format (`site-config.md`)
Tally form export format with key-value pairs:

```markdown
Business Name: Serrurerie Express 31
Business Type: serrurier
City: Toulouse
Phone: 0612345678
Email: contact@serrurerie-express31.fr
...
```

## Required Fields

- `business_name` - Company name
- `business_type` - One of: `serrurier`, `depanneur`, `electricien`
- `city` - Main city of operation
- `phone` - Contact phone number
- `email` - Contact email address

## Optional Fields

- `address` - Full business address
- `service_areas` - Comma-separated list of service areas
- `availability` - "24/7" or business hours
- `response_time` - Average response time
- `accent_color` - Brand color (hex format)
- `hero_title` - Main headline
- `hero_subtitle` - Subtitle text
- `description` - Short business description
- `cta_primary` - Primary button text
- `cta_secondary` - Secondary button text
- `urgency_banner` - Emergency banner text
- `trust_badges` - Comma-separated trust indicators

## Module Toggles

Set to `"true"` to enable, `"false"` or omit to disable:

- `enable_gallery` - Photo gallery section
- `enable_reviews` - Customer testimonials
- `enable_pricing` - Pricing table
- `enable_emergency_banner` - Animated urgency banner
- `enable_section_descriptions` - Section descriptions
- `enable_about_extended` - Extended about section
- `enable_trust_section` - Trust/guarantees section
- `enable_certifications` - Certifications section

## Usage

1. Export your Tally form results to this directory as `site-config.json` or `site-config.md`
2. Run `npm run generate` to build the site
3. Use `npm run dev` to preview

## Sample

See `site-config.sample.json` for a complete example configuration.
