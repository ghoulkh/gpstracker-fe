import {toast} from "react-toastify";

let notice = {
    success: (message) => toast.success(message),
    err: (message) => toast.error(message),
    inf: (message) => toast.info(message),
    warn: (message) => toast.warning(message),
}
export default notice;