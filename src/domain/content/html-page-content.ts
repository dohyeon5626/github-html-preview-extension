import { setData, getData } from '../../global/chrome/storage';
import { getNowVersion } from "../../global/chrome/manifest";
import { StorageType } from "../../global/type/storage-type";
import { getProxyToken } from '../../global/etc/api';

if (document.getElementById("html-preview") === null) {
    const btnGroup = document.querySelector(".prc-ButtonGroup-ButtonGroup-vcMeG:has(div > a)")
        if (btnGroup) {

        for (const aTag of btnGroup.querySelectorAll("div > a")) {
            if (aTag.getAttribute("data-testid") === "raw-button") {
                btnGroup.innerHTML = `<div>
                <button id="html-preview" data-size="small" data-variant="default" class="${aTag.getAttribute("class")}">
                    Preview
                </button></div>
                ${btnGroup.innerHTML}
                `;
            }
        }

        const urlData = location.href.replace("https://github.com/", "").split("/");
        document.getElementById("html-preview")!.onclick = async () => {
            const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
            if (token != undefined && token != "") {
                window.open(`https://github-html-preview.dohyeon5626.com/?${location.href}&${await getProxyToken(urlData[0], urlData[1], token)}&${new Date().getTime()}`);
            } else {
                window.open(`https://github-html-preview.dohyeon5626.com/?${location.href}`);
            }
        };
        document.querySelector("#preview-button-error-alert")?.remove()
    }
}

const checkPreviewButton = () => {
    setTimeout(() => {
        const url = location.href;
        if (url.startsWith("https://github.com/") && url.endsWith(".html") && !document.getElementById("html-preview") && !document.getElementById("preview-button-error-alert")) {
            const boxWrapper = document.createElement("div");
            boxWrapper.innerHTML =
            `
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
            `;
            document.body.appendChild(boxWrapper.firstElementChild as HTMLElement);
            
            const box = document.querySelector("#preview-button-error-alert") as HTMLElement | null;
            if (box) {
                const icon = box.querySelector('img') as HTMLImageElement | null;
                if (icon) icon.src = chrome.runtime.getURL('icon/128.png');

                const closeBtn = box.querySelector('#close-button') as HTMLElement | null;
                if (closeBtn) {
                    box.addEventListener('mouseenter', () => {
                        closeBtn.style.display = 'block';
                    });
                    box.addEventListener('mouseleave', () => {
                        closeBtn.style.display = 'none';
                    });
                    closeBtn.addEventListener('click', () => {
                        box.style.display = 'none';
                    });
                    closeBtn.addEventListener('mouseover', () => {
                        closeBtn.style.background='rgba(0,0,0,0.3)';
                    });
                    closeBtn.addEventListener('mouseout', () => {
                        closeBtn.style.background='rgba(0,0,0,0.2)';
                    });
                }

                const foreverCloseBtn = box.querySelector('#forever-close-button') as HTMLElement | null;
                if (foreverCloseBtn) {
                    box.addEventListener('mouseover', () => {
                        foreverCloseBtn.style.display = 'block';
                    });
                    box.addEventListener('mouseout', () => {
                        foreverCloseBtn.style.display = 'none';
                    });
                    foreverCloseBtn.addEventListener('click', () => {
                        box.style.display = 'none';
                        setData({[StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]: getNowVersion()});
                    });
                    foreverCloseBtn.addEventListener('mouseover', () => {
                        foreverCloseBtn.style.background='rgba(0,0,0,0.3)';
                    });
                    foreverCloseBtn.addEventListener('mouseout', () => {
                        foreverCloseBtn.style.background='rgba(0,0,0,0.2)';
                    });
                }
            
            }
        }
    }, 1000);
}

(async () => {
    const lastNonActivatedAlertVersion = (await getData([StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]))[StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]
    if (lastNonActivatedAlertVersion)
        if(lastNonActivatedAlertVersion != getNowVersion()) checkPreviewButton();
    else
        checkPreviewButton(); 
})();