import { StorageType } from "../type/storage-type";

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