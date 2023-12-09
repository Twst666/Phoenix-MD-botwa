const { writeExifImg, writeExifVid } = require('../../lib/');
const { STICKER_DATA } = require('../../config');

async function downloadMedia(message) {
    if (message.type === "imageMessage" || message.type === "videoMessage") {
        return await message.download();
    }
    throw new Error("Unsupported media type for download");
}

module.exports = {
    name: 'sticker',
    alias: ['stiker', 'stikergif', 'stikerg', 'stikerv', 'stikergif', 'stikerg', 's'],
    category: 'general',
    desc: 'Create sticker from image or video',
    use: 'packagename|authorname',
    async exec({ msg, arg, client }) {
        const { quoted, from, type } = msg;
        const packname = arg.split("|")[0] || STICKER_DATA.split(';')[0];
        const author = arg.split("|")[1] || STICKER_DATA.split(';')[1];

        const content = JSON.stringify(quoted);
        const isMedia = type === "imageMessage" || type === "videoMessage";
        const isQImg = type === "extendedTextMessage" && content.includes("imageMessage");
        const isQVid = type === "extendedTextMessage" && content.includes("videoMessage");
        const isQDoc = type === "extendedTextMessage" && content.includes("documentMessage");

        await client.sendMessage(msg.from, { react: { text: "⏳", key: msg.key } });

        let buffer, stickerBuff;
        try {
            const packnameStr = packname.toString();
            const authorStr = author.toString();

            buffer = await (isQImg ? downloadMedia(quoted) : msg.download());

            stickerBuff = await (isQImg ? writeExifImg(buffer, { packname: packnameStr, author: authorStr }) :
                                           writeExifVid(buffer, { packname: packnameStr, author: authorStr }));

            if (buffer && stickerBuff) {
                await client.sendMessage(from, { sticker: { url: `${stickerBuff}` } }, { quoted: msg });
                await client.sendMessage(msg.from, { react: { text: "✅", key: msg.key } });
            } else {
                console.error('Error: Buffer or stickerBuff is null or undefined');
                await msg.reply(`Silahkan kirim/reply gambar/video/dokumen yang ingin di convert ke sticker.\nPastikan ukuran tidak melebihi 2MB dan durasi tidak lebih 10detik.`);
                await client.sendMessage(msg.from, { react: { text: "❌", key: msg.key } });
            }
        } catch (e) {
            console.error('Error while creating sticker:', e);
            await msg.reply("Error while creating sticker");
            await client.sendMessage(msg.from, { react: { text: "❌", key: msg.key } });
        }
    }
};
