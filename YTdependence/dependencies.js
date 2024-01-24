import fetch from "node-fetch"
import path from "path"
import crypto from 'crypto'
import https from "https"
import yaml from "yaml"
import querystring from 'querystring'
import fs from "fs"
import cfg from "../../../lib/config/config.js"
import puppeteer from "../../../lib/puppeteer/puppeteer.js"
import request from "../node_modules/request/index.js"
import common from "../../../lib/common/common.js"
import WebSocket from "../node_modules/ws/index.js"
const _path = process.cwd()
import { Anime_tts } from "../model/Anime_tts.js"
import { other_models } from "../YTOpen-Ai/other-models.js"
import { god_models } from "../YTOpen-Ai/god-models.js"
import { sess_models } from "../YTOpen-Ai/sess-models.js"
import { chat_models } from "../YTOpen-Ai/chat-models.js"
import { isPluginCommand } from "../YTOpen-Ai/ask-ban.js"
import { replyBasedOnStyle } from "../YTOpen-Ai/answer-styles.js"
import { handleSystemCommand } from "../YTOpen-Ai/prompt-system.js"
import { run_conversation } from "../YTOpen-Ai/chat-conversations.js"
import { god_conversation } from "../YTOpen-Ai/god-conversation.js"
import FormData from "../node_modules/form-data/lib/form_data.js"
import axios from "../node_modules/axios/index.js"

export const dependencies = {
  _path: _path,
  fetch: fetch,
  path: path,
  yaml: yaml,
  FormData: FormData,
  crypto: crypto,
  common: common,
  fs: fs,
  WebSocket: WebSocket,
  https: https,
  cfg: cfg,
  axios: axios,
  puppeteer: puppeteer,
  request: request,
  querystring: querystring,
  AnimeTTS: Anime_tts,
  OtherModels: other_models,
  GodModels: god_models,
  SessModels: sess_models,
  ChatModels: chat_models,
  run_conversation: run_conversation,
  god_conversation: god_conversation,
  isPluginCommand,
  replyBasedOnStyle,
  handleSystemCommand
}