//get slug from URL (id calcolato dalla data temporale di una delle sessioni) e ritornanlo per renderlo disponibile alla pagina

import { browser } from '$app/environment';
import { getHistory } from '../localStorage.js';

export function load({ params }) {

    let hist = null;
    let trainingSession;
    if (browser) {
        hist = getHistory()
    }
    if (hist != null) {
        trainingSession = hist.get(parseInt(params.slug));
    }
    return {
        slug: params.slug,
        trainingSession,
    }
    //in alternativa si può usare page store direttamente nella pagina 
}