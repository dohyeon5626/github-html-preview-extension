import { getHtmlPreviewPageUrl, isOauthTokenEnable } from "../core/auth-service";
import { getGithubOauthButton, getTokenButton, getTokenInput } from "../core/tag-service";
import { executeScript, getData, queryInTab, removeData, sendMessage, setData, updateTab } from "../shared/chrome";
import { MessageType, StorageType } from "../shared/type";

(async () => {
    const githubOauthButton = getGithubOauthButton()!;
    
    if (await isOauthTokenEnable()) {
        githubOauthButton.classList.remove("logout")
        githubOauthButton.classList.add("login")
    }

    githubOauthButton.onclick = async () => {
        if (githubOauthButton.classList.contains("logout")) {
            await sendMessage(MessageType.START_OAUTH);
        } else {
            await removeData([StorageType.GITHUB_ACCESS_TOKEN, StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN, StorageType.GITHUB_REFRESH_TOKEN, StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN]);
            githubOauthButton.classList.remove("login")
            githubOauthButton.classList.add("logout")
        }
        queryInTab((tabs) => {
            tabs.filter(tab => tab.url?.startsWith("https://github-html-preview.dohyeon5626.com/")).forEach(async tab => {
                const url = tab.url!.split("?")[1].split("&")[0];
                const urlData = url.replace("https://github.com/", "").split("/");
                const user = urlData[0];
                const repo = urlData[1];
                updateTab(tab.id!, await getHtmlPreviewPageUrl(tab.url!, user, repo));
            });
        });
        window.close();
    }
    
    const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
    if (token != undefined && token != "") getTokenInput()!.value = token;
})();

getTokenButton()!.onclick = async () => {
    await setData({[StorageType.INPUT_TOKEN]: getTokenInput()!.value});
    queryInTab((tabs) => {
        tabs.filter(tab => tab.url?.startsWith("https://github-html-preview.dohyeon5626.com/")).forEach(async tab => {
            const url = tab.url!.split("?")[1].split("&")[0];
            const urlData = url.replace("https://github.com/", "").split("/");
            const user = urlData[0];
            const repo = urlData[1];
            updateTab(tab.id!, await getHtmlPreviewPageUrl(tab.url!, user, repo));
        });
    });
    window.close();
};