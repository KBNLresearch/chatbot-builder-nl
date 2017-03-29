# Chatbot builder (nl)

## Docker quickstart

Deze instructie start de tool in uitprobeer (mock) modus. Voor volledige installatie zie de instructie in de volgende sectie

Maak een file aan genaamd ```.env``` met de volgende inhoud:
```sh
FROG=http://nlp:5001/
PORT=5000
MODE=mock
SERVER_URL=http://localhost:5000
```

Start met [docker-compose](https://docs.docker.com/compose/install/)
```sh
$ docker-compose up 
```

Navigeer naar [http://localhost:5000](http://localhost:5000)

## Hoe werkt de tool

- dialoog aanmaken
- beschrijving antwoordtypes
- variabelen en vrije invoer
- welkomstboodschap
- startknop dialoog
- import / export

## De tool testen met commando's in ```./etc```


## Facebook integratie en deployment

- developer account
- app aanmaken
- messenger webhook registreren (ssl!)
- pagina aanmaken
- messenger knop toevoegen aan pagina
- .env file configureren / uitproberen op heroku

## Starten zonder docker

- environment variabelen


## Interne webhook API

- wat voor parameters
- wat voor antwoorden