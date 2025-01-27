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
            tabs.filter(tab => tab.url?.startsWith("https://github-html-preview.dohyeon5626.com/")).forEach(tab => {
                executeScript(tab.id!!, () => {
                    window.close();
                });
            });
        });
        window.close();
    });
};