import axios from "axios";

const baseAxios = () => axios.create({
    baseURL: 'https://api.dohyeon5626.com'
});

export interface TokenProxylResponse {
    token: string
}

export interface OauthTokenResponse {
    token: string
}

export const getProxyToken = (user: string, repo: string, tokenList: string[]) => {
    return new Promise<string>((resolve) => {
        baseAxios().post<TokenProxylResponse>(`/github-html-preview/token`, {
            "user" : user,
            "repo" : repo,
            "tokenList" : tokenList
        })
        .then(it => it.data)
        .then(it => resolve(it.token))
    });
}

export const getGithubOauthToken = (code: string, redirectUrl: string) => {
    return new Promise<string>((resolve) => {
        baseAxios().post<OauthTokenResponse>(`/github-html-preview/github-oauth/token`, null, { params: {
            "code": code,
            "redirectUri": redirectUrl
        }})
        .then(it => it.data)
        .then(it => resolve(it.token))
    });
}