# 🛠️ Commandes CLI - Personnalisation Site

## 🎯 **Workflow Principal**

```bash
# 1. Importer une soumission Tally et générer le site
npm run auto

# 2. Lancer le serveur de développement
npm run dev
```

## 🎨 **Personnalisation**

### **Changer de métier**
node scripts/set-trade.mjs depanneur    # 🚛 Dépannage auto
node scripts/set-trade.mjs serrurier    # 🔐 Serrurerie  
node scripts/set-trade.mjs electricien  # ⚡ Électricité

### 🎨 Personnalisation des couleurs

```bash
# Changer la couleur d'accent
node scripts/set-color-name.mjs rouge
node scripts/set-color-name.mjs bleu
node scripts/set-color-name.mjs vert
node scripts/set-color-name.mjs jaune
```

## 🔧 Layouts des sections

```bash
# Changer le layout de la section Services
node scripts/set-services-layout.mjs grid      # Grille de cartes (défaut)
node scripts/set-services-layout.mjs carousel  # Défilement horizontal
node scripts/set-services-layout.mjs list      # Liste verticale
```

## 🎯 **Système Intelligent**

Le système utilise un **fallback automatique** :

1. **Données Tally** (identity.json) → Utilisées en priorité
2. **Placeholders métier** (trades.json) → Si données manquantes
3. **Couleurs et textes** → Adaptés automatiquement au métier

## 📊 **Métiers Supportés**

| Métier | Couleur | Texte Urgence | Services |
|--------|---------|---------------|----------|
| 🚛 Dépanneur | Rouge | DÉPANNAGE AUTO D'URGENCE | 4 services |
| 🔐 Serrurier | Gris foncé | SERRURIER D'URGENCE | 4 services |
| ⚡ Électricien | Bleu | ÉLECTRICIEN D'URGENCE | 4 services |

## 🔄 **Workflow Complet**

```bash
# 1. Importer soumission Tally
npm run auto

# 2. Personnaliser si besoin
node scripts/set-color-name.mjs bleu
node scripts/set-text.mjs HERO_TEXT "Mon titre"

# 3. Tester
npm run dev

# 4. Construire pour production
npm run build
```
