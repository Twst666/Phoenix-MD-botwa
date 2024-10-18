const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");

const logger = require("pino");
const { Boom } = require("@hapi/boom");
const path = require("path").join;
const fs = require("fs");
const axios = require("axios");
const clt = require("./lib/Collection");
const chatEvent = require("./lib/chatEvent");
const ora = require("ora");
let config = require("./config");

clt.commands = new clt.Collection();
clt.prefix = `{config.HANDLERS}`;

// read commands
function readCommands() {
    const spinner = ora({
      spinner: "star"
    });

    spinner.start("ℹ Connecting To Your WhatsApp");

    let $rootDir = path(__dirname, "./plugins");
    let dir = fs.readdirSync($rootDir);

    dir.forEach(($dir) => {
        const commandFiles = fs.readdirSync(path($rootDir, $dir)).filter((file) => file.endsWith(".js"));
        for (let file of commandFiles) {
            const command = require(path($rootDir, $dir, file));
            clt.commands.set(command.name, command);
        }
    });
    if (spinner.isSpinning) {
        spinner.succeed("Plugins Installed ✅");
    }
}

readCommands();

async function start() {
    const [name, sessionId] = config.SESSION_ID.split("~");
    
    // Ensure the name is "Phoenix"
    if (name !== "Phoenix") {
        console.log("❌ Modified Version Detected. Use Phoenix-MD Original Version From github.com/AbhishekSuresh2/Phoenix-MD");
        console.log("Dear User This Is A Copy Version Of Phoenix-MD. Use Phoenix-MD Original Version From https://github.com/AbhishekSuresh2/Phoenix-Bot");
        console.log("ℹ️😂 Hey Kid Go And Make Your Own Bot Instead Of Renaming Others Bot😂😂😂😂😂😂😂😂");
        console.log("😂😂This Is A Copied Version!");
        console.log("ℹ️ My Real Creator Is Abhishek Suresh!");
        process.exitCode = 1; // Set exit code to indicate failure
        return;
    }

    try {
    // Fetch the data from the endpoint using the session ID
    const { data } = await axios.get(`https://abhi-simple-paste.onrender.com/paste/view/${sessionId}`);

    // Assuming `data` itself contains the correct structure for `creds.json`, you can write it directly:
    await fs.writeFileSync("./auth/creds.json", JSON.stringify(data));
} catch (error) {
    console.error("Error fetching data from endpoint:", error);
    return; // Stop execution if fetching fails
}

    const { state, saveCreds } = await useMultiFileAuthState(
        "./auth/",
        pino({ level: "silent" })
    );


  const client = makeWASocket({
    printQRInTerminal: true,
    logger: logger({ level: "silent" }),
    auth: state,
    defaultQueryTimeoutMs: undefined,
  });

  client.ev.on("connection.update", (update) => {
    const spinner = ora({ spinner: "star" });

    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete ${session} and Scan Again`);
        client.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        start();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        start();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
        client.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Delete ${session} and Scan Again.`);
        client.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        start();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        start();
      } else {
        client.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
      }
    } else if (connection === 'open') {
      spinner.start("Phoenix-MD Connected Successfully✅");
      
      if (spinner.isSpinning) {
        spinner.succeed("[INFO]Connection status: " + connection);
      }
    }
  });

  client.ev.on("creds.update", saveCreds);

  client.ev.on("messages.upsert", async m => {
    chatEvent(m, client);
  })
}

start();
