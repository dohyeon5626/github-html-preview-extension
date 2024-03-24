import { addTabUpdatedListener } from '../../global/chrome/tab';
import { executeScript } from '../../global/chrome/script';
import { addPreviewButton, deletePreviewButton } from '../../global/etc/tag';
import { getToken } from '../../global/chrome/storage';

addTabUpdatedListener(
    (url: string, tabId: number) => {
        if (url.includes("https://github.com/") && url.endsWith(".html")) {
            executeScript(tabId, () => addPreviewButton(getToken));
        } else {
            executeScript(tabId, deletePreviewButton);
        }
    }
);