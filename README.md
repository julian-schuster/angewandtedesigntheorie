# Angewandte Designtheorie

<img src="./doku/LoudAir.PNG" alt="Logo" height="150px">

Dies ist das Repository für das im Rahmen des Moduls "Angewandte Designtheorie" von Prof. Dr. Fischer entstandene Projekt "Loudair".
Bei dem Projekt handelt es sich um eine Audiovisuelle Darstellung von Luftverschmutzungsdaten.

## Setup
1. `Max` installieren (https://cycling74.com/downloads)
2. `Git` installieren (https://git-scm.com/downloads)
3. `Node.js` installieren (https://nodejs.org/en/)
4. `XAMPP` installieren (https://www.apachefriends.org/de/index.html)
5. `XAMPP Control Panel` öffnen und dort das Modul `Apache Webserver` starten um localhost verwenden zu können
6. Repository in den Ordner `htdocs` von XAMPP klonen
7. In den `frontend` Ordner navigieren
8. Node.js packages installieren:

```
npm install
```

9. Projekt builden:

```
npm run build:examples
```

10. In den Ordner `backend` navigieren
11. Node.js Server starten:

```
npm run dev
```

12. Max-Patch `soundshift.maxpat` aus dem Ordner `doku` öffnen.
13. Alle 7 Audiobuffer mit beliebigen Soundfiles oder den Soundfiles aus dem Ordner `doku` füllen.
14. Kommunikation mit Max und Node.js-Server starten, indem der zuständige Trigger aktiviert wird. 

### Zusätzliche Hinweise

Der Ordnerpfad in `htdocs` muss derselbe sein wie die Pfadangabe des url-Objekts im Max-Patch. 
Der ideale Pfad wäre: /htdocs/angewandtedesigntheorie/frontend/public/anchor/, da dies im localhost http://localhost/angewandtedesigntheorie/frontend/public/anchor/ entspricht.
Bei Rückfragen oder Problemen bezüglich der Aufsetzung des Projektes können sie uns unter folgenden E-mails kontaktieren:

## Team

| Name            | Email                                  |
| --------------- | -------------------------------------- |
| Gabriel Dickert | gabriel.dickert@informatik.hs-fulda.de |
| Julian Schuster | julian.schuster@informatik.hs-fulda.de |

Hochschule Fulda. Angewandte Designtheorie, Betreuer: Prof. Dr. Fischer, SoSe22.
