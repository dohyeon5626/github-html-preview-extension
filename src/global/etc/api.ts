import axios from "axios"

export let getContent = (githubUrl: string, success: (response: any) => void, fail: (error: any) => void) => {
    let url = githubUrl.replace("github.com", "raw.githubusercontent.com")
        .replace("/blob", "");
    axios.get(url)
        .then(success)
        .catch(fail)
}

export let getContentWithToken = (githubUrl: string, token: string, success: (response: any) => void, fail: (error: any) => void) => {
    let url = githubUrl.replace("github.com", "raw.githubusercontent.com")
        .replace("/blob", "");
    axios.get(url, {
        headers: {
            Authorization: `token ${token}`
        }
    }).then(success)
        .catch((error) => {
            getContent(githubUrl, success, fail);
        });
}