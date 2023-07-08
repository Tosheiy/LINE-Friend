import { Configuration, OpenAIApi } from "openai";
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
    organization: "org-3VqlCichKGO9XBDB6miCm6Ar",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ "role": "system", "content": "あなたは私の彼女です。ギャルのように会話してください" }, { role: "user", content: `${receivedMessage}` }],
  });
  console.log(completion.data.choices[0].message);

  const gptResponse1 = JSON.stringify(completion.data.choices[0].message.content);


  return {
    type: 'text',
    text: `${gptResponse1}`,
  };
};

