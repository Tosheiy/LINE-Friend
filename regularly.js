'use strict';
import { chatgpt } from './chatgpt.js';
import cron from 'node-cron';
import line from '@line/bot-sdk';
import 'dotenv/config';

const client = new line.Client({
    channelAccessToken: "'" + process.env.CHANNEL_ACCESS_TOKEN + "'"
});

// 朝7時にメッセージ
cron.schedule('0 45 22 * * *', async () => {
    const message = {
        type: 'text',
        text: `${await chatgpt(おはよう)}`,
    };
    client.pushMessage(process.env.USER_ID, message)
});

// 夜0時にメッセージ
cron.schedule('0 0 0 * * *', () => {
    const message = {
        type: 'text',
        text: 'そろそろ寝ようかな。おやすみ〜'
    };
    client.pushMessage(process.env.USER_ID, message)
});

// LINE-Friendに移動し、node regularly.cjsを実行