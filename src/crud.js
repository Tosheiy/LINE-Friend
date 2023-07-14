import {
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
const { TABLE_NAME } = process.env;

// データ作成
export const createData = (userMessageContent, userId, dataType, nanoSecondFormat, appContext) => {
    // パラメータを作成
    const param = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            id: uuidv4(),
            content: userMessageContent,
            userId: userId,
            DataType: dataType,
            typedAt: dayjs().format(nanoSecondFormat),
            role: "user",
        },
    });

    // DynamoDBへデータを保存
    return appContext.dynamoDBContext.put(param);
};

export const anotherData = (chatGptMessageContent, userId, dataType, nanoSecondFormat, appContext) => {
    const param = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            id: uuidv4(),
            content: chatGptMessageContent,
            userId: userId,
            DataType: dataType,
            typedAt: dayjs().format(nanoSecondFormat),
            role: "assistant",
        },
    })
    return appContext.dynamoDBContext.put(param);
};

// データ取得
export const readData = (userId, DataType, appContext) => {
    // パラメータを作成
    const param = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "userIdIndex",
        KeyConditionExpression: "#userId = :userId and #DataType = :DataType",
        ExpressionAttributeNames: {
            "#userId": "userId",
            "#DataType": "DataType"
        },
        ExpressionAttributeValues: {
            ":userId": userId,
            ":DataType": DataType,
        },
    });

    // DynamoDBからデータを取得
    return appContext.dynamoDBContext.query(param);
};



// データ更新
export const updateData = (userId, dataType, data, appContext) => {
    // パラメータを作成
    const param = {
        TableName: TABLE_NAME,
        Key: {
            ID: userId,
            DataType: dataType,
        },
        ExpressionAttributeValues: {
            ':d': data,
        },
        ExpressionAttributeNames: {
            '#d': 'Data',
        },
        UpdateExpression: 'set #d = :d',
    };

    // DynamoDBへデータを更新
    return appContext.dynamoDBContext.update(param);
};

// データ削除
export const deleteData = (userId, dataType, appContext) => {
    // パラメータを作成
    const param = {
        TableName: TABLE_NAME,
        Key: {
            ID: userId,
            DataType: dataType,
        },
    };

    // DynamoDBへデータを削除
    return appContext.dynamoDBContext.delete(param);
};