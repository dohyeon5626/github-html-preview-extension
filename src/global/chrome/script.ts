export let executeScript = (tabId: number, func: () => void) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: func
    });
}