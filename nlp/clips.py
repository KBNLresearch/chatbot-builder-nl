from flask import Flask, request
from pattern.nl import parse, split, pprint

app = Flask(__name__)

@app.route('/')
def parseResponse():
    if request.args.get('text') is None:
        return ""

    ret = ""
    parsed = parse(request.args.get('text'), lemmata=True)
    for sen in split(parsed):
        for word in sen.words:
            ret += word.string + "\t" + word.lemma + "\t" + word.type + "\t" + str(word.chunk) + "\n"
    return ret


if __name__ == '__main__':
    app.run(debug=True)
