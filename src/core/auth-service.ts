import { getProxyToken, refreshGithubOauthToken } from "../shared/api";
import { getData, removeData, sendMessage, setData } from "../shared/chrome";
import { MessageType, StorageType } from "../shared/type";

export const isOauthTokenEnable = async (): Promise<boolean> => {
    await refreshOauthTokenState();
    const data = await getData([StorageType.GITHUB_ACCESS_TOKEN, StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN, StorageType.GITHUB_REFRESH_TOKEN, StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN]);
    if (!(data[StorageType.GITHUB_ACCESS_TOKEN] && data[StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN] && data[StorageType.GITHUB_REFRESH_TOKEN] && data[StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN])) {
        return false;
    }
    
    return true;
}

export const getHtmlPreviewPageUrl = async (url: string, user: string, repo: string): Promise<string> => {
    await refreshOauthTokenState();
    const data = await getData([StorageType.GITHUB_ACCESS_TOKEN, StorageType.INPUT_TOKEN]);
    
    const tokenList = [];
    if (data[StorageType.GITHUB_ACCESS_TOKEN]) {
        tokenList.push(data[StorageType.GITHUB_ACCESS_TOKEN]);
    }
    if (data[StorageType.INPUT_TOKEN] && data[StorageType.INPUT_TOKEN] != "") {
        tokenList.push(data[StorageType.INPUT_TOKEN]);
    }

    if (tokenList.length === 0)
        return `https://github-html-preview.dohyeon5626.com/?${url}`
    else
        return `https://github-html-preview.dohyeon5626.com/?${url}&${await getProxyToken(user, repo, tokenList)}&${new Date().getTime()}`
}

const refreshOauthTokenState = async () => {
    const data = await getData([StorageType.GITHUB_ACCESS_TOKEN, StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN, StorageType.GITHUB_REFRESH_TOKEN, StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN]);
    if (!(data[StorageType.GITHUB_ACCESS_TOKEN] && data[StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN] && data[StorageType.GITHUB_REFRESH_TOKEN] && data[StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN])) {
        return;
    }

    if (data[StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN] <= Date.now()) {
        removeData([StorageType.GITHUB_ACCESS_TOKEN, StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN, StorageType.GITHUB_REFRESH_TOKEN, StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN]);
        sendMessage(MessageType.START_AUTO_OAUTH);
    }
    if (data[StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN] <= Date.now()) {
        const info = await refreshGithubOauthToken(data[StorageType.GITHUB_REFRESH_TOKEN]);
        setData({
            [StorageType.GITHUB_ACCESS_TOKEN]: info.access.token,
            [StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN]: Date.now() + info.access.expiresIn * 1000,
            [StorageType.GITHUB_REFRESH_TOKEN]: info.refresh.token,
            [StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN]: Date.now() + info.refresh.expiresIn * 1000
        });
    }
}