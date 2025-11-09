import { getData, setData } from "../shared/chrome";
import { getProxyToken } from "../shared/api";
import { StorageType } from "../shared/type";
import { createTokenButton, getRawTokenButton, getTokenButton, getTokenInput, replaceTag } from "../core/tag-service";

const tokenInputBoxSetting = async () => {
    const originButton = getRawTokenButton();
    if(originButton) replaceTag(originButton, createTokenButton());

    const input = getTokenInput();
    if (input) {
        const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
        if (token && token != "") input.value = token;
        
        getTokenButton()!.onclick = async () => {
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

