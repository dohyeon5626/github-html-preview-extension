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