import uuid from "uuid";
import React from "react";

export default (responseText) => {
    const splittedText = responseText.split(/\$[0-9]+/);
    const vars = responseText.match(/(\$[0-9]+)/g);

    return splittedText
        .map((str, i) => i === splittedText.length - 1
            ? [(<span key={uuid()}>{str}</span>)]
            : [(<span key={uuid()}>{str}</span>), (<span key={uuid()} className="label label-success">{vars[i]}</span>)])
        .reduce((a, b) => a.concat(b), []);
};