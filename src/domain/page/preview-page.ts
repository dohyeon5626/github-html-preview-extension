import { getToken, setToken } from '../../global/chrome/storage';
import { getContent, getContentWithToken } from '../../global/etc/api';
import { replacePage, setCss, setCssWithToken, setFavicon, setFaviconWithToken, setImg, setImgWithToken } from '../../global/etc/tag';

let getInput = (): HTMLInputElement => {
    return (<HTMLInputElement>document.getElementById("token-input"))!;
}

let url = new URLSearchParams(location.search).get("url")!;
getToken((token) => {
    getContentWithToken(url, token, (response) => {
        replacePage(response.data);
        setCssWithToken(url, token);
        setImgWithToken(url, token);
        setFaviconWithToken(url, token);
    }, (error) => {
        getInput().value = token;
        document.getElementById("error")!.style.visibility = "visible";
    });
}, () => {
    getContent(url, (response) => {
        replacePage(response.data);
        setCss(url);
        setImg(url);
        setFavicon(url);
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