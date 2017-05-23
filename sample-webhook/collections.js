const collections = [
    "Boekillustratoren Jan en Casper Luyken",
    "Franse figurale pijpen",
    "Gravures en tekeningen uit de achttiende eeuw",
    "Atlassen",
    "Nederland en Engeland: de band tussen twee naties",
    "De Nederlandse Oostzeehandel in de periode 1600-1850",
    "Schilderijen uit het Frans Hals Museum",
    "Atlas Schoemaker",
    "Nederland - Japan",
    "Van zeehelden en avonturiers: reisverhalen uit de 16e en 17e eeuw",
    "Schilderijen van het Mauritshuis",
    "16e-eeuwse Noord- en Zuid-Nederlandse grafiek",
    "Kunstnijverheid",
    "Japanse eisen",
    "Collectie Natuurkundige Commissie voor Nederlands-Indië",
    "Muziekmanuscripten van Alphons Diepenbrock (1862-1921), componist",
    "Een romantische kijk. Hoogromantiek in 70 schilderijen",
    "Album amicorum A.L.G. Bosboom-Toussaint, 1882",
    "Verzonken schatten",
    "Digitale Atlas Geschiedenis",
    "Frederik Muller Historieplaten",
    "Archeologische vondsten uit Nederland",
    "Atlassen uit het Scheepvaartmuseum",
    "Koloniale Wereldtentoonstellingen.",
    "Kamptekeningen uit bezet Nederlands-Indië (1942-1945)",
];


const randomCollection = () =>
    collections[parseInt(Math.random() * (collections.length - 1), 10)];

const randomCollections = (amount = 5) => {
    let out = [];
    for (let i = 0; i < amount; i++) {
        while (out.length < i + 1) {
            const rnd = randomCollection();
            if (out.indexOf(rnd) < 0) {
                out.push(rnd);
            }
        }
    }

    return out;
};


module.exports = {
    randomCollection: randomCollection,
    randomCollections: randomCollections,
    collections: collections
};