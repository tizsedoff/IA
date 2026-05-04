// --- CEREBRO ULTRA-REACTIVO v3.0 ---

async buscarEnWeb(query) {
    try {
        // Intentamos primero con el resumen directo
        const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.extract) {
            return data.extract;
        } 
        
        // Si no hay resumen directo (como pasó con Hilux), buscamos en los títulos
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (searchData.query.search.length > 0) {
            // Traemos el fragmento del primer resultado encontrado
            return searchData.query.search[0].snippet.replace(/<\/?[^>]+(>|$)/g, "") + "...";
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

async obtenerRespuesta(pregunta) {
    const p = pregunta.toLowerCase().trim();
    
    // 1. REACCIONES INMEDIATAS (Saludos y Comandos cortos)
    if (p === "hola") return "¡Hola! Soy la IA de APS Shop. Preguntame lo que quieras.";
    if (p === "chau" || p === "adios") return "¡Chau! Gracias por pasar por APS Shop.";
    if (p === "ayuda") return "Podés preguntarme sobre iPhones, precios o cualquier tema general (ej: 'Misiones' o 'Hilux').";

    // 2. LÓGICA DE NEGOCIO (APS SHOP)
    if (p.includes("iphone") || p.includes("11") || p.includes("12") || p.includes("13") || p.includes("15")) {
        return "En APS Shop tenemos stock de varios modelos. El 15 es el más nuevo, pero el 13 es el que más sale. ¿Querés precios?";
    }
    if (p.includes("precio") || p.includes("costo")) {
        return "Los precios cambian por el stock. Escribinos al MD de Instagram para la cotización de hoy.";
    }

    // 3. PENSAMIENTO UNIVERSAL (Cualquier otra cosa)
    const infoGlobal = await this.buscarEnWeb(pregunta);
    if (infoGlobal) {
        return infoGlobal;
    }

    return "No tengo info exacta, pero seguro en Google la encontrás rápido.";
}