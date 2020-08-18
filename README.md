<!--
# Commands in VSC:
    To multiline comment: Ctrl + K + C
    To multiline uncomment: Ctrl + K + U
    To block comment:  Shift + Alt + A
-->

# PSD2Demo

- The two goals of this app is to show customers/companies one possible use case of Open Payment's API and to give insight into how the API's payment procedure looks like. This will be done by displaying status messages, interactive elements and a loading icon in the frontend.

## Get started

1. Navigate into the backend folder:

   - **cd backend**

2. Run the command:

   - **npm install && npm run client-install**

3. Start the frontend (client) and backend (server) concurrently:

   - **npm run dev**

## Frontend - User Interface
### Landing page
<img width="1100" src="readmeImages/readmePreview.png"/>

### Landing page - Dark Mode
<img width="1100" src="readmeImages/readmePreviewDarkMode.png "/>

### Cart page
<img width="1100" src="readmeImages/readmePreview2.png"/>

### Payment flow
<img width="350" src="readmeImages/readmePreview7.png"/> <img width="350" src="readmeImages/readmePreview8.png"/>

### API page
<img width="1100" src="readmeImages/readmePreview5.png"/>

### AIS page
<img width="1100" src="readmeImages/readmePreview6.png"/>


## Preview of responsiveness

![](readmeImages/demoAppResponsive.gif)

## Process flow diagram (.puml file)

![](readmeImages/processFlow.png)

## General remarks:

A complete route between client and server is:

- For instance: http://localhost:5000/connect/token. However, the part 'http://localhost:5000' is left out and handled by the package.json (proxy) from the frontend folder:
- "proxy": "http://localhost:5000"

## Content related to PSD2:

##### DN - Publicerad 2020-05-05 - Nytt EU-direktiv kan göra kreditprövningen säkrare redan nu.

`Med ett medgivande från kunden kan kreditgivaren hämta hem transaktionsdata från kundens bankkonto och se vad kunden har för inkomst, tillgångar, andra lån/skulder samt utgiftsmönster. Kreditgivaren kan också få information om ifall slutkunden ägnar sig åt alltför mycket spelande i relation till sin inkomst. Andra riskdrivare kan också identifieras och senare översättas till ett ekonomiskt betyg som kreditgivaren kan använda som ett underlag till akten för kreditbeslutet.` <br> https://www.dn.se/debatt/nytt-eu-direktiv-kan-gora-kreditprovningen-sakrare-redan-nu/

##### Tutorial link to Open Payments API - How to get started.

https://www.youtube.com/watch?v=v2QK4ZvXELM
