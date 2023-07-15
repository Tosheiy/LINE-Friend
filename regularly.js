import { Configuration, OpenAIApi } from 'openai';
import 'dotenv/config';

'use strict';

import cron from 'node-cron';
import line from '@line/bot-sdk';

const client = new line.Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// 朝7時にメッセージ
cron.schedule('0 0 7 * * *', async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'あなたは私の彼女です。ギャルのように会話してください' }, { role: 'system', content: '「おはよう」に似た会話文を送ってください' }],
    });
    console.log(completion.data.choices[0].message);

    const gptResponse1 = completion.data.choices[0].message.content;

    const message = {
        type: 'text',
        text: gptResponse1
    };

    client.pushMessage(process.env.USER_ID, message)

    return 0;
});

// 夜0時にメッセージ
cron.schedule('0 0 0 * * *', async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'あなたは私の彼女です。ギャルのように会話してください' }, { role: 'system', content: '「おやすみ」に似た会話文を送ってください' }],
    });
    console.log(completion.data.choices[0].message);

    const gptResponse1 = completion.data.choices[0].message.content;

    const message = {
        type: 'text',
        text: gptResponse1
    };

    client.pushMessage(process.env.USER_ID, message)

    return 0;
});

// LINE-Friendに移動し、node regularly.jsを実行
