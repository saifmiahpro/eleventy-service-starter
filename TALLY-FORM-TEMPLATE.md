# 📋 Formulaire Tally MVP — Template

Ce document définit le formulaire Tally minimal optimisé pour maximiser le taux de réponse tout en collectant les données essentielles.

## 🎯 Structure du Formulaire (7 questions essentielles)

### Page 1 : Informations Business (Obligatoire)

**Question 1 : Nom de l'entreprise**
- Type : Texte court
- Label : `Nom de l'entreprise`
- Placeholder : "Ex: Serrurerie Express 31"
- Obligatoire : Oui

**Question 2 : Type d'activité**
- Type : Choix unique
- Label : `Type d'activité`
- Options :
  - Serrurier
  - Dépanneur / Remorquage
  - Électricien
- Obligatoire : Oui

**Question 3 : Ville principale**
- Type : Texte court
- Label : `Ville`
- Placeholder : "Ex: Toulouse"
- Obligatoire : Oui

### Page 2 : Contact (Obligatoire)

**Question 4 : Téléphone**
- Type : Téléphone
- Label : `Téléphone`
- Format : France (+33)
- Obligatoire : Oui

**Question 5 : Email**
- Type : Email
- Label : `Email`
- Placeholder : "contact@votre-entreprise.fr"
- Obligatoire : Oui

### Page 3 : Disponibilité & Zones (Obligatoire)

**Question 6 : Disponibilité**
- Type : Choix unique
- Label : `Disponibilité`
- Options :
  - Service 24h/24 et 7j/7
  - Heures ouvrables uniquement
- Obligatoire : Oui

**Question 7 : Zones d'intervention**
- Type : Texte court
- Label : `Zones d'intervention`
- Placeholder : "Ex: Toulouse, Blagnac, Colomiers"
- Description : "Séparez par des virgules"
- Obligatoire : Oui

---

## 🎨 Questions Optionnelles (Page 4)

Ces questions améliorent le site mais ne sont pas bloquantes :

**Question 8 : Adresse complète**
- Type : Texte
- Label : `Adresse complète`
- Obligatoire : Non

**Question 9 : Temps de réponse moyen**
- Type : Texte court
- Label : `Temps de réponse moyen`
- Placeholder : "Ex: 20-30 minutes"
- Obligatoire : Non

**Question 10 : Couleur de marque**
- Type : Choix unique
- Label : `Couleur principale du site`
- Options :
  - Orange (#fd7e14) — Recommandé serrurier
  - Rouge (#e74c3c) — Recommandé dépanneur
  - Bleu (#3498db) — Recommandé électricien
  - Vert (#28a745)
  - Violet (#6f42c1)
- Obligatoire : Non

---

## 📸 Upload Images (Page 5 - Optionnel)

**Question 11 : Logo**
- Type : Upload fichier
- Label : `Logo de l'entreprise`
- Formats acceptés : PNG, JPG, SVG
- Taille max : 5MB
- Obligatoire : Non
- Description : "Si vous n'avez pas de logo, le nom de votre entreprise sera affiché"

**Question 12 : Image de fond**
- Type : Upload fichier
- Label : `Image de fond (hero)`
- Formats acceptés : JPG, PNG
- Taille max : 5MB
- Obligatoire : Non
- Description : "Photo de votre véhicule, équipe ou intervention"

---

## 🎯 Modules Premium (Page 6 - Optionnel)

**Question 13 : Activer la galerie photos**
- Type : Oui/Non
- Label : `Souhaitez-vous une galerie photos ?`
- Obligatoire : Non
- Note : "Ajoutez les photos dans assets/images/gallery/ après génération"

**Question 14 : Activer les avis clients**
- Type : Oui/Non
- Label : `Afficher des avis clients ?`
- Obligatoire : Non

**Si Oui à Q14 → Questions conditionnelles :**

**Avis 1-3** (répéter 3 fois) :
- `Avis 1 - Nom` (Texte court)
- `Avis 1 - Témoignage` (Texte long)
- `Avis 1 - Note` (Choix : 5, 4, 3)

**Question 15 : Afficher les tarifs**
- Type : Oui/Non
- Label : `Afficher une grille tarifaire ?`
- Obligatoire : Non

**Si Oui à Q15 → Questions conditionnelles :**

**Tarif 1-3** (répéter 3 fois) :
- `Tarif 1 - Service` (Texte court) "Ex: Ouverture de porte"
- `Tarif 1 - Prix` (Nombre) "Ex: 80"
- `Tarif 1 - Note` (Texte court) "Ex: Sans casse dans 90% des cas"

---

## 🎨 Page de fin

**Message de remerciement :**
```
✅ Merci ! Votre site sera généré dans les prochaines minutes.

Vous recevrez un email avec :
- Un lien de prévisualisation
- Les prochaines étapes
- Des conseils pour optimiser votre présence en ligne

Questions ? Contactez-nous à support@votre-domaine.fr
```

---

## 🔧 Configuration Tally Recommandée

### Paramètres généraux
- **Mode** : Conversationnel (une question à la fois)
- **Progression** : Afficher la barre de progression
- **Auto-sauvegarde** : Activé
- **Temps estimé** : 2-3 minutes

### Design
- **Thème** : Professionnel
- **Couleur primaire** : #f39c12 (orange)
- **Police** : Inter ou System UI

### Notifications
- **Email au client** : Oui (avec récapitulatif)
- **Email interne** : Oui (avec submissionId)
- **Webhook** : Optionnel (pour automatisation complète)

### Intégrations
- **Zapier/Make** : Possible pour déclencher automatiquement `npm run tally:pull`
- **API** : Utilisée par le script `tally-pull.mjs`

---

## 📊 Mapping des Champs

| Question Tally | Clé dans script | Transformation |
|----------------|-----------------|----------------|
| Nom de l'entreprise | `nom-de-l-entreprise` | → `business_name` |
| Type d'activité | `type-d-activite` | → `business_type` (normalized) |
| Ville | `ville` | → `city` |
| Téléphone | `telephone` | → `phone` (normalized +33) |
| Email | `email` | → `email` |
| Disponibilité | `disponibilite` | → `availability` + `is_24_7` |
| Zones d'intervention | `zones-d-intervention` | → `service_areas` (split) |
| Logo | `logo` | → File download si --download |
| Image de fond | `image-hero` | → File download si --download |
| Avis 1 - Nom | `avis-1-nom` | → `reviews[0].name` |
| Tarif 1 - Service | `tarif-1-service` | → `pricing[0].service` |

---

## 🚀 Workflow Complet

### Pour le client (2-3 min)
1. Reçoit le lien Tally
2. Remplit le formulaire (7 questions min, 15 max)
3. Soumet

### Pour vous (automatique ou 1 commande)

**Option 1 : Manuel**
```bash
# Récupérer le submissionId depuis l'email Tally
npm run tally:pull -- --id=abc123xyz --download
npm run generate
npm run dev
# Prévisualiser et valider
npm run build
# Déployer
```

**Option 2 : Automatique (avec Zapier/Make)**
1. Webhook Tally déclenche
2. Script auto-execute `tally:pull`
3. Génère le site
4. Deploy sur Netlify/Vercel
5. Email envoyé au client avec preview

---

## 💡 Conseils d'Optimisation

### Taux de complétion
- ✅ **7 questions obligatoires max** (taux ~80%)
- ✅ **Questions optionnelles en fin** (ne bloquent pas)
- ✅ **Mode conversationnel** (+30% complétion)
- ✅ **Barre de progression** (rassure l'utilisateur)

### Qualité des données
- ✅ **Placeholders explicites** (guide les réponses)
- ✅ **Validation des champs** (email, téléphone)
- ✅ **Choix pré-définis** (évite les erreurs de saisie)
- ✅ **Descriptions courtes** (clarifie sans surcharger)

### Upsell Premium
- ✅ **Modules en fin** (ne décourage pas au début)
- ✅ **Bénéfices clairs** (galerie → "Montrez vos réalisations")
- ✅ **Exemples visuels** (screenshots si possible)

---

## 🔗 Créer le Formulaire

1. **Accédez à** : https://tally.so/
2. **Créez un nouveau formulaire**
3. **Copiez la structure ci-dessus**
4. **Activez les intégrations** :
   - Email notifications
   - API access
5. **Testez** avec une soumission test
6. **Récupérez** :
   - Form ID : Dans l'URL
   - API Key : Settings → API

---

## ✅ Checklist de Validation

Avant de partager le formulaire :

- [ ] Toutes les questions essentielles sont présentes
- [ ] Les choix multiples ont les bonnes options
- [ ] Les placeholders sont clairs
- [ ] La validation des champs fonctionne
- [ ] Le message de fin est personnalisé
- [ ] Les notifications email sont configurées
- [ ] L'API est activée et testée
- [ ] Le script `tally:pull` fonctionne avec une soumission test
- [ ] Le site se génère correctement
- [ ] Les images uploadées fonctionnent avec `--download`

---

**Formulaire prêt à l'emploi !** 🚀

Pour toute question ou amélioration, consultez la documentation Tally : https://tally.so/help
