class RedNeuronalAPS {
    constructor() {
        this.pesos = { 
            "iphone": 0.8, "11": 0.5, "12": 0.5, "13": 0.5, 
            "15": 0.5, "precio": 0.9, "costo": 0.9, "envio": 0.7 
        };
    }

    // Función para buscar en la web (usando Wikipedia como ejemplo de base de datos)
    async buscarEnWeb(query) {
        try {
            const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.extract) {
                return data.extract;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    async obtenerRespuesta(pregunta) {
        const p = pregunta.toLowerCase().trim();
        const palabras = p.split(" ");
        
        // 1. Lógica interna de APS Shop (Prioridad)
        let puntaje = 0;
        palabras.forEach(palabra => {
            if (this.pesos[palabra]) puntaje += this.pesos[palabra];
        });

        if (puntaje > 0.4) {
            if (p.includes("15")) return "El iPhone 15 tiene USB-C y es lo más nuevo en APS Shop.";
            if (p.includes("precio")) return "Los precios de iPhones varían diariamente. Consultanos al MD.";
            return "Veo que preguntás por iPhones. ¿Querés ver el catálogo de APS?";
        }

        // 2. BUSCADOR INTELIGENTE (Si no es de APS, busca en la web)
        const infoWeb = await this.buscarEnWeb(pregunta);
        if (infoWeb) {
            return `Según mis registros web: ${infoWeb}`;
        }

        return "No encontré info específica en APS ni en la web rápida. ¿Podés ser más específico?";
    }
}

const inteligenciaAPS = new RedNeuronalAPS();

async function ejecutarIA() {
    const input = document.getElementById('inputPregunta');
    const container = document.getElementById('chat-container');
    const texto = input.value.trim();

    if (texto === "") return;

    // Mensaje Usuario
    const divUser = document.createElement('div');
    divUser.className = 'mensaje-usuario';
    divUser.innerText = texto;
    container.appendChild(divUser);

    input.value = ""; 

    // Pensando...
    const divPensando = document.createElement('div');
    divPensando.className = 'mensaje-ia';
    divPensando.id = 'pensando';
    divPensando.innerText = "> Consultando base de datos mundial...";
    container.appendChild(divPensando);
    container.scrollTop = container.scrollHeight;

    // Usamos await porque la búsqueda tarda un poquito
    const respuesta = await inteligenciaAPS.obtenerRespuesta(texto);

    const pensando = document.getElementById('pensando');
    if (pensando) pensando.remove();

    const divIA = document.createElement('div');
    divIA.className = 'mensaje-ia';
    divIA.innerText = "> " + respuesta; 
    container.appendChild(divIA);
    
    container.scrollTop = container.scrollHeight;
}