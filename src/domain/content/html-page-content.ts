import { addPreviewButton, checkPreviewButton } from "../../global/etc/tag";
import { getToken } from '../../global/chrome/storage';

addPreviewButton(getToken);
checkPreviewButton();