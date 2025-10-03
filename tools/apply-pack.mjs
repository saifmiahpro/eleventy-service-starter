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
