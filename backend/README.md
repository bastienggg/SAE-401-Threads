# 🌐 SAE 4.DWeb-DI.01 - Développer pour le Web

![Project Banner](https://source.unsplash.com/1600x400/?technology,web)

## 🚀 Description du Projet
Bienvenue dans le projet **SAE 4.DWeb-DI.01** ! Ce projet s'inscrit dans le BUT2 MMI à l'IUT du Limousin. L'objectif est de développer une **application web dynamique** incluant un **back-office performant** et une **expérience utilisateur optimisée**.

🔹 **Thème du projet** : Création d'un réseau social inspiré de Twitter/Instagram.  
🔹 **Objectif principal** : Offrir une plateforme interactive où les utilisateurs peuvent publier, partager et interagir avec du contenu.  
🔹 **Challenge** : Utiliser des **frameworks modernes** et respecter les bonnes pratiques de **développement web**.

---

## 🛠️ Technologies Utilisées
| Outil | Technologie |
|-------|------------|
| **Back-end** | Symfony (Doctrine, MySQL) |
| **Front-end** | React + TailwindCSS |
| **API** | RESTful (JSON) |
| **Base de données** | MySQL |
| **Déploiement** | Docker, LAMP |
| **Versioning** | Git & GitHub |

---

## 🎯 Fonctionnalités Clés

### 🏁 Cycle A : Authentification
✅ Inscription avec validation email  
✅ Connexion/Déconnexion sécurisée  
✅ Réinitialisation du mot de passe  

### 📝 Cycle B : Profil Utilisateur
✅ Modification du profil et avatar  
✅ Mode privé & lecture seule  
✅ Suppression de compte  

### 📰 Cycle C : Publications
✅ Rédaction et suppression de posts  
✅ Ajout d'images et vidéos  
✅ Mentions (@) et hashtags (#)  

### 📢 Cycle D : Fil d'actualité
✅ Affichage des posts abonnements  
✅ Recherche et filtrage de contenu  

### 💬 Cycle E : Interactions Sociales
✅ Likes, commentaires, retweets  
✅ Notifications et sondages  
✅ Threads interactifs  

### 📌 Cycle F : Gestion des Abonnements
✅ Abonnement et blocage  
✅ Listes personnalisées & mode sourdine  

### 🛡️ Cycle G : Administration
✅ Gestion des utilisateurs et modération  
✅ Suppression et censure de contenus  

---

## 📥 Installation et Configuration

### ⚙️ Prérequis
- Docker & Docker Compose
- Node.js & npm (pour React)
- Composer (pour Symfony)

### 📌 Installation
\`\`\`bash
# 1. Cloner le repository
git clone https://github.com/votre-repo/sae4-dweb.git && cd sae4-dweb

# 2. Lancer l'environnement Docker
docker-compose up -d

# 3. Installer les dépendances Symfony
cd backend && composer install

# 4. Installer les dépendances React
cd frontend && npm install

# 5. Démarrer les serveurs
symfony server:start  # Back-end
npm start            # Front-end
\`\`\`

---

## 🏆 Bonnes Pratiques
✅ Branches Git distinctes pour chaque itération (\`itération-x\`)  
✅ Respect des normes de code (**PSR-4, ESLint**)  
✅ Documentation et commentaires en anglais  
✅ Utilisation de **maquettes Figma** pour la conception UI/UX  

---

## 📌 Auteur
Projet réalisé dans le cadre du **BUT2 MMI - IUT du Limousin** 🎓  

📧 Contact : [votre.email@unilim.fr](mailto:votre.email@unilim.fr)  
🔗 LinkedIn : [linkedin.com/in/votreprofil](https://linkedin.com/in/votreprofil)  

---