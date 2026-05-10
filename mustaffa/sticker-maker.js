const { cmd } = require('../command')
const config = require('../config')
const fs = require("fs")
const ffmpeg = require("fluent-ffmpeg")

cmd({
pattern: "s",
alias: ["sticker","wm"],
desc: "Create HD Sticker",
category: "convert",
filename: __filename
},

async(conn, m, mek, {from, reply}) => {

try{

const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ""

if(!mime) return reply("*Reply to an image, video, or gif!* 📸")

await conn.sendMessage(from,{react:{text:"🪄",key:mek.key}})

const media = await quoted.download()

/*
IMAGE STICKER
*/

if(mime.includes("image")){

await conn.sendMessage(from,{
sticker: media,
packname: "POPKID XMD",
author: "Popkid Ke"
},{quoted:m})

}

/*
VIDEO OR GIF STICKER
*/

else if(mime.includes("video") || mime.includes("gif")){

let input = `./temp_${Date.now()}.mp4`
let output = `./sticker_${Date.now()}.webp`

fs.writeFileSync(input, media)

await new Promise((resolve,reject)=>{

ffmpeg(input)

.inputOptions(["-t 7"])

.outputOptions([
"-vcodec libwebp",
"-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15",
"-loop 0",
"-preset default",
"-an",
"-vsync 0"
])

.save(output)

.on("end",resolve)
.on("error",reject)

})

const sticker = fs.readFileSync(output)

await conn.sendMessage(from,{
sticker: sticker,
packname: "POPKID XMD",
author: "Popkid Ke"
},{quoted:m})

fs.unlinkSync(input)
fs.unlinkSync(output)

}

else{

reply("*Reply to image or video only!*")

}

await conn.sendMessage(from,{react:{text:"✅",key:mek.key}})

}catch(err){

console.log(err)

reply("❌ Sticker creation failed")

}

})
