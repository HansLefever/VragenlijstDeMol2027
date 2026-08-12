DE MOL 2027 – VRAGENLIJST WEBAPP – V1.1

BESTANDEN
- index.html: vragenlijst voor alle deelnemers
- admin.html: beveiligde beheerpagina voor de spelleider
- questions.js: deelnemers + 48 vragen
- firebase-config.js: Firebase-configuratie (reeds ingevuld)
- firestore.rules: gecombineerde regels voor QR-teller + vragenlijst

1. FIRESTORE RULES PUBLICEREN
Ga in Firebase Console naar Firestore Database > Rules.
Vervang de huidige regels door de inhoud van firestore.rules en klik Publish.
De bestaande qrGame/main-teller blijft behouden.

2. BEHEERACCOUNT AANMAKEN
De antwoorden zijn bewust NIET publiek leesbaar.
Ga in Firebase Console naar Authentication > Sign-in method en activeer Email/Password.
Ga daarna naar Authentication > Users > Add user en maak 1 account voor de spelleider.
Gebruik dat e-mailadres en wachtwoord op admin.html.

3. PUBLICEREN OP GITHUB PAGES
Upload alle bestanden samen naar dezelfde map/repository.
Open index.html voor de deelnemers.
Open admin.html voor de spelleider.

4. WERKING
- deelnemer kiest naam
- beantwoordt 48 vragen
- antwoorden worden opgeslagen in Firestore collection: responses
- elk document gebruikt de naam van de deelnemer als document-id
- admin.html leest de antwoorden pas na Firebase Authentication
- CSV-export gebruikt puntkomma's, handig voor Nederlandstalige Excel

BELANGRIJK
De firebaseConfig in een browserapp mag zichtbaar zijn; beveiliging gebeurt via Firestore Security Rules en Firebase Authentication.
