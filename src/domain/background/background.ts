import { executeScript, executeScriptFile } from '../../global/chrome/script';
import { addTabUpdatedListener } from '../../global/chrome/tab';
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