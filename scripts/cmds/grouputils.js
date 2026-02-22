const nix = {
  nix: {
    name: "grouputils",
    aliases: ["gu"],
    version: "0.0.1",
    author: "ArYAN",
    cooldowns: 5,
    role: 0,
    category: "group",
    shortDescription: "TagAll, Top messageurs, Tirage aléatoire",
    longDescription: "Commandes pour gérer et interagir avec les membres actifs d'un groupe Telegram.",
    guide: "Usage:\n/tagall\n/topmsg\n/draw"
  },

  // Stockage interne des utilisateurs et compteurs de messages
  messageStore: {},

  onMessage: function({ message }) {
    if (!message.from || message.from.is_bot) return;
    const id = message.from.id;
    if (!this.messageStore[id]) {
      this.messageStore[id] = {
        id: id,
        username: message.from.username,
        first_name: message.from.first_name,
        messages: 0
      };
    }
    this.messageStore[id].messages += 1;
  },

  onStart: async function({ bot, message, chatId, args }) {
    const cmd = args[0]?.toLowerCase();

    if (cmd === "tagall") {
      const users = Object.values(this.messageStore).filter(u => !u.is_bot);
      if (users.length === 0) return message.reply("❌ | Aucun membre actif à mentionner.");

      let text = "📢 | Tag de tous les membres actifs :\n\n";
      users.forEach(u => {
        text += `[@${u.username || u.first_name}](tg://user?id=${u.id}) `;
      });

      return bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }

    if (cmd === "topmsg") {
      const users = Object.values(this.messageStore)
        .sort((a, b) => b.messages - a.messages)
        .slice(0, 10);
      if (users.length === 0) return message.reply("❌ | Aucun membre actif.");

      let text = "🏆 | Top 10 des membres les plus actifs :\n\n";
      users.forEach((u, i) => {
        text += `${i + 1}. ${u.username || u.first_name} - ${u.messages} messages\n`;
      });

      return bot.sendMessage(chatId, text);
    }

    if (cmd === "draw") {
      const users = Object.values(this.messageStore).filter(u => !u.is_bot);
      if (users.length === 0) return message.reply("❌ | Aucun membre actif pour le tirage.");

      const winner = users[Math.floor(Math.random() * users.length)];
      const text = `🎉 | Tirage aléatoire : [@${winner.username || winner.first_name}](tg://user?id=${winner.id}) a été choisi !`;

      return bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }

    return message.reply("❌ | Commande invalide.\nUsage:\n/tagall\n/topmsg\n/draw");
  }
};

module.exports = nix;
