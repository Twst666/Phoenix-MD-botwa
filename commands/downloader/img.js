const fg = require("api-dylux");

module.exports = {
  name: "img",
  category: "main",
  desc: "Get Google Images",
  async exec({ client, match }) {
    const [query, amount] = match.split(",");

    if (!query) {
      return await client.sendMessage(
        "_Enter A Text And Number Of Images You Want_\n_📌 Example:_ *Phoenix MD,5*"
      );
    }

    const result = await fg.googleImage(query);

    await client.sendMessage(
      `_Downloading... *${amount || 5}* Images For *${query}*_`
    );

    for (let imageUrl of result) {
      await client.sendFromUrl(imageUrl);
    }
  },
};
