module.exports = {
    name: "alive",
    category: "main",
    desc: "Bot Chatho Illeuo Enn Nokan",
    async exec({ msg, client }) {
        const sourceUrl = 'https://github.com/AbhishekSuresh2/Phoenix-MD';

        const linkPreview = {
            title: "I'M Alive Now",
            body: "𝙿𝚑𝚘𝚎𝚗𝚒𝚡-𝙼𝙳",
            thumbnailUrl: "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg",
            mediaType: 1,
            mediaUrl: sourceUrl,
            sourceUrl: sourceUrl,
            showAdAttribution: false,
            renderLargerThumbnail: false
        };

        msg.quoted = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remotejid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `${msg.pushName}`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${client.user.name},;;;\nFN:${client.user.name},\nitem1.TEL;waid=919074692450:919074692450\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                    jpegThumbnail: "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg",
                }
            }
        };

        const text = `testingg`;

        await client.sendMessage(msg.from, { text: text, contextInfo: { externalAdReply: linkPreview } }, { quoted: msg.quoted || '' });
    }
};
