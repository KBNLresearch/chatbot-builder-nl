const rp = require("request-promise"),
    GVN_URL = "http://www.geheugenvannederland.nl/nl/api",
    randomCollection = require("./collections").randomCollection,
    randomCollections = require("./collections").randomCollections;

const imageByDidl = (result, callback) => {

    rp.get({
        uri: `${GVN_URL}/resource?coll=ngvn&identifier=${encodeURIComponent(result.recordIdentifier)}&type=didl`,
        json: true
    }).then((data) => {
        if (data.resourceList && data.resourceList.images &&
            data.resourceList.images.length > 0 && data.resourceList.images[0].image.length > 0 &&
            data.resourceList.images[0].image[data.resourceList.images[0].image.length - 1].src
        ) {
            callback(data.resourceList.images[0].image[data.resourceList.images[0].image.length - 1].src)
        } else {
            callback();
        }
    }).catch(() => callback());
};

const stripPayload = (payload) => {
    const [dialogId, parentId] = payload.split("|");

    return `${dialogId}|${parentId}`;
};


const search = ({payload, params, query, res, onSucces}) => {
    const uri =`${GVN_URL}/results?coll=ngvn&query=${encodeURIComponent(`"${query}"`)}&maxperpage=10&${randomCollections().map((c) =>
        `facets[collectionStringNL][]=${encodeURIComponent(c)}`).join("&")}`;
    console.log(uri);
    rp.get({
        uri: uri,
        json: true
    }).then(data => {
        if (data.records.length === 0) {
            onSucces([{
                responseType: "typing",
                responseDelay: 0,
                typeDelay: 1000,
            }, {
                responseType: "text",
                responseDelay: 500,
                responseText: `Ik heb helaas geen afbeeldingen gevonden voor '${query}'`
            }]);
        } else {
            let images = [];
            const amount = data.records.length > 2 ? 3 : data.records.length;
            for (let i = 0; i < amount; i++) {
                const resultIdx = parseInt(Math.random() * (data.records.length - 1), 10);
                const result = data.records[resultIdx];
                const title = typeof result.title === 'string' ? result.title : result.title[0];

                imageByDidl(result, (imgSrc) => {
                    images.push({
                        title: title,
                        image_url: `http://imageviewer.kb.nl/ImagingService/imagingService?id=${encodeURIComponent(imgSrc)}&useresolver=false&w=500&x=0&y=0&h=260&zoom=1`,
                        url: `http://www.geheugenvannederland.nl/nl/geheugen/view?identifier=${encodeURIComponent(result.recordIdentifier)}`
                    });
                    if (images.length === amount) {
                        onSucces([{
                            responseType: "typing",
                            responseDelay: 0,
                            typeDelay: 2000,
                        }, {
                            responseType: "imageCarousel",
                            responseDelay: 0,
                            images: images
                        }])
                    }
                })
            }


        }
    }).catch(data => {
        onSucces([{
            responseType: "typing",
            responseDelay: 0,
            typeDelay: 1000,
        }, {
            responseType: "text",
            responseDelay: 1000,
            responseText: `Ik heb helaas geen afbeeldingen gevonden voor '${query}'`
        }]);
    });
};

const surpise = ({payload, params, onSucces}) => {
    const page = parseInt(Math.random() * 900, 10);
    const [ collection ] = params;
    const query = `&facets[collectionStringNL][]=${encodeURIComponent(collection || randomCollection())}&maxperpage=100`;
    const uri = `${GVN_URL}/results?coll=ngvn&${query}`;
    console.log(uri);
    rp.get({
        uri: uri,
        json: true
    }).then(data => {
        const resultIdx = data.records.length === 1 ? 0 : parseInt(Math.random() * (data.records.length - 1), 10);
        const result = data.records[resultIdx];
        const title = typeof result.title === 'string' ? result.title : result.title[0];
        const collectionStringNL = typeof result.collectionStringNL === 'string'
                ?  result.collectionStringNL : result.collectionStringNL[0];
        imageByDidl(result, (imgSrc) => {
            onSucces([
                {
                    responseType: "image",
                    responseDelay: 0,
                    url: imgSrc
                }, {
                    responseType: "typing",
                    responseDelay: 0,
                    typeDelay: 2000,
                }, {
                    responseType: "url",
                    responseDelay: 2100,
                    responseText: `Je ziet: ${title}`,
                    url: `http://www.geheugenvannederland.nl/nl/geheugen/view?identifier=${encodeURIComponent(result.recordIdentifier)}`
                }, {
                    responseType: "buttons",
                    responseDelay: 1000,
                    responseText: `Wil je nog een plaatje zien uit de collectie '${collectionStringNL}' of van iets anders?`,
                    buttons: [{
                        text: `Uit deze collectie`,
                        payload: stripPayload(payload) + `|${collectionStringNL}`
                    }, {
                        text: "Iets anders",
                        payload: stripPayload(payload)
                    }]
                }
            ])
        });
    }).catch(data => {console.log(data); onSucces([])})
};

module.exports = { surpise, search }