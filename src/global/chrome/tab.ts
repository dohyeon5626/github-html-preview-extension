export let addTabUpdatedListener = (func: (url: string, tabId: number) => void) => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (tab.url) {
            func(tab.url!, tabId);
        }
    });
}

export let createTab = (url: string, tab: chrome.tabs.Tab) => {
    chrome.tabs.create({ index: tab.index + 1, openerTabId: tab.id, url: url });
}