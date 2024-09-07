//get slug from URL (id calcolato dalla data temporale di una delle sessioni) e ritornanlo per renderlo disponibile alla pagina

import { browser } from '$app/environment';
import { getHistory } from '../localStorage.js';

export function load({ params }) {

    let hist = null;
    if (browser) {
        hist = getHistory()
    }
    return {
        hist,
    }
}