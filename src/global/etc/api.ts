import axios from "axios";

const baseAxios = () => axios.create({
    baseURL: 'https://licorice-api.dohyeon5626.com'
});

export interface TokenProxylResponse {
    token: string
}

export const getProxyToken = (user: string, repo: string, token: string) => {
    return new Promise<String>((resolve) => {
        baseAxios().post<TokenProxylResponse>(`/github-content-proxy/token`, {
            "user" : user,
            "repo" : repo,
            "token" : token
        })
        .then(it => it.data)
        .then(it => resolve(it.token))
    });
}