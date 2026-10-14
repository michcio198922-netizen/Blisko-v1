# Blisko — Android

Spokojna, prywatna aplikacja do pogłębiania relacji z Bogiem bez punktów, kar i streaków.

## Funkcje
- codzienny fragment Pisma jako odnośnik + autorska refleksja,
- poranna modlitwa własnymi słowami,
- jeden konkretny krok na dzień,
- intencje modlitewne,
- 3 rzeczy wdzięczności,
- wieczorna refleksja,
- historia wpisów,
- tryb ciszy 5 / 10 / 15 min,
- własne pytania do Boga / wiary / życia,
- dane zapisywane lokalnie na telefonie.

Aplikacja nie cytuje konkretnego współczesnego przekładu Biblii. Pokazuje odnośnik i zachęca do przeczytania fragmentu w wybranym przez użytkownika przekładzie.

## Budowanie APK na GitHubie
Jeśli folder `.github` nie wgra się przez przeglądarkę:
1. Add file -> Create new file
2. Nazwa: `.github/workflows/build-apk.yml`
3. Wklej całą zawartość `BUILD_APK_YAML.txt`
4. Commit changes

W Settings -> Secrets and variables -> Actions dodaj:
- `BLISKO_KEYSTORE_BASE64`
- `BLISKO_KEYSTORE_PASSWORD`

Wartości znajdują się w prywatnej paczce podpisu. Nie wrzucaj jej do repozytorium.

Po zielonym buildzie pobierz artifact `Blisko-APK` i zainstaluj `app-release.apk`.
