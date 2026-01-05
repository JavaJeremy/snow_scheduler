# Firebase Setup für Cross-Device Sync

Um die Daten geräteübergreifend zu synchronisieren, folgen Sie diesen Schritten:

## 1. Firebase Projekt erstellen

1. Gehen Sie zu [Firebase Console](https://console.firebase.google.com/)
2. Klicken Sie auf "Add project" oder wählen Sie ein bestehendes Projekt
3. Folgen Sie den Anweisungen zum Erstellen des Projekts

## 2. Firestore Database aktivieren

1. Im Firebase Console, gehen Sie zu "Firestore Database"
2. Klicken Sie auf "Create database"
3. Wählen Sie "Start in test mode" (für den Anfang)
4. Wählen Sie eine Region (z.B. `europe-west3` für Deutschland)
5. Klicken Sie auf "Enable"

## 3. Web App hinzufügen

1. Gehen Sie zu Project Settings (Zahnrad-Symbol)
2. Scrollen Sie zu "Your apps"
3. Klicken Sie auf das Web-Symbol (`</>`)
4. Geben Sie einen App-Namen ein (z.B. "Snow Scheduler")
5. Klicken Sie auf "Register app"
6. Kopieren Sie das `firebaseConfig` Objekt

## 4. Konfiguration einrichten

1. Öffnen Sie `firebase-config.js`
2. Fügen Sie die kopierte Konfiguration in `FIREBASE_CONFIG` ein
3. Ändern Sie `USE_FIREBASE = true`

## 5. Anonymous Authentication aktivieren

1. Öffnen Sie die [Firebase Console](https://console.firebase.google.com/)
2. Wählen Sie Ihr Projekt aus (snow-scheduler)
3. Im **linken Menü** klicken Sie auf "Build" → "Authentication"
4. Falls Authentication noch nicht aktiviert ist, klicken Sie auf **"Get started"**
5. Gehen Sie zum Tab **"Sign-in method"** (oben in der Authentication-Seite)
6. Scrollen Sie durch die Liste der Anbieter und finden Sie **"Anonymous"**
7. Klicken Sie auf **"Anonymous"**
8. Aktivieren Sie den Schalter (Toggle) oben rechts
9. Klicken Sie auf **"Save"**

**Alternative Navigation:**
- Falls Sie "Authentication" nicht direkt sehen: Klicken Sie auf **"Build"** im linken Menü, dann sollte "Authentication" darunter erscheinen
- Oder verwenden Sie die Suchleiste oben in der Firebase Console und suchen Sie nach "Authentication"

Die App meldet sich automatisch anonym an - keine Benutzerinteraktion nötig!

## 6. Firestore Security Rules

Gehen Sie zu Firestore Database → Rules und setzen Sie:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schedules/{document=**} {
      // Nur authentifizierte Benutzer (auch anonym) können lesen und schreiben
      allow read, write: if request.auth != null;
    }
  }
}
```

**Erklärung**: 
- `request.auth != null` bedeutet, dass nur authentifizierte Benutzer Zugriff haben
- Da die App Anonymous Authentication verwendet, ist jeder Benutzer automatisch authentifiziert
- Dies verhindert, dass Fremde ohne Authentifizierung auf Ihre Daten zugreifen können

## 7. Testen

1. Laden Sie die Seite neu
2. Der Sync-Status sollte "Mit Cloud verbunden" anzeigen
3. Daten sollten jetzt auf allen Geräten synchronisiert werden

## Kosten

Firebase Firestore hat einen kostenlosen Plan (Spark Plan) mit:
- 50.000 Lesevorgänge/Tag
- 20.000 Schreibvorgänge/Tag
- 20.000 Löschvorgänge/Tag
- 1 GB Speicher

Für einen kleinen Haushalt sollte das völlig ausreichen!

## Fehlerbehebung

- **"Cloud-Verbindung fehlgeschlagen"**: Überprüfen Sie die Firebase-Konfiguration
- **Daten werden nicht synchronisiert**: Überprüfen Sie die Firestore Security Rules
- **"Fehler beim Speichern"**: Überprüfen Sie die Browser-Konsole für Details

