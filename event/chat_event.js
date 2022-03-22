const { getBinaryNodeChild } = require("@adiwajshing/baileys")
const { serialize } = require("../lib/helper")
const { checkData } = require("./database/group_setting")
const djs = require("@discordjs/collection")
const { color } = require("../utils")
const { fetchJson } = require("../utils");
const Levels = require('discord-xp')
const axios = require("axios")
const { QuickDB } = require("quick.db");
const db = QuickDB(); 
const sid = new db.table('sid')
const pro = new db.table('pro')
const chara = new db.table('chara')
Levels.setURL("mongodb+srv://das77:das@cluster0.itbgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
console.log("Connected to database")

const cooldown = new djs.Collection();
const prefix = '!';
const multi_pref = new RegExp('^[' + '!'.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

function printSpam(isGc, sender, gcName) {
    if (isGc) {
        return console.log(color('[SPAM]', 'red'), color(sender.split('@')[0], 'lime'), 'in', color(gcName, 'lime'))
    }
    if (!isGc) {
        return console.log(color('[SPAM]', 'red'), color(sender.split('@')[0], 'lime'))
    }
}

function printLog(isCmd, sender, gcName, isGc) {
    if (isCmd && isGc) {
        return console.log(color('[EXEC]', 'aqua'), color(sender.split('@')[0], 'lime'), 'in', color(gcName, 'lime'))
    }
    if (isCmd && !isGc) {
        return console.log(color('[EXEC]', 'aqua'), color(sender.split('@')[0], 'lime'))
    }
}

/**
 * This function will check every received message which includes the whatsapp group invite link
 * and kick the sender
 * @param sock current connection socket
 * @param {String} groupId group id
 * @param {String} text message
 * @param {String} participant sender of message
 * @param gcMeta group Metadata
 */
const checkLinkAndKick = async (sock, groupId = "", text = "", participant = "", gcMeta) => {
    let currentData = checkData(groupId.split("@")[0], "on/link");
    if (currentData === "inactive" || currentData === "no_file") { return; }
    else if (text.includes("chat.whatsapp.com") && currentData === "active") {
        // Extract the original invitation code for further checking
        let code = text.match(/chat\.whatsapp\.com\/([\w\d]*)/g)?.[0]?.replace("chat.whatsapp.com/", "");
        // Filter to check bot and sender is admin or not
        let isBotAdmin = gcMeta?.participants?.filter(ids => ids.id === sock.user.id.replace(/:([0-9]+)/, ""))[0]?.admin
        let isSenderAdmin = gcMeta?.participants?.filter(ids => ids.id === participant)[0]?.admin
        // Don't execute if bot is not admin or if sender is admin
        if (!isBotAdmin || isSenderAdmin) { return console.log(color("[SYS]", "yellow"), `sender (${participant}) is an admin or bot is not an admin`); }
        // Request to WhatsApp server for current group invite code
        let groupCode = await sock.groupInviteCode(groupId);
        const queryInvite = async (code) => {
            const results = await sock.query({
                tag: "iq",
                attrs: {
                    type: "get",
                    xmlns: "w:g2",
                    to: "@g.us"
                }, content: [{ tag: "invite", attrs: { code } }]
            })
            const group = getBinaryNodeChild(results, "group");
            return group.attrs;
        };

        // If the invite code is not found or is the same as the current group invite code, ignore it
        if (
            (!code || code === "")
            || code === groupCode
        ) {
            return console.log(color("[SYS]", "yellow"), `This (${code}) invite code is invalid or current group (${color(groupId, "green")}) invite code.`);
        } else {
            let status;
            /**
             * Attempting to request detailed information about the received invitation code,
             * if that fails just ignore it
             */
            try {
                status = await queryInvite(code);
            } catch {
                return console.log(color("[SYS]", "yellow"), `This (${code}) invite code is invalid.`);
            }
            if (status.id) {
                await sock.groupParticipantsUpdate(groupId, [participant], "remove");
                return "done."
            } else {
                return;
            }
        }
    }
}

module.exports = chatHandler = async (m, sock) => {
    try {
        if (m.type !== "notify") return;
        let msg = serialize(JSON.parse(JSON.stringify(m.messages[0])), sock);
        if (!msg.message) return;
        if (msg.key && msg.key.remoteJid === "status@broadcast") return;
        if (msg.type === "protocolMessage" || msg.type === "senderKeyDistributionMessage" || !msg.type || msg.type === "") return;

        let { body } = msg;
		const { pushName } = msg
        const { isGroup, sender, from } = msg;
        const gcMeta = isGroup ? await sock.groupMetadata(from) : '';
        const gcName = isGroup ? gcMeta.subject : '';

        // no group invite
        checkLinkAndKick(sock, from, body, sender, gcMeta);
        let temp_pref = multi_pref.test(body) ? body.split('').shift() : '!';
        if (body === 'prefix' || body === 'cekprefix') {
            msg.reply(`My prefix ${prefix}`);
        }
        if (body) {
            body = body.startsWith(temp_pref) ? body : ""
        }
        else { body = '' }
///chara
setInterval(async () => {
  const myArray = db.all()
  const arr = randomItem = myArray[Math.floor(Math.random()*myArray.length)];
  const data = await fetchJson("https://reina-api.vercel.app/api/mwl/random")
  await sock.sendMessage(arr, { image: { url: data.display_picture  }, caption: "A character has spawn to add it in your heram use !catch <name>" });
  chara.set(arr, data.name)
  sid.set(arr, data.id)
}, 1000);
///chara

        const arg = body.substring(body.indexOf(' ') + 1);
        const args = body.trim().split(/ +/).slice(1);
        const isCmd = body.startsWith(temp_pref);

        // Log
        printLog(isCmd, sender, gcName, isGroup);

        const cmdName = body.slice(temp_pref.length).trim().split(/ +/).shift().toLowerCase();
        const cmd = djs.commands.get(cmdName) || djs.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
        if (!cmd && isCmd == true) return await sock.sendMessage(from, { image: { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtyNqQWR838Px1nXnvbnvu8BNULpo0IzZKuw&usqp=CAU" }, caption: "Please use the commands from the help list" }, { quoted: msg })
 //if (!cmd && isCmd == true) return await sock.sendMessage(from, { image: { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtyNqQWR838Px1nXnvbnvu8BNULpo0IzZKuw&usqp=CAU" }, caption: "Please use the commands from the help list" }, { quoted: msg })
	 if (!cmd && isCmd == true) return
    const randomXp = Math.floor(Math.random() * 1) + 1;//Random amont of XP until the number you want + 1
    const hasLeveledUp = await Levels.appendXp(sender, "bot", randomXp);
	 
    if (hasLeveledUp) {
        const user = await Levels.fetch(sender, "bot");
        // ROLE (Change to what you want, or add) and you can change the role sort based on XP.
        const levelRole = user.level
        var role = 'Warrior'
        if (levelRole <= 2) {
            var role = 'Elite III'
        } else if (levelRole <= 4) {
            var role = 'Elite II'
        } else if (levelRole <= 6) {
            var role = 'Elite I'
        } else if (levelRole <= 8) {
            var role = 'Master IV'
        } else if (levelRole <= 10) {
            var role = 'Master III'
        } else if (levelRole <= 12) {
            var role = 'Master II'
        } else if (levelRole <= 14) {
            var role = 'Master I'
        } else if (levelRole <= 16) {
            var role = 'Grandmaster V'
        } else if (levelRole <= 18) {
            var role = 'Grandmaster IV'
        } else if (levelRole <= 20) {
            var role = 'Grandmaster III'
        } else if (levelRole <= 22) {
            var role = 'Grandmaster II'
        } else if (levelRole <= 24) {
            var role = 'Grandmaster I'
        } else if (levelRole <= 26) {
            var role = 'Epic V'
        } else if (levelRole <= 28) {
            var role = 'Epic IV'
        } else if (levelRole <= 30) {
            var role = 'Epic III'
        } else if (levelRole <= 32) {
            var role = 'Epic II'
        } else if (levelRole <= 34) {
            var role = 'Epic I'
        } else if (levelRole <= 36) {
            var role = 'Legend V'
        } else if (levelRole <= 38) {
            var role = 'Legend IV'
        } else if (levelRole <= 40) {
            var role = 'Legend III'
        } else if (levelRole <= 42) {
            var role = 'Legend II'
        } else if (levelRole <= 44) {
            var role = 'Legend I'
        } else if (levelRole <= 46) {
            var role = 'Mythic'
        } else if (levelRole <= 50) {
            var role = 'Mythic Glory'
        }
        await sock.sendMessage(from, { image: { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR5kFSuoFniw90CNXW8z1FkDma4WF6fJyL3Q&usqp=CAU" }, caption: `_*「 LEVEL UP! 」*_\n\n➸ *📃️Name*: ${pushName}\n➸ *🎯️XP*: ${user.xp} / ${Levels.xpFor(user.level + 1)}\n➸ *❤️Level*: ${user.level} 🆙 \n➸ *🔮️Role*: *${role}*\n\nCongrats!! 🎉🎉`}, { quoted: msg });
    }
        if (!cmd) return;

        if (!cooldown.has(from)) {
            cooldown.set(from, new djs.Collection());
        }
        const now = Date.now();
        const timestamps = cooldown.get(from);
        const cdAmount = (cmd.cooldown || 5) * 1000;
        if (timestamps.has(from)) {
            const expiration = timestamps.get(from) + cdAmount;
            if (now < expiration) {
                if (isGroup) {
                    let timeLeft = (expiration - now) / 1000;
                    printSpam(isGroup, sender, gcName);
                    return await sock.sendMessage(from, { text: `This group is on cooldown, please wait another ${timeLeft.toFixed(1)} second(s)` }, { quoted: msg })
                }
                else if (!isGroup) {
                    let timeLeft = (expiration - now) / 1000;
                    printSpam(isGroup, sender);
                    return await sock.sendMessage(from, { text: `You are on cooldown, please wait another ${timeLeft.toFixed(1)} second(s)` }, { quoted: msg })
                }
            }
        }
        timestamps.set(from, now);
        setTimeout(() => timestamps.delete(from), cdAmount);

        try {
            cmd.exec(msg, sock, args, db, arg);
        } catch (e) {
            console.error(e);
        }
    } catch (e) {
        console.log(color("[Err]", "red"), e.stack + "\nerror while handling chat event, might some message not answered");
    }
}
