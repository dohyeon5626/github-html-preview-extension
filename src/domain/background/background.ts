import { addTabUpdatedListener } from '../../global/chrome/tab';
import { executeScript } from '../../global/chrome/script';
import { addPreviewButton, deletePreviewButton } from '../../global/etc/tag';

addTabUpdatedListener(
    (url: string, tabId: number) => {
        if (url.includes("https://github.com/") && url.endsWith(".html")) {
            executeScript(tabId, addPreviewButton);
        } else {
            executeScript(tabId, deletePreviewButton);
        }
    }
);