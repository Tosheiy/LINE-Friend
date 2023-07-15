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
};

