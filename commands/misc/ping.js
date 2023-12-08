const { calculatePing } = require("../../lib/");

module.exports = {
    name: "ping",
    category: "misc",
    desc: "Bot response.",
    async exec({ msg }) {
        await msg.reply(`*📡Pong!* ${calculatePing(msg.messageTimestamp, Date.now())} Ms`);
    }
}
