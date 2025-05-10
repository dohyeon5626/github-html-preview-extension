export let addOnCommandListener = (func: (command: string) => void) => {
    chrome.commands.onCommand.addListener(func);
}