const { OWNER_NAME, OWNER_NUMBER, BOT_NAME } = require('../../config');

module.exports = {
    name: "owner",
    category: "main",
    desc: "show the bot owner",
    async exec({ msg, client }) {
        const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + `FN:${OWNER_NAME}\n` 
            + `ORG:${BOT_NAME};\n` 
            + `TEL;type=CELL;type=VOICE;waid=${OWNER_NUMBER}:${OWNER_NUMBER}\n` 
            + 'END:VCARD';

        return await client.sendMessage(
            msg.from,
            { 
                contacts: { 
                    displayName: OWNER_NAME, 
                    contacts: [{ vcard }] 
                }
            }
        );
    }
};
