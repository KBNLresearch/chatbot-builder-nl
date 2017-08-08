# -*- coding: utf-8 -*-
from flask import Flask, request
from pattern.nl import parse, split, pprint

app = Flask(__name__)

@app.route('/')
def parseResponse():
    if request.args.get('text') is None:
        return ""

    ret = []
    parsed = parse(request.args.get('text'), lemmata=True)
    for sen in split(parsed):
        for word in sen.words:
            ret.append(u'\t'.join([word.string, word.lemma, word.type]))
    return u'\n'.join(ret)


if __name__ == '__main__':
    app.run()
