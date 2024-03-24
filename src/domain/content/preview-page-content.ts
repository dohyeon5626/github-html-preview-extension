import { setToken } from "../../global/chrome/storage";

let token = location.href.split("&")[1];
if (token) {
    setToken(token, () => {});
}