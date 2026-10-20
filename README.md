# pmrs.fr — site du Projet Maillage Radio Secours

Site vitrine du **PMRS**, réseau citoyen de messages texte par radio LoRa MeshCore (869,618 MHz) : des répéteurs solaires posés sur les points hauts de Bretagne, sans opérateur, sans Internet, sans licence.

Le site sert à trois choses :

1. faire comprendre en un coup d'œil ce qu'est le PMRS (et ce qu'il n'est pas) ;
2. convaincre des hôtes d'accueillir un répéteur ;
3. publier la procédure d'usage en crise et les ressources utiles de la communauté.

## Structure

```
/            Accueil : les trois moyens radio à égalité, démarche, Ciaran, crise, ressources, contact
pmr446.html           Phonie PMR446 (veille canal 7)
cb.html               Phonie CB 27 MHz (veille canal 9)
maillage.html         Maillage LoRa MeshCore : principe, matériel, état du réseau, accueil d'un répéteur
procedure.html        Procédure d'usage en crise (Bretagne)
style.css             Feuille de style commune à toutes les pages
site.js               Comportements communs (thème, menu mobile, graphique, schéma de résilience, copier, check-list)
logo.png              Écusson PMRS
og-image.png          Images de partage (1200 × 630) : accueil,
og-pmr446.png           PMR446,
og-cb.png               CB,
og-maillage.png         maillage LoRa,
og-procedure.png        procédure
fonts/                Polices woff2 (latin et latin étendu) et leurs licences
favicon*, icon-*      Icônes
site.webmanifest      Manifeste web
_archive/             Ancienne page « site en construction »
```

Site **statique** : pas de build, pas de dépendance, pas de framework, aucune ressource externe. Les polices (IBM Plex Sans, IBM Plex Mono, Saira Condensed, licence SIL OFL) sont hébergées dans `fonts/` et déclarées en tête de `style.css`.

## Voir le site en local

Les icônes sont référencées en chemin absolu (`/favicon.ico`…), il vaut donc mieux passer par un petit serveur plutôt qu'ouvrir le fichier directement :

```sh
python3 -m http.server 8000
```

puis ouvrir <http://localhost:8000>.

## Mise en ligne

Déposer le contenu du dossier tel quel à la racine du domaine `pmrs.fr` (sauf `_archive/` et ce `README.md`, facultatifs).

## Modifier le contenu

Tout le texte est directement dans le HTML, section par section. Chaque section est repérée par un commentaire (`<!-- ===== CONTACT ===== -->`) et un identifiant d'ancre.

**L'accueil ne doit privilégier aucun moyen radio** : PMR446, CB et maillage LoRa y sont présentés à égalité, comme complémentaires, et chacun a sa page.

| Page | Ancre | Contenu | Source |
|---|---|---|---|
| `/` | `#top` | Héros, fiche « en un coup d'œil » | — |
| | `#moyens` | Les trois moyens radio, exemple d'enchaînement, cadre réglementaire | — |
| | `#philosophie` | Lettre du collectif et 5 principes | — |
| | `#pourquoi` | Tempête Ciaran, chaîne des coupures, comparatif des moyens | Présentation, diapos 3 à 7 |
| | `#crise` | Les cinq états, lien vers `procedure.html` | Procédure de crise |
| | `#ressources` | Pages PMRS et outils de la communauté | — |
| | `#contact` | Adresse du collectif | — |
| `pmr446.html` | — | Caractéristiques, usage, réglage, bonnes pratiques, 16 canaux | — |
| `cb.html` | — | Caractéristiques, usage, réglage, bonnes pratiques, 40 canaux | — |
| `maillage.html` | `#principe` | Réseau maillé, schéma de résilience en 4 étapes | Diapos 8 à 13 |
| | `#materiel` | Répéteur, autonomie, terminaux, MeshCore / Meshtastic | Diapos 14 à 20 |
| | `#avancement` | Chiffres nationaux, frise de déploiement | Diapos 21 et 22 |
| | `#accueil` | Conditions d'accueil d'un répéteur, demande, contact | Diapos 19 et 23 |
| | `#crise` | Message direct et message de canal | Procédure de crise |

### Mises à jour courantes

- **Chiffres du réseau** (répéteurs actifs, trames par jour, utilisateurs) : section `#avancement` de `maillage.html`, penser à changer la date du relevé.
- **Phase en cours de la frise** (`maillage.html`) : déplacer la classe `now` sur le bon `<li>` de `.timeline`, et passer les phases terminées en `done`.
- **Ajouter une ressource** : copier un `<li>` existant dans le bon groupe de `#ressources` (nom, domaine, description d'une ligne).
- **Navigation et pied de page** : ils sont recopiés dans chaque page ; une modification se reporte dans les cinq fichiers HTML.
- **Procédure de crise** : mettre à jour la date de version dans `procedure.html` (en-tête et pied de page) à chaque révision.
- **Données du graphique Ciaran** : tableau `DATA` dans `site.js` **et** tableau « Voir les données » dans `/` (section `#pourquoi`), à garder identiques.

## Design

L'identité reprend celle de la page d'origine : papier teinté rouge, écusson qui émet, lectures de fréquence.

- **Couleurs** : définies une seule fois en variables CSS en haut de `style.css` (`--bg`, `--fg`, `--accent`…), avec leur version sombre. Ne pas mettre de couleur en dur ailleurs.
- **Rouge `--accent`** : le signal, le message qui circule (routes actives, répéteurs, chiffres clés). **Ambre `--warn`** : panne, pré-alerte, point à trancher. **Vert `--ok`** : message acquitté, levée.
- **Polices** : Saira Condensed pour les titres, IBM Plex Sans pour le texte, IBM Plex Mono pour les données (fréquences, étiquettes, chiffres).
- **Thème** : clair, sombre ou automatique (selon le système), mémorisé dans le navigateur du visiteur.
- **Mobile** : tout est prévu pour 390 px de large minimum ; les tableaux larges défilent dans leur cadre.
- **Accessibilité** : animations désactivées si le visiteur le demande (`prefers-reduced-motion`), schémas avec description textuelle, graphique doublé d'un tableau de données.

## Règles éditoriales

- **Ne jamais présenter le PMRS comme un service de secours.** Toute page qui parle d'usage en crise rappelle que le 18, le 15 et le 112 restent les numéros d'urgence et que le PMRS n'est pas intégré à la chaîne ORSEC.
- **Ne jamais publier de clé de canal privé**, ni de donnée personnelle de porteur ou d'hôte. Les noms de canaux peuvent figurer, pas leurs secrets.
- Citer la source des chiffres (préfecture, Enedis, Orange, relevés du réseau) et la date des relevés.
- Écrire simplement : le site s'adresse à des élus, des gestionnaires de bâtiments et des citoyens, pas seulement à des radioamateurs.

## À faire

- [ ] Vérifier les descriptions des ressources meshcore.serveurperso.in, meshqual, meshcore-analyzer et wiki.meshcore.bzh
- [ ] Ajouter des photos d'installations et les simulations de couverture (Brocéliande, Glaz Arena)
- [ ] Préciser la ligne « Assurance » une fois la convention type rédigée
- [ ] Décider si la procédure de crise reste publique tant qu'elle est en version de travail

## Contact

PMRS · [contact@pmrs.fr](mailto:contact@pmrs.fr)

Initiative citoyenne, sans but lucratif.
