# Chatbot builder (nl)


## Docker quickstart (command line, mac en linux)

Deze instructie start de tool in uitprobeer (mock) modus. Voor volledige installatie zie de instructie in de volgende sectie.

Installeer [docker](https://docs.docker.com/engine/installation/).

Open een terminal en maak een nieuwe directory aan, bijvoorbeeld:
```sh
$ mkdir chatbot-builder-nl
$ cd chatbot-builder-nl
```

Download de [docker-compose.yml](https://raw.githubusercontent.com/KBNLresearch/chatbot-builder-nl/master/docker-compose.yml) file naar deze directory, of gebruik wget vanaf de command line.

```sh
$ wget https://raw.githubusercontent.com/KBNLresearch/chatbot-builder-nl/master/docker-compose.yml
```

Maak in dezelfde directory een file aan genaamd ```.env``` met de volgende inhoud:
```sh
FROG=http://nlp:5001/
PORT=5000
MODE=mock
SERVER_URL=http://localhost:5000
```

Start met [docker-compose](https://docs.docker.com/compose/install/).
```sh
$ docker-compose up 
```

Navigeer naar [http://localhost:5000](http://localhost:5000)

## Hoe werkt de tool

- import / export
- emulator
- dialoog aanmaken
- beschrijving antwoordtypes
- variabelen en vrije invoer
- welkomstboodschap
- startknop dialoog



## Facebook integratie en deployment

- developer account
- app aanmaken
- messenger webhook registreren (ssl!)
- pagina aanmaken
- messenger knop toevoegen aan pagina
- .env file configureren / uitproberen op heroku
- De tool testen met commando's in ```./etc```


## Starten zonder docker

- environment variabelen


## Interne webhook API

- wat voor parameters
- wat voor antwoorden
