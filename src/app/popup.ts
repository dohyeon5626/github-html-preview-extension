import { executeScript, getData, queryInTab, setData } from "../shared/chrome";
import { StorageType } from "../shared/type";

const getInput = (): HTMLInputElement => {
    return (<HTMLInputElement>document.getElementById("token-input"))!;
}

(async () => {
    const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
    if (token != undefined && token != "") {
        getInput().value = token;
    } else {
        getInput().value = "";
    }
})();

document.getElementById("token-button")!.onclick = async () => {
    await setData({[StorageType.INPUT_TOKEN]: getInput().value});
    queryInTab((tabs) => {
        tabs.filter(tab => tab.url?.startsWith("https://github-html-preview.dohyeon5626.com/")).forEach(tab => {
            executeScript(tab.id!!, () => {
                window.close();
            });
        });
    });
    window.close();
};