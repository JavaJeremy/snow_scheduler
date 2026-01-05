# Schneeschippen Planer ❄️

Ein einfacher, turnus-basierter Planer für das Schneeschippen, optimiert für mobile Geräte.

🌐 **Live Version**: [https://javajeremy.github.io/snow_scheduler/](https://javajeremy.github.io/snow_scheduler/)

## Features

- **Turnus-basiert**: Nicht datumsbasiert, sondern rotiert automatisch durch die Personen
- **Backup-System**: Personen können übersprungen werden bei Krankheit oder Urlaub
- **Selbst-Checkout**: Personen können sich selbst als erledigt markieren
- **Statistik**: Übersicht wer wie oft geschippt hat mit visueller Darstellung
- **Mobile-optimiert**: Responsive Design für Smartphones
- **Persistente Speicherung**: Daten werden im Browser (LocalStorage) gespeichert und bleiben erhalten
- **Kompakte UI**: Personen-Verwaltung ist standardmäßig eingeklappt

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

1. Personen hinzufügen über das "+" Symbol neben "Personen" (standardmäßig eingeklappt)
2. Die aktuelle Person wird oben hervorgehoben angezeigt
3. Nach dem Schippen auf "Ich habe geschippt ✓" klicken
4. Bei Krankheit/Urlaub auf "Nächste Person" klicken, um zu überspringen
5. Die Statistik zeigt an, wer wie oft geschippt hat
6. Die letzten Schippeinsätze werden in der Historie angezeigt

## Datenspeicherung

Die Daten werden im Browser (LocalStorage) gespeichert und bleiben auch nach dem Schließen des Browsers erhalten. **Wichtig**: Die Daten sind nur auf dem jeweiligen Gerät/Browser verfügbar. Für eine geräteübergreifende Synchronisation wäre ein Backend-Service erforderlich (nicht möglich mit reinem GitHub Pages).

## Technische Details

- Reine HTML/CSS/JavaScript (keine Dependencies)
- LocalStorage für Datenspeicherung
- Responsive Design mit Mobile-First Ansatz
- Touch-optimierte Buttons (min. 44px Höhe)

