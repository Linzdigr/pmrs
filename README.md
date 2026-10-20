# pmrs.fr — site du Projet Maillage Radio Secours

Site vitrine du **PMRS**, réseau citoyen de messages texte par radio LoRa MeshCore (869,618 MHz) : des répéteurs solaires posés sur les points hauts de Bretagne, sans opérateur, sans Internet, sans licence.

Le site sert à trois choses :

1. faire comprendre en un coup d'œil ce qu'est le PMRS (et ce qu'il n'est pas) ;
2. convaincre des hôtes d'accueillir un répéteur ;
3. publier la procédure d'usage en crise et les ressources utiles de la communauté.

## Structure

```
index.html            Page d'accueil (présentation, principe, matériel, avancement, accueil, crise, ressources)
procedure.html        Procédure d'usage en crise (Ille-et-Vilaine)
style.css             Feuille de style commune aux deux pages
site.js               Comportements communs (thème, menu mobile, graphique, schéma de résilience, copier, check-list)
logo.png              Écusson PMRS
og-image.png          Image de partage (réseaux sociaux)
favicon*, icon-*      Icônes
site.webmanifest      Manifeste web
_archive/             Ancienne page « site en construction »
```

Site **statique** : pas de build, pas de dépendance, pas de framework. Seules les polices viennent de Google Fonts.

## Voir le site en local

Les icônes sont référencées en chemin absolu (`/favicon.ico`…), il vaut donc mieux passer par un petit serveur plutôt qu'ouvrir le fichier directement :

```sh
python3 -m http.server 8000
```

puis ouvrir <http://localhost:8000>.

## Mise en ligne

Déposer le contenu du dossier tel quel à la racine du domaine `pmrs.fr` (sauf `_archive/` et ce `README.md`, facultatifs).

## Modifier le contenu

Tout le texte est directement dans le HTML, section par section. Chaque section de `index.html` est repérée par un commentaire (`<!-- ===== 04 AVANCEMENT ===== -->`) et un identifiant d'ancre :

| Ancre | Contenu | Source |
|---|---|---|
| `#top` | Héros, fiche « en un coup d'œil », cartes d'accès rapide | — |
| `#philosophie` | Lettre du collectif et 5 principes | — |
| `#pourquoi` | Tempête Ciaran, chaîne des coupures, comparatif des moyens | Présentation, diapos 3 à 7 |
| `#principe` | Réseau maillé, schéma de résilience en 4 étapes | Diapos 8 à 13 |
| `#materiel` | Répéteur, autonomie, terminaux, MeshCore / Meshtastic, fréquences | Diapos 14 à 20 |
| `#avancement` | Chiffres nationaux, frise de déploiement | Diapos 21 et 22 |
| `#accueil` | Conditions d'accueil, demande, contact | Diapos 19 et 23 |
| `#crise` | Résumé de la procédure, lien vers `procedure.html` | Procédure de crise |
| `#ressources` | Liens vers les outils de la communauté | — |

### Mises à jour courantes

- **Chiffres du réseau** (répéteurs actifs, trames par jour, utilisateurs) : section `#avancement`, penser à changer la date du relevé.
- **Phase en cours de la frise** : déplacer la classe `now` sur le bon `<li>` de `.timeline`, et passer les phases terminées en `done`.
- **Ajouter une ressource** : copier un `<li>` existant dans le bon groupe de `#ressources` (nom, domaine, description d'une ligne).
- **Procédure de crise** : mettre à jour la date de version dans `procedure.html` (en-tête et pied de page) à chaque révision.
- **Données du graphique Ciaran** : tableau `DATA` dans `site.js` **et** tableau « Voir les données » dans `index.html`, à garder identiques.

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
- [ ] Mettre à jour `og-image.png` si le visuel de partage doit évoluer
- [ ] Décider si la procédure de crise reste publique tant qu'elle est en version de travail

## Contact

Yvan Ferez — responsable de déploiement Ille-et-Vilaine et Morbihan · [contact@pmrs.fr](mailto:contact@pmrs.fr)

Initiative citoyenne, sans but lucratif.
