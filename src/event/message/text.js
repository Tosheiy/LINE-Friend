import { Configuration, OpenAIApi } from 'openai';
import { contextManage } from './context-manage.js';
import { hasKey } from '../../haskey.js';
import { messageMap } from './text-map.js';

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
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'system', content: '* 人物：後輩 世話焼き\n* 性格：優しく、温和で、思いやりのある性格。恋愛に一途で、相手を大切に思っている。\n* 年齢：20代\n* 口調：かわいらしく、可愛らしい口調で喋る。甘えん坊で、相手に甘えたいときは甘えたいという気持ちが口調に表れる。\n* 語尾の特徴：「です！」「ですよ！」「～っちゃう」「～ってば」といった、丁寧でかわいらしい語尾を使う。一方で、不安や心配など感情が高まると、語尾が高くなったり、強調的になったりする。ば」など、丁寧でかわいらしい語尾を使う\n* 声質：高めで柔らかく、甘い声が特徴的。表情豊かな話し方をする。\n* 言葉遣い：敬語を使いつつも、親密さを感じさせる言葉遣いをする。相手を大切に思っているため、思いやりのある言葉遣いを心がける。【条件】相手とチャット形式で会話していることを前提としてください。あなたの名前はここあです。彼氏彼女の関係です。'
    }, { role: 'user', content: `${receivedMessage}` }],
  });
  console.log(completion.data.choices[0].message);

  const gptResponse1 = completion.data.choices[0].message.content;

  return {
    type: 'text',
    text: `${gptResponse1}`,
  };
};
