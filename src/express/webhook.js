// モジュール読み込み
import line from '@line/bot-sdk';
import aws from 'aws-sdk';
import { error, log } from '../log.js';
import { bot } from '../bot.js';
import { DynamoDBContext } from '../db.js';
import { AppContext } from '../app-context.js';
import { saveContentFileToDownloadDir } from '../save-file.js';
import 'dotenv/config';


const { CHANNEL_ACCESS_TOKEN } = process.env;



// bot-sdkのクライアントを作成
const lineClient = new line.Client({
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
});


export const webhook = (req, res) => {
  // 受け取ったイベントの中身を出力
  console.log(req.body.events[0].message.text);

  // リクエストボディからイベントを取り出し
  const { events } = req.body;

  // DynamoDB DocumentClientのインスタンスを生成
  const dynamoDocument = new aws.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:8000',
    region: 'ap-northeast-1',
  });

  // DynamoDBのContextを作成
  const dynamoDBContext = new DynamoDBContext(dynamoDocument);

  // ファイルのダウンローダーを作成
  const contentFileDownloader = saveContentFileToDownloadDir;

  // AppContextを作成
  const appContext = new AppContext({
    dynamoDBContext,
    lineClient,
    contentFileDownloader,
  });

  // イベントを処理する関数を呼び出す
  Promise
    .all(bot(events, appContext))
    .catch((err) => {
      error(`返信処理でエラーが発生しました: ${err}`);
    });

  return res.json('ok');
};