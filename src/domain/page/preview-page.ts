import { getToken, setToken } from '../../global/chrome/storage';
import { getBlobContentWithToken, getContent, getContentWithToken } from '../../global/etc/api';
import { replacePage, replaceStyleTag } from '../../global/etc/tag';

let getInput = (): HTMLInputElement => {
    return (<HTMLInputElement>document.getElementById("token-input"))!;
}

let url = new URLSearchParams(location.search).get("url")!;
getToken((token) => {
    getContentWithToken(url, token, (response) => {
        replacePage(response.data);
        setCss(token);
        setImg(token);
    }, (error) => {
        getInput().value = token;
        document.getElementById("error")!.style.visibility = "visible";
    });
}, () => {
    getContent(url, (response) => {
        replacePage(response.data);
    }, (error) => {
        getInput().value = "";
        document.getElementById("error")!.style.visibility = "visible";
    });
});

document.getElementById("token-button")!.onclick = () => {
    let input = getInput();
    setToken(input.value, () => {
        location.reload();
    });
};

let setCss = (token: string) => {
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
                    tag.outerHTML = "";
                }, (error) => {});
            }
        }
    }
}

let setImg = (token: string) => {
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