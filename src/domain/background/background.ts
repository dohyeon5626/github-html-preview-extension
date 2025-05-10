import { addContextMenusOnClickedListener, createContextMenu } from '../../global/chrome/context-menu';
import { addRuntimeInstalledListener } from '../../global/chrome/install';
import { executeScript, executeScriptFile } from '../../global/chrome/script';
import { getToken } from '../../global/chrome/storage';
import { addTabUpdatedListener, createTab } from '../../global/chrome/tab';
import { getProxyToken } from '../../global/etc/api';
import { deletePreviewButton } from '../../global/etc/tag';

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
    createContextMenu("Preview", "https://github.com/**.html");
});
  
addContextMenusOnClickedListener((info, tab) => {
    let urlData = info.pageUrl.replace("https://github.com/", "").split("/");
    let user = urlData[0];
    let repo = urlData[1];
    getToken(async (token) => {
        createTab(`https://github-html-preview.dohyeon5626.com/?${info.pageUrl}&${await getProxyToken(user, repo, token)}&${new Date().getTime()}`, tab);
    }, () => {
        createTab(`https://github-html-preview.dohyeon5626.com/?${info.pageUrl}`, tab);
    });
});