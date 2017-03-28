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
        if (token === 'mock_token' && process.env.MODE === 'mock') {
            return onSuccess({
                name: 'Mock User',
                tokenOk: true
            });
        }

        if (typeof token === 'undefined') {
            return onFailure({tokenOk: false});
        }
        const cToken = tokenCache.find(c => c.token === token);
        if (cToken) {
            onSuccess({
                name: cToken.name,
                tokenOk: true
            });
        } else {
            rp.get({
                uri: `https://graph.facebook.com/me/?fields=name&access_token=${token}`,
                json: true
            }).then(data => {
                const {name, id} = data;
                console.log("LOGGED IN=", name);
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

    const filterMiddleware = (filterPaths = []) => (req, res, next) => {
        if (filterPaths.find(p => req.path.indexOf(p) === 0)) {
            const token = req.header("x-fb-token");

            checkToken(token, () => next(), (payload) => {
                res.status(401);
                res.set('Content-type', 'application/json');
                res.end(JSON.stringify(payload));
            });

        } else {
            next();
        }
    };

    return {
        checkToken: checkToken,
        filterMiddleware: filterMiddleware
    }
};


