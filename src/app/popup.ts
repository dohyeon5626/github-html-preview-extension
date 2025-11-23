import { getHtmlPreviewPageUrl, isOauthTokenEnable } from "../core/auth-service";
import { getGithubOauthButton, getTokenButton, getTokenInput } from "../core/tag-service";
import { executeScript, getData, queryInTab, removeData, removeTab, sendMessage, setData, updateTab } from "../shared/chrome";
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
            await removeData([StorageType.GITHUB_OAUTH_TOKEN]);
        }
        sendMessage(MessageType.UPDATE_PAGE);
        window.close();
    }
    
    const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
    if (token != undefined && token != "") getTokenInput()!.value = token;
})();

getTokenButton()!.onclick = async () => {
    await setData({[StorageType.INPUT_TOKEN]: getTokenInput()!.value});
    sendMessage(MessageType.UPDATE_PAGE);
    window.close();
};