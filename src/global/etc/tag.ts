import { getBlobContent, getBlobContentWithToken, getContent, getContentWithToken } from './api';

export let addPreviewButton = () => {
    let isPublic = document.querySelector("meta[name=octolytics-dimension-repository_public]")!.getAttribute("content") == "true";

    if (isPublic && document.getElementById("html-preview") === null) {
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
            window.open(`${chrome.runtime.getURL("page/preview.html")}?url=${encodeURI(location.href)}`);
        };
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

let replaceScriptTag = (url: string, getScript: (cssUrl: string, callback: (response: any) => void) => void) => {
    let scriptTags = document.getElementsByTagName("script");
    for (let i=0; i<scriptTags.length; i++) {
        let tag = (<HTMLScriptElement>scriptTags[i]);
        if (tag.getAttribute('src') != null)  {
            let src = tag.getAttribute('src')!!;
            if (!isPublicUrl(src)) {
                let jsUrl = getFileUrl(url, src);
                getScript(jsUrl, (response) => {
                    tag.outerHTML = `<script>${response.data}</script>`;
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

export let setJs = (url: string) => {
    replaceScriptTag(url, (JsUrl, callback) => {
        getContent(JsUrl, (response) => {
            callback(response);
        }, (error) => {});
    });
}

export let setJsWithToken = (url: string, token: string) => {
    replaceScriptTag(url, (JsUrl, callback) => {
        getContentWithToken(JsUrl, token, (response) => {
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