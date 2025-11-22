export enum MessageType {
    START_OAUTH, START_AUTO_OAUTH, REMOVE_OTHER_PAGE
}

export enum StorageType {
    INPUT_TOKEN = "inputToken",
    LAST_NON_ACTIVATED_ALERT_VERSION = "lastNonActivatedAlertVersion",
    GITHUB_ACCESS_TOKEN = "githubAccessToken",
    GITHUB_ACCESS_TOKEN_EXPIRES_IN = "githubAccessTokenExpiresIn",
    GITHUB_REFRESH_TOKEN = "githubRefreshToken",
    GITHUB_REFRESH_TOKEN_EXPIRES_IN = "githubRefreshTokenExpiresIn"
}