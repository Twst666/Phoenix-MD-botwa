const { slots } = require("../../lib/games");

module.exports = {
    name: "slot",
    category: "game",
    desc: "Play the slot game.",
    async exec({ msg }) {
        const spinResult = slots();

        const [x, y, z] = spinResult;

        const slotDisplay = `🎰 ┃ *SLOTS* 
 ───────────
   ${x} : ${y} : ${z}
   ───────────
    🎰┃🎰┃ 🎰`;

        await msg.reply(slotDisplay);

        if (spinResult.every((emoji) => emoji === spinResult[0])) {
            await msg.reply("🎉 *Congratulations!* You Won");
        } else {
            await msg.reply(" *😔 You Lose* Better Luck Next Time");
        }
    }
}
