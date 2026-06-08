const messages = {
    en: {
        welcome: "Welcome",
        invalid: "Invalid option",
        goodbye: "Goodbye",
        menu: "1. Add lead\n2. Exit\n4. Help",
        enterName: "Enter lead name:",
        enterPhone: "Enter lead phone:",
        confirmTemplate: (name, phone) => `Confirm:\nName: ${name}\nPhone: ${phone}\n1. Save\n2. Cancel`,
        saved: "Lead saved. Asante.",
        cancelled: "cancelled.",
    },
    sw: {
        welcome: "Karibu",
        invalid: "Chaguo batili",
        goodbye: "Kwaheri",
        menu: "1. Ongeza lead\n2. Ondoka\n4. Msaada",
        enterName: "Andika jina la lead:",
        enterPhone: "Andika nambari ya simu",
        comfirmTemplate: (name, phone) => `Thibitisha:\nJina: ${name}\nSimu: ${phone}\n1. Hifadhi\n2. Futa`,
        saved: "Lead imehifadhiwa. Asante.",
        cancelled: "Imefutwa.",
    },
    es: {
    welcome: "Bienvenido",
    invalid: "Opción inválida",
    goodbye: "Adiós",
    menu: "1. Agregar contacto\n2. Salir\n4. Ayuda",
    enterName: "Ingrese el nombre:",
    enterPhone: "Ingrese el teléfono:",
    confirmTemplate: (name, phone) => `Confirmar:\nNombre: ${name}\nTeléfono: ${phone}\n1. Guardar\n2. Cancelar`,
    saved: "Contacto guardado. Gracias.",
    cancelled: "Cancelado.",
},

};

function t(lang, key, ...args) {
    const bundle = messages[lang] || messages.en;
    const value = bundle[key];
    return typeof value === "function" ? value(...args) : value;
}

module.exports = { t };