# Psikologiaren Lenteen Atlasa

2. Batxilergoko **Psikologia** irakasgairako webgune interaktiboa, euskaraz.
Gizakia ulertzeko moduen historia, lente edo ikuspegi gisa antolatuta.

> **Ideia nagusia:** psikologiaren historia ez da autore eta data zerrenda bat,
> gizakia ulertzeko lenteen historia baizik. *Lente bakarrarekin ez da nahikoa.*

Klasean azaltzeko **eta** ikasleek etxean errepasatzeko sortua dago, eta etorkizunean
beste gai batzuk gehitzeko prest.

---

## 1. Zer dago barruan

```
psikologia-btx2-web/
├── index.html        ← orriaren egitura (atalak, ikonoak, heroa)
├── styles.css        ← diseinua (kolore, tipografia, txartelak…)
├── script.js         ← interakzioak (ez da ukitu behar edukia aldatzeko)
├── content/
│   └── psikologiaren-historia.json   ← ★ EDUKI GUZTIA HEMEN DAGO ★
├── assets/
│   └── logo.svg
└── README.md         ← gida hau
```

**Garrantzitsuena:** testu guztia `content/psikologiaren-historia.json` fitxategian dago.
Hori editatzen baduzu, webgune osoa eguneratzen da. **Ez duzu kodea ukitu behar.**

---

## 2. Edukia editatzen (JSON fitxategia)

JSON fitxategi bat testu hutsa da, baina arau txiki batzuk ditu:

- Testu bakoitza **komatxo bikoitzen** artean doa: `"hau testua da"`.
- Elementuak **komaz** bereizten dira. Azken elementuak **ez** darama komarik.
- Komatxoak testu barruan behar badituzu, `«»` erabili (adib. `"«kakotx hauek» arazorik gabe"`).
- `"` bat testu barruan jarri nahi baduzu, aurretik `\` jarri: `"5\" hazbeteko"`.

> 💡 **Aholkua:** editatu aurretik egin fitxategiaren kopia bat. Zerbait apurtzen bada,
> kopiara itzul zaitezke. Zalantzarik baduzu, [jsonlint.com](https://jsonlint.com) webgunean
> itsatsi fitxategia eta esango dizu akatsik dagoen.

### Fitxategiaren atalak

| Atala | Zertarako |
|-------|-----------|
| `meta` | Izenburua, azpititulua eta esaldi-gakoa |
| `lenteak` | 6 ikuspegiak (iragazkiak): barnera, portaerara, garunera… |
| `galderaHandiak` | 1. ataleko galdera nagusiak |
| `kronologia` | Denbora-lerroko mugarriak |
| `eskolak` | Eskola psikologikoen txartelak |
| `harremanak` | Harremanen maparen nodoak eta loturak |
| `kritikak` | "Kontuz sinplifikazioekin" ataleko oharrak |
| `sintesia` | Amaierako esaldia, mini-mapa eta 5 galderak |
| `ibilbidea` | Goiko nabigazioko 6 pausoak |

### Adibidea: eskola baten testua aldatu

Bilatu `"eskolak"` atalean dagokion eskola eta aldatu nahi duzun eremua:

```json
{
  "id": "konduktismoa",
  "izena": "Konduktismoa",
  "garaia": "1910–1950",
  "blokea": "estruktura",
  "lenteak": ["portaerara"],
  "galdera": "Kontzientzia ezin bada neurtu, zer azter dezakegu objektiboki?",
  "zerAztertzen": "Behagarria den portaera…",
  "autoreak": ["John B. Watson", "Ivan Pavlov", "B. F. Skinner"],
  "adibidea": "Pavloven txakurra: kanpai-hotsarekin lerdea…",
  "ekarpena": "Psikologia zientzia objektibo bihurtu zuen…",
  "sinplifikazioa": "Barne-mundua «kutxa beltz» gisa baztertu zuen…",
  "gaurEgun": "Ikaskuntzaren printzipioak baliozkoak dira oraindik…",
  "esaldia": "Ikus dezakeguna neur dezakegu; baina dena al da ikusgai?",
  "klaseGaldera": "Zure ohitura bat aukeratu: zer estimuluk eragiten du…?"
}
```

- `galdera` → txartelaren goiko galdera nagusia.
- `adibidea`, `sinplifikazioa`, `gaurEgun` → "Ulertu / Adibidea / Kritika / Gaur egun" botoiek erakusten dutena.
- `esaldia` → txartelaren behealdeko esaldia (ikaslearentzat).
- `klaseGaldera` → **Irakasle moduan** bakarrik agertzen den galdera, klasean botatzeko.

### Adibidea: kronologiara mugarri berri bat gehitu

Kopiatu lehendik dagoen mugarri baten egitura osoa, jarri koma bat aurrekoaren ondoren,
eta aldatu balioak:

```json
{
  "id": "k17",
  "garaia": "XXI. mendea",
  "data": "2010–",
  "blokea": "positibo",
  "mugarria": "Adibide berria",
  "autoreak": ["Egilea"],
  "galdera": "Zein galderari erantzuten dio?",
  "ekarpena": "Zer ekarri zuen.",
  "muga": "Zein muga zituen.",
  "gaurEgun": "Gaur egun zer geratu den."
}
```

`blokea` eremuak kolorea zehazten du. Aukerak: `filosofia`, `estruktura`, `sozial`, `positibo`.

### Lenteak (iragazkiak)

Eskola bakoitzak `lenteak` zerrenda du. Balio posibleak:

| `lenteak` balioa | Esanahia |
|------------------|----------|
| `barnera` | Barnera begiratzen dute (arima, kontzientzia, inkontzientea) |
| `portaerara` | Portaerara begiratzen dute |
| `garunera` | Garunera begiratzen dute |
| `gizartera` | Gizartera begiratzen dute |
| `harremanetara` | Harremanetara begiratzen dute |
| `zentzura` | Zentzura eta hazkundera begiratzen dute |

Eskola batek lente bat baino gehiago izan ditzake: `"lenteak": ["barnera", "portaerara"]`.

---

## 3. Etorkizunerako: gai berri bat gehitzea

Webgunea **hazteko** prestatuta dago. Gaur "Psikologiaren historia" da hasierako gaia,
baina bihar memoria, emozioak, pertzepzioa edo beste edozein gai gehi daiteke.

Bide errazena:

1. Sortu `content/` barruan datu-fitxategi berri bat, adib. `content/memoria.json`.
2. Kopiatu `index.html` orri berri batera (adib. `memoria.html`) eta `script.js`-en
   aldatu kargatzen den fitxategiaren izena.
3. Lotu orri berria hasierako orritik.

Egitura bera berrerabiltzen denez, gai bakoitzak itxura eta funtzionamendu berdina izango du.

---

## 4. Lokalean ikusteko (zure ordenagailuan)

Fitxategia zerbitzari batetik kargatzen denez, **ez da nahikoa `index.html` klik bikoitzarekin irekitzea**.
Terminala ireki, joan karpetara eta exekutatu:

```bash
cd psikologia-btx2-web
python3 -m http.server 8000
```

Gero, nabigatzailean: <http://localhost:8000>

(Geldiarazteko: `Ctrl + C` terminalean.)

---

## 5. Interneten argitaratzeko (GitHub Pages)

1. Igo karpeta osoa GitHub biltegi batera.
2. Biltegian: **Settings → Pages**.
3. **Source**: `Deploy from a branch` → `main` adarra, `/ (root)` karpeta.
4. Minutu batzuk barru, helbidea emango dizu (adib. `https://zureizena.github.io/biltegia/`).

GitHub Pagesek dena automatikoki zerbitzatzen du; ez da ezer konpilatu behar.

---

## 6. Erabilera-moduak eta irisgarritasuna

- **Ikasle / Irakasle** botoia (goian): irakasle moduan, eskola bakoitzean klasean
  galdetzeko galdera bat agertzen da.
- **Animazioak** botoia: animazioak desgaitzen ditu (edo sistemak "movement reduction"
  aktibatuta badu, automatikoki desgaitzen dira).
- Webgunea teklatuz erabil daiteke (`Tab`, `Enter`), kontraste ona du eta mugikorrean
  zabaltzen den informaziorik ez dago hover hutsean ezkutatuta.

---

## 7. Diseinu-sistema (laburpena)

- **Tipografia:** Nunito (izenburuak) + Inter (testua), Google Fonts bidez.
- **Oinarria:** paper bero argia, ez zuritasun kliniko hutsa.
- **Kolore nagusiak:** urdin iluna + grafitoa.
- **Azentuak:** more elektriko leuna, berde mentolatua, anbar epela — neurrian.
- Kolore guztiak `styles.css`-eko hasierako `:root` blokean daude, aldatzeko erraz.
