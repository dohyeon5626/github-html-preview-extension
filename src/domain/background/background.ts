import { addOnCommandListener } from '../../global/chrome/command';
import { addContextMenusOnClickedListener, createContextMenu } from '../../global/chrome/context-menu';
import { getRedirectUrl, launchWebAuthFlow } from '../../global/chrome/identity';
import { addRuntimeInstalledListener } from '../../global/chrome/install';
import { addMessageListener, sendMessage } from '../../global/chrome/message';
import { executeScript, executeScriptFile } from '../../global/chrome/script';
import { getToken } from '../../global/chrome/storage';
import { addTabUpdatedListener, createTab, getActiveTab } from '../../global/chrome/tab';
import { getGithubOauthToken, getProxyToken } from '../../global/etc/api';
import { deletePreviewButton } from '../../global/etc/tag';
import { MessageType } from '../../global/type/message-type';

addTabUpdatedListener(
    (url: string, tabId: number) => {
        if (url.startsWith("https://github.com/") && url.endsWith(".html")) {
            executeScriptFile(tabId, "html-page-content.js");
        } else {
            executeScript(tabId, deletePreviewButton);
        }
    }
);

addRuntimeInstalledListener(() => {
    createContextMenu("Preview Html", "https://github.com/**.html");
});
  
addContextMenusOnClickedListener((info, tab) => {
    let urlData = info.pageUrl.replace("https://github.com/", "").split("/");
    getToken(async (token) => {
        createTab(`https://github-html-preview.dohyeon5626.com/?${info.pageUrl}&${await getProxyToken(urlData[0], urlData[1], token)}&${new Date().getTime()}`, tab);
    }, () => {
        createTab(`https://github-html-preview.dohyeon5626.com/?${info.pageUrl}`, tab);
    });
});

addOnCommandListener(async (command) => {
    if(command === "preview") {
        let tab = await getActiveTab();
        let url = tab.url!!;

        if (url.startsWith("https://github.com/") && url.endsWith(".html")) {
            let urlData = url.replace("https://github.com/", "").split("/");
            getToken(async (token) => {
                createTab(`https://github-html-preview.dohyeon5626.com/?${url}&${await getProxyToken(urlData[0], urlData[1], token)}&${new Date().getTime()}`, tab);
            }, () => {
                createTab(`https://github-html-preview.dohyeon5626.com/?${url}`, tab);
            });
        }
    }
});

addMessageListener(
    (request, callback) => {
        (async () => {
            if(request.action === MessageType.START_OAUTH) {
                let redirectUrl = getRedirectUrl("github")
                launchWebAuthFlow(
                    `https://licorice-api.dohyeon5626.com/github-html-preview/github-oauth/authorize?redirect_uri=${redirectUrl}`,
                    async (responseUrl) => {
                        if (responseUrl) {
                            const code = new URL(responseUrl).searchParams.get('code');
                            if (code) {
                                let info = await getGithubOauthToken(code, redirectUrl);
                                console.log(info);
                                // TODO
                            }
                        }
                    });
            }
        })();
        return true;
    }
)