import { contextManage } from './context-manage.js';
import { hasKey } from '../../haskey.js';
import { messageMap } from './text-map.js';
import 'dotenv/config';
import { createData, readData, deleteData } from "../../crud.js";
import { Configuration, OpenAIApi } from "openai";


// テキストメッセージの処理をする関数
export const textEvent = async (event, appContext) => {
  // contextが存在した場合は対応するメッセージが返ってきて、存在しない場合はundefinedが帰ってくる
  const contextManageResult = await contextManage(event, appContext);
  if (contextManageResult) {
    return contextManageResult;
  }
  // ユーザーから送られてきたメッセージ
  const receivedMessage = event.message.text;
  // 送られてきたメッセージに応じて返信するメッセージを取得してreturn
  if (hasKey(messageMap, receivedMessage)) {
    return messageMap[receivedMessage](event, appContext);
  }


  // 返信するメッセージが存在しない場合

  // キャラクターの変更関数
  const character = async (event, appContext) => {
    const defaultprompt = '* 人物：後輩 世話焼き\n* 性格：優しく、温和で、思いやりのある性格。恋愛に一途で、相手を大切に思っている。\n* 年齢：20代\n* 口調：かわいらしく、可愛らしい口調で喋る。甘えん坊で、相手に甘えたいときは甘えたいという気持ちが口調に表れる。\n* 語尾の特徴：「です！」「ですよ！」「～っちゃう」「～ってば」といった、丁寧でかわいらしい語尾を使う。一方で、不安や心配など感情が高まると、語尾が高くなったり、強調的になったりする。ば」など、丁寧でかわいらしい語尾を使う\n* 声質：高めで柔らかく、甘い声が特徴的。表情豊かな話し方をする。\n* 言葉遣い：敬語を使いつつも、親密さを感じさせる言葉遣いをする。相手を大切に思っているため、思いやりのある言葉遣いを心がける。【条件】相手とチャット形式で会話していることを前提としてください。あなたの名前はここあです。彼氏彼女の関係です。'
    const prompt = await readData(event.source.userId, 'prompt', appContext);

    if (prompt.Items[0]) {
      if (prompt.Items[0].Data.length < 50) {

        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system', content: `ChatGPTが以下の性格になりきってチャットができるように命令文を生成してください。\n[以下の形式で出力してください]\n#命令文\n次の#キャラクター設定に従って質問に回答してください。【例】* 人物：後輩 世話焼き\n* 性格：優しく、温和で、思いやりのある性格。恋愛に一途で、相手を大切に思っている。\n* 年齢：20代\n* 口調：かわいらしく、可愛らしい口調で喋る。甘えん坊で、相手に甘えたいときは甘えたいという気持ちが口調に表れる。\n* 語尾の特徴：「です！」「ですよ！」といった、丁寧でかわいらしい語尾を使う。一方で、不安や心配など感情が高まると、語尾が高くなったり、強調的になったりする。ば」など、丁寧でかわいらしい語尾を使う\n* 声質：高めで柔らかく、甘い声が特徴的。表情豊かな話し方をする。\n* 言葉遣い：敬語を使いつつも、親密さを感じさせる言葉遣いをする。相手を大切に思っているため、思いやりのある言葉遣いを心がける。【条件】相手とチャット形式で会話していることを前提としてください。あなた自身の一人称はここあです。彼氏彼女の関係です。`
          },
          { role: 'user', content: `${prompt.Items[0].Data}` }],
        });
        console.log(completion.data.choices[0].message);

        const newprompt = completion.data.choices[0].message.content;
        await createData(event.source.userId, 'prompt', newprompt, appContext);
        return completion.data.choices[0].message.content;
      }
      console.log(prompt.Items[0].Data);
      return prompt.Items[0].Data;
    }
    console.log(defaultprompt);
    return defaultprompt;
  };


  // 性格命令文
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const systemMessage = {

    role: 'system', content: `${await character(event, appContext)}`
  };

  //await deleteData(event.source.userId, 'message', appContext);

  let Message = await readData(event.source.userId, 'message', appContext);
  console.log(Message);
  if (Message.Items[0] === undefined) {
    Message = []
  } else {
    Message = Message.Items[0].Data;
  };
  Message.push({ role: "user", content: receivedMessage })
  console.log(Message);



  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      systemMessage,

      ...Message

    ],
    top_p: 0.5,
    temperature: 0.5,

  }
  )

  const res = completion.data.choices[0].message.content;

  Message.push({ role: 'assistant', content: res })
  Message = Message.slice(-6)

  console.log(Message);
  await createData(event.source.userId, 'message', Message, appContext);

  return {
    type: 'text',
    text: res
  };
};
