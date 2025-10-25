import { addPreviewButton, checkPreviewButton } from "../../global/etc/tag";
import { getData } from '../../global/chrome/storage';
import { getNowVersion } from "../../global/chrome/manifest";
import { StorageType } from "../../global/type/storage-type";

addPreviewButton();
(async () => {
    let lastNonActivatedAlertVersion = (await getData([StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]))[StorageType.LAST_NON_ACTIVATED_ALERT_VERSION]
    if (lastNonActivatedAlertVersion)
        if(lastNonActivatedAlertVersion != getNowVersion()) checkPreviewButton();
    else
        checkPreviewButton(); 
})();