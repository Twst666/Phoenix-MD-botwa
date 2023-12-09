const emojis = ["🕊", "📍", "🍇", "💵", "🍭"];
module.exports = {
    name: "slot",
    category: "game",
    desc: "Play the slot game.",
    async exec({ msg }) {
        const spinResult = [];

        for (let i = 0; i < 3; i++) {
            const randomEmojiIndex = Math.floor(Math.random() * emojis.length);
            spinResult.push(emojis[randomEmojiIndex]);
        }

        const [x, y, z] = spinResult;

        const slotDisplay = `
            🎰 ┃ *SLOTS* 
         ────────────
         | ${x} | ${y} | ${z} |
         ────────────
            🎰┃🎰┃ 🎰
        `;

        const isWinner = spinResult.every((emoji) => emoji === spinResult[0]);
        const resultMessage = isWinner
            ? "🎉 *Congratulations!* You Won"
            : " *😔 You Lose* Better Luck Next Time";
        await msg.reply(`${slotDisplay}\n\n${resultMessage}`);
    }
}
