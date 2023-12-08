const moment = require('moment');
const { serialize } = require("./serialize");
const clt = require("./Collection");
const chalk = require("chalk");
const { SUDO, HANDLERS } = require("../config");

const prefix = `${HANDLERS}`
const owner = `${SUDO}`
const multi_prefix = new RegExp("^[" + "!#$%&?/;:,.<>~-+=".replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + "]");

let now = moment();
let formattedTime = now.format('HH:mm');

async function isAdmin(client, from, sender) {
    const groupAdmins = await client.getGroupAdmins(from);
    return groupAdmins.includes(sender) || owner.includes(sender);
}

function printLog(cmdName, isCmd, pushName, sender, gcName, isGc) {
    if (isCmd && isGc) {
        return console.log("\n" + chalk.white.bgBlue(`[${formattedTime}]`) + chalk.black.bgGreen( "", cmdName, "by", pushName + " : " + sender.split("@")[0], "in", gcName, ""));
    }
    if (isCmd && !isGc) {
        return console.log("\n" + chalk.white.bgBlue(`[${formattedTime}]`) + chalk.black.bgGreen( "", cmdName, "by", pushName + " : " + sender.split("@")[0], "" ));
    }
}

module.exports = chatEvent = async (m, client) => {
    try {
        if (m.type !== "notify") return;
        let msg = serialize(JSON.parse(JSON.stringify(m.messages[0])), client);
        if (!msg.message) return;
        if (msg.key && msg.key.remoteJid === "status@broadcast") return;
        if (
            msg.type === "protoocolMessage" ||
            msg.type === "senderKeyDistributionMessage"||
            !msg.type ||
            msg.type === ""
        )
        return;

        let { body } = msg;
        const { isGroup, pushName, sender, from } = msg;
        const gcMeta = isGroup ? await client.groupMetadata(from) : "";
        const gcName = isGroup ? gcMeta.subject : "";
        const isOwner = owner.includes(sender) || msg.isSelf;

        let temp_prefix = multi_prefix.test(body) ? body.split("").shift() : "!";
        if (body === "prefix" || body === "cekprefix") {
            msg.reply(`My prefix ${prefix}`);
        }

        if (body) {
            body = body.startsWith(temp_prefix) ? body : "";
        } else {
            body = "";
        }

        const args = body.trim().split(/ +/).slice(1);
        const arg  = args.join(" ")
        const isCmd = body.startsWith(temp_prefix);
        const cmdName = body.slice(temp_prefix.length).trim().split(/ +/).shift().toLowerCase();
        const cmd = clt.commands.get(cmdName) || clt.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
        if (!cmd) return;

        if (isGroup) {
            const isBotAdmin = await isAdmin(client, from, client.user.id);

            if (cmd.groupCommand && !isBotAdmin) {
                return await msg.reply("I'm sorry, but I am not an admin in this group.");
            }

            if (cmd.groupAdmin && !await isAdmin(client, from, sender)) {
                return await msg.reply("This command is only for group admins.");
            }
        }

        if (cmd.owner && !isOwner) {
            return await msg.reply("This Command Can Only Be Used By The *Creator Of The Bot*");
        }

        // Log
        printLog(cmdName, isCmd, pushName, sender, gcName, isGroup);

        // Execute command
        cmd.exec({ client, msg, args, arg, isOwner });

    } catch (err) {
        console.log(err);
    }
}
