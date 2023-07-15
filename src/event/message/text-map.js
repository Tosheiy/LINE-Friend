import {
  createData, deleteData, readData, updateData,
} from '../../crud.js';
import { get } from '../../request.js';
import { error } from '../../log.js';
// ユーザーのプロフィールを取得する関数
const getUserProfile = (event, client) => client.getProfile(event.source.userId);

// 受け取ったメッセージと返信するメッセージ(を返す関数)をマッピング
export const messageMap = {
  テスト: () => ({
    type: 'text',
    text: 'テスト成功',
  }),
  //まだできてない。消すならここ消す
  性格変更: async (event, appContext) => {
    await createData(event.source.userId, 'context', 'changecha', appContext);
    return {
      type: 'text',
      text: 'どんなタイプが好きだったっけ？',
    };
  },
  性格変更確認: async (event, appContext) => {
    const prompt = await readData(event.source.userId, 'prompt', appContext);
    if (prompt.Items[0]) {
      return {
        type: 'text',
        text: `${prompt.Items[0].Data}`,
      };
    }
    return {
      type: 'text',
      text: '性格が存在しません',
    };
  },
  テスト: () => ({
    type: 'text',
    text: 'テスト成功',
  }),
  Create: async (event, appContext) => {
    const date = new Date();
    await createData(event.source.userId, 'testData', `Data created at ${date}`, appContext);
    return {
      type: 'text',
      text: 'データが作成されました',
    };
  },
  Read: async (event, appContext) => {
    const dbData = await readData(event.source.userId, 'testData', appContext);
    return {
      type: 'text',
      text: `DBには以下のデータが保存されています\n\n${dbData.Items[0].Data}`,
    };
  },
  Update: async (event, appContext) => {
    const date = new Date();
    await updateData(event.source.userId, 'testData', `Data created at ${date}`, appContext);
    return {
      type: 'text',
      text: 'データを更新しました',
    };
  },
  Delete: async (event, appContext) => {
    await deleteData(event.source.userId, 'testData', appContext);
    return {
      type: 'text',
      text: 'データを削除しました',
    };
  },
  メモ: async (event, appContext) => {
    const memoData = await readData(event.source.userId, 'memo', appContext);
    if (memoData.Items[0]) {
      return {
        type: 'text',
        text: `${memoData.Items[0].Data}`,
      };
    }

    return {
      type: 'text',
      text: 'メモが存在しません',
    };
  },
  メモ開始: async (event, appContext) => {
    await createData(event.source.userId, 'context', 'memoMode', appContext);
    return {
      type: 'text',
      text: '開始',
    };
  },
};

