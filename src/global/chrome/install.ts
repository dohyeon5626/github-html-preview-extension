export const addRuntimeInstalledListener = (func: () => void) => {
    chrome.runtime.onInstalled.addListener(func);
}
