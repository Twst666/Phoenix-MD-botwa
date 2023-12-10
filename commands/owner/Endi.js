const Jimp = require("jimp");

module.exports = {
  name: "updateProfilePicture",
  category: "main",
  desc: "Update user's profile picture",
  async exec({ msg, client }) {
    if (!msg.reply_msg.image) return await msg.reply("_Reply To A Photo_");

    let media = await msg.quoted.download();
    const { img } = await generateProfilePicture(media);
    await updateProfilePicture(msg.user, img, msg);

    const text = "_Profile Picture Updated Successfully_";
    await client.sendMessage(msg.from, { text: text });
  }
};

async function updateProfilePicture(jid, img, msg) {
  const { query } = msg.client;
  await query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}
