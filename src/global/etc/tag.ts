export let addPreviewButton = (getToken: (success: (token: string) => void, fail: () => void) => void) => {
    if (document.getElementById("html-preview") === null) {
        let btnGroup = document.querySelector(".Box-sc-g0xbh4-0 .kSGBPx")!;
        for (let aTag of btnGroup.querySelectorAll("div > a")) {
            if (aTag.getAttribute("data-testid") === "raw-button") {
                btnGroup.innerHTML += `
                <button id="html-preview" data-size="small"
                class="${aTag.getAttribute("class")}">
                Preview
                </button>
                `;
            }
        }

        document.getElementById("html-preview")!.onclick = () => {
            getToken((token) => {
                window.open(`https://dohyeon5626.github.io/github-html-preview-page/?${location.href}&${token}`);
            }, () => {
                window.open(`https://dohyeon5626.github.io/github-html-preview-page/?${location.href}`);
            });
        };
    }
}

export let deletePreviewButton = () => {
    if (document.getElementById("html-preview") != null) {
        document.getElementById("html-preview")!.outerHTML = "";
    }
}