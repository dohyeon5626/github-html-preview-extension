import { getBlobContent, getBlobContentWithToken, getContent, getContentWithToken } from './api';

export let addPreviewButton = () => {
    if (document.getElementById("html-preview") === null) {
        let btnGroup = document.querySelector(".d-flex.py-1.py-md-0.flex-auto.flex-order-1.flex-md-order-2.flex-sm-grow-0.flex-justify-between.hide-sm.hide-md > .BtnGroup")!;
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

let getFileUrl = (githubUrl: string, path: string) => {
    let urlInfo = githubUrl.split("/");
    if (path.startsWith("/")) {
        urlInfo[7] = path;
    } else {
        urlInfo[urlInfo.length-1] = path;
    }
    return urlInfo.join("/");
}

let isPublicUrl = (path: string) => {
    return path.startsWith("http://") || path.startsWith("https://");
}

let replaceStyleTag = (url: string, getStyle: (cssUrl: string, callback: (response: any) => void) => void) => {
    let linkTags = document.getElementsByTagName("link");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLLinkElement>linkTags[i]);
        if (tag.rel === "stylesheet") {
            let href = tag.getAttribute("href")!;
            if (!isPublicUrl(href)) {
                let cssUrl = getFileUrl(url, href);
                getStyle(cssUrl, (response) => {
                    tag.outerHTML = `<style>${response.data}</style>`;
                });
            }
        }
    }
}

let replaceImageTag = (url: string, getBlobContent: (imgUrl: string, callback: (response: any) => void) => void) => {
    let linkTags = document.getElementsByTagName("img");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLImageElement>linkTags[i]);
        let src = tag.getAttribute("src")!;
        if (!isPublicUrl(src)) {
            let imgUrl = getFileUrl(url, src);
            getBlobContent(imgUrl, (response) => {
                let objectUrl = URL.createObjectURL(response.data);
                tag.src = objectUrl;
            });
        }
    }
}

let replaceFaviconTag = (url: string, getBlobContent: (imgUrl: string, callback: (response: any) => void) => void) => {
    let linkTags = document.getElementsByTagName("link");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLLinkElement>linkTags[i]);
        if (tag.rel === "icon") {
            let href = tag.getAttribute("href")!;
            if (!isPublicUrl(href)) {
                let imgUrl = getFileUrl(url, href);
                getBlobContent(imgUrl, (response) => {
                    let objectUrl = URL.createObjectURL(response.data);
                    tag.href = objectUrl;
                });
            }
        }
    }
}

export let setCss = (url: string) => {
    replaceStyleTag(url, (cssUrl, callback) => {
        getContent(cssUrl, (response) => {
            callback(response);
        }, (error) => {});
    });
}

export let setCssWithToken = (url: string, token: string) => {
    replaceStyleTag(url, (cssUrl, callback) => {
        getContentWithToken(cssUrl, token, (response) => {
            callback(response);
        }, (error) => {});
    });
}

export let setImg = (url: string) => {
    replaceImageTag(url, (imgUrl, callback) => {
        getBlobContent(imgUrl, (response) => {
            callback(response);
        }, (error) => {});
    });
}

export let setImgWithToken = (url: string, token: string) => {
    replaceImageTag(url, (imgUrl, callback) => {
        getBlobContentWithToken(imgUrl, token, (response) => {
            callback(response);
        }, (error) => {});
    });
}

export let setFavicon = (url: string) => {
    replaceFaviconTag(url, (imgUrl, callback) => {
        getBlobContent(imgUrl, (response) => {
            callback(response);
        }, (error) => {});
    });
}

export let setFaviconWithToken = (url: string, token: string) => {
    replaceFaviconTag(url, (imgUrl, callback) => {
        getBlobContentWithToken(imgUrl, token, (response) => {
            callback(response);
        }, (error) => {});
    });
}