import { getProxyToken } from "./api";

export let addPreviewButton = (getToken: (success: (token: string) => void, fail: () => void) => void) => {
    if (document.getElementById("html-preview") === null) {
        let btnGroup = document.querySelector(".Box-sc-g0xbh4-0 .kcLCKF")!

        if (!btnGroup) return;

        for (let aTag of btnGroup.querySelectorAll("div > a")) {
            if (aTag.getAttribute("data-testid") === "raw-button") {
                btnGroup.innerHTML = `
                <button id="html-preview" data-size="small" data-variant="default"
                class="${aTag.getAttribute("class")}">
                Preview
                </button>
                ${btnGroup.innerHTML}
                `;
            }
        }

        let urlData = location.href.replace("https://github.com/", "").split("/");
        let user = urlData[0];
        let repo = urlData[1];

        document.getElementById("html-preview")!.onclick = () => {
            getToken(async (token) => {
                window.open(`https://github-html-preview.dohyeon5626.com/?${location.href}&${await getProxyToken(user, repo, token)}&${new Date().getTime()}`);
            }, () => {
                window.open(`https://github-html-preview.dohyeon5626.com/?${location.href}`);
            });
        };
    }
}

export let deletePreviewButton = () => {
    if (document.getElementById("html-preview") != null) {
        document.getElementById("html-preview")!.outerHTML = "";
    }
}