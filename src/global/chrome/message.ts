export const addMessageListener = (func: (request: any, callback: (response: any) => void) => void) => {
    chrome.runtime.onMessage.addListener((request, sender, callback) => func(request, callback));
}

export const sendMessage = (request: any) => {
    return new Promise<any>(resolve => {
        chrome.runtime.sendMessage(request, value => resolve(value));
    });
}