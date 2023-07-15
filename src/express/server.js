// モジュールの読み込み
import express from 'express';
import { middleware } from '@line/bot-sdk';

import 'dotenv/config';


// ファイルの読み込み
import { webhook } from './webhook.js';
import { log } from '../log.js';


const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};




const PORT = process.env.PORT || 3000;

const app = express();

// /にアクセスがあった時、Deploy succeededと返す
app.get('/', (_req, res) => { res.send('Deploy succeeded'); });
// /webhookにアクセスがあったとき、bot.jsのindexを呼び出す
app.post('/webhook', middleware(config), webhook);

app.listen(PORT);
log(`Server running at ${PORT}`);