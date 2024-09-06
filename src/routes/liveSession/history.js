import { HISTORY_KEY } from "$lib/constants";

/**
 * 
 * @param {import("$lib/myTypes").Reading[]} readings 
 * @param {import("$lib/myTypes").Reading} best 
 * @param {string} crono 
 */
export function saveSession(readings, best, crono,) {

    //TODO: modal popup to rate performance?

    let history = new Map();
    const historyJSON = localStorage.getItem(HISTORY_KEY)
    console.log(historyJSON)
    if (historyJSON != null) {
        history = new Map(JSON.parse(historyJSON))
    }
    else {
        history = new Map();
    }

    // const id = crypto.randomUUID()
    const id = history.size
    let session = {
        id: id,
        readings: readings,
        best: best,
        crono: crono,
        date: new Date(),
    }
    console.log("session: " + session)
    console.log("history pre-set: " + history)
    console.log(JSON.stringify([...history]))

    history.set(id, session)
    localStorage.setItem(HISTORY_KEY, JSON.stringify([...history]))
    console.log("history after-set: " + history)

}