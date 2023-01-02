import { getBlobContent, getBlobContentWithToken, getContent, getContentWithToken } from './api';

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

let replaceStyleTag = (tag: HTMLLinkElement, css: string) => {
    tag.outerHTML = `<style>${css}</style>`;
}

export let setCss = (url: string) => {
    let urlInfo = url.split("/");
    let linkTags = document.getElementsByTagName("link");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLLinkElement>linkTags[i]);
        if (tag.rel === "stylesheet") {
            let href = tag.getAttribute("href")!;
            if (!href.startsWith("http://") && !href.startsWith("https://")) {
                if (href.startsWith("/")) {
                    urlInfo[7] = href;
                } else {
                    urlInfo[urlInfo.length-1] = href;
                }

                let cssUrl = urlInfo.join("/");
                getContent(cssUrl, (response) => {
                    replaceStyleTag(tag, response.data);
                }, (error) => {});
            }
        }
    }
}

export let setCssWithToken = (url: string, token: string) => {
    let urlInfo = url.split("/");
    let linkTags = document.getElementsByTagName("link");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLLinkElement>linkTags[i]);
        if (tag.rel === "stylesheet") {
            let href = tag.getAttribute("href")!;
            if (!href.startsWith("http://") && !href.startsWith("https://")) {
                if (href.startsWith("/")) {
                    urlInfo[7] = href;
                } else {
                    urlInfo[urlInfo.length-1] = href;
                }

                let cssUrl = urlInfo.join("/");
                getContentWithToken(cssUrl, token, (response) => {
                    replaceStyleTag(tag, response.data);
                }, (error) => {});
            }
        }
    }
}

export let setImg = (url: string) => {
    let urlInfo = url.split("/");
    let linkTags = document.getElementsByTagName("img");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLImageElement>linkTags[i]);
        let src = tag.getAttribute("src")!;
        if (!src.startsWith("http://") && !src.startsWith("https://")) {
            if (src.startsWith("/")) {
                urlInfo[7] = src;
            } else {
                urlInfo[urlInfo.length-1] = src;
            }
            
            let imgUrl = urlInfo.join("/");
            getBlobContent(imgUrl, (response) => {
                let objectUrl = URL.createObjectURL(response.data);
                tag.src = objectUrl;
            }, (error) => {});
        }
    }
}

export let setImgWithToken = (url: string, token: string) => {
    let urlInfo = url.split("/");
    let linkTags = document.getElementsByTagName("img");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLImageElement>linkTags[i]);
        let src = tag.getAttribute("src")!;
        if (!src.startsWith("http://") && !src.startsWith("https://")) {
            if (src.startsWith("/")) {
                urlInfo[7] = src;
            } else {
                urlInfo[urlInfo.length-1] = src;
            }
            
            let imgUrl = urlInfo.join("/");
            getBlobContentWithToken(imgUrl, token, (response) => {
                let objectUrl = URL.createObjectURL(response.data);
                tag.src = objectUrl;
            }, (error) => {});
        }
    }
}

export let setFavicon = (url: string) => {
    let urlInfo = url.split("/");
    let linkTags = document.getElementsByTagName("link");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLLinkElement>linkTags[i]);
        if (tag.rel === "icon") {
            let href = tag.getAttribute("href")!;
            if (!href.startsWith("http://") && !href.startsWith("https://")) {
                if (href.startsWith("/")) {
                    urlInfo[7] = href;
                } else {
                    urlInfo[urlInfo.length-1] = href;
                }

                let imgUrl = urlInfo.join("/");
                getBlobContent(imgUrl, (response) => {
                    let objectUrl = URL.createObjectURL(response.data);
                    tag.href = objectUrl;
                }, (error) => {});
            }
        }
    }
}

export let setFaviconWithToken = (url: string, token: string) => {
    let urlInfo = url.split("/");
    let linkTags = document.getElementsByTagName("link");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLLinkElement>linkTags[i]);
        if (tag.rel === "icon") {
            let href = tag.getAttribute("href")!;
            if (!href.startsWith("http://") && !href.startsWith("https://")) {
                if (href.startsWith("/")) {
                    urlInfo[7] = href;
                } else {
                    urlInfo[urlInfo.length-1] = href;
                }

                let imgUrl = urlInfo.join("/");
                getBlobContentWithToken(imgUrl, token, (response) => {
                    let objectUrl = URL.createObjectURL(response.data);
                    tag.href = objectUrl;
                }, (error) => {});
            }
        }
    }
}