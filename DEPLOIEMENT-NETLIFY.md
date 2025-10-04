# 🚀 DÉPLOIEMENT NETLIFY - GUIDE COMPLET

**Objectif :** Déployer tes pages démo sur Netlify pour avoir des URLs publiques à envoyer aux prospects.

---

## ✅ PRÉREQUIS

- Compte GitHub (gratuit)
- Compte Netlify (gratuit)
- Les 9 pages démo générées (`npm run generate:demos`)

---

## 📦 ÉTAPE 1 : CRÉER UN REPO GITHUB

### **Option A : Via l'interface GitHub**
1. Va sur https://github.com/new
2. Nom du repo : `tekna-demos`
3. Public ou Private (Private recommandé)
4. **NE PAS** cocher "Initialize with README"
5. Clique "Create repository"

### **Option B : Via la ligne de commande**
```bash
cd /Users/tekna/Documents/tekna-starter

# Initialiser Git (si pas déjà fait)
git init

# Créer .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env.local
.env
tally-data.json
current-submission.json
input/
EOF

# Premier commit
git add .
git commit -m "Initial commit - Pages démo"

# Ajouter le remote (remplace USERNAME par ton username GitHub)
git remote add origin https://github.com/USERNAME/tekna-demos.git

# Push
git push -u origin main
```

---

## 🌐 ÉTAPE 2 : DÉPLOYER SUR NETLIFY

### **Méthode 1 : Via l'interface Netlify (Recommandé)**

1. Va sur https://netlify.com
2. Clique "Add new site" → "Import an existing project"
3. Choisis "GitHub"
4. Autorise Netlify à accéder à ton repo
5. Sélectionne `tekna-demos`
6. **Configuration du build :**
   - Build command : `npm run generate:demos && npx @11ty/eleventy`
   - Publish directory : `_site`
7. Clique "Deploy site"

### **Méthode 2 : Via Netlify CLI (Plus rapide)**

```bash
# Installer Netlify CLI
npm install netlify-cli -g

# Login
netlify login

# Initialiser le site
netlify init

# Suivre les étapes :
# - Create & configure a new site
# - Team : Ton team
# - Site name : tekna-demos (ou autre)
# - Build command : npm run generate:demos && npx @11ty/eleventy
# - Publish directory : _site

# Déployer
netlify deploy --prod
```

---

## 🎯 ÉTAPE 3 : CONFIGURER LE DOMAINE

### **Option A : Sous-domaine Netlify (gratuit)**
Ton site sera sur : `https://tekna-demos.netlify.app`

### **Option B : Domaine personnalisé**
Si tu as un domaine (ex: `demos.tekna.studio`) :

1. Dans Netlify → Settings → Domain management
2. Add custom domain : `demos.tekna.studio`
3. Ajoute un CNAME dans ton DNS :
   ```
   demos.tekna.studio → tekna-demos.netlify.app
   ```

---

## 📋 ÉTAPE 4 : TESTER LES URLS

Une fois déployé, tu auras :

### **Page d'accueil des démos :**
```
https://tekna-demos.netlify.app/demos/
```

### **URLs par métier et pack :**

**Dépanneur :**
- Lite : `https://tekna-demos.netlify.app/demos/depanneur/lite/`
- Standard : `https://tekna-demos.netlify.app/demos/depanneur/standard/`
- Premium : `https://tekna-demos.netlify.app/demos/depanneur/premium/`

**Électricien :**
- Lite : `https://tekna-demos.netlify.app/demos/electricien/lite/`
- Standard : `https://tekna-demos.netlify.app/demos/electricien/standard/`
- Premium : `https://tekna-demos.netlify.app/demos/electricien/premium/`

**Serrurier :**
- Lite : `https://tekna-demos.netlify.app/demos/serrurier/lite/`
- Standard : `https://tekna-demos.netlify.app/demos/serrurier/standard/`
- Premium : `https://tekna-demos.netlify.app/demos/serrurier/premium/`

---

## 💡 UTILISATION POUR LA PROSPECTION

### **Template Email de Prospection**

```
Objet : Site web professionnel pour votre activité de [métier]

Bonjour [Nom],

Je crée des sites web modernes pour les artisans.

Voici des exemples concrets pour [métier] :
👉 https://tekna-demos.netlify.app/demos/[métier]/lite/ (299€)
👉 https://tekna-demos.netlify.app/demos/[métier]/standard/ (499€)
👉 https://tekna-demos.netlify.app/demos/[métier]/premium/ (799€)

Cliquez pour voir les différences entre les formules.

Intéressé ? Répondez à ce mail ou appelez-moi !

Cordialement,
[Ton nom]
```

### **Message LinkedIn**

```
Bonjour [Prénom],

J'ai vu que vous êtes [serrurier/électricien/dépanneur] à [ville].

J'ai créé des démos de sites web spécialement pour votre métier :
🔗 [lien vers /demos/[métier]/]

3 formules de 299€ à 799€.
Jetez un œil, ça prend 2 minutes 😊

Bonne journée !
```

---

## 🔄 MISE À JOUR DES DÉMOS

Quand tu modifies les démos localement :

```bash
# 1. Régénérer les démos
npm run generate:demos

# 2. Commit + Push
git add .
git commit -m "Mise à jour démos"
git push

# Netlify redéploie automatiquement ! ✨
```

Ou en manuel avec CLI :
```bash
npm run generate:demos
netlify deploy --prod
```

---

## 🎨 PERSONNALISATION DES DÉMOS

Pour modifier une démo (ex: changer les avis clients, photos, etc.) :

1. Édite `presets/demo-depanneur.json` (ou electricien/serrurier)
2. Modifie les données (reviews, gallery, etc.)
3. Régénère : `npm run generate:demos`
4. Deploy : `git push` ou `netlify deploy --prod`

---

## 📊 ANALYTICS (Optionnel)

Pour voir combien de prospects visitent tes démos :

1. Dans Netlify → Analytics → Enable Analytics
2. Ou ajouter Google Analytics dans `base.njk`

---

## ⚠️ POINTS D'ATTENTION

### **1. Assets (images, CSS, JS)**
Vérifie que tous les assets se chargent bien en production.

### **2. Liens relatifs**
Utilise des chemins absolus : `/assets/...` plutôt que `assets/...`

### **3. Build time**
Netlify gratuit = 300 minutes de build/mois.
Tes builds prennent ~30 secondes = 600 builds possibles/mois.

### **4. Cache**
Netlify cache automatiquement.
Si les modifs n'apparaissent pas : CTRL+SHIFT+R pour hard refresh.

---

## 🚀 CHECKLIST AVANT PROSPECTION

- [ ] Pages démo générées localement
- [ ] Repo GitHub créé et pushé
- [ ] Site Netlify déployé
- [ ] Toutes les URLs testées et fonctionnelles
- [ ] Assets (images, CSS) chargent correctement
- [ ] Page /demos/ accessible
- [ ] Template email/LinkedIn préparé

---

## 💰 COÛTS

**Netlify gratuit** :
- ✅ 100 GB bande passante/mois
- ✅ 300 min build/mois
- ✅ HTTPS automatique
- ✅ Redéploiement auto sur git push

**Largement suffisant pour tes démos !**

---

## 📞 PROCHAINES ÉTAPES

1. ✅ Déployer sur Netlify
2. ✅ Tester toutes les URLs
3. ✅ Créer ton pitch commercial
4. ✅ Commencer à prospecter !

**Une fois que le client dit "OK j'aime bien le Standard", tu utilises `npm run auto` pour créer SON site personnalisé.**

---

🎉 **Tu es prêt à prospecter avec des démos live !**
