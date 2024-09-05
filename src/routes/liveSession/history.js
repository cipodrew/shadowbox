import { HISTORY_KEY } from "$lib/constants";

export function saveSession(readings, best, crono,) {

    //TODO: modal popup to rate performance?

    let history = null;
    const historyJSON = localStorage.getItem(HISTORY_KEY)
    if (historyJSON != null) {
        history = JSON.parse(historyJSON)
    }
    else (
        history = []
    )
    let session = {
        readings: readings,
        best: best,
        crono: crono
    }
    history.push(session)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}