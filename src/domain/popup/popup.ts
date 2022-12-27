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
    let input = getInput();
    setToken(input.value, () => {
        window.close();
    });
};