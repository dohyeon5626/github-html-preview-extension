import { addPreviewButton, checkPreviewButton } from "../../global/etc/tag";
import { getLastNonActivatedAlertVersion, getToken } from '../../global/chrome/storage';
import { getNowVersion } from "../../global/chrome/manifest";

addPreviewButton(getToken);
getLastNonActivatedAlertVersion((lastNonActivatedAlertVersion) => {
    if(lastNonActivatedAlertVersion != getNowVersion()) checkPreviewButton();
}, () => {
    checkPreviewButton();
});