class RedNeuronalAPS {
    constructor() {
        // Conocimiento específico de tu negocio
        this.datosPropios = {
            "iphone": "En APS Shop tenemos los mejores iPhones de Misiones. ¿Buscás el 11, 12, 13 o 15?",
            "precio": "Los precios de los equipos dependen del stock y el dólar. Consultanos al MD para cotizar.",
            "envio": "Hacemos envíos a todo Misiones. Si estás en Oberá, coordinamos en el acto.",
            "hola": "¡Hola! Soy la IA de APS. Preguntame lo que quieras, de iPhones o de cultura general.",
            "chau": "¡Nos vemos! Gracias por contactar a APS Shop.",
            "gracias": "¡De nada! Es un gusto ayudarte."
        };
    }

    // FUNCIÓN DE PENSAMIENTO GLOBAL (Busca en la web)
    async buscarConocimientoExterno(tema) {
        try {
            // Consultamos la base de datos de Wikipedia para responder "cualquier cosa"
            const respuesta = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tema)}`);
            const data = await respuesta.json();
            return data.extract || null;
        } catch (e) {
            return null;
        }
    }

    async procesarPregunta(mensaje) {
        const m = mensaje.toLowerCase().trim();
        
        // 1. Check de comandos directos o palabras de APS
        for (let clave in this.datosPropios) {
            if (m.includes(clave)) return this.datosPropios[clave];
        }

        // 2. Si no es algo de la tienda, la IA "PIENSA" y busca afuera
        const infoExtra = await this.buscarConocimientoExterno(m);
        if (infoExtra) {
            return infoExtra;
        }

        // 3. Respuesta por defecto si está muy confundida
        return "No tengo info exacta sobre eso, pero si es un objeto o tema famoso, probá escribiendo solo el nombre (ej: 'Toyota Hilux').";
    }
}

const inteligenciaAPS = new RedNeuronalAPS();

async function ejecutarIA() {
    const input = document.getElementById('inputPregunta');
    const container = document.getElementById('chat-container');
    const texto = input.value.trim();

    if (texto === "") return;

    // Crear globo del usuario
    const divUser = document.createElement('div');
    divUser.className = 'mensaje-usuario';
    divUser.innerText = texto;
    container.appendChild(divUser);

    input.value = "";

    // Globo de "Pensando..."
    const divPensando = document.createElement('div');
    divPensando.className = 'mensaje-ia';
    divPensando.id = 'temp-pensando';
    divPensando.innerText = "> IA está analizando la consulta...";
    container.appendChild(divPensando);
    container.scrollTop = container.scrollHeight;

    // LLAMADA AL CEREBRO
    const respuesta = await inteligenciaAPS.procesarPregunta(texto);

    // Quitar "Pensando" y poner respuesta final
    document.getElementById('temp-pensando').remove();
    const divIA = document.createElement('div');
    divIA.className = 'mensaje-ia';
    divIA.innerText = "> " + respuesta;
    container.appendChild(divIA);
    
    container.scrollTop = container.scrollHeight;
}