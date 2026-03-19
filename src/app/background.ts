import { addContextMenusOnClickedListener, addMessageListener, addOnCommandListener, addRuntimeInstalledListener, addTabUpdatedListener, createContextMenu, createTab, executeScript, executeScriptFile, getActiveTab, getData, getRedirectUrl, launchWebAuthFlow, queryInTab, removeTab, setData, updateTab } from '../shared/chrome';
import { getGithubOauthToken, getProxyToken } from '../shared/api';
import { MessageType, StorageType } from '../shared/type';
import { getHtmlPreviewPageUrl, parseGithubUrl } from '../core/auth-service';

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
    const { user, repo } = parseGithubUrl(info.pageUrl);
    createTab(await getHtmlPreviewPageUrl(info.pageUrl, user, repo), tab);
});

addOnCommandListener(async (command) => {
    if(command === "preview") {
        const tab = await getActiveTab();
        const url = tab.url!;

        if (url.startsWith("https://github.com/") && url.endsWith(".html")) {
            const { user, repo } = parseGithubUrl(url);
            createTab(await getHtmlPreviewPageUrl(url, user, repo), tab);
        }
    }
});

addMessageListener(
    (request, callback) => {
        (async () => {
            if(request.action === MessageType.START_OAUTH) {
                const redirectUrl = getRedirectUrl("github");
                await launchWebAuthFlow(
                    `https://api.dohyeon5626.com/github-html-preview/github-oauth/authorize?redirectUri=${redirectUrl}`,
                    async (responseUrl) => {
                        if (responseUrl) {
                            const code = new URL(responseUrl).searchParams.get('code');
                            if (code) {
                                const token = await getGithubOauthToken(code, redirectUrl);
                                await setData({[StorageType.GITHUB_OAUTH_TOKEN]: token});
                                callback(null);
                            }
                        }
                    }
                );
            } else if(request.action === MessageType.REMOVE_OTHER_PAGE) {
                queryInTab((tabs) => {
                    tabs.filter(tab => tab.url?.startsWith("https://github-html-preview.dohyeon5626.com/")).forEach(tab => {
                        if(!tab.active) removeTab(tab.id!);
                    });
                });
            } else if (request.action === MessageType.UPDATE_PAGE) {
                queryInTab((tabs) => {
                    tabs.filter(tab => tab.url?.startsWith("https://github-html-preview.dohyeon5626.com/")).forEach(async tab => {
                        if (tab.active) {
                            const url = tab.url!.split("?")[1].split("&")[0];
                            const { user, repo } = parseGithubUrl(url);
                            updateTab(tab.id!, await getHtmlPreviewPageUrl(url, user, repo));
                        } else {
                            removeTab(tab.id!);
                        }
                    });
                });
                callback(null);
            }
        })();
        
        return true;
    }
)