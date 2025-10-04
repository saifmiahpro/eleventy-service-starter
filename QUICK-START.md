# ⚡ QUICK START - DÉMARRAGE RAPIDE

**Pour prospecter DÈS MAINTENANT** 🚀

---

## 🎯 EN 3 COMMANDES

```bash
# 1. Générer les 9 pages démo
npm run generate:demos

# 2. Tester en local
npm start
# → Ouvre http://localhost:8080/demos/

# 3. Déployer sur Netlify
netlify deploy --prod
# (si pas installé : npm install -g netlify-cli)
```

**C'EST TOUT !** Tu as maintenant 9 pages démo publiques.

---

## 📧 TEMPLATES DE PROSPECTION

### **Email - Version courte**
```
Bonjour [Nom],

Sites web pour [métier] :
→ https://[ton-site].netlify.app/demos/[métier]/

3 formules de 299€ à 799€.
Comparez en 2 minutes !

Cordialement,
[Ton nom]
```

### **LinkedIn - Message direct**
```
Salut [Prénom] 👋

Site web pour [métier] à [ville] ?
J'ai des démos à te montrer : [lien]

Jette un œil, c'est rapide 😊
```

---

## 💰 QUAND IL DIT OUI

```bash
# Client remplit ton Tally → Tu génères son site :
npm run auto

# Sélectionne sa soumission
# → Site personnalisé créé !

# Deploy sur son domaine
netlify deploy --prod

# Facture → $$$ 💰
```

---

## 📁 FICHIERS IMPORTANTS

- `README-PROSPECTION.md` → Stratégie complète
- `DEPLOIEMENT-NETLIFY.md` → Guide déploiement
- `WORKFLOW-COMPLET.md` → Process détaillé

---

## 🆘 AIDE RAPIDE

**Problème de build ?**
```bash
rm -rf _site node_modules
npm install
npm run generate:demos
```

**Netlify ne déploie pas ?**
→ Vérifie `Build command` dans Settings

**Modifier une démo ?**
→ Édite `presets/demo-[metier].json`

---

🎉 **GO PROSPECTER !**
