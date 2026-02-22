const nix = {
  nix: {
    name: "tagall",
    aliases: ["ta"],
    version: "0.0.1",
    author: "ArYAN",
    cooldowns: 10,
    role: 0,
    category: "group",
    shortDescription: "Mentionne tous les membres du groupe",
    longDescription: "Cette commande mentionne tous les membres du groupe Telegram pour attirer leur attention.",
    guide: "Usage : /tagall"
  },

  onStart: async function({ bot, message, chatId, participants }) {
    if (!participants || participants.length === 0) {
      return message.reply("❌ | Impossible de récupérer les membres du groupe.");
    }

    let text = "📢 | Tag de tous les membres :\n\n";
    participants.forEach(user => {
      if (!user.is_bot) text += `[@${user.username || user.first_name}](tg://user?id=${user.id}) `;
    });

    return bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }
};

module.exports = nix;
