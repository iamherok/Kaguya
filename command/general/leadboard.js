const Levels = require('discord-xp')

module.exports = {
    name: "leadboard",
    alias: ["ldb", "lb"],
    category: "general",
    desc: "Show this leadboard of xp",
    async exec(msg, sock) {
        const { pushName, from, isGroup, sender } = msg;
const mems_id = new Array()
      const lb = await Levels.fetchLeaderboard("bot", 10);
     // const lbcom = await Levels.computeLeaderboard("bot", lb);    
        //const bo = lbcom.map(e => `${e.position} -> ${e.username.split('@')[0]}\nLevel: ${e.level}\nXP: ${e.xp.toLocalestring()}`);
      let lbtext = "*── 「 LEADERBOARDS 」 ──*\n\n"
	  for (let i = 0; i < lb.length; i++) {
		          const levelRole = lb[i].level
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
    lbtext += `${i + 1}# ${lb[i].userID}\n*LEVEL* : ${lb[i].level}\n*XP* :${lb[i].xp}\n*ROLR* : ${role}\n\n`;
	mems_id.push(lb[i].userID)
}
try {
	  //msg.reply(`${lbtext}`)
//mentions(lbtext, mems_id, true)
	  //await sock.sendMessage(from, { lbtext, mentions: mems_id, true }, { quoted: msg })
	  await sock.sendMessage(from, { image: { url: "https://c4.wallpaperflare.com/wallpaper/825/394/522/anime-girl-laptop-wallpaper-preview.jpg" }, caption: `${lbtext}`}, { quoted: msg })
} catch(err){ 
msg.reply(`${err}\n ${mems_id}`)
msg.reply(mems_id)
}
	  //console.log(lb)
	  //https://c4.wallpaperflare.com/wallpaper/825/394/522/anime-girl-laptop-wallpaper-preview.jpg
    }
}