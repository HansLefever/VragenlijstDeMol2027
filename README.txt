DE MOL 2027 – VRAGENLIJST V1.6

Inhoud:
- 30 behouden meerkeuzevragen (18 opgegeven vragen verwijderd)
- 10 open vragen, verspreid tussen de meerkeuzevragen
- dynamische vraag: 'Waarom denk je dat [naam] de Mol zal zijn?'
- Firestore-opslag en admin/CSV-export

BELANGRIJK BIJ PUBLICATIE:
1. Upload alle webbestanden naar GitHub Pages.
2. Publiceer firestore.rules in Firebase Firestore Rules.
5. Voor admin.html blijft Firebase Authentication (Email/Password) nodig.

De bestaande qrGame/main-regel is behouden.


V1.6: Alleen Firestore wordt gebruikt voor de antwoorden.


VERSIE 2.0
- Persoonsgegevens toegevoegd vóór de vragenlijst: voornaam, familienaam, geboortedatum, geboorteplaats, adres, postcode, gemeente, telefoonnummer en optioneel e-mailadres.
- Geen foto-upload: Firebase Storage blijft niet nodig.
- De 40 bestaande vragen blijven behouden.


VERSIE 2.1
- Persoonsgegevens beperkt tot voornaam en familienaam.
- Eén gedeelde 4-cijferige toegangscode voor alle deelnemers.
- Huidige toegangscode: 2027
- De code wordt niet opgeslagen in Firestore.
