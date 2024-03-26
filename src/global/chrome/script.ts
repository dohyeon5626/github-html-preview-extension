export let executeScript = (tabId: number, func: () => void) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: func
    });
}

export let executeScriptFile = (tabId: number, file: string) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [file]
    });
}