import { executeScript } from "../../global/chrome/script";
import { getData, setData } from "../../global/chrome/storage";
import { queryInTab } from "../../global/chrome/tab";
import { StorageType } from "../../global/type/storage-type";

let getInput = (): HTMLInputElement => {
    return (<HTMLInputElement>document.getElementById("token-input"))!;
}

(async () => {
    let token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
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