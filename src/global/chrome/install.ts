export let addRuntimeInstalledListener = (func: () => void) => {
    chrome.runtime.onInstalled.addListener(func);
}
