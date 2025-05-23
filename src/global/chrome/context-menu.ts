export let createContextMenu = (title: string, documentUrlPattern: string) => {
    chrome.contextMenus.create({
        id: title,
        title: title,
        contexts: ["all"],
        documentUrlPatterns: [documentUrlPattern]
    });
}

export let addContextMenusOnClickedListener = (func: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => void) => {
    chrome.contextMenus.onClicked.addListener((info, tab) => func(info, tab!!))
}