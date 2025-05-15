export let getToken = (success: (token: string) => void, fail: ()=> void) => {
    chrome.storage.sync.get(['token'], (result) => {
        if (result.token != undefined && result.token != "") {
            success(result.token);
        } else {
            fail();
        }
    });
}

export let setToken = (token: string, callback: () => void) => {
    chrome.storage.sync.set({token: token}, () => callback());
}

export let getLastNonActivatedAlertVersion = (success: (lastNonActivatedAlertVersion: string) => void, fail: ()=> void) => {
    chrome.storage.sync.get(['lastNonActivatedAlertVersion'], (result) => {
        if (result.lastNonActivatedAlertVersion != undefined && result.lastNonActivatedAlertVersion != "") {
            success(result.lastNonActivatedAlertVersion);
        } else {
            fail();
        }
    });
}

export let setLastNonActivatedAlertVersion = (lastNonActivatedAlertVersion: string) => {
    chrome.storage.sync.set({lastNonActivatedAlertVersion: lastNonActivatedAlertVersion});
}