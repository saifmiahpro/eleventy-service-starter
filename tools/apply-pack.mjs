export function applyPack(site) {
  const pack = (site.PACK || "lite").toLowerCase();

  // Defaults OFF
  let enable = {
    BANNER: false, GALLERY: false, REVIEWS: false, PRICING: false,
    GUARANTEES: false, CERTS: false
  };
  let caps = { photos: 0, reviews: 0, prices: 0 };

  if (pack === "lite") {
    site.TEXT_MODE = "simple";
    enable = { ...enable };
    caps = { photos: 0, reviews: 0, prices: 0 };
  } else if (pack === "standard") {
    site.TEXT_MODE = site.TEXT_MODE || "simple";
    // Respecte 2 modules choisis par l'utilisateur (sinon pick par défaut)
    const chosen = Array.isArray(site.MODULES) ? site.MODULES : ["bandeau", "avis"];
    enable.BANNER = chosen.includes("bandeau");
    enable.GALLERY = chosen.includes("galerie");
    enable.REVIEWS = chosen.includes("avis");
    enable.PRICING = chosen.includes("tarifs");
    // descriptions est géré par TEXT_MODE + descriptions brèves
    caps = { photos: 8, reviews: 3, prices: 6 };
  } else { // premium
    site.TEXT_MODE = "detail";
    enable = { BANNER: true, GALLERY: true, REVIEWS: true, PRICING: true, GUARANTEES: true, CERTS: true };
    caps = { photos: 16, reviews: 6, prices: 10 };
  }

  site.BANNER_ENABLED   = !!enable.BANNER;
  site.ENABLE_GALLERY   = !!enable.GALLERY;
  site.ENABLE_REVIEWS   = !!enable.REVIEWS;
  site.ENABLE_PRICING   = !!enable.PRICING;
  site.SHOW_GUARANTEES  = !!enable.GUARANTEES;
  site.ENABLE_CERTS     = !!enable.CERTS;

  site._CAPS = caps;
  return site;
}

// Fonction pour backfill avec placeholders intelligents
export function backfillWithPlaceholders(site, placeholders) {
  // Avis clients avec placeholders par métier
  if (site.ENABLE_REVIEWS) {
    if (!Array.isArray(site.REVIEWS) || site.REVIEWS.length === 0) {
      site.REVIEWS = (placeholders.REVIEWS || []).slice(0, site._CAPS?.reviews || 3);
    } else {
      site.REVIEWS = site.REVIEWS.slice(0, site._CAPS?.reviews || 3);
    }
  }

  // Galerie avec placeholders par métier
  if (site.ENABLE_GALLERY) {
    if (!Array.isArray(site.GALLERY) || site.GALLERY.length === 0) {
      site.GALLERY = (placeholders.GALLERY || []).slice(0, site._CAPS?.photos || 8);
    } else {
      site.GALLERY = site.GALLERY.slice(0, site._CAPS?.photos || 8);
    }
  }

  // Pricing avec placeholders par métier
  if (site.ENABLE_PRICING) {
    if (!Array.isArray(site.PRICING) || site.PRICING.length === 0) {
      site.PRICING = (placeholders.PRICING || []).slice(0, site._CAPS?.prices || 6);
    } else {
      site.PRICING = site.PRICING.slice(0, site._CAPS?.prices || 6);
    }
  }

  return site;
}
