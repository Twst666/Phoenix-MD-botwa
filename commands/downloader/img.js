async function gimage(query, amount = 5) {
  let list = [];
  return new Promise((resolve, reject) => {
    gis(query, async (error, result) => {
      for (
        var i = 0;
        i < (result.length < amount ? result.length : amount);
        i++
      ) {
        list.push(result[i].url);
      }
      resolve(list);
    });
  });
}

module.exports = {
  name: "gimage",
  category: "main",
  desc: "Get Google Images",
  async exec({ client, match }) {
    if (!match)
      return await client.sendMessage(
        "_Enter A Text And Number Of Images You Want_\n_📌 Example:_ *Phoenix MD,6*"
      );

    let [query, amount] = match.split(",");
    let result = await gimage(query, amount);

    await message.sendMessage(
      `_Downloading... *${amount || 5}* Images For *${query}*_`
    );

    for (let imageUrl of result) {
      await client.sendFromUrl(imageUrl);
    }
  },
};
