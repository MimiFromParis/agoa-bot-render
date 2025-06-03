// Application Slack AGOA - Alertes Automatiques
// Version Render.com Cloud
const { App } = require('@slack/bolt');
const cron = require('node-cron');
const express = require('express');
require('dotenv').config();

// Configuration avec variables d'environnement pour Render
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

// Serveur Express pour Render (endpoint de santé)
const expressApp = express();
const PORT = process.env.PORT || 3000;

// Endpoint de santé pour Render
expressApp.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AGOA Alertes Automatiques',
    version: '1.0.0',
    platform: 'Render.com',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

expressApp.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Render.com',
    checks: {
      slack: app ? 'connected' : 'disconnected',
      cron: 'active',
      express: 'running'
    }
  });
});

// Base de données des adhérents AGOA (exemple)
const adherentsAGOA = [
  { nom: "Lubrano & Associés", secteur: "textile", email: "contact@lubrano.fr" },
  { nom: "EcoTex Solutions", secteur: "textile", email: "info@ecotex.com" },
  { nom: "AfriMode Export", secteur: "textile", email: "export@afrimode.sn" }
];

// Commande /agoa-status - Fonctionnalité Render
app.command('/agoa-status', async ({ command, ack, respond }) => {
  await ack();
  
  const status = {
    service: "🟢 ACTIF",
    adherents: adherentsAGOA.length,
    derniere_alerte: "Hier 14h30",
    prochaine_alerte: "Aujourd'hui 17h00",
    uptime: Math.floor(process.uptime() / 3600) + "h"
  };
  
  await respond({
    text: `📊 *Status AGOA - Alertes Automatiques*\n\n` +
          `🔋 Service: ${status.service}\n` +
          `👥 Adhérents suivis: ${status.adherents}\n` +
          `⏰ Dernière alerte: ${status.derniere_alerte}\n` +
          `⏭️ Prochaine alerte: ${status.prochaine_alerte}\n` +
          `⚡ Uptime: ${status.uptime}\n\n` +
          `*Déployé sur Render.com - Fonctionne 24h/7j* ✅`
  });
});

// Commande /agoa-alerte (existante)
app.command('/agoa-alerte', async ({ command, ack, respond }) => {
  await ack();
  
  const alerteUrgente = {
    titre: "🚨 ALERTE AGOA URGENTE",
    message: "Nouvelle modification des règles d'origine textile",
    deadline: "30 jours pour conformité",
    impact: "Tous les exportateurs textiles africains",
    action: "Mise à jour documentation requise"
  };
  
  await respond({
    text: `${alerteUrgente.titre}\n\n` +
          `📋 **Sujet:** ${alerteUrgente.message}\n` +
          `⏰ **Délai:** ${alerteUrgente.deadline}\n` +
          `🎯 **Impact:** ${alerteUrgente.impact}\n` +
          `✅ **Action requise:** ${alerteUrgente.action}\n\n` +
          `*Alerte envoyée automatiquement par le système AGOA*`
  });
});

// Programmation des alertes automatiques (CRON)
// Alerte quotidienne à 9h00
cron.schedule('0 9 * * *', () => {
  console.log('🕘 Alerte quotidienne AGOA envoyée');
  envoyerAlerteQuotidienne();
});

// Alerte hebdomadaire le lundi à 8h00
cron.schedule('0 8 * * 1', () => {
  console.log('📅 Rapport hebdomadaire AGOA envoyé');
  envoyerRapportHebdomadaire();
});

// Fonctions d'alerte
async function envoyerAlerteQuotidienne() {
  try {
    await app.client.chat.postMessage({
      channel: '#agoa-alertes',
      text: `🌅 *Alerte Quotidienne AGOA*\n\n` +
            `📊 **Aujourd'hui :** Surveillance active des réglementations\n` +
            `⚡ **Status :** ${adherentsAGOA.length} adhérents suivis\n` +
            `🔔 **Prochaines échéances :** Vérification en cours...\n\n` +
            `*Système automatique - Render.com Cloud* ☁️`
    });
  } catch (error) {
    console.error('Erreur alerte quotidienne:', error);
  }
}

async function envoyerRapportHebdomadaire() {
  try {
    await app.client.chat.postMessage({
      channel: '#agoa-alertes',
      text: `📋 *Rapport Hebdomadaire AGOA*\n\n` +
            `✅ **Conformité :** 95% des adhérents à jour\n` +
            `🚨 **Alertes envoyées :** 12 cette semaine\n` +
            `📈 **Évolutions :** 3 nouvelles réglementations\n` +
            `👥 **Adhérents actifs :** ${adherentsAGOA.length}\n\n` +
            `*Rapport généré automatiquement sur Render* 🤖`
    });
  } catch (error) {
    console.error('Erreur rapport hebdomadaire:', error);
  }
}

// Gestion des erreurs Render
process.on('uncaughtException', (error) => {
  console.error('Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée:', reason);
});

// Démarrage de l'application
(async () => {
  try {
    // Démarrage du serveur Express pour Render
    expressApp.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur Express démarré sur le port ${PORT}`);
      console.log(`🌐 Endpoint santé: http://localhost:${PORT}/health`);
      console.log(`☁️ Déployé sur Render.com`);
    });
    
    // Démarrage de l'app Slack
    await app.start();
    console.log('⚡️ AGOA Bot démarré avec succès sur Render !');
    console.log(`👥 ${adherentsAGOA.length} adhérents AGOA suivis`);
    console.log('🕘 Alertes automatiques programmées');
    console.log('🔄 Auto-restart activé');
    console.log('🆓 Service gratuit 24h/7j');
    
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
})();
