import { getProxyToken } from "./api";

export let addPreviewButton = (getToken: (success: (token: string) => void, fail: () => void) => void) => {
    if (document.getElementById("html-preview") === null) {
        let btnGroup = document.querySelectorAll(".Box-sc-g0xbh4-0 .prc-ButtonGroup-ButtonGroup-vcMeG")![1]

        if (!btnGroup) return;
        console.log(btnGroup)

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