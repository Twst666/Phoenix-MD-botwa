const { calculatePing } = require("../../utils");

module.exports = {
    name: "ping",
    category: "main",
    desc: "Check Bot Response Speed",
    async exec({ message, reply }) {
        const pingMsg = await msg.reply('*📡Checking Ping...*');
        const timestamp = Date.now();


        setTimeout(async () => {
            const latency = calculatePing(timestamp, Date.now()).toFixed(4);
            await pingMsg.edit(`*📡Pong!* ${latency} ms`);
        }, 1000);
    }
};
