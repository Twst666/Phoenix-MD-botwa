function spinSlot() {
    const emojis = ["🍒", "🍇", "📍", "💵", "🍭"];
    const spinResult = [];

    for (let i = 0; i < 3; i++) {
        const randomEmojiIndex = Math.floor(Math.random() * emojis.length);
        spinResult.push(emojis[randomEmojiIndex]);
    }

    return spinResult;
}

module.exports = {
    spinSlot,
};
