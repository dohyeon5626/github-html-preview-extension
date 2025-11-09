import { getTokenButton, getTokenInput } from "../core/tag-service";
import { executeScript, getData, queryInTab, setData } from "../shared/chrome";
import { StorageType } from "../shared/type";

(async () => {
    const token = (await getData([StorageType.INPUT_TOKEN]))[StorageType.INPUT_TOKEN];
    const input = getTokenInput()!;
    if (token != undefined && token != "") input.value = token;
    else input.value = "";
})();

getTokenButton()!.onclick = async () => {
    await setData({[StorageType.INPUT_TOKEN]: getTokenInput()!.value});
    queryInTab((tabs) => {
        tabs.filter(tab => tab.url?.startsWith("https://github-html-preview.dohyeon5626.com/")).forEach(tab => {
            executeScript(tab.id!, () => {
                window.close();
            });
        });
    });
    window.close();
};