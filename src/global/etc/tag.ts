import { getProxyToken } from "./api";

export let addPreviewButton = (getToken: (success: (token: string) => void, fail: () => void) => void) => {
    if (document.getElementById("html-preview") === null) {
        let btnGroup = document.querySelector(".Box-sc-g0xbh4-0 .prc-ButtonGroup-ButtonGroup-vcMeG:has(div > a)")!!
        if (!btnGroup) return;

        for (let aTag of btnGroup.querySelectorAll("div > a")) {
            if (aTag.getAttribute("data-testid") === "raw-button") {
                btnGroup.innerHTML = `<div>
                <button id="html-preview" data-size="small" data-variant="default"
                class="${aTag.getAttribute("class")}">
                Preview
                </button></div>
                ${btnGroup.innerHTML}
                `;
            }
        }

        let urlData = location.href.replace("https://github.com/", "").split("/");
        document.getElementById("html-preview")!.onclick = () => {
            getToken(async (token) => {
                window.open(`https://github-html-preview.dohyeon5626.com/?${location.href}&${await getProxyToken(urlData[0], urlData[1], token)}&${new Date().getTime()}`);
            }, () => {
                window.open(`https://github-html-preview.dohyeon5626.com/?${location.href}`);
            });
        };
    }
}

export let deletePreviewButton = () => {
    if (document.getElementById("html-preview") != null) {
        document.getElementById("html-preview")?.parentElement?.remove()
    }
}