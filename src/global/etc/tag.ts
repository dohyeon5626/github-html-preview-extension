export let addPreviewButton = () => {
    if (document.getElementById("html-preview") === null) {
        let btnGroup = (document.getElementsByClassName("BtnGroup"))[3];
        let url = chrome.runtime.getURL("page/preview.html");
        btnGroup.innerHTML += `
        <a href="${url}" id="html-preview" data-view-component="true" class="btn-sm btn BtnGroup-item" target="_blank">
        Html Preview
        </a>
        `;
    }
}