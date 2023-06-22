
import plugin from '../../../lib/plugins/plugin.js'
import fetch from "node-fetch";
import common from'../../../lib/common/common.js'
const _path = process.cwd();

let time = 0
let daan = ""
let tp = ""
let gs = ""
let dati = ""
 let url = `https://xiaoapi.cn/API/game_ktccy.php?msg=开始游戏&id=1828222534`;
let res = await fetch(url)
res = await res.json()
export class ktccy extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '阴天[看图猜成语]',
      /** 功能描述 */
      dsc: '看图猜成语',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message.group',
      /** 优先级，数字越小等级越高 */
      priority: 500,
      rule: [
        {
           reg: "^#猜成语$|^答(.*)$",//匹配消息正则，命令正则
    fnc: 'yx'
      },
        {
          /** 命令正则匹配 */
          reg: '^#下一条$', 
          /** 执行方法 */
          fnc: 'xyyx'
      },
        {
          /** 命令正则匹配 */
          reg: '^#结束猜成语$', 
          /** 执行方法 */
          fnc: 'jsyx'
        }
      ]
    })
  }
async jsyx(e) {
       if (e.msg == '#结束猜成语' ) {
e.reply('看图猜成语已结束')
time = 0
}
}

async xyyx(e) {
       if (time == 1 & e.msg == '#下一条' ) {
            let url = `https://xiaoapi.cn/API/game_ktccy.php?msg=开始游戏&id=1828222534`;
            let res = await fetch(url)
            res = await res.json()
            daan = res.data.answer
tp = res.data.pic
e.reply('游戏开始了哦！')
await common.sleep(3000)
            e.reply(segment.image(tp))
            console.log(daan)
dati = setTimeout(() => {
                e.reply(['很可惜40秒内无人答对，那么我就公布正确答案了'])            
                daan = res.data.answer
                tp = res.data.pic
                e.reply(['正确答案是'+daan])
                console.log(daan)
                console.log()
            }
                , 40000);
           
        }         
}
async yx(e) {
        if (e.msg.includes('答') & time == 0) {
            console.log('不在游戏范围')
            return false
        }         
if (e.msg.includes('答') & time == 1) {     
                gs = e.msg.replace(/答/g, "").trim();
                if (gs == daan) {
                    clearTimeout(dati)
let msg = [segment.at(e.user_id),"\n",
`恭喜你回答正确`]
                    e.reply(msg)      
                    daan = res.data.answer
                 tp = res.data.pic
                    e.reply(['看来你的学识很渊博呢'])
                    console.log(daan)
                 } else {          
                 e.reply()     
                  
                }    
            return
        }
        if (time == 0 & e.msg == '#猜成语' ) {
  
            let url = `https://xiaoapi.cn/API/game_ktccy.php?msg=开始游戏&id=1828222534`;
            let res = await fetch(url)
            res = await res.json()
            daan = res.data.answer
tp = res.data.pic
e.reply('游戏开始了哦！')
await common.sleep(3000)
            e.reply(segment.image(tp))
            console.log(daan)
dati = setTimeout(() => {
                e.reply(['很可惜40秒未有人答对，那么我就公布正确答案了'])            
                daan = res.data.answer
                tp = res.data.pic
                e.reply(['正确答案是'+daan])
                console.log(daan)
                console.log()
            }
                , 40000);
time = 1
     } else if (time == 1 & e.msg == '#猜成语') {
            e.reply('游戏正在进行中')

        }


    }
}    










