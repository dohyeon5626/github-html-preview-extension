import { getData, setData } from "../shared/chrome";
import { getProxyToken } from "../shared/api";
import { StorageType } from "../shared/type";

const tokenInputBoxSetting = async () => {
    if(document.getElementById("raw-token-button")) {
        const originButton = document.getElementById("raw-token-button")!!;
        const newButton = new DOMParser().parseFromString(`<button id="token-button">Enter</button>`, 'text/html');
        originButton.insertAdjacentElement("afterend", newButton.body.firstElementChild as HTMLElement);
        originButton.remove();
    }
    if (document.getElementById("token-input")) {
        const input = ((document.getElementById("token-input")!!) as HTMLInputElement);
        const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
        if (token != undefined && token != "") {
            input.value = token;
        }
        
        document.getElementById("token-button")!!.onclick = async () => {
            const url = location.search.split("&")[0].replace("?", "");
            const urlData = url.replace("https://github.com/", "").split("/");
            const user = urlData[0];
            const repo = urlData[1];
            const token = input.value;
    
            await setData({[StorageType.INPUT_TOKEN]: token});
            if (token == "") location.href = location.href.split("&")[0];
            else location.href = `https://github-html-preview.dohyeon5626.com/?${url}&${await getProxyToken(user, repo, token)}&${new Date().getTime()}`;
        };
    }
}

tokenInputBoxSetting();

(async () => {
    new MutationObserver((mutations) => {
        tokenInputBoxSetting();
    }).observe(document, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
    });
})();

