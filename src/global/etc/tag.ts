export let addPreviewButton = () => {
    if (document.getElementById("html-preview") === null) {
        let btnGroup = (document.getElementsByClassName("BtnGroup"))[3];
        let url = chrome.runtime.getURL("page/preview.html") + `?url=${encodeURI(location.href)}`;
        btnGroup.innerHTML += `
        <a href="${url}" id="html-preview" data-view-component="true" class="btn-sm btn BtnGroup-item" target="_blank">
        Preview
        </a>
        `;
    }
}

export let deletePreviewButton = () => {
    if (document.getElementById("html-preview") != null) {
        document.getElementById("html-preview")!.outerHTML = "";
    }
}

export let replacePage = (html: string) => {
    document.getElementsByTagName("html")[0].innerHTML = html;
}