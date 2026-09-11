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

## 3. Configuration de la boutique (déjà faite)

Tout ce qui suit a été créé directement sur la boutique. Rien n'est à refaire.

### Menus (Boutique en ligne → Navigation)
| Menu | Handle | Contenu |
|---|---|---|
| Menu principal | `main-menu` | NOUVEAUTÉS · BEST-SELLERS · BIJOUX (sous-menu des 5 catégories) · POUR SOI · LA PROMESSE · DUO |
| Pied de page | `footer` | NOUVEAUTÉS + les 5 catégories + DUO |
| Légal | `legal` | MENTIONS LÉGALES · CGV · CONFIDENTIALITÉ |

### Pages
| Page | Handle | Template |
|---|---|---|
| POUR SOI | `pour-soi` | `page.pour-soi` |
| LA PROMESSE | `la-promesse` | `page.la-promesse` |
| DUO | `duo` | `page.duo` |
| FAQ | `faq` | `page.faq` (4 questions-réponses remplies) |
| Contact | `contact` | `page.contact` |
| LIVRAISON | `livraison` | `page` |
| RETOURS | `retours` | `page` |
| ENTRETIEN | `entretien` | `page` |
| MENTIONS LÉGALES | `mentions-legales` | `page` |
| CGV | `cgv` | `page` |
| POLITIQUE DE CONFIDENTIALITÉ | `politique-de-confidentialite` | `page` |

**⚠ Les 3 pages légales sont des trames.** Les champs `[À COMPLÉTER]`
(raison sociale, SIRET, RCS, TVA, médiateur) doivent être remplis, et les CGV
relues par un juriste, avant l'ouverture réelle de la boutique.

Les pages LIVRAISON, RETOURS et ENTRETIEN alimentent automatiquement les
accordéons de chaque fiche produit : un seul endroit à modifier.

### Collections
Créées automatiquement par tag (additives : aucun produit, prix, SKU ni stock
n'a été modifié).

| Collection | Handle | Règle | Produits | Image |
|---|---|---|---|---|
| BRACELETS | `bracelets` | tag `bracelet` ou `chaine-de-main` | 10 | ✓ |
| CHAÎNES | `chaines` | titre contient « Chaîne » | 1 | ✓ |
| COLLIERS | `colliers` | tag `collier` | 3 | ✓ |
| BAGUES | `bagues` | tag `bague` | 3 | ✓ |
| BOUCLES D'OREILLES | `boucles-d-oreilles` | tag `boucles-oreilles` | 3 | ✓ |
| POUR SOI | `pour-soi` | tout le catalogue | 20 | — |
| NOUVEAUTÉS | `nouveautes` | tag `nouveaute` | 0 | — |
| BEST-SELLERS | `best-sellers` | tag `best-seller` | 0 | — |
| DUO | `duo` | tag `duo` | 0 | — |
| LA PROMESSE | `la-promesse` | tag `promesse` | 0 | — |

Les quatre dernières sont des **bacs de curation** : taguez vos produits
`nouveaute`, `best-seller`, `duo` ou `promesse` et elles se remplissent seules.
Le tag `nouveaute` allume aussi le badge NOUVEAUTÉ sur les cartes produit.

CHAÎNES se base sur le titre car le tag `cuban` est partagé avec les bracelets.
Pour élargir, taguez vos chaînes `chaine` et ajoutez la règle correspondante.

### Produits
Les 20 produits sont **actifs**. Le suivi d'inventaire est désactivé
(`tracked: false`), donc tous restent achetables malgré un stock affiché à 0 :
aucune pièce n'apparaîtra « ÉPUISÉ ».

---

## 4. Ce qu'il reste à faire : les visuels

C'est le seul vrai manque. Les sections suivantes affichent un visuel
d'attente tant que vous n'avez pas chargé vos images de campagne dans
Contenu → Fichiers, puis sélectionné dans l'éditeur de thème :

- **Hero de la page d'accueil** — image desktop + image mobile séparées, ou vidéo MP4
- **Les 3 portes** — une image par porte (POUR SOI, LA PROMESSE, DUO)
- **Campagne lifestyle** — image desktop + mobile
- **LA PROMESSE** et **DUO** — l'image de la colonne éditoriale
- **Social / UGC** — 6 contenus
- **Section DUO** — les deux produits de la paire à sélectionner

Direction artistique : flash photography, chrome, nuit, hôtels, voitures,
bijoux très visibles. Les voiles sombres sont réglables section par section
(*Assombrissement haut / bas*) pour que le bijou reste le sujet.

## 5. Performance et mobile

- Aucune librairie externe, aucun framework. ~25 ko de JS non minifié au total.
- Images en `srcset` + `sizes`, `loading="lazy"` partout sauf le hero.
- Vidéos en lecture uniquement lorsqu'elles sont visibles.
- Animations : reveal court (0,5 s), hover produits, sweep de lumière, chrome animé.
  Tout est désactivé automatiquement si `prefers-reduced-motion` est actif.
- Sticky add-to-cart mobile, galerie en swipe avec compteur, panier en panneau latéral.
- Le site reste fonctionnel sans JavaScript (formulaires natifs Shopify).

---

## 6. Historique des thèmes

| Thème | Rôle | Note |
|---|---|---|
| EROS PARIS (réparé) | **en ligne** | version publiée |
| EROS PARIS v2 — menus & pages | non publié | menus, pages et réglages reliés — à prévisualiser puis publier |
| eros-paris-theme | non publié | import initial incomplet, conservé par sécurité |
| Horizon | non publié | thème Shopify par défaut |

Un thème publié ne peut pas être modifié directement par l'API : chaque série
de changements est appliquée à une copie non publiée, que vous prévisualisez
puis publiez depuis Boutique en ligne → Thèmes.
