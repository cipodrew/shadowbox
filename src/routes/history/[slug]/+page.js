//get slug from URL (id calcolato dalla data temporale di una delle sessioni) e ritornanlo per renderlo disponibile alla pagina

export function load({ params }) {

    return {
        slug: params.slug
    }
    //in alternativa si può usare page store direttamente nella pagina 
}