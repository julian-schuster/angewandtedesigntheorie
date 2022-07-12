# Angewandte Designtheorie

<img src="doku/LoudAir.png" alt="Logo" height="150px">

Dies ist das Repository für das im Rahmen des Moduls "Angewandte Designtheorie" von Prof. Dr. Fischer entstandene Projekt "Loudair".
Bei dem Projekt handelt es sich um eine Audiovisuelle Darstellung von Luftverschmutzung.

## Setup
1. `Max` installieren (https://cycling74.com/downloads)
2. `Git` installieren (https://git-scm.com/downloads)
3. `Node.js` installieren (https://nodejs.org/en/)
4. `XAMPP` installieren (https://www.apachefriends.org/de/index.html)
5. Repository in den Ordner `htdocs` von XAMPP klonen
6. In den `frontend` Ordner navigieren
7. Node.js packages installieren:

```
npm install
```

8. Projekt builden:

```
npm run build:examples
```

9. In den Ordner `backend` navigieren
10. Node.js Server starten:

```
npm run dev
```

11. Max-Patch `soundshift.maxpat` aus dem Ordner `doku` öffnen.
12. Alle 7 Audiobuffer mit beliebigen Soundfiles oder den Soundfiles aus dem Ordner `doku` füllen.
13. Kommunikation mit Max und Node.js-Server starten, indem der zuständige Trigger aktiviert wird. 

### Zusätzliche Hinweise

Ordnerpfad in htdocs muss derselbe sein wie die Pfadangabe des url-Objekts im Max-Patch. 
Idealer Pfad wäre: /htdocs/angewandtedesigntheorie/frontend/public/anchor/

## Team

| Name            | Email                                  |
| --------------- | -------------------------------------- |
| Gabriel Dickert | gabriel.dickert@informatik.hs-fulda.de |
| Julian Schuster | julian.schuster@informatik.hs-fulda.de |

Hochschule Fulda. Angewandte Designtheorie, Betreuer: Prof. Dr. Fischer, SoSe22.
