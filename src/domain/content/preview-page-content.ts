import { getToken, setToken } from "../../global/chrome/storage";
import { getProxyToken } from "../../global/etc/api";

let tokenInputBoxSetting = () => {
    if(document.getElementById("raw-token-button")) {
        let originButton = document.getElementById("raw-token-button")!!;
        let newButton = new DOMParser().parseFromString(`<button id="token-button">Enter</button>`, 'text/html');
        originButton.insertAdjacentElement("afterend", newButton.body.firstElementChild as HTMLElement);
        originButton.remove();
    }
    if (document.getElementById("token-input")) {
        let input = ((document.getElementById("token-input")!!) as HTMLInputElement);
        getToken((token) => {
            input.value = token;
        }, () => {});
        document.getElementById("token-button")!!.onclick = () => {
            let url = location.search.split("&")[0].replace("?", "");
            let urlData = url.replace("https://github.com/", "").split("/");
            let user = urlData[0];
            let repo = urlData[1];
            let token = input.value;
    
            setToken(token, async () => {
                if (token == "") location.href = location.href.split("&")[0];
                else location.href = `https://github-html-preview.dohyeon5626.com/?${url}&${await getProxyToken(user, repo, token)}&${new Date().getTime()}`;
            })
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

