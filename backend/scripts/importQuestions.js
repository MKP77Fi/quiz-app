// backend/scripts/importQuestions.js

// Ladataan ympäristömuuttujat oikeasta polusta
require('dotenv').config({ path: '../.env' }); // HUOM: Tarkista polku suhteessa skriptin sijaintiin!
const mongoose = require('mongoose');
const Question = require('../models/Question');

/**
 * ------------------------------------------------------------------
 * KYSYMYSBANKIN TUONTISKRIPTI
 * ------------------------------------------------------------------
 * Tämä työkalu lukee alla olevan raakadatan (rawData) ja vie sen tietokantaan.
 * Käytetään järjestelmän alustuksessa tai kun halutaan nollata kysymyspankki.
 * * TOIMINTA:
 * 1. Lukee tekstin.
 * 2. Tunnistaa kysymykset (**1. Kysymys...), vaihtoehdot (•) ja oikeat vastaukset ((Oikein)).
 * 3. Tyhjentää tietokannan vanhoista kysymyksistä.
 * 4. Tallentaa uudet kysymykset.
 */

// TÄHÄN KOPIOIDAAN KYSYMYSDATA (Wordista tai tekstitiedostosta)
// Lyhennetty tässä esimerkissä luettavuuden vuoksi.
// KOPIOI ALKUPERÄINEN SISÄLTÖ TÄHÄN KOKONAISUUDESSAAN!
const rawData = `
**1. Asiakkaanasi oleva kiireinen Herra Möttönen pyytää sinua pysähtymään hyvin vilkkaasti liikennöidyllä tiellä, jotta hän voisi jäädä pois. Mikä seuraavista tilannetta koskevista väittämistä on oikea?
• Herra Möttösellä on oikeus valita pysähtymispaikka, sillä hän maksaa kyydistä
• Herra Möttösellä on velvollisuus maksaa mahdollinen sakkomaksu, mikäli hän on pyytänyt pysähtymään kielletyssä paikassa
• Asiakkaan turvallinen autoon tulo ja poistuminen on aina kuljettajan vastuulla, joten jos pysähtymispaikka on sellainen, ettei Herra Möttönen voi siinä poistua, etsit paremman paikan (Oikein)
**2. Mikä seuraavista vaihtoehdoista on oikein?
• Taksiluvan haltijalla on poikkeustapauksessa oikeus ohittaa kuljettajan alkolukon käyttövelvollisuus
• Alkoholia ei tule nauttia ennen ajovuoroa, koska nautittu alkoholi aiheuttaa aina väsymystä ja heikentää ajokykyä (Oikein)
• Jos kuljettaja ei saa puhalluksen jälkeen autoa käyntiin, voi hän aina vaihtaa sellaiseen ajoneuvoon, jossa ei ole alkolukkoa
**3. Miten toimit, jos asiakas pyytää ajamaan ylinopeutta?
• Voit ajaa ylinopeutta, jos on sovittu, että asiakas maksaa ylinopeussakot
• Kerrot asiakkaalle, ettet voi ajaa ylinopeutta, mutta teet parhaasi, jotta hän pääsee turvallisesti perille, nopeinta mahdollista reittiä (Oikein)
• Voit ajaa ylinopeutta, jos asiakkaalla on siihen perusteltu syy
**4. Miksi alkolukko vaaditaan pakollisena varusteena kunnan tilaamissa koulu- ja päivähoitokuljetuksissa?
• Sillä estetään ajoneuvon liikkuminen, jos kuljettaja on nauttinut alkoholia (Oikein)
• Se on tarkoitettu ainoastaan työnantajan seurantavälineeksi kuljettajan alkoholin käytöstä
• Sillä poliisi tarkistaa liikenteenvalvonnassa kuljettajan ajokunnon
**5. Liikenteessä on poikkeusjärjestelyjä liikenneonnettomuuden vuoksi. Saat samaan aikaan kolmelta taholta, jotka eivät tiedä toisistaan, keskenään ristiriitaisia toimintaohjeita. Kenellä seuraavista on määräysvalta, eli kenen ohjeita sinun tulee noudattaa?
• Liikennevirasto
• Poliisi (Oikein)
• Työnantajasi
**6. Seuraavassa on kolme väittämää taksinkuljettajan velvollisuuksista. Mikä niistä on mielestäsi oikein?
• Alle 135 cm pituinen lapsi tarvitsee aina turvalaitteen matkustaessaan taksissa (Oikein)
• Lapsi voi matkustaa taksissa ilman turvalaitetta, kunhan istuu takapenkillä ja on turvavöissä
• Alle 3-vuotias istuu aina etupenkillä
**7. Mikä seuraavista on hyvää viestimien käyttöön liittyvää asiakaspalvelua?
• Kuljettaja voi lähettää viestejä, jos puhelin on äänettömällä
• Puhelun soittaminen, jos se on kuljetuksen edistämiseksi välttämätön (Oikein)
• Kuljettaja voi puhua henkilökohtaisia puheluita, jos asiakas ei siitä häiriinny
**8. 17-vuotias Elviira kulkee viikoittain yksin tanssiharrastuksestaan kotiin Kuopion keskustasta pientaloalueelle. Kuka vastaa turvavyön käytöstä?
• Kuljettaja 
• Elviira itse (Oikein)
• Taksissa turvavyön käyttö on aina vapaaehtoista, joten turvavyötä ei tarvitse laittaa kiinni
**9. Mitä taksinkuljettajalta edellytetään, jos asiakkaana on henkilö, joka ei kykene käyttämään puhuttua kieltä?
• Taksinkuljettajalta edellytetään viittomakielen taitoa
• Taksinkuljettajan tulee huolehtia, että asiakas pääsee määränpäähän (Oikein)
• Taksinkuljettajalta edellytetään erityisammattitutkinnon suorittamista
**10. Miten alle 3-vuotiasta lasta tulee kuljettaa taksissa?
• Lasta voi kuljettaa ilman turvalaitetta, kunhan istuu takapenkillä turvavöihin kytkettynä
• Lasta voi kuljettaa täysi-ikäisen matkustajan sylissä takapenkillä
• Lapsi tulee kuljettaa aina asianmukaisessa turvalaitteessa (Oikein)
**11. Mikä seuraavista väittämistä pitää paikkaansa?
• Jos kuljettaja joutuu auton liikkuessa soittamaan puhelun, hänen ei tarvitse käyttää handsfree-laitetta
• Mikäli taksissa ei ole asiakkaita, saa kuljettaja ajoneuvon liikkuessa katsella televisiokuvaa integroidusta näytöstä
• Kuljettaja saa soittaa puhelun ajon aikana handsfree-laitetta käyttäen, jos se on kuljetuksen suorittamiseksi välttämätön (Oikein)
**12. Kuinka toimit, jos tilausosoitteeseen saapuessasi huomaat, että yksi matkustaja on kolmevuotias lapsi ja autossasi ei ole hänelle sopivaa turvalaitetta?
• Pahoittelet asiakkaalle, ettet voi ottaa heitä kyytiin ja ehdotat, että tilaat turvalaitteilla varustetun ajoneuvon asiakkaalle (Oikein)
• Toivotat asiakkaat tervetulleeksi kyytiin, mutta lapsen tulee istua ilman turvalaitetta etupenkillä turvavöissä
• Toivotat asiakkaat tervetulleeksi taksiin, mutta lapsen tulee istua ilman turvalaitetta
**13. Mikä seuraavista pyörätuolin käyttöä ja kiinnittämistä koskevista väittämistä pitää paikkaansa?
• Sähköpyörätuolia ei tarvitse kiinnittää ajoneuvoon
• Asiakkaan ei tarvitse ajon aikana pyörätuolissa istuessa käyttää ajoneuvon turvavöitä (Oikein)
• Pyörätuoli tulee kiinnittää siten, että se estää ainoastaan sivusuuntaisen liikkeen
**14. Mikä seuraavista pyörätuolin käyttöä ja kiinnittämistä koskevista väittämistä pitää paikkaansa?
• Pyörätuoli on kiinnitettävä sen rungosta (Oikein)
• Nimenomaan sisäkäyttöön tarkoitettua pyörätuolia ei tarvitse kiinnittää ajon aikana, jos taksimatkan pituus on alle kilometrin
• Asiakas päättää kiinnitetäänkö pyörätuoli
**15. Kasvava osa taksikuljetuksista hoidetaan autoilla, jotka ovat esteettömiä. Miten pyörätuoli on kiinnitettävä, kun matkustaja istuu matkan ajan pyörätuolissa?
• Pyörätuolin jarrut laitetaan päälle ja pyörätuoli kiinnitetään autoon turvavöillä
• Pyörätuolin jarrut laitetaan päälle ja pyörätuoli kiinnitetään sen rungosta neljästä pisteestä (Oikein)
• Asiakas päättää kiinnitetäänkö pyörätuoli
**16. Kenen vastuulla on pyörätuolin huolellinen kiinnittäminen taksiin, kun asiakkaan mukana on henkilökohtainen avustaja?
• Asiakkaan
• Kuljettajan (Oikein)
• Henkilökohtaisen avustajan
**17. Olet ottanut asiakkaan kyytiin paikkakuntasi taksiasemalta. Olette ajaneet hyvän matkaa, kun taksin puhelin soi. Huomaat, että handsfree-laite on jäänyt kotiin. Mitä teet?
• Pahoittelet asiakkaalle puhelun aiheuttamaa häiriötä ja vastaat sitten puheluun
• Pysähdyt tien varteen, jotta voit kirjoittaa ylös välttämättömät tiedot. Voit pitää taksamittarin päällä
• Pahoittelet asiakkaalle puhelun aiheuttamaa häiriötä etkä vastaa siihen. Soitat takaisin kyydin päätyttyä (Oikein)
**18. Taksi mahdollistaa näkövammaisten asiakkaiden sujuvan liikkumisen. Myös sinun kyytiisi taksinkuljettajana tulee todennäköisesti näkövammaisia asiakkaita ja joskus heillä on mukana opaskoira. Mitä sinun on hyvä muistaa opaskoirasta?
• Opaskoiraa tulee aina rapsuttaa kiitokseksi hyvin tehdystä työstä
• Opaskoira istuu joko asiakkaan jalkatilassa tai matkatavaratilassa (Oikein)
• Opaskoira istuu aina takapenkillä
**19. Taksit hoitavat merkittävän osan kuntien järjestämistä koulu- ja päiväkotikuljetuksista. Oppilaat ovat lapsia ja nuoria, mikä edellyttää, että kuljettaja kykenee tulemaan toimeen heidän kanssaan. Oppilaskuljetuksia tekevän taksinkuljettajan kuuluu muun muassa:
• Oppilaan hakeminen sisältä ja vieminen sisälle, kotitehtävien tarkistaminen sekä saattaminen luokkaan
• Oppilaan turvavyön varmistaminen ja vastuulliseen liikennekäyttäytymiseen opastaminen (Oikein)
• Jatkuva yhteydenpito vanhempien kanssa. Kuljettajan tulee soittaa kaikkien kyydissä olevien lasten vanhemmille, kun lapset tulevat kyytiin ja poistuvat kyydistä. Näin varmistetaan, että jokainen lapsi on varmasti päässyt kouluun
**20. Miten tulee toimia, kun liikuntavammaisella asiakkaalla on mukana avustaja ja runsaasti matkatavaroita?
• Avustajan vastuu on huolehtia matkatavaroiden lastaamisesta ja purkamisessa sillä välin kun kuljettaja avustaa asiakasta
• Avustaja avustaa matkustajaa kaikessa ja kuljettaja odottaa paikallaan koska hänellä ei ole mitään tehtävää
• Kuljettaja avustaa asiakkaat ajoneuvoon ja huolehtii matkatavaroiden turvallisesta lastaamisesta ja purkamisesta (Oikein)
**21. Mitä taksinkuljettajan tulee muistaa koulu- ja päivähoitokuljetuksiin liittyen?
• Lapsille ei saa puhua matkan aikana
• Lapsille tulee tarjota riittävästi virvokkeita
• Kuljettajan tulee käyttäytyä vastuullisen aikuisen ja esimerkillisen roolimallin mukaisesti (Oikein)
**22. Koulukuljetuksia hoitava taksinkuljettaja on lapsen elämässä tärkeä aikuinen. Mitä on hyvä muistaa turvavyön käytöstä?
• Kuljettajan ei tarvitse käyttää turvavyötä
• Myös kuljettaja käyttää turvavyötä (Oikein)
• Taka penkillä matkustavan ei tarvitse käyttää turvavyötä
**23. Alkolukko on pakollinen varuste autoissa, joilla suoritetaan koulu- tai päivähoitokuljetuksia. Alkolukko säädetään siten, että ajoneuvon käynnistyminen estyy, jos kuljettajan uloshengitysilman alkoholipitoisuus on:
• 0,10 milligrammaa alkoholia litrassa uloshengitysilmaa tai enemmän (Oikein)
• 0,50 milligrammaa alkoholia litrassa uloshengitysilmaa tai enemmän
• Uloshengitysilmassa ei saa olla lainkaan alkoholia 
**24. Miten tulee toimia, kun kyytiin on tulossa hyvin iäkäs hitaasti liikkuva asiakas vilkkaasti liikennöidyssä paikassa?
• Avustan häntä ottamalla käsivarresta kiinni kysymättä asiakkaalta tarvitseeko hän apua
• Pyydän asiakasta kiirehtimään autoon, koska kaupan edessä on paljon liikennettä
• Nousen ajoneuvosta ja tiedustelen, tarvitseeko hän apua (Oikein)
**25. Lasten kanssa työskentelevältä vaaditaan moitteetonta taustaa. Tästä johtuen jokaiselta koulu- ja päivähoitokuljetuksia hoitavalta kuljettajalta vaaditaan rikosrekisteriote. Kuka tuon otteen hankkii?
• Kuljettajan työnantaja 
• Kuljettaja itse (Oikein)
• Kuljetuksen tilaaja
**26. Uudella työnantajallasi on paljon sellaisia asiakkaita, jotka ovat käyttäneet taksia jo useiden vuosien ajan ja suuren asiakasryhmän muodostavat näkövammaiset asiakkaat. Ensimmäisellä vuorollasi asiakkaaksesi sattuu tulemaan 48-vuotias näkövammainen Elmeri, joka käy aina maanantaisin uimassa läheisellä uimahallilla. Mitä sinun tulee muistaa näkövammaisten asiakaspalvelusta?
• Näkövammaisia palvellessa tulee muistaa puhua hieman normaalia puheääntä kovempaa
• Kuljettajan on hyvä kysyä asiakkaalta, miten häntä voi auttaa; ja kertoa sanallisesti sijaintiin liittyvistä olennaisista asioista (Oikein)
• Elmerin yksilöllinen tilanne huomioiden on kunnioittavaa pitäytyä erityishuomion osoittamisesta, koska hän on varmasti oppinut jo käyttämänsä reitin ulkoa ja hän pärjää siksi ilman näkökykyään
**27. Liikuntavammaisella asiakkaalla saattaa olla mukanaan avustaja. Miten toimit silloin?
• Keskustelen aina vain avustajan kanssa 
• Keskustelen aina asiakkaan kanssa (Oikein)
• Pyydän kirjalliset ohjeet siitä, miten tulee toimia
**28. Eelis Auvisella on synnynnäinen näkövamma, jonka vuoksi hänellä ei ole lainkaan näkökykyä. Hän käyttää liikkumisen apuna valkoista keppiä ja hänellä on mukana myös opaskoira. Eelis kulkee päivittäin taksilla kotoaan työpaikalle. Mitä teet, kun haet Eeliksen aamulla ja et ole kuljettanut häntä koskaan aikaisemmin?
• Odotat kadunvarressa, että Eelis saapuu taksin luokse. Avaat hänelle sisäpuolelta oven ja teet takapenkille tilaa hänen opaskoiralleen
• Soitat torvea, jotta Eelis tietää, että olet saapunut
• Nouset autosta ja kerrot hänelle, että hänen taksinsa on saapunut sekä esittelet itsesi. Kerrot missä taksi on ja tiedustelet, missä hän haluaa istua (Oikein)
**29. Mikä seuraavista vastausvaihtoehdoista on paras tapa toimia? Asiakkaanasi on ikääntynyt avustettava henkilö ja hänet jätetään hoitolaitoksen luona.
• Kuljettajan vastuu päättyy, kun asiakas on noussut ulos autosta
• Taksinkuljettaja huolehtii, että asiakas saa yhteyden hoitohenkilökuntaan (Oikein)
• Taksinkuljettajan tulee aina myös huolehtia asiakkaan ulkovaatteiden riisumisesta
**30. Helmi on vaikeavammainen 8-vuotias tyttö, joka käy viikoittain kuntoutuksessa läheisessä hoitolaitoksessa. Hän käyttää pyörätuolia, eikä pysty liikkumaan itsenäisesti lainkaan. Hänen äitinsä on kuullut, että Helmillä olisi oikeus saada itselleen kansaneläkelaitoksen (Kela) korvaamana vakiotaksi, jolloin häntä kuljettaisi saman yrityksen palveluksessa olevat kuljettajat. Helmin äiti tiedustelee sinulta, onko tämä mahdollista. Miten vastaat hänelle?
• Helmillä ei ole oikeutta vakiotaksiin, sillä siihen ovat oikeutettuja vain vanhukset ja työssä käyvät vaikeavammaiset aikuiset
• Helmillä on oikeus vakiotaksiin vain, jos hänen äitinsä kulkee matkat hänen kanssaan
• Helmillä on oikeus vakiotaksiin (Oikein)
**31. Asiakas on tilannut Kela-kyytinsä keskitetystä tilausvälitysnumerosta. Mitä asiakas maksaa?
• Koko matkan hinnan
• Enintään omavastuun 50 euroa
• Enintään omavastuun 25 euroa (Oikein)
**32. Miten neuvot asiakasta, kun hän tiedustelee sinulta vakiotaksioikeudesta Kela-korvattavien taksimatkojen osalta?
• Neuvon asiakasta soittamaan kenelle tahansa vapaana olevalle taksille
• Neuvon asiakasta ottamaan taksin taksitolpalta
• Neuvon asiakasta soittamaan Kelan palvelunumeroon (Oikein)
**33. Olet viemässä tuttua asiakasta paikalliseen elokuvateatteriin, kun yhtäkkiä huomaat, että asiakas saa kouristuskohtauksen. Asiakas on sinulle entuudestaan tuttu, joten tiedät hänen sairastavan epilepsiaa. Mikä on ensimmäinen ensiaputoimenpiteesi?
• Pidät tiukasti kiinni asiakkaasta, jotta hän ei satuttaisi itseään kouristuskohtauksen aikana
• Huolehdit, ettei asiakas kolhi päätään, mutta et pyri estämään kouristusliikkeitä. Kun kouristukset vähentyvät, käännät henkilön kylkiasentoon (Oikein)
• Jatkat normaalisti matkaa, koska aikataulusi on tiukka ja kohtaus menee pian ohi
**34. Miten tulee toimia, kun pyörätuolissa olevan asiakkaan vaatteet ovat jääneet siten, että asiakkaalla on epämiellyttävä istua?
• Varmistaa, että asiakkaalla on mukava olla ja tarvittaessa auttaa oikaisemaan asiakkaan vaatteet (Oikein)
• Kuljettajan tehtävä ei ole suoristaa asiakkaan vaatteita
• Kuljettajan tehtävä on aina pukea asiakas ennen kyytiin ottamista
**35. Miten tulee toimia, kun maksuhetkellä asiakas on haluton maksamaan matkaansa?
• Kutsun paikalle poliisin selvittämään asiaa (Oikein)
• Kutsun paikalle mahdollisimman monia muita taksinkuljettajia selvittämään asiaa
• Otan asiakkaalta väkisin arvoesineen maksun pantiksi
**36. Taksinkuljettajalla on huono päivä ja hänestä tuntuu, ettei mikään ole mennyt päivän aikana kovinkaan hyvin. Hänen ei tee mieli hymyillä eikä varsinkaan puhua asiakkaiden kanssa. Asiakkaiden mielipiteet ärsyttävät ja eräälle asiakkaalle hän on erityisen töykeä. Asiakas tekee tilanteesta valituksen. Onko asiakkaalla oikeus valittaa saamastaan palvelusta?
• Kyllä, sillä asiakkaita kohtaan tulee aina käyttäytyä kohteliaasti ja asiallisesti (Oikein)
• Ei, sillä asiakas ei osta taksiin tullessaan iloista palvelua vaan kuljetuksen määränpäähän
• Ei, sillä kyseinen tapa on Reinikaisen tapa toimia, eikä häntä voi siitä moittia
**37. Kyydissäsi on liikuntarajoitteinen asiakas, joka tarvitsisi kaksi pulloa viiniä. Hän pyytää sinut hakemaan viinipullot Alkosta, koska liikkuminen on hänelle hankalaa. Mitä vastaat asiakkaan pyyntöön?
• Valitettavasti laki kieltää hakemasta alkoholia asiakkaille (Oikein)
• Tottahan toki voit hakea, koska on tiedossa kenelle juomat tulevat
• Voit hakea, jos asiakas kirjoittaa kirjallisen valtakirjan, jolla valtuuttaa hakemaan itselleen juomat
**38. Mikä seuraavista on hyvää asiakaspalvelua?
• Kuljettaja tervehtii kohteliaasti ja tunnustelee, onko asiakas halukas jutustelemaan ja antaa päättää aiheesta (Oikein)
• Kuljettaja tervehtii kohteliaasti ja suostuu keskustelemaan ainoastaan ajoreittiin liittyvistä asioista
• Kuljettaja tervehtii kohteliaasti ja aloittaa keskustelun itselleen mieleisestä aiheesta
**39. Taksisi kyytiin tulee 10-vuotias Elina, joka ilmoittaa, ettei halua käyttää turvavyötä, sillä se tuntuu epämukavalta ja hän kertoo, että äiti on antanut hänelle luvan matkustaa ilman turvavyön kiinnittämistä. Mitä teet?
• Lapsen huoltajat voivat päättää, että Elina voi matkustaa ilman turvavyötä, joten Elinan ei tarvitse käyttää turvavyötä
• Taksissa saa matkustaa ilman turvavyötä, joten Elinan ei tarvitse laittaa turvavyötä
• Huolehdit, että Elina kiinnittää turvavyön. Yksin matkustava lapsi pitää taksissa aina turvavyötä (Oikein)
**40. Miten tulee toimia, kun pyörätuolissa oleva asiakas haluaa itse siirtyä pyörätuolistansa?
• Asiakas ei voi koskaan siirtyä ilman kuljettajan apua
• Annat asiakkaan siirtyä itse ja avustat tarvittaessa (Oikein)
• Jos matkustaja haluaa siirtyä itse ajoneuvoon, voit siirtyä odottamaan kuljettajan paikalle
**41. Talvet saattavat Suomessa olla erittäin kylmiä. Eräänä helmikuun torstaiyönä ulkona on -30 astetta pakkasta. Olet saanut lentokentältä varsin väsyneen oloisen asiakkaan, joka on nauttinut muutaman alkoholiannoksen. Kyyti sujuu oikein mainiosti ja perille päästyänne asiakas lähtee hoippumaan kohti kotioveaan. Miten toimit?
• Varmistat, että asiakas pääsee kotiovesta sisään. Tämän jälkeen voit jatkaa matkaa (Oikein)
• Asiakas ei ole taksista poistumisen jälkeen enää sinun vastuullasi, joten voit jatkaa matkaasi
• Puhallutat asiakkaan ennen kuin päästät hänet ulos autosta. Jos hän puhaltaa yli 0,5%, viet hänet poliisin selviämisasemalle
**42. Kuinka tulee toimia tilanteessa, jossa kyydin päätyttyä huomaat asiakkaan unohtaneen ajoneuvoon käsilaukkunsa?
• Voit viedä käsilaukun kotiisi ja odottaa asiakkaan yhteydenottoa
• Toimitat käsilaukun tilausvälitystoimistolle viimeistään viikon kuluessa
• Toimitat käsilaukun viipymättä asiakkaalle tai poliisin löytötavaratoimistoon (Oikein)
**43. Kuljettaja pystyy vaikuttamaan merkittävästi asiakkaan matkustusmukavuuteen. Mitä sinulta odotetaan?
• Jatkuvaa keskustelun ylläpitoa
• Hyvää pelisilmää sillä joskus asiakkaat eivät halua keskustella ja taas välillä asiakas haluaa juttukumppanin (Oikein)
• Huomaamatonta ja äänettömänä olemista
**44. Kuinka paljon taksissa saa enintään ylittää ajoneuvon istuinpaikkaluvun mukaisen henkilömäärän, jos kyseessä ei ole koulu- tai päivähoitokuljetus?
• Ei yhtään (Oikein)
• Ylitys saa olla enintään 30%
• Kuljettaja voi oman harkinnan mukaan päättää, mikä on turvallinen ylitys
**45. Kuinka pitkään taksinkuljettajan ajolupa on enintään voimassa?
• Viisi vuotta (Oikein)
• Viisitoista vuotta
• Toistaiseksi
**46. Kuljettajan ajoluvan myöntää:
• ELY-keskus liikenne
• Viestintävirasto Trafi (Oikein)
• Poliisi
**47. Aulis on hankkinut itselleen ajoluvan kolme vuotta sitten. Ajoluvan asemapaikka on Vantaa. Aulis on kuitenkin muuttamassa Jyväskylään ja onkin löytänyt itselleen uuden työnantajan uudesta kotikaupungistaan. Voiko Aulis aloittaa työskentelyn tällä jyväskyläläisellä työnantajalla?
• Ei, sillä taksinkuljettajan ajolupa on voimassa vain kaksi vuotta
• Kyllä, mutta suoritettuaan hyväksytysti Jyväskylän paikallistuntemuskokeen ja haettuaan ajoluvan kelpoisuusalueen laajentamista Traficomilta
• Kyllä, sillä taksinkuljettajan ajolupa on voimassa koko manner-Suomen alueella (Oikein)
**48. Missä seuraavista tilanteissa kuljettaja voi kieltäytyä kyydistä?
• Kyyti suuntautuu toiselle liikennealueelle
• Laillinen työaika ylittyisi (Oikein)
• Asiakas on menossa toisen kunnan alueelle
**49. Kalle Kuljettaja on ajanut opintojensa ohella Ismo Isännälle neljän vuoden ajan. Nyt hän on valmistunut opinnoistaan ja aikoo muuttaa toiselle paikkakunnalle, joten hän päättää työsuhteensa Ismo Isäntään. Kuinka pitkä on Kallen irtisanomisaika?
• 14 päivää, sillä työsuhde on kestänyt alle viisi vuotta 
• 1 kuukausi, sillä työsuhde on kestänyt yli vuoden, mutta alle viisi vuotta (Oikein)
• Kalle voi lopettaa työnsä sitten, kun Ismo löytää itselleen uuden kuljettajan
**50. Seuraavassa kolme väittämää koskien taksinkuljettajan velvollisuuksia. Mikä niistä on mielestäsi oikein?
• Alle 135 cm pituinen lapsi tarvitsee aina turvalaitteen matkustaessaan taksissa (Oikein)
• Lapsi voi matkustaa taksilla ilman turvalaitetta, kunhan hän istuu takapenkillä ja turvavyöt kiinnitettynä
• Alle 3-vuotias lapsi ei saa matkustaa taksissa ilman huoltajan kirjallista suostumusta
**51. Miten kuljettajan tulee valita käytettävä ajoreitti kohteeseen, jos matkustaja jättää valinnan kuljettajalle ja kun matkan hinta perustuu matkan pituuteen tai matkaan käytettävään aikaan?
• Kuljettajan ei tarvitse valita reittiä, koska asiakkaan tulee tietää paras reitti perille
• Kuljettaja voi valita minkä reitin tahansa
• Kuljettajan tulee valita matkustajan kannalta edullisin tarkoituksenmukainen reitti (Oikein)
**52. Kuka vastaa 15 vuotta täyttäneen asiakkaan turvavyön käytöstä?
• Kuljettaja
• Asiakas (Oikein)
• Taksissa turvavyön käyttö on aina vapaaehtoista, joten turvavyön käytöstä ei tarvitse välittää
**53. Koskeeko työaikalaki taksinkuljettajaa?
• Kyllä koskee (Oikein)
• Ei koske, jos siitä on sovittu työnantajan kanssa
• Ei koske missään tilanteessa
**54. Milloin taksissa tulee olla alkolukko?
• Aina kun suoritetaan kunnan tilaamia koulu- ja päivähoitokuljetuksia (Oikein)
• Aina kun asiakas otetaan kyytiin ilman ennakkotilausta
• Vain jos kuljettajalla on taksinkuljettajan ajoluvassa alkolukon määräävä erityisehto
**55. Missä seuraavissa tilanteissa taksissa tulee olla kuljettajan nimi esillä?
• Vain ennakkotilauskuljetuksissa
• Kaikissa kuljetuksissa (Oikein)
• Vain koulu- ja päivähoitokuljetuksissa
**56. Millä alueella taksinkuljettajan ajolupa on voimassa?
• Kuljettajan pääasiallisessa asuinkunnassa
• Euroopan Unionin alueella
• Manner-Suomessa (Oikein)
**57. Mikä seuraavista on peruste taksinkuljettajan ajoluvan peruuttamiselle?
• Kuljettaja ei ole työskennellyt viimeisen kolmen vuoden aikana taksinkuljettajana
• Alueella toimivat taksinkuljettajat ja taksiyrittäjät suosittelevat ajoluvan peruuttamista
• Kuljettaja on syyllistynyt törkeään liikenneturvallisuuden vaarantamiseen (Oikein)
**58. Mikä seuraavista kuljettajan työaikaa koskevista väittämistä ei pidä paikkaansa?
• Taksinkuljettajan vuorokautinen työmäärä saa olla enimmillään 11 tuntia 24 tunnin ajanjaksolla (Oikein)
• Työaikaa on varsinaisen ajotyön lisäksi taksiasemalla oloaika auton siivoamiseen
• Työaikaa on myös kuljettajan työpäivän aikana pitämä kahden tunnin tauko
**59. Mikä seuraavista väittämistä on virheellinen?
• Ajoneuvo tulee olla rekisteröity luvanvaraiseen liikenteeseen
• Kuljettajalla tulee olla aina mukana taksinkuljettajan ajolupa
• Jokaisessa taksissa tulee olla alkolukko (Oikein)
**60. Miten toimit, kun asiakas pyytää pysähtymään ja odottamaan paikassa, jossa on pysähtyminen kielletty?
• Asiakkaalla on oikeus valita pysähtymispaikka, sillä hän maksaa kyydistä
• Taksinkuljettaja voi perustelluista syistä poiketa pysähtymissäännöistä
• Voit jäädä odottamaan sellaiseen paikkaan, jossa pysähtyminen on sallittu (Oikein)
**61. Kenellä on vastuu työvuorossa käytettävän taksin liikennekelpoisuudesta?
• Kuljettajalla (Oikein)
• Taksintarkastajalla
• Katsastajalla
**62. Asiakas tulee kyytiin taksiasemalta ja ilmoittaa haluavansa osoitteeseen, joka ei ole sinulle tuttu entuudestaan. Kuinka toimit?
• Lähdet ajamaan siihen suuntaan, missä epäilet osoitteen sijaitsevan
• Näpyttelet osoitteen navigaattorille ja seuraat sen antamia ohjeita
• Kerrot asiakkaalle, että osoite ei valitettavasti ole sinulle ennestään tuttu ja tiedustelet samalla hiukan lisätietoja osoitteesta (Oikein)
**63. Mitä tarkoittaa taksinkuljettajalta vaadittava riittävä kielitaito?
• Sitä, että kuljettaja pystyy keskustelemaan asiakkaan kanssa sujuvasti päivän tapahtumista
• Sitä, että kuljettajan on pitänyt suorittaa kansalaisuuden kielikoe
• Sitä, että kuljettaja kykenee kommunikoimaan asiakkaan kanssa siten, että asiakas pääsee turvallisesti oikeaan määränpäähänsä (Oikein)
**64. Jokaisen työsuhteessa olevan taksinkuljettajan velvollisuutena on täyttää kuljettajan ajopäiväkirjaa. Mitä ajopäiväkirjaan muun muassa merkitään?
• Työvuoron aloitus ja tauot (Oikein)
• Tauot ja niiden aikana nautittu ravinto
• Lyhyt selvitys työssä tapahtuneista ongelmatilanteista
**65. Yleinen hätänumero on:
• 118
• 119
• 112 (Oikein)
**66. Saat suuryrityksestä kyytiisi kiireisen toimitusjohtajan. Hän juoksee taksille ja huikkaa jo tullessaan, että hänellä on hirvittävä kiire, sillä tärkeä kokous alkaa jo 15 minuutin kuluttua. On iltapäivän ruuhka-aika ja matka on sen verran pitkä, että tiedät jo etukäteen, ettei sitä pysty millään ajamaan siinä ajassa. Kerrot tästä asiakkaalle, jolloin hän vaatii sinua ajamaan ylinopeutta. Asiakas lupautuu maksamaan mahdolliset ylinopeussakot. Kuinka toimit?
• Kerrot asiakkaalle, ettet voi ajaa ylinopeutta, mutta teet parhaasi, jotta hän pääse turvallisesti perille nopeinta mahdollista reittiä (Oikein)
• Toteat, että sopimus kuulostaa reilulta ja lähdet ajamaan kohti määränpäätä niin nopeasti kuin pystyt
• Toteat asiakkaalle, ettet voi ottaa häntä lainkaan kyytiin ja kutsut poliisit paikalle, sillä asiakas yllytti sinua rikokseen
**67. Ennakoivassa ajotavassa tärkeintä on:
• Osata toimia oikein onnettomuuden satuttua
• Taito toimia oikein vaaratilanteessa onnettomuuden välttämiseksi
• Pyrkimys ajaa niin, ettei joudu vaara- eikä onnettomuustilanteeseen (Oikein)
**68. Ajat vilkkaasti liikennöityä valtatietä kohti taksiasemaa. Yhtäkkiä huomaat kaukana edellä polkupyöräilijän horjahtavan, kaatuvan ja jäävän maahan makaamaan keskelle tietä liikkumattomana. Mikä on sinun ensimmäinen ensiaputoimenpiteesi?
• Hengitysteiden avaaminen
• Polkupyöräilijän tutkiminen mahdollisten murtumien ja verenvuotojen havaitsemiseksi
• Polkupyöräilijän siirtäminen turvallisempaan paikkaan (Oikein)
**69. Mikä seuraavista lisää eniten taksinkuljettajan loukkaantumisriskiä?
• Ajoneuvon huono tekninen kunto 
• Turvavyön käyttämättömyys (Oikein)
• Aggressiivisesti käyttäytyvät asiakkaat
**70. Kuinka kauan pitää odottaa rattijuopumukseen syyllistymisen jälkeen ennen kuin voi hakea taksin ajolupaa?
• Vuoden ajan
• Kolmen vuoden ajan
• Viiden vuoden ajan (Oikein)
**71. Taksinkuljettajan ajolupaa hakevan henkilön on täytettävä tietyt terveysvaatimukset. Näiden vaatimusten täytyminen osoitetaan:
• Lääkärintarkastuksella ja siitä saatavalla todistuksella taksinkuljettajan ajolupaa hakiessa (Oikein)
• Omalla kirjallisella terveydentilaa koskevalla raportilla
• Terveydentilaa ei tarvitse todistaa millään tavalla
**72. Taksinkuljettajan ajoluvan voi peruuttaa:
• Poliisi (Oikein)
• Taksin paikallisyhdistys
• Liikenne- ja viestintävirasto 
**73. Kuinka pitkään b-luokan ajo-oikeuden on pitänyt olla voimassa, jotta taksinkuljettajan ajolupa voidaan myöntää?
• Vähintään yhden vuoden ajan (Oikein)
• Vähintään kolmen vuoden ajan
• Vähintään viiden vuoden ajan
**74. Miten toimit, kun kyytiin tulee asiakas, joka ilmoittaa, ettei hän halua keskustella?
• Annat asiakkaan istua rauhassa kyydissä ja pyydät ainoastaan reittiin liittyviä tietoja (Oikein)
• Kuljettajan tulee osoittaa asiakkaalle, että tällä on huonot vuorovaikutustaidot kun hän ei halua keskustella
• Kuljettaja yrittää keskustella koko matkan ajan, sillä hänen pitää huolehtia keskustelun ylläpitämisestä
**75. Mikä viranomainen myöntää taksinkuljettajan ajoluvan?
• Poliisi
• Liikenne- ja viestintävirasto (Oikein)
• TE-toimisto
**76. Aino on aloittanut työvuoronsa klo 5.30 sillä hän on aina ollut aamuvirkku ihminen. Hänen aamunsa koostuu lähinnä muiden aamuvirkkujen kuljettamisesta työpaikalleen. Noin puoli kahdeksan aikaan hän aloittaa koululaisten kuljetukset. Aamu kuluu mielenkiintoisissa ja monipuolisissa tehtävissä yleensä erittäin nopeasti. Milloin Ainon on viimeistään pidettävä ensimmäinen tauko?
• Sitten kun hän tuntee itsensä väsyneeksi. Työaikalaki määrittelee, että jokainen tarkkailee jaksamistaan ja tauottaa työpäivänsä tarpeen mukaan
• Viimeistään klo 11, sillä kuljettajan yhtäjaksoinen työaika saa olla enintään 5,5 tuntia (Oikein)
• Viimeistään klo 10, sillä kuljettajan yhtäjaksoinen työaika saa olla enintään 4,5 tuntia 
**77. Saako taksinkuljettaja työskennellä yhtäjaksoisesti 15 tuntia?
• Kyllä, jos työtä ei voida muulla tavoin tarkoituksenmukaisesti järjestää
• Kyllä, jos kuljettaja itse haluaa (Oikein)
• Kyllä, jos työnantaja kuuluu taksityönantajien liittoon
**78. Millä maksuvälineillä asiakkaan on oikeus maksaa taksimatkansa, jos hän tulee taksiasemalta ilman etukäteen tehtyä tilausta?
• Asiakas voi maksaa matkansa ainoastaan käteisellä
• Kuljettajan tehtävänä on päättää käytettävä maksuväline
• Asiakkaalla on oikeus maksaa matkansa käteisellä tai yleisellä maksukortilla (Oikein)
**79. Laissa liikenteen palveluista on lueteltu erilaisia laatuvaatimuksia. Mikä seuraavista vaihtoehdoista pitää paikkaansa?
• Laatuvaatimukset koskevat ainoastaan taksiluvan haltijaa
• Laatuvaatimukset koskevat jokaista taksinkuljettajaa (Oikein)
• Laatuvaatimukset koskevat ainoastaan niitä yrittäjiä, joilla on enemmän kuin kaksi työntekijää vakituisessa työsuhteessa
**80. Milloin asiakkaalle tarvitsee tarjota kuitti taksikyydistä?
• Jos kyyti on tilattu applikaatiolla
• Jos kyydistä on sovittu kiinteä hinta
• Kyydistä on annettava aina kuitti (Oikein)
`;

// ... Parsintafunktio pysyy samana, mutta on siistitty debug-tulosteista ...
function parseQuestions(text) {
  const questions = [];
  
  // Etsitään kaikki kysymysblokit, jotka alkavat muotoilulla: **numero.
  // RegExp: \*\* vastaa tähtiä, \d+ numeroa, \. pistettä.
  const questionBlocks = text.split(/\*\*\d+\./).filter(block => block.trim());
  
  questionBlocks.forEach(block => {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length < 2) return; // Ohitetaan tyhjät tai rikkinäiset blokit
    
    // 1. Käsitellään kysymysteksti (ensimmäinen rivi)
    let questionText = lines[0].replace(/\*\*$/, '').trim();
    questionText = questionText.replace(/^\d+\.\s*/, ''); // Poistetaan mahdollinen tuplanumerointi
    
    // 2. Käsitellään vastausvaihtoehdot
    const options = [];
    let correctAnswer = null;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Tunnistetaan rivit, jotka alkavat luettelomerkillä (- tai •)
      if (line.startsWith('-') || line.startsWith('•')) {
        let option = line.replace(/^[-•]\s*/, '').trim();
        
        // Tunnistetaan oikea vastaus merkinnästä (Oikein)
        const isCorrect = option.includes('(Oikein)');
        
        if (isCorrect) {
          // Siistitään merkintä pois lopullisesta tekstistä
          option = option.replace('(Oikein)', '').trim();
          correctAnswer = option;
        }
        
        options.push(option);
      }
    }
    
    // 3. Validointi: Tallennetaan vain kelvolliset kysymykset
    if (questionText && options.length >= 2 && correctAnswer) {
      questions.push({
        questionText,
        options,
        correctAnswer,
        difficulty: 'medium', // Oletusarvo
        points: 1,            // Oletuspisteet
        published: true       // Julkaistaan heti
      });
    }
  });
  
  return questions;
}

const importQuestions = async () => {
  try {
    // Yhdistetään tietokantaan
    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      throw new Error("MONGODB_URI puuttuu .env-tiedostosta.");
    }

    console.log('🔗 Yhdistetään MongoDB:hen...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✅ Yhteys muodostettu.');

    console.log('📝 Parsitaan kysymyksiä...');
    const parsedQuestions = parseQuestions(rawData);
    
    if (parsedQuestions.length === 0) {
      throw new Error('Ei yhtään validia kysymystä löydetty raakadatasta.');
    }

    console.log(`✅ Parsittu ${parsedQuestions.length} kysymystä valmiiksi.`);
    console.log('⚠️  VAROITUS: Tämä skripti POISTAA kaikki vanhat kysymykset tietokannasta!');
    console.log('   Jatkaaksesi paina Enter. Peruuta painamalla Ctrl+C.');

    // Odotetaan käyttäjän vahvistusta
    await new Promise(resolve => process.stdin.once('data', resolve));

    // Tyhjennetään vanha kanta
    console.log('🗑️  Poistetaan vanhat kysymykset...');
    const deleteResult = await Question.deleteMany({});
    console.log(`✅ Poistettu ${deleteResult.deletedCount} kysymystä.`);

    // Tallennetaan uudet
    console.log('💾 Tallennetaan uusia kysymyksiä...');
    const insertResult = await Question.insertMany(parsedQuestions);
    console.log(`✅ Tietokantaan lisätty ${insertResult.length} kysymystä onnistuneesti.`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Virhe tuonnissa:', error.message);
    process.exit(1);
  }
};

importQuestions();