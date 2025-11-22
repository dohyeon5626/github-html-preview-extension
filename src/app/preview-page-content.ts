import { getData, removeData, sendMessage, setData } from "../shared/chrome";
import { MessageType, StorageType } from "../shared/type";
import { appendTagBefore, createGithubOauthBox, createTokenButton, getGithubOauthButton, getRawTokenButton, getTokenBox, getTokenButton, getTokenInput, replaceTag } from "../core/tag-service";
import { getHtmlPreviewPageUrl, isOauthTokenEnable } from "../core/auth-service";

const tokenInputBoxSetting = async () => {
    const originButton = getRawTokenButton();
    if(originButton) replaceTag(originButton, createTokenButton());

    const input = getTokenInput();
    if (input) {
        const githubOauthBox = createGithubOauthBox()!;
        appendTagBefore(getTokenBox()!, githubOauthBox);

        const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
        if (token && token != "") input.value = token;

        const githubOauthButton = getGithubOauthButton()!;
        if (await isOauthTokenEnable()) {
            githubOauthButton.classList.remove("logout");
            githubOauthButton.classList.add("login");
        }
        githubOauthButton.onclick = async () => {
            if (githubOauthButton.classList.contains("logout")) {
                await sendMessage(MessageType.START_OAUTH);
            } else {
                await removeData([StorageType.GITHUB_ACCESS_TOKEN, StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN, StorageType.GITHUB_REFRESH_TOKEN, StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN]);
            }
            const url = location.search.split("&")[0].replace("?", "");
            const urlData = url.replace("https://github.com/", "").split("/");
            const user = urlData[0];
            const repo = urlData[1];
            location.href = await getHtmlPreviewPageUrl(url, user, repo);
        }
        
        getTokenButton()!.onclick = async () => {
            const token = input.value;
            await setData({[StorageType.INPUT_TOKEN]: token});

            const url = location.search.split("&")[0].replace("?", "");
            const urlData = url.replace("https://github.com/", "").split("/");
            const user = urlData[0];
            const repo = urlData[1];
            location.href = await getHtmlPreviewPageUrl(url, user, repo);
        };
    }
}

(async () => {
    new MutationObserver((mutations) => {
        tokenInputBoxSetting();
    }).observe(document, {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
    });
})();

sendMessage(MessageType.REMOVE_OTHER_PAGE);