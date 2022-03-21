const { owner } = require("../../config.json");
const Levels = require('discord-xp')

module.exports = {
    name: "profile",
    alias: ["p", "pro"],
    category: "general",
    desc: "Show this your info",
    async exec(msg, sock) {
        const { pushName, from, isGroup, sender } = msg;
        const user = await Levels.fetch(sender, "bot");
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
        if (!isGroup) return await msg.reply("Only can be executed in group");
        try {
        const meta = isGroup ? await sock.groupMetadata(from) : ''        
        const groupMem = isGroup ? meta.participants : ''                 
        const admin = isGroup ? getAdmin(groupMem) : ''                   
        const cekAdmin = (m) => admin.includes(m)
            const bio = await sock.fetchStatus(sender)
            try {
                pfp = await sock.profilePictureUrl(sender, "image");
            } catch { pfp = 'https://www.linkpicture.com/q/IMG-20220118-WA0387.png' }
let text = "";
text += `🔰 *Name* : ${pushName === undefined ? sender.split("@")[0] : pushName}\n\n💡 *Number* : ${sender}\n\n🗯 *Group* : ${meta?.subject}\n\n📑 *Bio*: ${bio.status}\n\n`
if (owner.includes(sender))
text += `🛎 *Owner* : True\n\n`
if (!user){
text += `🥇 *Level* : 0\n\n`
text += `🕹 *Exp* : 0`
} else {
text += `🥇 *Level* : ${user.level}\n\n`
text += `🕹 *Exp* : ${user.xp} / ${Levels.xpFor(user.level + 1)}\n\n`
}
text += `🎎 *Role* : ${role}\n\n`
if (cekAdmin(sender)) 
text += `📔 *Admin* : True`

                        await sock.sendMessage(from, { image: { url: pfp }, caption: text }, { quoted: msg });
        } catch(err){
            await msg.reply(err);
        }
    }
}

function getAdmin(participants) {
    let admins = new Array()
    for (let ids of participants) {
        !ids.admin ? '' : admins.push(ids.id)
    }
    return admins
}