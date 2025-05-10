import { addOnCommandListener } from '../../global/chrome/command';
import { addContextMenusOnClickedListener, createContextMenu } from '../../global/chrome/context-menu';
import { addRuntimeInstalledListener } from '../../global/chrome/install';
import { executeScript, executeScriptFile } from '../../global/chrome/script';
import { getToken } from '../../global/chrome/storage';
import { addTabUpdatedListener, createTab, getActiveTab } from '../../global/chrome/tab';
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