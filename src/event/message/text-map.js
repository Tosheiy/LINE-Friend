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
};

