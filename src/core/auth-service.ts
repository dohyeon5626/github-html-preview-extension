import { getProxyToken } from "../shared/api";
import { getData, removeData, sendMessage, setData } from "../shared/chrome";
import { MessageType, StorageType } from "../shared/type";

export const isOauthTokenEnable = async (): Promise<boolean> => {
    const data = await getData([StorageType.GITHUB_OAUTH_TOKEN]);
    return data[StorageType.GITHUB_OAUTH_TOKEN];
}

export const getHtmlPreviewPageUrl = async (url: string, user: string, repo: string): Promise<string> => {
    const data = await getData([StorageType.GITHUB_OAUTH_TOKEN, StorageType.INPUT_TOKEN]);
    
    const tokenList = [];
    if (data[StorageType.GITHUB_OAUTH_TOKEN]) {
        tokenList.push(data[StorageType.GITHUB_OAUTH_TOKEN]);
    }
    if (data[StorageType.INPUT_TOKEN] && data[StorageType.INPUT_TOKEN] != "") {
        tokenList.push(data[StorageType.INPUT_TOKEN]);
    }

    if (tokenList.length === 0)
        return `https://github-html-preview.dohyeon5626.com/?${url}`
    else
        return `https://github-html-preview.dohyeon5626.com/?${url}&${await getProxyToken(user, repo, tokenList)}&${new Date().getTime()}`
}