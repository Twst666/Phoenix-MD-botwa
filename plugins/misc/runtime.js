const { runtime } = require("../../lib");

module.exports = {
    name: "runtime",
    category: "misc",
    desc: "Bot response.",
    async exec({ msg }) {
        const time = await runtime()
        await msg.reply(`_*Runtime ${time}*_`);
    }
}
