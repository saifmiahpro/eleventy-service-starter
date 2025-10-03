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
```bash
node scripts/set-trade.mjs depanneur    # 🚛 Dépannage auto
node scripts/set-trade.mjs serrurier    # 🔐 Serrurerie  
node scripts/set-trade.mjs electricien  # ⚡ Électricité
```

### **Modifier les couleurs**
```bash
# Par nom (comme réponses Tally)
node scripts/set-color-name.mjs rouge
node scripts/set-color-name.mjs bleu
node scripts/set-color-name.mjs vert
node scripts/set-color-name.mjs jaune

# Par code hex
node scripts/set-color.mjs #e74c3c
```

### **Personnaliser les textes**
```bash
node scripts/set-text.mjs HERO_TEXT "🔧 Mon Titre Personnalisé"
node scripts/set-text.mjs BUSINESS_NAME "MonEntreprise Pro"
node scripts/set-text.mjs URGENCY_TEXT "🚨 URGENCE 24/7"
```

### **Changer les variantes d'affichage**
```bash
node scripts/set-variant.mjs services grid      # Services en grille
node scripts/set-variant.mjs services carousel  # Services en carrousel
node scripts/set-variant.mjs services list      # Services en liste
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
