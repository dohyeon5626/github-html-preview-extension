import { getToken, setToken } from '../../global/chrome/storage';
import { getContent, getContentWithToken } from '../../global/etc/api';
import { replacePage, replaceStyleTag } from '../../global/etc/tag';

let getInput = (): HTMLInputElement => {
    return (<HTMLInputElement>document.getElementById("token-input"))!;
}

let url = new URLSearchParams(location.search).get("url")!;
getToken((token) => {
    getContentWithToken(url, token, (response) => {
        replacePage(response.data);
        setCss();
    }, (error) => {
        getInput().value = token;
        document.getElementById("error")!.style.visibility = "visible";
    });
}, () => {
    getContent(url, (response) => {
        replacePage(response.data);
        setCss();
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

let setCss = () => {
    let urlInfo = url.split("/");
    let linkTags = document.getElementsByTagName("link");
    for (let i=0; i<linkTags.length; i++) {
        let tag = (<HTMLLinkElement>linkTags[i]);
        if (tag.rel === "stylesheet") {
            let href = tag.getAttribute("href")!;
            if (href.startsWith("/")) {
                urlInfo[7] = href;
            } else {
                urlInfo[urlInfo.length-1] = href;
            }

            let cssUrl = urlInfo.join("/");
            getToken((token) => {
                getContentWithToken(cssUrl, token, (response) => {
                    replaceStyleTag(tag, response.data);
                    tag.outerHTML = "";
                }, (error) => {});
            }, () => {
                getContent(cssUrl, (response) => {
                    replaceStyleTag(tag, response.data);
                }, (error) => {});
            });
        }
    }
}