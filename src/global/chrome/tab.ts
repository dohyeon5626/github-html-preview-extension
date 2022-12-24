export let addTabUpdatedListener = (func: (url: string, tabId: number) => void) => {
    chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: any, tab: any) => {
        if (changeInfo.url) {
            func(changeInfo.url, tabId);
        }
    });
}