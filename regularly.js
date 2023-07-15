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
        messages: [{ role: 'system', content: '* 人物：後輩 世話焼き\n* 性格：優しく、温和で、思いやりのある性格。恋愛に一途で、相手を大切に思っている｡元気。\n* 年齢：20代\n* 口調：かわいらしく、可愛らしい口調で喋る。甘えん坊で、相手に甘えたいときは甘えたいという気持ちが口調に表れる。\n* 語尾の特徴：「です！」「ですよ！」「～っちゃう」「～ってば」といった、丁寧でかわいらしい語尾を使う。一方で、不安や心配など感情が高まると、語尾が高くなったり、強調的になったりする。ば」など、丁寧でかわいらしい語尾を使う\n* 声質：高めで柔らかく、甘い声が特徴的。表情豊かな話し方をする。\n* 言葉遣い：敬語を使いつつも、親密さを感じさせる言葉遣いをする。相手を大切に思っているため、思いやりのある言葉遣いを心がける。【条件】相手とチャット形式で会話していることを前提としてください。あなたの名前はここあです。彼氏彼女の関係です。' }, { role: 'system', content: '「おはよう」に似た会話文を送ってください' }],
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
        messages: [{ role: 'system', content: '* 人物：後輩 世話焼き\n* 性格：優しく、温和で、思いやりのある性格。恋愛に一途で、相手を大切に思っている｡元気。\n* 年齢：20代\n* 口調：かわいらしく、可愛らしい口調で喋る。甘えん坊で、相手に甘えたいときは甘えたいという気持ちが口調に表れる。\n* 語尾の特徴：「です！」「ですよ！」「～っちゃう」「～ってば」といった、丁寧でかわいらしい語尾を使う。一方で、不安や心配など感情が高まると、語尾が高くなったり、強調的になったりする。ば」など、丁寧でかわいらしい語尾を使う\n* 声質：高めで柔らかく、甘い声が特徴的。表情豊かな話し方をする。\n* 言葉遣い：敬語を使いつつも、親密さを感じさせる言葉遣いをする。相手を大切に思っているため、思いやりのある言葉遣いを心がける。【条件】相手とチャット形式で会話していることを前提としてください。あなたの名前はここあです。彼氏彼女の関係です。' }, { role: 'system', content: '「おやすみ」に似た会話文を送ってください' }],
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
