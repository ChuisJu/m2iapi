# M2I API - Collection de Démonstrations d'API et de Sécurité

Ce repository contient une collection complète d'exemples et de démonstrations pour l'apprentissage du développement d'API REST/SOAP et de la sécurité des applications web avec Node.js et Express.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Modules Disponibles](#modules-disponibles)
  - [Démonstrations de Base](#démonstrations-de-base)
  - [Architecture et Documentation](#architecture-et-documentation)
  - [Authentification](#authentification)
  - [Vulnérabilités de Sécurité](#vulnérabilités-de-sécurité)
  - [Mesures de Protection](#mesures-de-protection)
  - [Contrôle d'Accès et Audit](#contrôle-daccès-et-audit)
- [Avertissements de Sécurité](#avertissements-de-sécurité)
- [Contribution](#contribution)

## 🎯 Vue d'ensemble

Ce repository est conçu comme un outil pédagogique pour:
- Apprendre les bases du développement d'API REST et SOAP
- Comprendre les vulnérabilités courantes dans les applications web
- Découvrir les bonnes pratiques de sécurité
- Implémenter des mécanismes d'authentification et d'autorisation
- Mettre en place des mesures de protection contre les attaques

## ⚙️ Prérequis

- **Node.js** (version 14 ou supérieure)
- **npm** (Node Package Manager)
- **Postman** ou **curl** pour tester les API
- Connaissances de base en JavaScript et REST API

## 📁 Structure du Projet

Le projet est organisé en modules thématiques numérotés :

```
m2iapi/
├── 0-demo-REST/          # Démonstration API REST de base
├── 0-demo-soap/          # Démonstration API SOAP
├── 0-uuid/               # Gestion des UUID
├── 0-validation1/        # Validation des données (exemple 1)
├── 0-validation2/        # Validation des données (exemple 2)
├── 1-MVC/                # Architecture MVC avec Express
├── 2-restapi-login/      # API REST avec authentification
├── 2-restapi-login-mfa/  # Authentification multi-facteurs
├── 2-restapi-login-otp/  # Authentification par OTP
├── 2-swagger1/           # Documentation Swagger (basique)
├── 2-swagger2/           # Documentation Swagger (avancée)
├── 3-RCE/                # Démonstration Remote Code Execution
├── 3-SSRF/               # Démonstration Server-Side Request Forgery
├── 3-sqli/               # Démonstration SQL Injection
├── 3-anti-fuzz/          # Protection anti-fuzzing
├── 3-ratelimit/          # Limitation de taux (rate limiting)
├── 4-oauth/              # Implémentation OAuth
├── 4-roles/              # Contrôle d'accès basé sur les rôles
└── 5-audit/              # Système d'audit et logging
```

## 🚀 Installation

### Installation Globale

Pour installer toutes les dépendances du projet :

```bash
# Cloner le repository
git clone https://github.com/ChuisJu/m2iapi.git
cd m2iapi

# Installer les dépendances pour chaque module (exemple avec un script bash)
for dir in */; do
  if [ -f "$dir/package.json" ]; then
    echo "Installation de $dir..."
    cd "$dir"
    npm install
    cd ..
  fi
done
```

### Installation d'un Module Spécifique

```bash
# Naviguer vers le module souhaité
cd 0-demo-REST

# Installer les dépendances
npm install

# Démarrer l'application
node app.js
```

## 📚 Modules Disponibles

### Démonstrations de Base

#### 0-demo-REST
Première API REST simple avec Express.

**Installation et utilisation :**
```bash
cd 0-demo-REST
npm install
node app.js
```

**Tests :**
```bash
curl localhost:3000/aurevoir
curl localhost:3000/bonjour
```

---

#### 0-demo-soap
Démonstration d'une API SOAP.

**Installation et utilisation :**
```bash
cd 0-demo-soap
npm install
node app.js
```

**Test avec Postman :**
- Méthode: POST
- URL: `localhost:8000/soap`
- Headers:
  - `Content-Type: text/xml; charset=utf-8`
  - `SOAPAction: urn:bonjour`
- Body (raw XML):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tns="http://www.examples.com/bonjour">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:bonjour>
      <name>Julien</name>
    </tns:bonjour>
  </soapenv:Body>
</soapenv:Envelope>
```

---

#### 0-uuid
Gestion et génération d'UUID.

**Installation et utilisation :**
```bash
cd 0-uuid
npm install
node app.js
```

**Tests :**
```bash
curl localhost:3000/error
curl localhost:3000/uid
```

---

#### 0-validation1 et 0-validation2
Exemples de validation des données d'entrée utilisateur.

**Technologies :** Express, validation d'email, validation de données

---

### Architecture et Documentation

#### 1-MVC
Implémentation du pattern MVC (Model-View-Controller) avec Express.

**Technologies :** Express, SQLite3, Body-Parser

---

#### 2-swagger1 et 2-swagger2
Documentation d'API avec Swagger/OpenAPI.

**Technologies :** Express, Swagger-UI-Express

Ces modules montrent comment documenter automatiquement vos API REST.

---

### Authentification

#### 2-restapi-login
API REST avec système d'authentification par JWT.

**Technologies :** Express, SQLite3, JWT, bcrypt

**Fonctionnalités :**
- Inscription et connexion
- Gestion des utilisateurs
- Tokens JWT

---

#### 2-restapi-login-mfa
Authentification multi-facteurs (MFA).

**Fonctionnalités :**
- Authentification en deux étapes
- Génération et validation de codes MFA

---

#### 2-restapi-login-otp
Authentification par mot de passe à usage unique (OTP).

**Fonctionnalités :**
- Génération de codes OTP
- Validation temporaire

---

### Vulnérabilités de Sécurité

> ⚠️ **AVERTISSEMENT** : Ces modules démontrent des vulnérabilités à des fins éducatives uniquement. Ne jamais utiliser ce code en production !

#### 3-RCE (Remote Code Execution)
Démonstration de vulnérabilité d'exécution de code à distance.

**Exemple de vulnérabilité :** Injection de commandes via l'exécution non sécurisée de `exec()`.

---

#### 3-SSRF (Server-Side Request Forgery)
Démonstration de vulnérabilité SSRF permettant de forcer un serveur à faire des requêtes réseau non prévues.

**Principe :** Exploitation de requêtes HTTP non validées.

---

#### 3-sqli (SQL Injection)
Démonstration de vulnérabilité d'injection SQL.

**Tests d'exploitation :**
```bash
# Requête normale
curl "http://localhost:3000/users?username=admin"

# Injection SQL
curl "http://localhost:3000/users?username=%27%20OR%20%271%27%3D%271"
```

---

### Mesures de Protection

#### 3-anti-fuzz
Protection contre le fuzzing et les tests automatisés malveillants.

**Techniques :** Détection de patterns suspects, limitation des requêtes

---

#### 3-ratelimit
Limitation du taux de requêtes (rate limiting).

**Technologies :** Express-rate-limit, Winston (logging)

**Fonctionnalités :**
- Limite le nombre de requêtes par IP
- Logging des tentatives excessives

---

### Contrôle d'Accès et Audit

#### 4-oauth
Implémentation du protocole OAuth pour l'authentification déléguée.

**Technologies :** Express, JWT

---

#### 4-roles
Contrôle d'accès basé sur les rôles (RBAC).

**Technologies :** Express, SQLite3, JWT, bcrypt

**Fonctionnalités :**
- Gestion des rôles utilisateur (admin, user, etc.)
- Middleware d'autorisation

---

#### 5-audit
Système d'audit et de logging des actions utilisateur.

**Technologies :** SQLite3, Winston

**Fonctionnalités :**
- Traçabilité des actions
- Logs persistants
- Analyse d'activité

---

## ⚠️ Avertissements de Sécurité

### À Usage Éducatif Uniquement

Ce repository contient des **démonstrations de vulnérabilités de sécurité** à des fins pédagogiques. Les modules de la série **3-*** présentent intentionnellement des failles de sécurité.

**NE JAMAIS :**
- Utiliser ce code en production
- Exposer ces applications sur Internet
- Utiliser ces techniques pour attaquer des systèmes réels

**Utilisation recommandée :**
- Environnement de développement local uniquement
- Formation à la sécurité
- Tests en environnement isolé

### Bonnes Pratiques de Sécurité

Pour des applications en production, toujours :
- ✅ Valider et sanitiser toutes les entrées utilisateur
- ✅ Utiliser des requêtes préparées (prepared statements) pour les bases de données
- ✅ Implémenter une authentification et autorisation robustes
- ✅ Activer le rate limiting
- ✅ Logger et monitorer les activités suspectes
- ✅ Maintenir les dépendances à jour
- ✅ Utiliser HTTPS en production
- ✅ Gérer les secrets avec des variables d'environnement
- ✅ Implémenter une gestion d'erreurs appropriée

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pusher vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est à usage éducatif. Veuillez consulter les auteurs pour toute question de licence.

## 👥 Auteurs

- **nrousse** - Auteur principal de certains modules
- Autres contributeurs du projet M2I

## 📖 Ressources Additionnelles

- [Documentation Express.js](https://expressjs.com/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT.io](https://jwt.io/)
- [Documentation Swagger](https://swagger.io/docs/)

## 🔗 Liens Utiles

- [Repository GitHub](https://github.com/ChuisJu/m2iapi)
- [Présentation du Projet](Presentation2.pdf)

---

**Note :** Ce README fournit une vue d'ensemble du projet. Pour des instructions détaillées sur chaque module, consultez les fichiers README individuels dans les répertoires respectifs (quand disponibles).
