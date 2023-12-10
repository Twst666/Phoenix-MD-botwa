const fg = require("api-dylux");

module.exports = {
  name: "img",
  category: "main",
  desc: "Get Google Images",
  async exec({ client, args }) {
    if (!args || args.length < 2) {
      return await client.sendMessage(
        "_Enter A Text And Number Of Images You Want_\n_📌 Example:_ *Phoenix MD,5*"
      );
    }

    const query = args[0];
    const amount = args[1];

    const result = await fg.googleImage(query);

    await client.sendMessage(
      `_Downloading... *${amount || 5}* Images For *${query}*_`
    );

    for (let imageUrl of result) {
      await client.sendFromUrl(imageUrl);
    }
  },
};
