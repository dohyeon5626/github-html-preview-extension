import axios from "axios";

const baseAxios = () => axios.create({
    baseURL: 'https://licorice-api.dohyeon5626.com'
});

export interface TokenProxylResponse {
    token: string
}

export const getProxyToken = (user: string, repo: string, token: string) => {
    return new Promise<string>((resolve) => {
        baseAxios().post<TokenProxylResponse>(`/github-html-preview/token`, {
            "user" : user,
            "repo" : repo,
            "token" : token
        })
        .then(it => it.data)
        .then(it => resolve(it.token))
    });
}

export const getGithubOauthToken = (code: string, redirectUrl: string) => {
    return new Promise<GithubOauthTokenResponse>((resolve) => {
        baseAxios().post<GithubOauthTokenResponse>(`/github-html-preview/github-oauth/token`, null, { params: {
            "code": code,
            "redirect_uri": redirectUrl
        }})
        .then(it => resolve(it.data))
    });
}

export interface GithubOauthTokenResponse {
    access: GithubOauthTokenDetailResponse,
    refresh: GithubOauthTokenDetailResponse
}

export interface GithubOauthTokenDetailResponse {
    token: string,
    expiresIn: number
}