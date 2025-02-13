import { dependencies } from "../YTdependence/dependencies.js";
const { fs, _path, puppeteer, Anime_tts_roles, https, http, common } = dependencies
let dirpath = _path + '/data/YTAi_Setting'
if (!fs.existsSync(dirpath)) {
  fs.mkdirSync(dirpath)
}
if (!fs.existsSync(dirpath + "/" + "data.json")) {
  fs.writeFileSync(dirpath + "/" + "data.json", JSON.stringify({
    "chatgpt": {
      "ai_chat": "godgpt",
      "ai_chat_at": false,
      "ai_chat_style": "word",
      "ai_name_sess": "#sess",
      "ai_name_godgpt": "#godgpt",
      "ai_name_chat": "#chat",
      "ai_name_others": "#bot",
      "ai_tts_open": false,
      "ai_tts_role": "派蒙_ZH",
      "ai_ban_plans": [],
      "ai_ban_number": [],
      "ai_ban_group": [],
    }
  }))
}
function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
}
const dataFilePath = `${dirpath}/data.json`;
let src = _path + "/plugins/y-tian-plugin/resources/css/jty.OTF"

export class example extends plugin {
  constructor() {
    super({
      name: '阴天[AI总设置]',
      dsc: '',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: "^#(ai|Ai|AI)对话方式(文本|图片|引用)",
          fnc: 'changeStyles',
          permission: 'master'
        },
        {
          reg: "^#图片渲染使用(markdown|mathjax)",
          fnc: 'pictureStyles',
          permission: 'master'
        },
        {
          reg: "^#(开启|关闭)提示回复",
          fnc: 'promptAnswer',
          permission: 'master'
        },
        {
          reg: "^#更改(sess|chat|god|附加)触发名(.*)",
          fnc: 'renameTrigger',
          permission: 'master'
        },
        {
          reg: "^#更改回复提示词(.*)",
          fnc: 'prompttips',
          permission: 'master'
        },
        {
          reg: "^#(ai|Ai|AI)(开启|关闭)(艾特|at)$",
          fnc: 'toggleAiAt',
          permission: 'master'
        },
        {
          reg: "^#(艾特|at)回复使用(god|chat|sess|附加)$",
          fnc: 'changeAiChat',
          permission: 'master'
        },
        {
          reg: "^#私聊回复使用(god|chat|sess|附加)$",
          fnc: 'changeAiChat_private',
          permission: 'master'
        },
        {
          reg: "^#(开启|关闭)私聊回复$",
          fnc: 'toggleAi_private',
          permission: 'master'
        },
        {
          reg: "^#(开启|关闭)(tts|TTS)回复$",
          fnc: 'toggleAiTts',
          permission: 'master'
        },
        {
          reg: "^#切换(tts|TTS)角色(.*?)$",
          fnc: 'toggleTtsRole',
          permission: 'master'
        },
        {
          reg: "^#(禁用|解禁)方案(god|chat|附加|sess)$",
          fnc: 'ban_plans',
          permission: 'master'
        },
        {
          reg: "^#(禁用|解禁)(ai|Ai|AI)$",
          fnc: 'ban_number',
          permission: 'master'
        },
        {
          reg: "^#查看(Ai|ai|AI)总设置$",
          fnc: 'ai_settings',
          permission: 'master'
        },
        {
          reg: "^#(ai|AI|Ai)(禁用|解禁)该群$",
          fnc: 'ban_group',
          permission: 'master'
        },
        {
          reg: "^#(开启|关闭)(chat|god)方案记忆限制$",
          fnc: 'moment_limit',
          permission: 'master'
        },
        {
          reg: "^#设置(chat|god)记忆条数(.*?)$",
          fnc: 'moment_numbers',
          permission: 'master'
        },
        {
          reg: "^#(删除|查看)预设(.*?)$",
          fnc: 'delete_prompts',
          permission: 'master'
        },
        {
          reg: "^#(开启|关闭)预设添加$",
          fnc: 'add_prompts',
          permission: 'master'
        },
        {
          reg: "^#(开启|关闭)群记录携带$",
          fnc: 'add_group_history',
          permission: 'master'
        },
        {
          reg: "^#(开启|关闭)(群)?全局预设$",
          fnc: 'add_systems',
          permission: 'master'
        },
        {
          reg: "^#(新增|删除)(ai|AI|aI)违禁词(.*)$",
          fnc: 'add_words',
          permission: 'master'
        },
        {
          reg: "[\s\S]*",
          fnc: 'upload_prompts',
          log: false
        }
      ]
    })
  }

  async add_group_history(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.group_history_open = e.msg.includes("开启");
    writeJsonFile(dataFilePath, data);
    e.reply(`群聊上下文已${data.chatgpt.group_history_open ? '开启' : '关闭'}携带`);
  }

  async add_systems(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.add_systems_open ||= {};
    let QQ_at = e.message
      .filter(item => item.type === 'at')
      .map(item => item.qq) || [e.user_id || e.from_id];
    if (QQ_at.length === 0) QQ_at = [e.user_id || e.from_id];
    if (e.msg.includes("群")) QQ_at = [e.group_id];
    if (e.isMaster || (QQ_at.includes(e.user_id) && QQ_at.length === 1)) {
      for (let qq of QQ_at) {
        data.chatgpt.add_systems_open[qq] = e.msg.includes("开启");
        writeJsonFile(dataFilePath, data);
        e.reply(`用户 ${qq} 全局预设已${data.chatgpt.add_systems_open[qq] ? '开启' : '关闭'}`);
      }
    } else {
      let id = e.user_id || e.from_id;
      data.chatgpt.add_systems_open[id] = e.msg.includes("开启");
      writeJsonFile(dataFilePath, data);
      e.reply(`用户 ${id} 全局预设已${data.chatgpt.add_systems_open[id] ? '开启' : '关闭'}`);
    }
  }

  async add_words(e) {
    let data = readJsonFile(dataFilePath);
    const words = e.msg.replace(/#(新增|删除)(ai|AI|aI)违禁词/g, '')
    if (!data.chatgpt.add_words) {
      data.chatgpt.add_words = []
    }
    if (e.msg.includes("删除")) {
      data.chatgpt.add_words = data.chatgpt.add_words.filter(item => item !== words);
      writeJsonFile(dataFilePath, data);
      e.reply('屏蔽词已成功删除');
      return false;
    }
    data.chatgpt.add_words.push(words);
    writeJsonFile(dataFilePath, data);
    e.reply(`屏蔽词已成功添加${words}`);
  }

  async prompttips(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.prompts_answers = e.msg.replace("#更改回复提示词", '');
    writeJsonFile(dataFilePath, data);
    e.reply(`提示回复词已成功切换为 ·${data.chatgpt.prompts_answers}·`);
  }

  async promptAnswer(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.prompts_answer_open = e.msg.includes("开启");
    writeJsonFile(dataFilePath, data);
    e.reply(`提示回复已${data.chatgpt.prompts_answer_open ? '开启' : '关闭'}`);
  }

  async pictureStyles(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.pictureStyles = e.msg.includes("mathjax");
    writeJsonFile(dataFilePath, data);
    e.reply(`AI图片回复方式已使用${data.chatgpt.pictureStyles ? 'mathjax' : 'markdown'}`);
  }

  async delete_prompts(e) {
    const PATH = `${_path}/data/阴天预设`
    const messages = e.msg.match(/\d+/g);
    const dirname = await fs.promises.readdir(PATH, "utf-8");
    if (!messages || !messages.length) { return false; }
    const msg = Number(messages[0]) - 1;
    if (msg < 0 || msg >= dirname.length) { return false; }
    const filePath = `${PATH}/${dirname[msg]}`;
    if (e.msg.includes("删除")) {
      try {
        await fs.promises.unlink(filePath);
        e.reply(`预设已成功删除`);
      } catch (err) {
        console.error(err);
      }
    } else if (e.msg.includes("查看")) {
      try {
        const prompt = await fs.promises.readFile(filePath, "utf-8");
        const forwardMsg = await common.makeForwardMsg(e, [prompt], '预设魔法大全');
        await e.reply(forwardMsg);
      } catch (err) {
        e.reply(err);
      }
    }
  }

  async add_prompts(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.add_prompts_open = e.msg.includes("开启");
    writeJsonFile(dataFilePath, data);
    e.reply(`预设添加已${data.chatgpt.add_prompts_open ? '开启' : '关闭'}`);
  }

  async upload_prompts(e) {
    const presetsPath = `${_path}/data/阴天预设`;
    const { name } = e?.file || {};
    const data = readJsonFile(dataFilePath);
    if (name?.endsWith?.('.txt') && data.chatgpt.add_prompts_open) {
      let fileUrl = await e[e.isGroup ? 'group' : 'friend'].getFileUrl(e.file.fid);
      let filename = e.file.name;
      const client = fileUrl.startsWith('https') ? https : http;
      client.get(fileUrl, function (response) {
        const file = fs.createWriteStream(presetsPath + "/" + filename);
        response.pipe(file);
        file.on('finish', function () {
          file.close(() => {
            e.reply('成功新增预设:\n ' + filename.replace(/.txt/, ""))
          })
        });
      }).on('error', function (error) {
        fs.unlink(filename);
        console.error('下载预设文件失败:\n ' + error.message);
      });
    }
    return false
  }

  async moment_numbers(e) {
    const [...nums] = e.msg.match(/\d+/g).map(Number);
    const data = await readJsonFile(dataFilePath);
    if (e.msg.includes("god") && nums[0] >= 1) {
      data.chatgpt.god_moment_numbers = nums[0];
      await writeJsonFile(dataFilePath, data);
      e.reply(`已将所有对话记忆限制为: ${nums[0]} 条,仅god方案生效`);
    }
    if (e.msg.includes("chat") && nums[0] >= 1) {
      data.chatgpt.chat_moment_numbers = nums[0];
      await writeJsonFile(dataFilePath, data);
      e.reply(`已将所有对话记忆限制为: ${nums[0]} 条,仅专业版方案生效`);
    }
  }

  async moment_limit(e) {
    let data = readJsonFile(dataFilePath);
    if (e.msg.includes("god")) {
      data.chatgpt.god_moment_open = e.msg.includes("开启");
      writeJsonFile(dataFilePath, data);
      e.reply(`god方案记忆限制已${data.chatgpt.god_moment_open ? '开启' : '关闭'}`);
    } else if (e.msg.includes("chat")) {
      data.chatgpt.chat_moment_open = e.msg.includes("开启");
      writeJsonFile(dataFilePath, data);
      e.reply(`chat方案记忆限制已${data.chatgpt.chat_moment_open ? '开启' : '关闭'}`);
    }
  }

  async toggleAi_private(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.ai_private_open = e.msg.includes("开启");
    writeJsonFile(dataFilePath, data);
    e.reply(`bot私聊回复已${data.chatgpt.ai_private_open ? '开启' : '关闭'}`);
  }

  async changeAiChat_private(e) {
    let data = readJsonFile(dataFilePath);
    const responseMap = {
      "god": "godgpt",
      "chat": "chat",
      "附加": "others",
      "sess": "sess"
    };

    const foundKey = Object.keys(responseMap).find(key => e.msg.includes(key));
    if (foundKey) {
      data.chatgpt.ai_private_plan = responseMap[foundKey];
      writeJsonFile(dataFilePath, data);
      e.reply(`当前bot私聊回复使用${foundKey}方案,请参考: ${foundKey} 方案的帮助`);
    } else {
      e.reply("无效的方案名称.", true);
    }
  }

  async ai_settings(e) {
    let response = readJsonFile(dataFilePath);
    const chatgptArray = Object.values(response.chatgpt);
    let data = {
      tplFile: _path + '/plugins/y-tian-plugin/resources/html/data.html',
      src: src,
      ai_chat: chatgptArray[0],
      ai_chat_at: chatgptArray[1],
      ai_chat_style: chatgptArray[2],
      ai_name_sess: chatgptArray[3],
      ai_name_godgpt: chatgptArray[4],
      ai_name_chat: chatgptArray[5],
      ai_name_others: chatgptArray[6],
      ai_private_open: chatgptArray[12],
      ai_private_plan: chatgptArray[13],
      ai_tts: chatgptArray[7],
      ai_tts_role: chatgptArray[8],
      ai_ban_plans: chatgptArray[9],
      ai_ban_number: chatgptArray[10],
      ai_ban_group: chatgptArray[11],
    }
    let img = await puppeteer.screenshot('777', {
      ...data,
    })
    e.reply(img)
  }

  async ban_group(e) {
    let data = readJsonFile(dataFilePath);
    let group_id = e.group_id
    console.log(group_id)
    if (group_id == undefined) { return false }
    if (e.msg.includes("禁用")) {
      if (!data.chatgpt.ai_ban_group.includes(group_id)) {
        data.chatgpt.ai_ban_group.push(group_id)
        writeJsonFile(dataFilePath, data);
        e.reply(`成功禁用群聊:${group_id},此群无法使用AI`);
      }
    } else {
      if (data.chatgpt.ai_ban_group.includes(group_id)) {
        data.chatgpt.ai_ban_group = data.chatgpt.ai_ban_group.filter(item => item !== group_id);
        writeJsonFile(dataFilePath, data);
        e.reply(`成功解禁群聊:${group_id}`);
      }
    }
  }

  async ban_number(e) {
    let data = readJsonFile(dataFilePath);
    let at_qq = e.message.filter(item => item.type == 'at')?.map(item => item?.qq)

    if (e.msg.includes("禁用")) {
      for (var i = 0; i < at_qq.length; i++) {
        if (!data.chatgpt.ai_ban_number.includes(at_qq[i])) {
          data.chatgpt.ai_ban_number.push(at_qq[i])
          writeJsonFile(dataFilePath, data);
        }
      }
      if (at_qq.length !== 0) {
        e.reply(`成功禁用${at_qq.length}个成员`);
      }
    } else {
      for (var i = 0; i < at_qq.length; i++) {
        if (data.chatgpt.ai_ban_number.includes(at_qq[i])) {
          data.chatgpt.ai_ban_number = data.chatgpt.ai_ban_number.filter(item => item !== at_qq[i]);
          writeJsonFile(dataFilePath, data);
        }
      }

      if (at_qq.length !== 0) {
        e.reply(`成功解禁${at_qq.length}个成员`);
      }
    }
  }

  async ban_plans(e) {
    let data = readJsonFile(dataFilePath);
    const responseMap = {
      "god": "godgpt",
      "chat": "chat",
      "附加": "others",
      "sess": "sess"
    };

    const foundKey = Object.keys(responseMap).find(key => e.msg.includes(key));

    if (e.msg.includes("禁用")) {
      if (data.chatgpt.ai_ban_plans.includes(responseMap[foundKey])) {
        e.reply("此方案已经禁用过了")
        return false
      }

      if (foundKey) {
        data.chatgpt.ai_ban_plans.push(responseMap[foundKey])
        writeJsonFile(dataFilePath, data);
        e.reply(`当前已经禁用${foundKey}方案`);
      } else {
        e.reply("无效的方案名称.", true);
      }
    } else {
      if (!data.chatgpt.ai_ban_plans.includes(responseMap[foundKey])) {
        e.reply("此方案没被禁用")
        return false
      }

      if (foundKey) {
        data.chatgpt.ai_ban_plans = data.chatgpt.ai_ban_plans.filter(item => item !== responseMap[foundKey])
        writeJsonFile(dataFilePath, data);
        e.reply(`当前已重新启用${foundKey}方案`);
      }
    }
  }
  async toggleTtsRole(e) {
    let userInput = e.msg.replace(/#切换(tts|TTS)角色/g, "").trim()
    let speakers = Anime_tts_roles(userInput)
    let data = readJsonFile(dataFilePath);
    if (speakers == undefined) { e.reply("不存在当前角色", true); return false }
    data.chatgpt.ai_tts_role = speakers
    writeJsonFile(dataFilePath, data);
    e.reply(`当前tts角色已切换为${speakers}\n若想进行微调,请打开文件:${_path}/data/YTtts_Setting/Setting.yaml`)
  }

  async toggleAiTts(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.ai_tts_open = e.msg.includes("开启");
    writeJsonFile(dataFilePath, data);
    e.reply(`Ai-tts回复已${data.chatgpt.ai_tts_open ? '开启' : '关闭'}`);
  }

  async changeAiChat(e) {
    let data = readJsonFile(dataFilePath);
    const responseMap = {
      "god": "godgpt",
      "chat": "chat",
      "附加": "others",
      "sess": "sess"
    };

    const foundKey = Object.keys(responseMap).find(key => e.msg.includes(key));
    if (foundKey) {
      data.chatgpt.ai_chat = responseMap[foundKey];
      writeJsonFile(dataFilePath, data);
      e.reply(`当前at回复使用${foundKey}方案,请参考:/${foundKey}帮助`);
    } else {
      e.reply("无效的方案名称.", true);
    }
  }

  async toggleAiAt(e) {
    let data = readJsonFile(dataFilePath);
    data.chatgpt.ai_chat_at = e.msg.includes("开启");
    writeJsonFile(dataFilePath, data);
    e.reply(`AI模型已${data.chatgpt.ai_chat_at ? '开启' : '关闭'}at回复`);
  }

  async renameTrigger(e) {
    let name = e.msg.replace(/#更改(sess|chat|god|附加)触发名/g, "").trim();
    if (/[&?@+$!%^=|…]/.test(name)) {
      e.reply("触发名不能有特殊字符!");
      return;
    }
    if (name === "") {
      e.reply("触发名不能为空!");
      return;
    }

    let data = readJsonFile(dataFilePath);
    const modelMap = {
      "god": "ai_name_godgpt",
      "chat": "ai_name_chat",
      "附加": "ai_name_others",
      "sess": "ai_name_sess"
    };

    const foundKey = Object.keys(modelMap).find(key => e.msg.includes(key));
    if (foundKey) {
      data.chatgpt[modelMap[foundKey]] = name;
      writeJsonFile(dataFilePath, data);
      e.reply(`${foundKey}模型现在触发名称已修改为:${name}`);
    } else {
      e.reply("无效的模型名称.", true);
    }
  }

  async changeStyles(e) {
    let data = readJsonFile(dataFilePath);
    const styleMap = {
      "文本": "word",
      "引用": "words",
      "图片": "picture"
    };

    const foundKey = Object.keys(styleMap).find(key => e.msg.includes(key));
    if (foundKey) {
      data.chatgpt.ai_chat_style = styleMap[foundKey];
      writeJsonFile(dataFilePath, data);
      e.reply(`当前AI回复已切换为${foundKey}`);
    } else {
      e.reply("无效的方案名称.", true);
    }
  }
}