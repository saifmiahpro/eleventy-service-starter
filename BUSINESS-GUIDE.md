# 🚀 Guide Business - Template System

## 💰 Grille Tarifaire

### Package de Base - 300€
**Inclus dans tous les sites:**
- ✅ Hero section avec CTA optimisé
- ✅ Section services (jusqu'à 6 services)
- ✅ Zones d'intervention
- ✅ FAQ (jusqu'à 8 questions)
- ✅ Section contact avec Google Maps
- ✅ Design responsive mobile/desktop
- ✅ Optimisation SEO de base
- ✅ Hébergement 1 an inclus

### Fonctionnalités Premium

#### 📝 Descriptions de Sections (+100€)
- Texte descriptif sous chaque titre de section
- Améliore le SEO et l'engagement
- Contenu professionnel pré-rédigé
- **Toggle:** `ENABLE_SECTION_DESCRIPTIONS: true`

#### 📖 Section "À Propos" Étendue (+150€)
- Histoire de l'entreprise détaillée
- Liste des points forts avec icônes
- Mise en avant de l'expérience
- **Toggle:** `ENABLE_ABOUT_EXTENDED: true`

#### 🛡️ Section Garanties/Confiance (+150€)
- 4 cartes de garanties avec icônes
- Rassure les clients potentiels
- Augmente les conversions
- **Toggle:** `ENABLE_TRUST_SECTION: true`

#### 🏆 Section Certifications (+250€)
- Mise en avant des agréments
- Badges de confiance professionnels
- Crédibilité renforcée
- **Toggle:** `ENABLE_CERTIFICATIONS: true`

### Modules Standards (Inclus)

#### 🚨 Bandeau d'Urgence Animé
- Texte défilant rouge en haut
- Crée l'urgence et l'action
- Animation professionnelle

#### ⭐ Avis Clients
- Témoignages avec étoiles
- Social proof efficace
- Jusqu'à 10 avis

#### 💰 Grille Tarifaire
- Présentation claire des prix
- Transparence commerciale
- Cartes avec hover effects

#### 🖼️ Galerie Photos
- Showcase du travail
- Images optimisées
- Layout responsive

## 🎯 Workflow Client

### 1. Découverte Client
```bash
npm run generate
```

**Questions posées:**
- Secteur d'activité (depanneur/serrurier/electricien)
- Informations business (nom, ville, contact)
- Zones d'intervention
- Couleur de marque
- Logo disponible ?
- Fonctionnalités premium souhaitées

### 2. Génération Automatique
- Configuration `site.json` créée
- Preset métier appliqué
- Tokens remplacés ({{CITY}}, etc.)
- Calcul automatique du prix

### 3. Développement
```bash
npm run dev    # Preview en temps réel
npm run build  # Version finale
```

### 4. Livraison
- Site statique prêt à déployer
- Documentation fournie
- Formation client (optionnelle)

## 📊 Exemples de Pricing

### Client Basique - Serrurier Toulouse
- Package de base: **300€**
- Total: **300€**

### Client Premium - Dépanneur Lyon  
- Package de base: 300€
- Descriptions de sections: +100€
- Section "À propos" étendue: +150€
- Section garanties: +150€
- **Total: 700€**

### Client Professionnel - Électricien Paris
- Package de base: 300€
- Toutes les fonctionnalités premium: +650€
- **Total: 950€**

## 🔧 Personnalisation Avancée

### Ajout d'un Nouveau Métier

1. **Créer le preset:**
```bash
mkdir presets/plombier
```

2. **Définir les services spécifiques:**
```json
{
  "NICHE": "plombier",
  "ACCENT": "#1e88e5",
  "HERO_TEXT": "Plombier 24/7 à {{CITY}} — Intervention Rapide",
  "SERVICES": [
    {
      "title": "Fuite d'eau",
      "desc": "Réparation urgente, détection et colmatage."
    }
  ]
}
```

3. **Mettre à jour le générateur:**
```javascript
if (!['depanneur', 'serrurier', 'electricien', 'plombier'].includes(niche))
```

### Customisation Client

**Couleurs:**
- Modifier `ACCENT` dans `site.json`
- CSS custom properties automatiques

**Contenu:**
- Tous les textes dans `site.json`
- Modification en temps réel

**Modules:**
- Toggle on/off via `ENABLE_*` flags
- Facturation modulaire

## 📈 Optimisations Business

### Upselling Facile
1. Montrer le site de base
2. Démontrer les fonctionnalités premium
3. Calculateur de prix automatique
4. Devis instantané

### Efficacité Maximale
- **5 minutes** pour générer un site
- **30 minutes** pour personnaliser
- **1 heure** pour livrer

### Évolutivité
- Nouveaux métiers facilement ajoutables
- Fonctionnalités premium extensibles
- Templates réutilisables

## 🎨 Assets Client

### Logo
- Format: PNG/SVG recommandé
- Taille: Max 200px de large
- Fond transparent
- Filtre blanc automatique sur hero

### Photos Galerie
- Format: JPG optimisé
- Taille: 800x600px recommandé
- Compression automatique
- Lazy loading inclus

### Contenu Texte
- Services: Titre + description courte
- FAQ: Questions/réponses métier
- Témoignages: Nom + avis + note

## 🚀 Déploiement

### Hébergement Recommandé
1. **Netlify** (gratuit/payant)
2. **Vercel** (gratuit/payant) 
3. **GitHub Pages** (gratuit)

### Domaine Client
- Configuration DNS simple
- HTTPS automatique
- CDN global inclus

---

**💡 Conseil:** Commencez toujours par le package de base, puis proposez les upgrades après avoir montré la valeur.
