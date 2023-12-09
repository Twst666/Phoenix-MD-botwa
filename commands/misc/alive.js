const { getBuffer } = require("../../lib/");

module.exports = {
    name: "alive",
    category: "main",
    desc: "Bot Chatho Illeuo Enn Nokan",
    async exec({ msg }) {
    const image = 'https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg';
    const thumb = "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg";
    
    const number = message.user.jid;
    const logo = await getBuffer(image);
    const thumbnail = await getBuffer(thumb);
    const sourceUrl = 'https://github.com/AbhishekSuresh2/Phoenix-MD';

    const linkPreview = {
        title: "I'M Alive Now",
        body: "𝙿𝚑𝚘𝚎𝚗𝚒𝚡-𝙼𝙳",
        thumbnail: logo,
        mediaType: 1,
        mediaUrl: sourceUrl,
        sourceUrl: sourceUrl,
        showAdAttribution: false,
        renderLargerThumbnail: false
    };

    message.quoted = {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remotejid: "status@broadcast"
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${client.user.name},;;;\nFN:${client.user.name},\nitem1.TEL;waid=919074692450:919074692450\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                jpegThumbnail: thumbnail
            }
        }
    };

    const text = `testingg`;

    await client.sendMessage(msg.from, { text: text, contextInfo: { externalAdReply: linkPreview } }, { quoted: message.quoted || '' });
});
