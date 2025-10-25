export const getRedirectUrl = (path: string) => {
    return chrome.identity.getRedirectURL(path);
}

export const launchWebAuthFlow = (url: string, func: (responseUrl?: string) => void) => {
    chrome.identity.launchWebAuthFlow({
        url: url,
        interactive: true
    }, (responseUrl) => {
        if (chrome.runtime.lastError) return;
        func(responseUrl)
    });
}