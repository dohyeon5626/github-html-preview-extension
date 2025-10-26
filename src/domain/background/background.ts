import { addOnCommandListener } from '../../global/chrome/command';
import { addContextMenusOnClickedListener, createContextMenu } from '../../global/chrome/context-menu';
import { getRedirectUrl, launchWebAuthFlow } from '../../global/chrome/identity';
import { addRuntimeInstalledListener } from '../../global/chrome/install';
import { addMessageListener, sendMessage } from '../../global/chrome/message';
import { executeScript, executeScriptFile } from '../../global/chrome/script';
import { getData, setData } from '../../global/chrome/storage';
import { addTabUpdatedListener, createTab, getActiveTab } from '../../global/chrome/tab';
import { getGithubOauthToken, getProxyToken } from '../../global/etc/api';
import { MessageType } from '../../global/type/message-type';
import { StorageType } from '../../global/type/storage-type';

addTabUpdatedListener(
    (url: string, tabId: number) => {
        if (url.startsWith("https://github.com/") && url.endsWith(".html")) {
            executeScriptFile(tabId, "html-page-content.js");
        } else {
            executeScript(tabId, () => {
                document.getElementById("html-preview")?.parentElement?.remove()
                document.getElementById("preview-button-error-alert")?.remove()
            });
        }
    }
);

addRuntimeInstalledListener(() => {
    createContextMenu("Preview Html", "https://github.com/**.html");
});
  
addContextMenusOnClickedListener(async (info, tab) => {
    const urlData = info.pageUrl.replace("https://github.com/", "").split("/");
    const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
    if (token != undefined && token != "") {
        createTab(`https://github-html-preview.dohyeon5626.com/?${info.pageUrl}&${await getProxyToken(urlData[0], urlData[1], token)}&${new Date().getTime()}`, tab);
    } else {
        createTab(`https://github-html-preview.dohyeon5626.com/?${info.pageUrl}`, tab);
    }
});

addOnCommandListener(async (command) => {
    if(command === "preview") {
        const tab = await getActiveTab();
        const url = tab.url!!;

        if (url.startsWith("https://github.com/") && url.endsWith(".html")) {
            const urlData = url.replace("https://github.com/", "").split("/");
            const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
            if (token != undefined && token != "") {
                createTab(`https://github-html-preview.dohyeon5626.com/?${url}&${await getProxyToken(urlData[0], urlData[1], token)}&${new Date().getTime()}`, tab);
            } else {
                createTab(`https://github-html-preview.dohyeon5626.com/?${url}`, tab);
            }
        }
    }
});

addMessageListener(
    (request, callback) => {
        (async () => {
            if(request.action === MessageType.START_OAUTH) {
                const redirectUrl = getRedirectUrl("github")
                launchWebAuthFlow(
                    `https://licorice-api.dohyeon5626.com/github-html-preview/github-oauth/authorize?redirect_uri=${redirectUrl}`,
                    async (responseUrl) => {
                        if (responseUrl) {
                            const code = new URL(responseUrl).searchParams.get('code');
                            if (code) {
                                const info = await getGithubOauthToken(code, redirectUrl);
                                setData({
                                    [StorageType.GITHUB_ACCESS_TOKEN]: info.access.token,
                                    [StorageType.GITHUB_ACCESS_TOKEN_EXPIRES_IN]: Date.now() + info.access.expiresIn * 1000,
                                    [StorageType.GITHUB_REFRESH_TOKEN]: info.refresh.token,
                                    [StorageType.GITHUB_REFRESH_TOKEN_EXPIRES_IN]: Date.now() + info.refresh.expiresIn * 1000
                                });
                            }
                        }
                    });
            }
        })();
        return true;
    }
)