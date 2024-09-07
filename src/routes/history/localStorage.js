import { HISTORY_KEY } from "$lib/constants";
/**
 * retrieves the the training history from local Storage
 * @returns {Map<number,import("$lib/myTypes").Training> | null} 
 */
export function getHistory() {
    let history = null;
    const historyJSON = localStorage.getItem(HISTORY_KEY)
    if (historyJSON != null) {
        history = new Map(JSON.parse(historyJSON))
    }
    return history
}
