# Schneeschippen Planer ❄️

Ein einfacher, turnus-basierter Planer für das Schneeschippen, optimiert für mobile Geräte.

## Features

- **Turnus-basiert**: Nicht datumsbasiert, sondern rotiert automatisch durch die Personen
- **Backup-System**: Personen können übersprungen werden bei Krankheit oder Urlaub
- **Selbst-Checkout**: Personen können sich selbst als erledigt markieren
- **Mobile-optimiert**: Responsive Design für Smartphones
- **Offline-fähig**: Daten werden lokal im Browser gespeichert

## GitHub Pages Setup

1. Erstelle ein neues Repository auf GitHub
2. Lade alle Dateien hoch:
   - `index.html`
   - `style.css`
   - `script.js`
3. Gehe zu Repository Settings → Pages
4. Wähle die Branch aus (meist `main` oder `master`)
5. Die Seite ist dann unter `https://[username].github.io/[repository-name]` erreichbar

## Verwendung

1. Personen hinzufügen über das Eingabefeld
2. Die aktuelle Person wird oben angezeigt
3. Nach dem Schippen auf "Ich habe geschippt ✓" klicken
4. Bei Krankheit/Urlaub auf "Nächste Person" klicken, um zu überspringen
5. Die letzten Schippeinsätze werden in der Historie angezeigt

## Technische Details

- Reine HTML/CSS/JavaScript (keine Dependencies)
- LocalStorage für Datenspeicherung
- Responsive Design mit Mobile-First Ansatz
- Touch-optimierte Buttons (min. 44px Höhe)

