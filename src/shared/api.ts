import axios from "axios";

const baseAxios = axios.create({
    baseURL: 'https://api.dohyeon5626.com'
});

export interface TokenProxyResponse {
    token: string
}

export interface OauthTokenResponse {
    token: string
}

export const getProxyToken = async (user: string, repo: string, tokenList: string[]): Promise<string> => {
    const { data } = await baseAxios.post<TokenProxyResponse>(`/github-html-preview/token`, {
        "user" : user,
        "repo" : repo,
        "tokenList" : tokenList
    });
    return data.token;
}

export const getGithubOauthToken = async (code: string, redirectUrl: string): Promise<string> => {
    const { data } = await baseAxios.post<OauthTokenResponse>(`/github-html-preview/github-oauth/token`, null, { params: {
        "code": code,
        "redirectUri": redirectUrl
    }});
    return data.token;
}
