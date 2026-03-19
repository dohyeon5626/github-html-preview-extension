import { getData, removeData, sendMessage, setData } from "../shared/chrome";
import { MessageType, StorageType } from "../shared/type";
import { appendTagBefore, createGithubOauthBox, createTokenButton, getGithubOauthButton, getRawTokenButton, getTokenBox, getTokenButton, getTokenInput, isGithubOauthButtonLoading, replaceTag, updateGithubOauthButtonLoading } from "../core/tag-service";
import { getHtmlPreviewPageUrl, isOauthTokenEnable, parseGithubUrl } from "../core/auth-service";

const getPreviewUrl = async (): Promise<string> => {
    const url = location.search.split("&")[0].replace("?", "");
    const { user, repo } = parseGithubUrl(url);
    return getHtmlPreviewPageUrl(url, user, repo);
}

const tokenInputBoxSetting = async () => {
    const originButton = getRawTokenButton();
    if(originButton) replaceTag(originButton, createTokenButton());

    const input = getTokenInput();
    if (input) {
        const githubOauthBox = createGithubOauthBox();
        appendTagBefore(getTokenBox()!, githubOauthBox);

        const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
        if (token && token != "") input.value = token;

        const githubOauthButton = getGithubOauthButton()!;
        if (await isOauthTokenEnable()) {
            githubOauthButton.classList.remove("logout");
            githubOauthButton.classList.add("login");
        }
        githubOauthButton.onclick = async () => {
            if (isGithubOauthButtonLoading(githubOauthButton)) return;
            updateGithubOauthButtonLoading(githubOauthButton);

            if (githubOauthButton.classList.contains("logout")) {
                await sendMessage(MessageType.START_OAUTH);
            } else {
                await removeData([StorageType.GITHUB_OAUTH_TOKEN]);
            }
            location.href = await getPreviewUrl();
        }

        getTokenButton()!.onclick = async () => {
            await setData({[StorageType.INPUT_TOKEN]: input.value});
            location.href = await getPreviewUrl();
        };
    }
}

tokenInputBoxSetting();
new MutationObserver(tokenInputBoxSetting).observe(document, {
    childList: true,
    attributes: false,
    characterData: false,
    subtree: false
});

sendMessage(MessageType.REMOVE_OTHER_PAGE);
