# EROS PARIS — Thème Shopify

Thème sur mesure. Noir / blanc / chrome. Mobile-first. 80 % visuel, 20 % texte.
Construit sur les données réelles de la boutique : produits, variantes, prix, stock, panier.
Aucun produit codé en dur, aucune donnée Shopify remplacée.

---

## 1. Architecture

```
assets/
  eros-base.css        design system (couleurs, typo, boutons, reveal, chrome)
  eros-components.css  header, drawers, cartes, hero, portes, campagne, footer
  eros-templates.css   fiche produit, collection, panier, compte
  eros-theme.js        header sticky, drawers, panier AJAX, reveal, recherche live
  eros-product.js      variantes, galerie, zoom, sticky add-to-cart, reco
config/
  settings_schema.json réglages globaux (typo, produits, panier, LA PROMESSE, socials)
  settings_data.json   valeurs par défaut
layout/
  theme.liquid         layout principal
  password.liquid      page mot de passe
locales/
  fr.default.json      tous les textes d'interface, en français
sections/
  header-group.json / footer-group.json    groupes de sections
  header, announcement-bar, footer
  hero, eros-doors, featured-collection, category-grid,
  lifestyle-campaign, eros-promise, eros-duo, social-editorial,
  ticker, newsletter, rich-text, faq, contact-form
  main-product, main-collection, main-cart, main-search, main-page,
  main-blog, main-article, main-list-collections, main-404
  product-recommendations, cart-drawer, predictive-search  (techniques)
snippets/
  product-card, price, icon, cart-drawer, search-drawer, meta-tags
templates/
  index / product / collection / cart / search / page / 404 / blog / article
  page.pour-soi.json · page.la-promesse.json · page.duo.json
  page.contact.json · page.faq.json
  customers/*.liquid
```

Toutes les sections sont configurables depuis l'éditeur de thème : textes, images,
vidéos, produits, collections, liens, visuel desktop et mobile séparés là où c'est utile.

---

## 2. L'architecture de marque : les trois portes

Le concept commercial est intégré au design, pas ajouté comme catégorie :

| Porte | Où c'est visible |
|---|---|
| **POUR SOI** | section « Les 3 portes » (homepage), menu mobile, nav, `templates/page.pour-soi.json` |
| **LA PROMESSE** | section « Les 3 portes », section dédiée `eros-promise`, encart sur chaque fiche produit, nav (point chrome), `templates/page.la-promesse.json` |
| **DUO** | section « Les 3 portes », section `eros-duo` avec une vraie paire de produits du catalogue, `templates/page.duo.json` |

**Important sur LA PROMESSE** : aucune fonctionnalité non développée n'est annoncée.
Le thème présente le concept, pas de numéro de Promesse, pas de certificat, pas de QR code.
Un champ optionnel « destinataire » existe sur la fiche produit (bloc Achat → *Champ destinataire*) :
il ajoute simplement une note libre à la ligne de commande. Il est **désactivé par défaut**.
Quand le système évoluera, ce champ est le point d'accroche naturel.

---

## 3. Mise en route

### a) Menus (Boutique en ligne → Navigation)
Menu principal suggéré :
```
NOUVEAUTÉS · BEST-SELLERS · BRACELETS · CHAÎNES · COLLIERS · BAGUES · BOUCLES D'OREILLES
POUR SOI · LA PROMESSE · DUO
```
Menu `footer` pour la colonne BOUTIQUE, et un menu « Légal » pour mentions légales / CGV / confidentialité
(à relier dans Pied de page → *Menu légal*).

### b) Pages à créer (Boutique en ligne → Pages)
| Page | Handle attendu | Template |
|---|---|---|
| POUR SOI | `pour-soi` | `page.pour-soi` |
| LA PROMESSE | `la-promesse` | `page.la-promesse` |
| DUO | `duo` | `page.duo` |
| FAQ | `faq` | `page.faq` |
| Contact | `contact` | `page.contact` |
| Livraison / Retours / Entretien / CGV / Mentions légales / Confidentialité | libre | `page` |

Les pages LIVRAISON, RETOURS et ENTRETIEN peuvent être réutilisées telles quelles dans
les accordéons de la fiche produit (bloc Informations → *Ou page Shopify*).

### c) Collections
Le catalogue actuel est organisé par **tags** (`bracelet`, `collier`, `bague`,
`boucles-oreilles`, `cuban`, `tennis`, `chaine-de-main`). Deux options :

1. Créer des collections automatiques par tag (recommandé) et les sélectionner dans
   la section **Catégories**.
2. En attendant, chaque bloc Catégorie accepte un **lien personnalisé** :
   `/search?q=bracelet` par exemple.

Collections utiles : NOUVEAUTÉS, BEST-SELLERS, BRACELETS, CHAÎNES, COLLIERS, BAGUES,
BOUCLES D'OREILLES, DUO, POUR SOI.

### d) Visuels
Chargez les images dans Contenu → Fichiers, puis sélectionnez-les dans l'éditeur.
Hero et Campagne acceptent une image **desktop** et une image **mobile** distinctes,
ou une vidéo MP4 (collez l'URL du fichier).

Direction artistique : flash photography, chrome, nuit, hôtels, voitures, bijoux très visibles.
Les bijoux doivent rester le sujet : les voiles sombres des sections sont réglables
(*Assombrissement haut / bas*).

### e) Badge NOUVEAUTÉ
Réglages → Produits → *Tag affichant le badge*. Par défaut `nouveaute` : taguez les produits concernés.

---

## 4. Performance et mobile

- Aucune librairie externe, aucun framework. ~25 ko de JS non minifié au total.
- Images en `srcset` + `sizes`, `loading="lazy"` partout sauf le hero.
- Vidéos en lecture uniquement lorsqu'elles sont visibles.
- Animations : reveal court (0,5 s), hover produits, sweep de lumière, chrome animé.
  Tout est désactivé automatiquement si `prefers-reduced-motion` est actif.
- Sticky add-to-cart mobile, galerie en swipe avec compteur, panier en panneau latéral.
- Le site reste fonctionnel sans JavaScript (formulaires natifs Shopify).

---

## 5. Installation comme thème non publié

Le thème n'écrase rien tant que vous ne le publiez pas.

**Option A — ZIP**
Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier ZIP.
Il apparaît dans « Thèmes de la bibliothèque » : cliquez sur **Aperçu**.

**Option B — GitHub**
Boutique en ligne → Thèmes → Ajouter un thème → Connecter depuis GitHub,
puis sélectionnez ce dépôt et la branche `claude/eros-paris-shopify-theme-636g3h`.

Dans les deux cas, publiez seulement après validation de l'aperçu.
