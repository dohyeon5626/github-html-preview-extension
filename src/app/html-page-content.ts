import { getData, getNowVersion } from '../shared/chrome';
import { StorageType } from '../shared/type';
import { appendTagBefore, createHtmlPreviewButtonBox, createPreviewButtonErrorAlert, getHtmlPreview, getPreviewButtonErrorAlert } from '../core/tag-service';
import { getHtmlPreviewPageUrl, parseGithubUrl } from '../core/auth-service';

const OBSERVING_FLAG = "__htmlPreviewButtonObserving";

const isPreviewablePage = (): boolean => {
    const url = location.href;
    return url.startsWith("https://github.com/") && url.endsWith(".html");
}

const insertHtmlPreviewButton = () => {
    if (getHtmlPreview() || !isPreviewablePage()) return;
    try {
        const btnGroup = document.querySelector('a[data-testid="raw-button"]')?.parentElement?.parentElement;
        if (btnGroup) {
            for (const aTag of btnGroup.querySelectorAll("div > a")) {
                if (aTag.getAttribute("data-testid") === "raw-button") {
                    appendTagBefore(btnGroup.firstElementChild!, createHtmlPreviewButtonBox(aTag.parentElement?.getAttribute("class")!, aTag.getAttribute("class")!));
                }
            }

            const { user, repo } = parseGithubUrl(location.href);
            getHtmlPreview()!.onclick = async () => {
                window.open(await getHtmlPreviewPageUrl(location.href, user, repo));
            };
            getPreviewButtonErrorAlert()?.remove()
        }
    } catch(ignore) {}
}

insertHtmlPreviewButton();

if (!(window as any)[OBSERVING_FLAG]) {
    (window as any)[OBSERVING_FLAG] = true;
    new MutationObserver(insertHtmlPreviewButton).observe(document, {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true
    });
}

if (location.href.split("/")[5] == "edit") {
    getPreviewButtonErrorAlert()?.remove()
}

const checkPreviewButton = () => {
    setTimeout(() => {
        const url = location.href;
        if (url.startsWith("https://github.com/") && url.endsWith(".html") && url.split("/")[5] == "blob" && !getHtmlPreview() && !getPreviewButtonErrorAlert()) {
            document.body.appendChild(createPreviewButtonErrorAlert());
        }
    }, 1000);
}

(async () => {
    const lastNonActivatedAlertVersion = (await getData([StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]))[StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]
    if (lastNonActivatedAlertVersion) {
        if(lastNonActivatedAlertVersion != getNowVersion()) checkPreviewButton();
    } else {
        checkPreviewButton(); 
    }
})();