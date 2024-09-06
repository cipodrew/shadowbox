import { HISTORY_KEY } from "$lib/constants";
/**
 * 
 * @returns
 */
export function getHistory() {
    let history = null;
    const historyJSON = localStorage.getItem(HISTORY_KEY)
    if (historyJSON != null) {
        history = new Map(JSON.parse(historyJSON))
    }
    return history
}
