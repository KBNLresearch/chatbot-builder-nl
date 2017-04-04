const rp = require("request-promise"),
    GVN_URL = "http://geheugenvannederland.nl/nl/api";

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

const surpise = ({payload, params, onSucces}) => {
    const page = parseInt(Math.random() * 900, 10);
    const [ collection ] = params;
    const query = collection
        ? `&facets[collectionStringNL][]=${encodeURIComponent(collection)}&maxperpage=50`
        : `&query=isShowPiece%20exact%20%221%22&&page=${page}&maxperpage=1`;
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
                    responseType: "url",
                    responseDelay: 200,
                    responseText: `Je ziet: ${title}`,
                    url: `http://geheugenvannederland.nl/nl/geheugen/view?identifier=${encodeURIComponent(result.recordIdentifier)}`
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

module.exports = { surpise }