//get slug from URL (id calcolato dalla data temporale di una delle sessioni) e ritornanlo per renderlo disponibile alla pagina

export function load() {
    let params = new URLSearchParams(document.location.search);
    let slug = params.get("id")
    return {
        slug
    }
    //Attenzione!!!! prob basta usare page store   
}