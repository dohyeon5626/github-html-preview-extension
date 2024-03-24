import { executeScript } from "../../global/chrome/script";
import { getToken, setToken } from "../../global/chrome/storage";

let getInput = (): HTMLInputElement => {
    return (<HTMLInputElement>document.getElementById("token-input"))!;
}

getToken((token) => {
    getInput().value = token;
}, () => {
    getInput().value = "";
});

document.getElementById("token-button")!.onclick = () => {
    setToken(getInput().value, () => {
        chrome.tabs.query({}, (tabs) => {
            tabs.filter(tab => tab.url?.startsWith("https://dohyeon5626.github.io/github-html-preview-page/")).forEach(tab => {
                executeScript(tab.id!!, () => {
                    window.close();
                });
            });
        });
        window.close();
    });
};