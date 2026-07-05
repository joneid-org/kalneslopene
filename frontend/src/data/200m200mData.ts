import type { StaticPhoto } from "@/data/loypekartData.ts";

export type RouteSection = {
  title: string;
  position: [number, number];
  description: string;
  photo: StaticPhoto;
};

export const routeDetails: RouteSection[] = [
  {
    title: "0-200 meter",
    position: [0, 200],
    description:
      "I krysset mellom Lundestadveien og Gamle Kongevei er det opparbeidet en flott parkeringsplass for de som bruker Kalnesskogen, og her er også start- og målområdet for Torsdagsløpet. Løypa er 5115 meter lang og er merket med blått. Tre lengre løyper (gul 7,0, grønn 8,8 og rød 10,2 km) starter på samme sted og i samme retning. Vi løper vestover.\n\nNår cirka 100 løpere skal starte et løp samtidig, er det viktig at det er bredt og oversiktlig der starten går. I så måte har Torsdagsløpet et helt supert startparti. Vi starter i den fem meter brede grusveien Lundestadveien. Etiketten er at de som vanligvis er de raskeste starter først, mens de som ikke løper så fort, eller har tenkt å ta det litt rolig akkurat denne dagen, starter lenger bak. Det er svært sjelden det er trøbbel med starten i Torsdagsløpet.\n\nDe første 100 meterne går det merkbart oppover, og det kan kjennes litt tøft. Men deretter går det nedover i et lettløpt grusparti.",
    photo: {
      fileName: "0200.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "0-200 meter",
    },
  },
  {
    title: "200-400 meter",
    position: [200, 400],
    description:
      "Når vi er mellom 200 og 360 meter løper vi fortsatt i grusveien Lundestadveien, og da nedover. Her er det gode muligheter for å sette opp farten. Det er også nok av plass for løpere til å passere hverandre i den fem meter brede veien. Det er lurt å finne en fornuftig plass i feltet her, før vi kommer inn i trangere partier.\n\nSiden vi løper vestover går starten enda litt lettere når vi har vind fra øst, mens det butter mer imot med vind fra vest. Likevel er litt vind fra vest å foretrekke siden vi vet at vi skal løpe motsatt vei mot mål, med slitne bein og med mindre vindbeskyttelse fra løpere foran oss.\n\nEtter 360 meter kommer løypas første utfordring for de med stor fart; en krapp høyresving som har fått navnet Raymondsvingen. Den tar oss ut av Lundestadveien. Vi løper fortsatt på grus, og det går litt oppover. Partiet er smalere, men det går fortsatt greit å passere hverandre.",
    photo: {
      fileName: "200400.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "200-400 meter",
    },
  },
  {
    title: "400-600 meter",
    position: [400, 600],
    description:
      "Vi befinner oss nå på en sti mellom Lundestadveien og Gamle Kongevei. Partiet mellom 400 og 500 meter er et ganske trangt grusparti. Partiet er s-formet, men er flatt og lettløpt. Vi er nå på vei nordover.\n\nEtter omtrent 500 meter er vi ferdig med å løpe på grus for en stund. Vi kommer over på myk og fin skogbunn. For oss som er glad i å løpe i terreng, og det er jo alle som løper Torsdagsløpet, er det deilig å løpe her.",
    photo: {
      fileName: "400600.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "400-600 meter",
    },
  },
  {
    title: "600-800 meter",
    position: [600, 800],
    description:
      "Vi er fortsatt mellom Lundestadveien og Gamle Kongevei, med skogbunn som behagelig underlag. Selv med et industriområde tett på er dette en sjarmerende og trivelig del av den blåmerkede løypa.\n\nVi har et gjerde på høyre side og tett skog på venstre side. Her er det vanskelig å passere andre løpere. Så selv om du skulle synes det går litt for sakte med løperen foran deg, så spar heller på kreftene enn å forsøke å passere her.\n\nSynes du det går altfor sakte, og du bare må forbi, rop gjerne at du vil passere på venstre side. Er du i motsatt situasjon og skjønner at noen vil forbi deg, prøv å trekke mot høyre i den grad det er mulig.",
    photo: {
      fileName: "600800.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "600-800 meter",
    },
  },
  {
    title: "800-1000 meter",
    position: [800, 1000],
    description:
      "Denne delen av løypa starter med at vi krysser Gamle Kongevei, fra sørvest-siden av veien til den nordøstlige siden. Arrangøren sørger for at alle kan krysse trygt når det er løp.\n\nNår vi har krysset veien kommer vi til en helling der vi kan teste hoppeferdighetene våre, eller strengt tatt landingsferdighetene. Så kommer vi inn et fint og temmelig flatt skogsterreng, med mye røtter. Røtter er både naturlig og sjarmerende når man løper i terreng, men det er viktig at man er oppmerksom og konsentrert i dette partiet.\n\nVi løper nordvestover, og etter hvert ganske så parallelt med Gamle Kongevei. Ved ca. 850 meter skilles for øvrig den grønne løypa fra den blå.",
    photo: {
      fileName: "8001000.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "800-1000 meter",
    },
  },
  {
    title: "1000-1200 meter",
    position: [1000, 1200],
    description:
      "Vi har passert skiltet som viser 1 km, og løper fortsatt nordvestover parallelt med Gamle Kongevei som da ligger noen meter til venstre for oss. I området like etter 1 km har det tidligere samlet seg store mengder vann etter at det har regnet mye, men etter at Dag Inge Sletner høsten 2019 gjorde en formidabel innsats med å legge grus og lage grøfter ser dette problemet ut til å være løst.\n\nEtter hvert kommer vi inn i et mer åpent parti. Det er også en del røtter i dette partiet, så løft beina ordentlig og se hvor det er lurt å sette dem. For øvrig er det et flatt og lettløpt parti, som også er vanlig å bruke til intervalltrening.\n\nLike etter 1 km-merket går den røde løypa til høyre, mens blåløypa går til venstre. Herfra er det bare den gule løypa som går sammen med den blå.",
    photo: {
      fileName: "10001200.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "1000-1200 meter",
    },
  },
  {
    title: "1200-1400 meter",
    position: [1200, 1400],
    description:
      "Vi er nå i et åpent, men naturlig terreng. Det gjelder å være oppmerksom på røttene som man ellers lett kan snuble i, eller skli på hvis det har regnet mye. Men vi skal slett ikke gjøre røtter til et negativt ord, de hører med i et terrengløp og gjør at det blir trim både for hjerne og kropp.\n\nI denne delen av løypa som er en del av Sletnersletta kan man kjenne at nordavinden byr på litt ekstra motstand hvis det blåser fra den kanten, eller man kan kjenne at man blir løftet fram av sønnavinden.\n\nEllers må denne delen av løypa, i likhet med de foregående 200 meterne, kunne betegnes som flatt og lettløpt. Derfor er den, igjen i likhet med strekningen 1000-1200 meter, populær å løpe intervaller i.\n\nEllers løper vi fortsatt nordvestover parallelt med Gamle Kongevei.",
    photo: {
      fileName: "12001400.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "1200-1400 meter",
    },
  },
  {
    title: "1400-1600 meter",
    position: [1400, 1600],
    description:
      "Etter at vi har løpt lenge på flat mark og rett fram, får vi nå et litt mer utfordrende parti der det går litt oppover og er litt svingete. Men veldig fint er det fortsatt, med naturlig skogbunn og tilhørende røtter som underlag.\n\nNår vi nærmer oss 1500 løpte meter kommer vi til et parti som er opparbeidet med en kort grusstrekning. Dette er gjort fordi det etter regntunge perioder kunne samle seg så mye vann i området at det var vanskelig for en løper å se hvor man kunne sette beina, noe som øker risikoen for fall og skader.\n\nEtter 1520 meter krysser vi en liten skogsvei, og for øvrig også den grønne og røde løypa som går i hver sin retning her.\n\nDeretter kommer vi til en liten forhøyning, vi kan vel kalle det kolle med navnet Baustadkollen, der det er ganske bratt på begge sider. Når du har kommet deg til toppen av denne er det god mulighet for å lange ut nedover. Det er i det hele tatt et morsomt innslag i den blåmerkede løypa.",
    photo: {
      fileName: "14001600.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "1400-1600 meter",
    },
  },
  {
    title: "1600-1800 meter",
    position: [1600, 1800],
    description:
      "Etter at vi har fått god fart ned fra kollen som avsluttet forrige 200-meter kan vi først nyte litt mer fallende terreng på naturlig skogbunn. Så kommer vi til et myrparti, det vil si det som en gang var et myrparti. Her er det gjort en stor jobb med å gjøre løypa mer framkommelig, med grus, duk og stokker. Dette partiet har fått navnet Bergerudpassasjen.\n\nFra rundt 1700 meter er vi tilbake i et mer naturlig terreng, med nye røtter som skal passeres i slak oppoverbakke. Senk blikket og løft beina, og du får en god opplevelse her. Nå kommer du nemlig inn i et virkelig flott skogsparti.\n\nVed 1715 meter skilles blå og gul, og blåløypa går solo de påfølgende meterne.",
    photo: {
      fileName: "16001800.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "1600-1800 meter",
    },
  },
  {
    title: "1800-2000 meter",
    position: [1800, 2000],
    description:
      "Starten av dette partiet er det virkelig bare å nyte, for dette er kanskje den aller flotteste delen av vår utmerkede blåmerkede løype. Du har tett skog rundt deg, med en myk skogbunn beina dine kan kose seg med og akkurat passe med røtter. Samtidig er det ganske bredt her, og fullt mulig å passere andre løpere. Vi er nå i delen som har fått navnet Paulsrudholtet.\n\nVed 1850 meter kommer du til en liten bru, og dermed slipper du å hoppe over bekken som «kjerringa med kjeppen». Etter brua er løypa like fin som før brua, og idyllen varer helt til du har kommet til 1920 meter. Da må du svinge til venstre og løpe opp et stykke på 20 meter som kan minne om en trapp, fortsatt i naturlig terreng. Velg å se positivt på det: Har du krefter kan du bruke Tomtrappa som vi kaller den til å tjene noen sekunder på de du har rundt deg.\n\nVi kommer så inn i et grusparti før vi passerer 200-meterskiltet. Etter at vi har svingt opp «trappa» løper vi ikke lenger parallelt med Gamle Kongevei, men vestover mot denne veien.",
    photo: {
      fileName: "18002000.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "1800-2000 meter",
    },
  },
  {
    title: "2000-2200 meter",
    position: [2000, 2200],
    description:
      "Fra merket som viser at vi har passert 2 km de påfølgende 165 meterne løper vi i et bredt grusparti, noe som skyldes skogsarbeid og ikke hensynet til turgåere og løpere. Du kjenner at det går oppover, og det kan være mange sekunder både å tape og å vinne i dette partiet.\n\nVi løper sørvestover mot gamle Kongevei, og etter 2165 meter er vi klare for å krysse denne veien. Det er heldigvis lite trafikk her, men om du ikke har tid til å se deg for, bør du i det minste høre etter om det kan være et kjøretøy på vei inn i løpebanen din.\n\nLike før den blå løypa krysser Gamle Kongevei er vi for øvrig inne i et parti der både den gule, den grønne og den røde løypa også går. Men det er bare den blå løypa som krysser veien her. De øvrige løypene tar til høyre like før og krysser veien lengre oppe.\n\nPå den andre siden av Gamle Kongevei blir løpsretningen for blåløypa igjen mer vestlig, og vi kommer inn i et sandparti.",
    photo: {
      fileName: "20002200.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "2000-2200 meter",
    },
  },
  {
    title: "2200-2400 meter",
    position: [2200, 2400],
    description:
      "Vi løper nå i et ganske bredt sandparti, med markert stigning. Her kan det være smart å finne seg et spor med mest mulig fast grunn, på siden av den mest løse sanden. Det kan spare deg for litt krefter, som du kan trenge i en del av løypa som kanskje er litt tøffere enn det ser ut til. For her er det 200 meter med jevn stigning. Underlaget blir fastere og bedre mot slutten av de 200 meterne, med mer naturlig skogbunn.\n\nDisse 200 meterne avsluttes med en 90 graders sving til venstre. Den bærer det godt etablerte navnet Lian-svingen, etter løperen Svein Lian som droppet å løpe her og heller sprang til venstre litt før.\n\nFor øvrig går den grønne løypa også i dette partiet, men i motsatt retning.",
    photo: {
      fileName: "22002400.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "2200-2400 meter",
    },
  },
  {
    title: "2400-2600 meter",
    position: [2400, 2600],
    description:
      "Vi har nettopp tatt en sving til venstre, og er nå over i et parti der det går slakt nedover. Det føles godt å komme i et mer lettløpt parti etter at vi har løpt oppover en stund. Underlagt er fortsatt sand, men her er det et fastere underlag med mer innslag av naturlig skogbunn enn de foregående 200 meterne, og du kan se en rot her og der. Det er også bredt her, med gode muligheter for å passere både andre løpere, turgåere og i ytterste fall også elgen som av og til hygger seg i dette området.\n\nDisse 200 meterne er i ganske åpent lende, og dersom det blåser kan man merke det godt. Vi løper sørover, og beveger oss nå bort fra Gamle Kongevei.",
    photo: {
      fileName: "24002600.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "2400-2600 meter",
    },
  },
  {
    title: "2600-2800 meter",
    position: [2600, 2800],
    description:
      "Vi er over halvveis! I denne delen av løypa går det fortsatt slakt nedover. Vi beveger oss gradvis fra sandbunn til naturlig skogbunn, med større innslag av røtter og steiner, beriket med traktorspor på sidene. Igjen er det på sin plass å minne om at røtter er fint, men at de også er egnet til å snuble i om føttene ikke løftes høyt nok.\n\nVi løper fortsatt sørover, og som for de forrige 200 meterne kan man kjenne vinden godt her.",
    photo: {
      fileName: "26002800.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "2600-2800 meter",
    },
  },
  {
    title: "2800-3000 meter",
    position: [2800, 3000],
    description:
      "Denne delen av løypa begynner med en miks av leire, stein, røtter og traktorspor, i en flat og rett strekning.\n\nMen så skjer det noe. På en miks av grus og skogbunn får vi en bratt og tøff oppoverbakke, som er ca. 40 meter lang. Her gjelder det å finne balansegangen mellom å komme seg fort opp og ikke løpe på seg altfor stive bein.\n\nNår du har kommet deg opp denne bakken er du på en topp med flott utsikt som har fått navnet Prøitztoppen, som vi har altfor lite tid til å nyte når vi løper Torsdagsløpet. Legg derfor turen innom her ved en annen anledning, gjerne når solen er i ferd med å stå opp. Her er det også en benk der du kan sette deg og nyte en matpakke eller bare stillheten.\n\nFra toppen går det naturlig nok nedover igjen, på samme underlag som tidligere. Og snart ser du skiltet som viser at du har løpt 3 km.",
    photo: {
      fileName: "28003000.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "2800-3000 meter",
    },
  },
  {
    title: "3000-3200 meter",
    position: [3000, 3200],
    description:
      "Nå går det nedover, men forhåpentligvis bare i den positive betydningen av ordet. Det er bratt, og vi løper på grus og stein med røtter i bunnen. Her er det på sin plass å oppfordre til å være både oppmerksom og hensynsfull. Det er bredt nok til å passere en annen løper, men unngå å sende deg selv eller en medløper i bakken.\n\nEtter 3130 meter kommer en venstrekurve som ikke er spesielt krapp, men som kan være litt vanskelig siden farten gjerne er stor ned bakken. Her er det også en del røtter du bør være oppmerksom på.\n\nEtter kurven fortsetter det å gå nedover, men ikke like bratt.  Vi løper nå i sørøstlig retning.\n\nVed den nevnte venstrekurven kommer også rød og gul løype inn. Gul løype følger den blå løypa helt til mål herfra.",
    photo: {
      fileName: "30003200.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "3000-3200 meter",
    },
  },
  {
    title: "3200-3400 meter",
    position: [3200, 3400],
    description:
      "Etter ha løpt nedover en stund kommer vi nå inn i en flatere del av løypa, med i hovedsak naturlig skogbunn og med relativt tett skog rundt. Det går først litt nedover, deretter er det ganske flatt.\n\nHer er det også ganske trangt, og normalt ikke en del av løypa der man passerer andre. For de du ligger rett bak her er jo ganske jevngode med deg, og dessuten kommer det snart en motbakke som det er lurt å spare litt krefter til.\n\nVær oppmerksom på røttene i denne delen av løypa også. De skal normalt ikke skape problemer, men det kan være vanskelig å se dem hvis du har løpere rett foran deg.",
    photo: {
      fileName: "32003400.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "3200-3400 meter",
    },
  },
  {
    title: "3400-3600 meter",
    position: [3400, 3600],
    description:
      "Hundebakken! Vi har nå kommet til den kanskje aller tøffeste delen av den blåmerkede løypa. Bakken starter ved 3400 meter og er 130 meter lang, målt til der det går en annen sti til venstre. Den har fått sitt navn etter en hund, som nå formodentlig er død, som bjeffet da løperne kom opp denne bakken. Bakken er gruslagt, men har også innslag av stein og røtter, særlig mot slutten.\n\nEtter Hundebakken flater det ut. Terrenget blir mer naturlig, og det gjelder nå å løfte slitne bein over røttene.",
    photo: {
      fileName: "34003600.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "3400-3600 meter",
    },
  },
  {
    title: "3600-3800 meter",
    position: [3600, 3800],
    description:
      "Med Hundebakken tilbakelagt er vi over i relativt flatt terreng, der det først går svakt oppover og så svakt nedover, med naturlig skogbunn. Utfordringen i starten av denne delen er de til dels kraftige røttene som ligger der klare til å felle torsdagsløpere med stive bein. Heldigvis er vi forberedt og nærmest danser oss gjennom dette partiet.\n\nSnart kommer vi over i et parti som er gruslagt for at det skal være framkommelig. Men snart er vi tilbake i naturlig terreng omgitt av urørt og vakker skog. Dette er en flott del av løypa, som bidrar til at Torsdagsløpet også er en naturopplevelse.",
    photo: {
      fileName: "36003800.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "3600-3800 meter",
    },
  },
  {
    title: "3800-4000 meter",
    position: [3800, 4000],
    description:
      "Tett skog på begge sider, naturlig skogbunn og litt røtter, det er sånn vi gjerne vil ha det. Og denne delen av løypa starter sånn. Etter hvert kommer vi over i et mer myraktig område, der det naturlig samler seg mye nedbør. Deler av dette området er nå utbedret med en steinlagt rand, slik at det skal være mulig å komme fram både raskt og sikkert. Av samme årsak er det lagt ut en liten «brygge» like før 4 km-merket.\n\nPartiet er flatt, og det går greit å passere andre løpere her. Nå begynner det jo å nærme seg slutten av løpet, og det er naturlig at noen forsøker å få opp farten litt.",
    photo: {
      fileName: "38004000.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "3800-4000 meter",
    },
  },
  {
    title: "4000-4200 meter",
    position: [4000, 4200],
    description:
      "Merket som viser 4 km er passert, og vi har bare en drøy kilometer igjen å løpe. Disse 200 meterne starter med et flatt parti, men så går det stadig brattere nedover. De som har velutviklet teknikk for å løpe i nedoverbakker, og unngår å bruke energi på å bremse opp, kan både tjene sekunder og spare på kreftene i denne delen av løypa.\n\nDenne strekningen er til dels gruslagt, men vi skal også forsere både røtter og steiner. Det er fremdeles ganske så tett skog på begge sider, og et hyggelig område å løpe i. Det er bredt nok til at det går an å passere andre løpere, men som mange andre steder er det viktig å vise hensyn, og det kan være lurt å gi beskjed om at du er på vei forbi.",
    photo: {
      fileName: "40004200.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "4000-4200 meter",
    },
  },
  {
    title: "4200-4400 meter",
    position: [4200, 4400],
    description:
      "Fra 4200 til 4270 meter går det virkelig bratt nedover. De 70 meterne er gruslagt, og selv om det stikker opp noen steiner og løv delvis dekker grusen, gir dette partiet virkelig mulighet for høy fart for de som behersker det. Det er dessuten opp mot et par meter bredt her, og dermed gode muligheter for å komme seg fram.\n\nVed 4270 meter løper vi inn til venstre, og deretter går det plutselig oppover igjen. Da gjelder det å få til en god overgang og utnytte videre farten man hadde nedover.\n\nVed 4270 meter skifter også underlaget karakter. Fra 4270 til 4400 meter løper vi på en smal sti med pakket jord og røtter som underlag. Det er en sjarmerende del med navnet Helgekneika, men vi tillater oss to anbefalinger: Husk å løfte beina godt så ikke røttene hekter deg, og ikke forsøk å passere noen akkurat her.",
    photo: {
      fileName: "42004400.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "4200-4400 meter",
    },
  },
  {
    title: "4400-4600 meter",
    position: [4400, 4600],
    description:
      "Vi lærte sist at vi løper på en smal sti i oppoverbakke fra 4270 til 4400 meter. Fra 4400 meter til 4440 meter fortsetter denne stien, men den slakker da ut. På disse 40 meterne er det ekstra viktig huske å løfte beina slik at du ikke sparker i en rot og faller, for nå er trolig både beina og hjernen litt preget av at du har løpt en stund.\n\nSå, ved 4440 meter, svinger vi til venstre inn på Lundestadveien. Vi er tilbake på en fem meter bred grusvei, og det går ganske så kraftig oppover når vi begynner å løpe denne veien i østlig retning. Jo da, det kan kjennes tøft, men nå gjelder det å ta ut de siste kreftene i de få minuttene som gjenstår av løpet. Og nå er det ingen røtter, krappe svinger eller andre vanskeligheter igjen, nå skal du bare løpe.\n\nOppløpet er langt, og det kan være en stor fordel å løpe sammen med en eller flere jevngode løpere her. De fleste vil da bli inspirert til å ta ut litt ekstra, og det er også en fordel å ligge bak noen for å få mindre luftmotstand, særlig hvis det er motvind.  Det er fint hvis man kan bytte på å ligge først, slik at begge eller alle får nytte av det. Her går det naturligvis veldig greit å passere andre løpere.",
    photo: {
      fileName: "44004600.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "4400-4600 meter",
    },
  },
  {
    title: "4600-4800 meter",
    position: [4600, 4800],
    description:
      "Vi er fortsatt på vei østover den fem meter brede grusveien Lundestadveien, og ved 4600 meter er vi fortsatt i tidlig fase av dette ganske tøffe oppløpet. Vi kommer inn i en slak venstrekurve før veien retter seg ut igjen. Det går fortsatt oppover, men på disse 200 meterne noe slakere enn i oppløpets første del. Her vil vi helst slippe at det blåser kraftig fra øst, for vi er i et åpent landskap der vi merker motvind godt.\n\nVed 4760 meter passerer vi det punktet der vi første svingte av etter starten. Altså løper vi nå for første gang i løpet i et parti der vi har løpt før, men i motsatt retning.",
    photo: {
      fileName: "46004800.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "4600-4800 meter",
    },
  },
  {
    title: "4800-5000 meter",
    position: [4800, 5000],
    description:
      "Vi er stadig på grus og vi løper stadig oppover, østover den fem meter brede Lundestadveien.\n\nLøpet er nesten slutt. Vi er slitne, men vi vet at det snart er over og finner krefter et aller annet sted. Det gjelder å holde farten oppe, men ikke stivne helt før vi er i mål.\n\nLøper du side om side med en du gjerne vil være foran i mål, må du foreta de siste taktiske valgene her. Tror du at du har litt mer krefter enn konkurrenten? Og du er kanskje litt bedre til å løpe oppover? Mens konkurrenten har litt bedre spurt? Er svarene ja så kanskje du skal forsøke et lite rykk, så konkurrenten er borte før dere skal spurte nedover. Er svarene derimot nei, kan det være smart bare å forsøke å holde følge og heller avgjøre mot slutten. Uansett: Husk at det bare skal være gøy.",
    photo: {
      fileName: "48005000.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "4800-5000 meter",
    },
  },
  {
    title: "5000-5115 meter",
    position: [5000, 5115],
    description:
      "Vi har passert 5 km-merket, og er ferdig med å løpe oppover. Det som nå gjenstår er 115 meter slak nedoverbakke på fem meter bred grusvei, meget godt egnet for spurt. Veien heter fremdeles Lundestadveien og løpsretningen er østover. Vi skal i mål samme sted som vi startet.\n\nDu kjenner det gjør vondt nå, og beina er stive, men du spurter med dem likevel, helt til Per Prøitz roper opp tiden din.\n\nKanskje klarte du akkurat tiden du håpet på, kanskje gikk det akkurat ikke. Uansett kommer det nye muligheter i Torsdagsløpet. Nå skal du bare nyte den gode følelsen etter å ha løpt, ta litt frukt og småprate med andre løpere.\n\nVi håper du har hatt en fin reise gjennom Torsdagsløpets blåmerkede løype, og ønsker deg velkommen tilbake igjen og igjen!",
    photo: {
      fileName: "50005115.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      description: "5000-5115 meter",
    },
  },
];
