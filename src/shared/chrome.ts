import { MessageType, StorageType } from "./type";

export const addOnCommandListener = (func: (command: string) => void) => {
    chrome.commands.onCommand.addListener(func);
}

export const createContextMenu = (title: string, documentUrlPattern: string) => {
    chrome.contextMenus.create({
        id: title,
        title: title,
        contexts: ["all"],
        documentUrlPatterns: [documentUrlPattern]
    });
}

export const addContextMenusOnClickedListener = (func: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => void) => {
    chrome.contextMenus.onClicked.addListener((info, tab) => func(info, tab!))
}

export const getRedirectUrl = (path: string) => {
    return chrome.identity.getRedirectURL(path);
}

export const launchWebAuthFlow = async (url: string, interactive: boolean, func: (responseUrl?: string) => void) => {
    const responseUrl = await new Promise<string | undefined>((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
        { url, interactive },
        (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(response);
        }
        );
    });

    func(responseUrl);
}

export const addRuntimeInstalledListener = (func: () => void) => {
    chrome.runtime.onInstalled.addListener(func);
}

export const getNowVersion = () => chrome.runtime.getManifest().version;

export const addMessageListener = (func: (request: any, callback: (response: any) => void) => void) => {
    chrome.runtime.onMessage.addListener((request, sender, callback) => func(request, callback));
}

export const sendMessage = (action: MessageType) => {
    return new Promise<any>(resolve => {
        chrome.runtime.sendMessage({action}, resolve);
    });
}

export const executeScript = (tabId: number, func: () => void) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: func
    });
}

export const executeScriptFile = (tabId: number, file: string) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [file]
    });
}

export const getData = (keys: StorageType[]) => {
    return new Promise<{ [key: string]: any }>((resolve) => {
        chrome.storage.sync.get(keys, resolve);
    });
}

export const setData = (items: Partial<{ [key in StorageType]: any }>) => {
    return new Promise<void>((resolve) => {
        chrome.storage.sync.set(items, resolve);
    });
}

export const removeData = (keys: StorageType[]) => {
    return new Promise<void>((resolve) => {
        chrome.storage.sync.remove(keys, resolve);
    });
}

export const addTabUpdatedListener = (func: (url: string, tabId: number) => void) => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (tab.url) {
            func(tab.url!, tabId);
        }
    });
}

export const createTab = (url: string, tab: chrome.tabs.Tab) => {
    chrome.tabs.create({ index: tab.index + 1, openerTabId: tab.id, url: url });
}

export const getActiveTab = () => {
    return new Promise<chrome.tabs.Tab>((resolve) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            resolve(tabs[0])
        });
    });
}

export const queryInTab = (func: (tabs: chrome.tabs.Tab[]) => void) => {
    chrome.tabs.query({}, func);
}

export const removeTab = (tabId: number) => {
    chrome.tabs.remove(tabId);
}

export const updateTab = (tabId: number, url: string) => {
    chrome.tabs.update(tabId, { url: url });
}