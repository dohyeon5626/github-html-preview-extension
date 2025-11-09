import { getNowVersion, setData } from "../shared/chrome";
import { StorageType } from "../shared/type";

export const getTokenInput = (): HTMLInputElement | null => {
    return (<HTMLInputElement>document.getElementById("token-input"));
}

export const getTokenButton = (): HTMLElement | null => {
    return document.getElementById("token-button");
}

export const getRawTokenButton = (): HTMLElement | null => {
    return document.getElementById("raw-token-button");
}

export const getHtmlPreview = (): HTMLElement | null => {
    return document.getElementById("html-preview");
}

export const getPreviewButtonErrorAlert = (): HTMLElement | null => {
    return document.getElementById("preview-button-error-alert");
}

export const createTokenButton = (): HTMLElement => {
    return getTagByString(`<button id="token-button">Enter</button>`);
}

export const createHtmlPreviewButtonBox = (styleClass: string): HTMLElement => {
    return getTagByString(`<div><button id="html-preview" data-size="small" data-variant="default" class="${styleClass}">Preview</button></div>`);
}

export const createPreviewButtonErrorAlert =(): HTMLElement => {
    const previewButtonErrorAlert = getTagByString(`
        <div id="preview-button-error-alert" style="
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 510px;
                        background: rgba(242,242,242,0.4);
                        backdrop-filter: blur(2px);
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', sans-serif;
                        display: flex;
                        padding: 16px;
                        z-index: 9999;">
                        <button id="close-button" style="
                            top: -10px;
                            position: absolute;
                            left: -10px;
                            height: 28px;
                            width: 28px;
                            border-radius: 50%;
                            border: 1px solid rgba(255,255,255,0.3);
                            background: rgba(0,0,0,0.2);
                            color: rgb(255,255,255);
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            display: none;">×</button>
                        <img style="
                            width: 44px;
                            height: 44px;
                            background-color: #ccc;
                            border-radius: 8px;
                            flex-shrink: 0;
                            margin-right: 12px;"></img>
                        <div style="flex: 1;">
                            <div style="height: 20px; font-size: 12px; color: #333; margin-bottom: 4px; display: flex; justify-content: space-between;">
                                Github Html Preview Extension
                                <button id="forever-close-button" style="border-radius: 5px;
                                    padding: 2px 12px;
                                    border: 1px solid rgba(255,255,255,0.3);
                                    background: rgba(0,0,0,0.2);
                                    color: rgba(255,255,255);
                                    font-size: 12px;
                                    font-weight: 600;
                                    cursor: pointer;
                                    line-height: 12px;
                                    display: none;">
                                    Don't show this again</button>
                            </div>
                            <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px; color: #111;">Preview button temporarily unavailable</div>
                            <div style="font-size: 13px; color: #333;">Due to recent changes to GitHub's layout, the preview button is temporarily disabled.<br/>Use Ctrl + Shift + P (Windows/Linux) or Command + Shift + P (Mac), or right-click and select "Preview HTML" from the context menu.</div>
                        </div>
                    </div>
        `);
        
    const icon = previewButtonErrorAlert.querySelector('img') as HTMLImageElement;
    if (icon) icon.src = chrome.runtime.getURL('icon/128.png');

    const closeBtn = previewButtonErrorAlert.querySelector('#close-button') as HTMLElement | null;
    if (closeBtn) {
        previewButtonErrorAlert.addEventListener('mouseenter', () => {
            closeBtn.style.display = 'block';
        });
        previewButtonErrorAlert.addEventListener('mouseleave', () => {
            closeBtn.style.display = 'none';
        });
        closeBtn.addEventListener('click', () => {
            previewButtonErrorAlert.style.display = 'none';
        });
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background='rgba(0,0,0,0.3)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background='rgba(0,0,0,0.2)';
        });
    }

    const foreverCloseBtn = previewButtonErrorAlert.querySelector('#forever-close-button') as HTMLElement | null;
    if (foreverCloseBtn) {
        previewButtonErrorAlert.addEventListener('mouseover', () => {
            foreverCloseBtn.style.display = 'block';
        });
        previewButtonErrorAlert.addEventListener('mouseout', () => {
            foreverCloseBtn.style.display = 'none';
        });
        foreverCloseBtn.addEventListener('click', () => {
            previewButtonErrorAlert.style.display = 'none';
            setData({[StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]: getNowVersion()});
        });
        foreverCloseBtn.addEventListener('mouseover', () => {
            foreverCloseBtn.style.background='rgba(0,0,0,0.3)';
        });
        foreverCloseBtn.addEventListener('mouseout', () => {
            foreverCloseBtn.style.background='rgba(0,0,0,0.2)';
        });
    }
    return previewButtonErrorAlert;
}

const getTagByString = (tagString: string): HTMLElement => {
    return new DOMParser().parseFromString(tagString, 'text/html').body.firstElementChild! as HTMLElement;
}

export const replaceTag = (origin: Element, newTag: Element) => {
    origin.insertAdjacentElement("afterend", newTag);
    origin.remove();
}

export const appendTagBefore = (origin: Element, newTag: Element) => {
    origin.insertAdjacentElement("beforebegin", newTag);
}