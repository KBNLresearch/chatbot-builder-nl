const rp = require("request-promise");

const ONE_HOUR = 1000 * 60 * 60;

module.exports = (config) => {

    let tokenCache = [];

    const cacheToken = (token, name) => {
        tokenCache = tokenCache.filter(c => c.token !== token).concat({
            token: token,
            name: name
        });

        setTimeout(() => {
            tokenCache = tokenCache.filter(c => c.token !== token);
        }, ONE_HOUR);
    };

    const checkToken = (token, onSuccess, onFailure) => {
        const cToken = tokenCache.find(c => c.token === token);
        if (cToken) {
            console.log("token found in cache for ", cToken.name);
            onSuccess({
                name: cToken.name,
                tokenOk: true
            });
        } else {
            console.log("token not found in cache");
            rp.get({
                uri: `https://graph.facebook.com/me/?fields=name&access_token=${token}`,
                json: true
            }).then(data => {
                const {name, id} = data;
                console.log("USERNAME=", name);
                console.log("USER_ID=", id);
                rp.get({
                    uri: `https://graph.facebook.com/${config.pageId}/roles?access_token=${config.pageAccessToken}`,
                    json: true
                }).then(pageData => {
                    const {data: pageRoles} = pageData;
                    const maintainers = pageRoles
                        .filter(role => role.perms.indexOf("ADMINISTER") > -1 || role.perms.indexOf("CREATE_CONTENT") > -1);


                    if (maintainers.find(m => m.id === id)) {
                        cacheToken(token, name);
                        onSuccess({
                            name: name,
                            tokenOk: true
                        });
                    } else {
                        onFailure({tokenOk: false});
                    }


                }).catch(err => onFailure({tokenOk: false}));

            }).catch(err => onFailure({tokenOk: false}));
        }
    };

    return {
        checkToken: checkToken,
    }
};


