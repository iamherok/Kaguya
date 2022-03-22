module.exports = {
    name: "chara",
    desc: "Active the chara game in the group",
    category: "group",
    use: "chara on",
    async exec(msg, db, sock, args) {
        const { from, isGroup, sender } = msg
        const gM = isGroup ? await sock.groupMetadata(from) : ''
        const admin = isGroup ? getAdmin(gM.participants) : ''
        const cekAdmin = (m) => admin.includes(m)
        if (!isGroup) return await msg.reply(`Only can be executed in group.`)
        if (!cekAdmin(sender)) return await msg.reply(`Sorry you are not an admin`)
        if (!args.length > 0) return await msg.reply("Please check *#help chara*")
   const check = db.get(from)
        let opt = args[0]
        
        switch (opt) {
            case "on":
                if(check == "false"){
                db.set(from,"true")
                return await msg.reply(`Chara has been activated`)
                }
                else if(check == "true"){
                return await msg.reply(`Chara is alrady active here`)
                }
                break;
           case "off":
              if(check == "true"){
                db.set(from,"false")
                return await msg.reply(`Chara has been deactivated`)
                }
                else if(check == "false"){
                return await msg.reply(`Chara is alrady deactivated here`)
                }
                break;
                default:
                msg.reply("Error")
                break;
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
