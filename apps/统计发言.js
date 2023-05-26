//发言记录,用法:统计＋数量，获取群前n次发言
//验证＋内容，相似度＋内容，对比查重
//交流群:756783127
import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
if(!global.segment){
global.segment = (await import('oicq')).segment
}
let ms
const _path = process.cwd();
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
export class example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '阴天[统计发言]',
      /** 功能描述 */
      dsc: '01',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 9000,
      rule: [
        {
          reg: '^#?相似度(.*)$',
          /** 执行方法 */
          fnc: 'xx'
},{
          reg: '^#?统计(.*)|^#消息统计(.*)$',
          /** 执行方法 */
          fnc: 'ct'
},{
          reg: '^#?验证(.*)$',
          /** 执行方法 */
          fnc: 'gb'

}
      ]
    })
}
async gb(e){
ms = e.msg.replace(/#?验证/g,"").trim()
e.reply("请发送要查重的")
}
async ct(e){
let n = []
let arr = []
let sr = e.msg.replace(/#?统计/g, "").trim();
sr = sr.match(/\d+/g);
let chat = await e.group.getChatHistory(0, 1);
let seq = chat[0].seq
let time = chat[0].time
let ranklistData = {}
ranklistData[e.group_id] = ranklistData[e.group_id] ? ranklistData[e.group_id] : {
        lastseq: 0,
        acount: 0
}
e.reply("正在为您分析中，请稍等~")
var start = new Date().getTime()
let CharList = ranklistData[e.group_id].list ? ranklistData[e.group_id].list : {};
let y = Number(seq)-Number(sr)
console.log(y)
console.log(seq)
for (let p = seq; p>y; p=p-1) {
let Char = await e.group.getChatHistory(p, 1);
//console.log(Char)
for (let  a = 0; a<sr; a++) {
if (typeof(Char[a])=== "undefined") {
break;
}
let jl = Char[a].raw_message
let uid = Char[a].sender.user_id
let name = Char[a].sender.title
let card = Char[a].sender.card
let message = ["\n",`群称呼:[${name}]`,"\n",`群名称:[${card}]`,"\n",`qq:[${uid}]`,"\n",`发言内容:[${jl}]`,"\n","\n"]
n.push(message)
arr.push(uid)
}
//console.log(n)
}
var end = new Date().getTime()
let sj = Number(end - start)/Number(1000)
e.reply(`已经完成了,用时${sj}s`)
function qc(arr) {
  let tempArr = []
  let obj = {}
  let resultArr = []
  arr.forEach(v=>{
    if(!tempArr.includes(v)) {
      tempArr.push(v)
    }
  })
  arr.forEach(v=>{
    if(obj[v]) {
      obj[v]++
    }else {
      obj[v] = 1
    }
  })
  tempArr.forEach(v=>{
    resultArr.push({
      "qq": v,
      "发言次数": obj[v]
    })
  })
  return resultArr
}
console.log(arr.length);
let gh = JSON.stringify(qc(arr))
gh = gh.replace(/,/g,"\n").replace("]","").replace("[","")
let length = qc(arr).length
e.reply(gh)
var data_msg = []
data_msg.push({
message: `${n}`,
          nickname: '',
          user_id: 1142407413
})
let brief = ""
let title = "历史记录"
let summary = ``
let ForwardMsg;
ForwardMsg = await e.group.makeForwardMsg(data_msg);
let regExp = /<summary color=\"#808080\" size=\"26\">查看(\d+)条转发消息<\/summary>/g;
let res2 = regExp.exec(ForwardMsg.data);
let pcs = res2[1];
ForwardMsg.data = ForwardMsg.data.replace(/<msg brief="\[聊天记录\]"/g, `<msg brief=\"[${brief ? brief : "聊天记录"}]\"`).replace(/<title color=\"#000000\" size=\"34\">转发的聊天记录<\/title>/g, `<title color="#000000" size="34">${title ? title : "群聊的聊天记录"}</title>`).replace(/<summary color=\"#808080\" size=\"26\">查看(\d+)条转发消息<\/summary>/g, `<summary color="#808080" size="26">${summary ? summary : `查看${pcs}条转发消息`}</summary>`);
e.reply(ForwardMsg)
}
async xx(e){
let msg = e.msg.replace(/#?相似度/g,"").trim()
let a = await 
fetch("http://life.chacuo.net/convertsimilar/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "proxy-connection": "keep-alive",
    "x-requested-with": "XMLHttpRequest",
    "Referer": "http://life.chacuo.net/convertsimilar/",
  },
  "body": `data=${ms}%5E%5E%5E${msg}&type=similar&arg=&beforeSend=undefined`,
  "method": "POST"
});
a = await a.json()
let b = JSON.stringify(await a.data)
b = b.replace("[","").replace("]","").replace(/"/g,"").replace(/,(.*?),(.*?),/g,"").replace(/!(.*?)%/g,"").replace("文档一与文档二","")
console.log(b)
e.reply(b)
}

}






















