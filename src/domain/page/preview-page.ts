import { getContent, getContentWithToken } from "../../global/etc/api";
import { replacePage } from "../../global/etc/tag";
import { getToken, setToken } from '../../global/chrome/storage';

let getInput = (): HTMLInputElement => {
    return (<HTMLInputElement>document.getElementById("token-input"))!;
}

let url = new URLSearchParams(location.search).get("url")!;
getToken((token) => {
    getContentWithToken(url, token, (response) => {
        replacePage(response.data);
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
})

document.getElementById("token-button")!.onclick = () => {
    let input = getInput();
    setToken(input.value, () => {
        location.reload();
    });
};