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

    try {
      const result = await fg.googleImage(query);

      if (!result || !Array.isArray(result)) {
        throw new Error("Invalid result from googleImage");
      }

      await client.sendMessage(
        `_Downloading... *${amount || 5}* Images For *${query}*_`
      );

      for (let imageUrl of result) {
        await client.sendFromUrl(imageUrl);
      }
    } catch (error) {
      console.error("Error in img.js:", error);
      // Handle the error, log it, or send an error message to the client
      // For example: await client.sendMessage("Error fetching images");
    }
  },
};
