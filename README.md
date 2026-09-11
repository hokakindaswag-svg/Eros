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
| NOUVEAUTÉS | `nouveautes` | tag `nouveaute` | 8 | ✓ |
| BEST-SELLERS | `best-sellers` | tag `best-seller` | 9 | ✓ |
| DUO | `duo` | tag `duo` | 8 | ✓ |
| LA PROMESSE | `la-promesse` | tag `promesse` | 8 | ✓ |

CHAÎNES se base sur le titre car le tag `cuban` est partagé avec les bracelets.
Pour élargir, taguez vos chaînes `chaine` et ajoutez la règle correspondante.

### Curation : quelles pièces dans quelle collection

Les quatre collections de curation ont été remplies en taguant les produits.
Seuls des tags ont été ajoutés — aucun prix, SKU, stock ou description touché.
Pour faire entrer ou sortir une pièce, ajoutez ou retirez le tag sur le produit.

**DUO est une offre, pas une collection de paires.** Le client achète deux
bijoux : il en garde un, l'autre part chez la personne de son choix —
partenaire, ami, famille. Les deux pièces n'ont pas besoin d'être identiques.

Huit pièces composent la sélection DUO : les deux Riviera, les deux Atlanta,
les deux Croisette, le Bracelet Karma et les Boucles Karma.

**LA PROMESSE — 14 pièces**, orientées vers le fait d'offrir un bijou à
quelqu'un : les trois bagues (Victoria, Antoinette, Nicki), trois colliers
(Riviera, Croisette, Capri), cinq bracelets (Riviera, Million, Eden,
Aphrodite, Croisette) et trois paires de boucles (Manhattan, Ange, Karma).

Volontairement exclus : Bracelet Atlanta, Bracelet Karma, Bracelet Nova et
Chaîne Atlanta, trop statement pour une pièce que l'on offre.

**BEST-SELLERS — 9 pièces** couvrant toutes les catégories et toute la gamme
de prix (59 € à 249 €). Aucune vente n'ayant encore eu lieu, c'est une
sélection éditoriale : remplacez-la par vos vrais best-sellers dès que vous
aurez des données.

**NOUVEAUTÉS — 8 pièces**, les plus récemment ajoutées, triées par date de
création décroissante. Le tag `nouveaute` allume aussi le badge NOUVEAUTÉ sur
les cartes produit.

### Livraison

La livraison est annoncée **gratuite, sans montant minimum**, sur la page
Livraison, dans la barre d'annonce, au panier et dans les CGV.

Aucun délai n'est affiché : le profil de livraison de la boutique ne
contenait aucune zone ni aucun tarif au moment de la rédaction, donc aucun
délai n'était vérifiable. N'en publiez que lorsqu'ils seront réels.

### Produits
Les 20 produits sont **actifs**. Le suivi d'inventaire est désactivé
(`tracked: false`), donc tous restent achetables malgré un stock affiché à 0 :
aucune pièce n'apparaîtra « ÉPUISÉ ».

---

## 4. Cartes produit

L'image reste nue : aucun bouton ne la recouvre. Sous la photo, le nom et le
prix à gauche, une petite pochette au contour fin à droite.

- Produit à variante unique : ajout direct au panier, sans quitter la grille.
  Le sac cède la place à une coche pendant 1,6 s et le compteur s'incrémente.
- Produit à plusieurs variantes : ouverture d'un panneau de sélection chargé
  en AJAX (`sections/quick-add.liquid`), avec combinaisons indisponibles
  grisées et prix recalculé. Le panier s'ouvre après l'ajout.

Le bouton mesure 34 px mais sa zone tactile est étendue à 44 px par un
pseudo-élément, pour rester confortable au doigt.

Le parcours d'ajout est couvert par un banc de test qui rejoue les routes
Shopify (`/cart/add.js`, `/cart.js`, rafraîchissement du panneau panier) et
vérifie, en desktop et en mobile, que la requête part avec la bonne variante,
que le compteur suit et que la confirmation s'affiche.

## 5. Présentation des visuels produit

Les bijoux ne sont **jamais recadrés**. Chaque packshot s'inscrit en entier
dans un cadre carré, avec de l'air autour.

| Réglage | Où | Défaut |
|---|---|---|
| Format des visuels produit | Réglages → Produits | Carré 1:1 |
| Fond des visuels produit | Réglages → Produits | Blanc |
| Air autour du bijou | Réglages → Produits | 8 % |

`object-fit: contain` est appliqué partout où un produit est montré :
cartes produit, galerie de la fiche produit, paire DUO, panier, pastilles
de campagne. `cover` reste réservé aux visuels éditoriaux — hero, campagne
lifestyle, mur social — où le cadrage plein est voulu.

**Le fond doit être accordé à vos photos.** Un packshot sur fond blanc placé
sur une surface noire produit un carré blanc disgracieux, et inversement.
Regardez une vignette après publication : si le fond de vos photos se fond
dans le cadre, le réglage est bon. Sinon, basculez entre Blanc et Noir.

Les tuiles de la section Catégories suivent la même règle. Chaque tuile
dispose d'une case **Image éditoriale** : décochée pour un packshot affiché
en entier, cochée pour une photo lifestyle qui remplit le cadre.

### Images sources à recadrer

Le CSS ne peut pas récupérer ce qui manque dans une image. Quatre images du
catalogue sont en paysage marqué : affichées dans un cadre carré, elles
laissent des bandes vides en haut et en bas.

| Produit | Source | Vide en carré |
|---|---|---|
| Bracelet Milano | 1536 × 1024 | 33 % |
| Boucles d'oreilles Karma | 1536 × 1024 | 33 % |
| Boucles d'oreilles Ange | 1404 × 1120 | 20 % |
| Boucles d'oreilles Manhattan | 1391 × 1131 | 19 % |

Recadrez-les en carré autour du bijou, avec une marge régulière, pour qu'elles
s'alignent sur les seize autres. Les quinze images déjà carrées (1254 × 1254)
ou quasi carrées (1312 × 1199, 1230 × 1278) n'ont rien à changer.

---

## 6. Ce qu'il reste à faire : les visuels de campagne

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

## 7. Performance et mobile

- Aucune librairie externe, aucun framework. ~25 ko de JS non minifié au total.
- Images en `srcset` + `sizes`, `loading="lazy"` partout sauf le hero.
- Vidéos en lecture uniquement lorsqu'elles sont visibles.
- Animations : reveal court (0,5 s), hover produits, sweep de lumière, chrome animé.
  Tout est désactivé automatiquement si `prefers-reduced-motion` est actif.
- Sticky add-to-cart mobile, galerie en swipe avec compteur, panier en panneau latéral.
- Le site reste fonctionnel sans JavaScript (formulaires natifs Shopify).

---

## 8. Historique des thèmes

| Thème | Rôle | Note |
|---|---|---|
| EROS PARIS v2 — menus & pages | **en ligne** | version publiée |
| EROS PARIS v3 — paires DUO | non publié | paires DUO reliées — à prévisualiser puis publier |
| EROS PARIS (réparé) | non publié | version précédente |
| eros-paris-theme | non publié | import initial incomplet, conservé par sécurité |
| Horizon | non publié | thème Shopify par défaut |

Un thème publié ne peut pas être modifié directement par l'API : chaque série
de changements est appliquée à une copie non publiée, que vous prévisualisez
puis publiez depuis Boutique en ligne → Thèmes.
