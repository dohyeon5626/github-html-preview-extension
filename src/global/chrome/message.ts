import { MessageType } from "../type/message-type";

export const addMessageListener = (func: (request: any, callback: (response: any) => void) => void) => {
    chrome.runtime.onMessage.addListener((request, sender, callback) => func(request, callback));
}

export const sendMessage = (action: MessageType) => {
    return new Promise<any>(resolve => {
        chrome.runtime.sendMessage({action}, resolve);
    });
}