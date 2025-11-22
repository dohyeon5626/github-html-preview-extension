import { getData, getNowVersion } from '../shared/chrome';
import { getProxyToken } from '../shared/api';
import { StorageType } from '../shared/type';
import { appendTagBefore, createHtmlPreviewButtonBox, createPreviewButtonErrorAlert, getHtmlPreview, getPreviewButtonErrorAlert } from '../core/tag-service';
import { getHtmlPreviewPageUrl } from '../core/auth-service';

const htmlPreview = getHtmlPreview();
if (!htmlPreview) {
    const btnGroup = document.querySelector(".prc-ButtonGroup-ButtonGroup-vcMeG:has(div > a)")
    if (btnGroup) {
        for (const aTag of btnGroup.querySelectorAll("div > a")) {
            if (aTag.getAttribute("data-testid") === "raw-button") {
                appendTagBefore(btnGroup.firstElementChild!, createHtmlPreviewButtonBox(aTag.getAttribute("class")!));
            }
        }

        const urlData = location.href.replace("https://github.com/", "").split("/");
        getHtmlPreview()!.onclick = async () => {
            window.open(await getHtmlPreviewPageUrl(location.href, urlData[0], urlData[1]));
        };
        getPreviewButtonErrorAlert()?.remove()
    }
}

const checkPreviewButton = () => {
    setTimeout(() => {
        const url = location.href;
        if (url.startsWith("https://github.com/") && url.endsWith(".html") && !getHtmlPreview() && !getPreviewButtonErrorAlert()) {
            document.body.appendChild(createPreviewButtonErrorAlert());
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