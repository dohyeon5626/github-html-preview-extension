export const addOnCommandListener = (func: (command: string) => void) => {
    chrome.commands.onCommand.addListener(func);
}