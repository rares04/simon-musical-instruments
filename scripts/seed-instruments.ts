import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supported locales
const locales = ['en', 'ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'] as const
type Locale = (typeof locales)[number]

// Instrument data with translations
const instruments = [
  {
    instrumentType: 'violin' as const,
    model: 'Stradivari',
    status: 'available' as const,
    stock: 1,
    price: 3500,
    year: 2024,
    image: 'professional-violin-front-view-on-white-background.jpg',
    specs: {
      bodyWood: 'Maple',
      topWood: 'European Spruce (cured since 2001)',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Dominant with Gold E',
      bodyLength: '356mm',
    },
    translations: {
      en: {
        title: 'Professional Concert Violin',
        luthierNotes:
          "This violin represents the culmination of traditional Transylvanian craftsmanship. The spruce top was selected from wood that began its natural curing process in 2001, allowing it to develop exceptional resonance properties. The maple back and sides provide brilliant projection while maintaining warmth. Each layer of varnish was hand-applied and allowed to cure naturally over several months, creating a finish that enhances rather than dampens the wood's natural voice. The instrument produces a warm, singing tone with excellent clarity across all registers, making it ideal for both solo and orchestral performance.",
      },
      ro: {
        title: 'Vioară Profesională de Concert',
        luthierNotes:
          'Această vioară reprezintă apogeul meșteșugului tradițional transilvănean. Capacul din molid a fost selectat din lemn care și-a început procesul natural de uscare în 2001, permițându-i să dezvolte proprietăți excepționale de rezonanță. Fundul și lateralele din arțar oferă o proiecție strălucitoare, menținând în același timp căldura sunetului. Fiecare strat de lac a fost aplicat manual și lăsat să se usuce natural timp de câteva luni, creând un finisaj care amplifică mai degrabă decât atenuează vocea naturală a lemnului. Instrumentul produce un ton cald, cântător, cu o claritate excelentă pe toate registrele, fiind ideal atât pentru performance solo, cât și orchestral.',
      },
      de: {
        title: 'Professionelle Konzertvioline',
        luthierNotes:
          'Diese Violine repräsentiert den Höhepunkt traditioneller siebenbürgischer Handwerkskunst. Die Fichtendecke wurde aus Holz ausgewählt, das seinen natürlichen Trocknungsprozess im Jahr 2001 begann, wodurch es außergewöhnliche Resonanzeigenschaften entwickeln konnte. Boden und Zargen aus Ahorn bieten brillante Projektion bei gleichzeitiger Wärme. Jede Lackschicht wurde von Hand aufgetragen und über mehrere Monate natürlich aushärten gelassen, wodurch ein Finish entsteht, das die natürliche Stimme des Holzes verstärkt statt dämpft. Das Instrument erzeugt einen warmen, singenden Ton mit ausgezeichneter Klarheit in allen Registern, ideal für Solo- und Orchesteraufführungen.',
      },
      fr: {
        title: 'Violon de Concert Professionnel',
        luthierNotes:
          "Ce violon représente l'aboutissement de l'artisanat traditionnel transylvanien. La table d'harmonie en épicéa a été sélectionnée parmi des bois ayant commencé leur processus de séchage naturel en 2001, lui permettant de développer des propriétés de résonance exceptionnelles. Le fond et les éclisses en érable offrent une projection brillante tout en conservant la chaleur. Chaque couche de vernis a été appliquée à la main et laissée à sécher naturellement pendant plusieurs mois, créant une finition qui amplifie plutôt qu'elle n'atténue la voix naturelle du bois. L'instrument produit un son chaud et chantant avec une excellente clarté sur tous les registres, idéal pour les performances solo et orchestrales.",
      },
      nl: {
        title: 'Professionele Concertviool',
        luthierNotes:
          'Deze viool vertegenwoordigt het hoogtepunt van traditioneel Transsylvanisch vakmanschap. De sparren bovenkant werd geselecteerd uit hout dat zijn natuurlijke droogproces begon in 2001, waardoor het uitzonderlijke resonantie-eigenschappen kon ontwikkelen. De esdoornhouten rug en zijkanten bieden briljante projectie met behoud van warmte. Elke laklaag werd met de hand aangebracht en mocht gedurende meerdere maanden natuurlijk uitharden, wat een afwerking creëert die de natuurlijke stem van het hout versterkt in plaats van dempt. Het instrument produceert een warme, zingende toon met uitstekende helderheid over alle registers, ideaal voor zowel solo- als orkestrale uitvoeringen.',
      },
      ja: {
        title: 'プロフェッショナル・コンサートヴァイオリン',
        luthierNotes:
          'このヴァイオリンは、トランシルヴァニアの伝統的な職人技の集大成です。スプルースの表板は、2001年から自然乾燥を始めた木材から選ばれ、卓越した共鳴特性を発達させました。メープルの裏板と側板は、温かみを保ちながら輝かしい投射力を提供します。各ニスの層は手作業で塗布され、数ヶ月かけて自然に硬化させることで、木材の自然な声を抑えるのではなく高める仕上がりを実現しました。この楽器は、すべての音域で優れた明瞭さを持つ温かく歌うような音色を生み出し、ソロとオーケストラの両方の演奏に最適です。',
      },
      ko: {
        title: '프로페셔널 콘서트 바이올린',
        luthierNotes:
          '이 바이올린은 트란실바니아 전통 장인 정신의 정점을 대표합니다. 스프루스 상판은 2001년부터 자연 건조 과정을 시작한 목재에서 선별되어 뛰어난 공명 특성을 발달시켰습니다. 메이플 뒷판과 측판은 따뜻함을 유지하면서 빛나는 투사력을 제공합니다. 각 니스 층은 손으로 도포되어 수개월에 걸쳐 자연 경화되어 목재의 자연스러운 소리를 억제하기보다 향상시키는 마감을 만들어냅니다. 이 악기는 모든 음역에서 뛰어난 명료함과 함께 따뜻하고 노래하는 듯한 음색을 생성하여 독주와 오케스트라 연주 모두에 이상적입니다.',
      },
      el: {
        title: 'Επαγγελματικό Βιολί Συναυλίας',
        luthierNotes:
          'Αυτό το βιολί αντιπροσωπεύει την κορύφωση της παραδοσιακής τρανσυλβανικής τεχνοτροπίας. Η ερυθρελάτη καπάκι επιλέχθηκε από ξύλο που ξεκίνησε τη φυσική του ξήρανση το 2001, επιτρέποντάς του να αναπτύξει εξαιρετικές ιδιότητες αντήχησης. Η πλάτη και τα πλαϊνά από σφένδαμο προσφέρουν λαμπρή προβολή διατηρώντας παράλληλα τη ζεστασιά. Κάθε στρώση βερνικιού εφαρμόστηκε χειροποίητα και αφέθηκε να στεγνώσει φυσικά για αρκετούς μήνες, δημιουργώντας ένα φινίρισμα που ενισχύει αντί να αποσβένει τη φυσική φωνή του ξύλου. Το όργανο παράγει έναν ζεστό, τραγουδιστό τόνο με εξαιρετική καθαρότητα σε όλα τα ρεπερτόρια.',
      },
    },
  },
  {
    instrumentType: 'cello' as const,
    model: 'Montagnana',
    status: 'available' as const,
    stock: 1,
    price: 8500,
    year: 2023,
    image: 'professional-cello-front-view-warm-wood.jpg',
    specs: {
      bodyWood: 'Flamed Maple',
      topWood: 'Alpine Spruce (aged since 2001)',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Larsen A&D, Spirocore G&C',
      bodyLength: '755mm',
    },
    translations: {
      en: {
        title: 'Master Series Cello',
        luthierNotes:
          "The Master Series Cello is a pinnacle achievement in our workshop. Crafted from premium Alpine spruce and flamed maple that has been naturally curing since 2001, this instrument offers unparalleled depth and resonance. The wood's extended aging has allowed the cellular structure to stabilize and open up, resulting in a voice that is both powerful and nuanced. The varnish was applied in thin layers over several months, each coat hand-rubbed and allowed to cure completely. This patient process creates a finish that protects the wood while allowing it to vibrate freely, producing a sound rich in overtones and capable of filling concert halls with effortless projection.",
      },
      ro: {
        title: 'Violoncel Seria Master',
        luthierNotes:
          'Violoncelul Seria Master reprezintă o realizare de vârf în atelierul nostru. Creat din molid alpin premium și arțar flăcărat care s-a uscat natural din 2001, acest instrument oferă o profunzime și rezonanță de neegalat. Îmbătrânirea extinsă a lemnului a permis structurii celulare să se stabilizeze și să se deschidă, rezultând o voce care este atât puternică, cât și nuanțată. Lacul a fost aplicat în straturi subțiri timp de câteva luni, fiecare strat frecat manual și lăsat să se usuce complet. Acest proces răbdător creează un finisaj care protejează lemnul, permițându-i în același timp să vibreze liber, producând un sunet bogat în armonice și capabil să umple sălile de concert cu o proiecție fără efort.',
      },
      de: {
        title: 'Meisterserie Cello',
        luthierNotes:
          'Das Meisterserie Cello ist eine Spitzenleistung unserer Werkstatt. Gefertigt aus erstklassiger Alpenfichte und geflammtem Ahorn, das seit 2001 natürlich getrocknet wurde, bietet dieses Instrument unvergleichliche Tiefe und Resonanz. Die verlängerte Alterung des Holzes hat es der Zellstruktur ermöglicht, sich zu stabilisieren und zu öffnen, was zu einer Stimme führt, die sowohl kraftvoll als auch nuanciert ist. Der Lack wurde über mehrere Monate in dünnen Schichten aufgetragen, wobei jede Schicht von Hand eingerieben und vollständig aushärten gelassen wurde. Dieser geduldige Prozess schafft ein Finish, das das Holz schützt und gleichzeitig frei schwingen lässt, wodurch ein obertonreicher Klang entsteht, der Konzertsäle mühelos füllen kann.',
      },
      fr: {
        title: 'Violoncelle Série Master',
        luthierNotes:
          "Le Violoncelle Série Master est une réalisation majeure de notre atelier. Fabriqué à partir d'épicéa alpin de première qualité et d'érable ondé séché naturellement depuis 2001, cet instrument offre une profondeur et une résonance inégalées. Le vieillissement prolongé du bois a permis à la structure cellulaire de se stabiliser et de s'ouvrir, produisant une voix à la fois puissante et nuancée. Le vernis a été appliqué en couches fines sur plusieurs mois, chaque couche frottée à la main et laissée à sécher complètement. Ce processus patient crée une finition qui protège le bois tout en lui permettant de vibrer librement, produisant un son riche en harmoniques capable de remplir les salles de concert sans effort.",
      },
      nl: {
        title: 'Meesterserie Cello',
        luthierNotes:
          'De Meesterserie Cello is een topprestatie van onze werkplaats. Vervaardigd uit premium Alpenspar en gevlamd esdoorn dat sinds 2001 natuurlijk is gedroogd, biedt dit instrument ongeëvenaarde diepte en resonantie. De verlengde veroudering van het hout heeft de celstructuur in staat gesteld te stabiliseren en te openen, resulterend in een stem die zowel krachtig als genuanceerd is. De lak werd in dunne lagen aangebracht over meerdere maanden, elke laag met de hand ingewreven en volledig laten uitharden. Dit geduldige proces creëert een afwerking die het hout beschermt terwijl het vrij kan trillen, wat een klank produceert die rijk is aan boventonen en concertzalen moeiteloos kan vullen.',
      },
      ja: {
        title: 'マスターシリーズ・チェロ',
        luthierNotes:
          'マスターシリーズ・チェロは、私たちの工房の最高傑作です。2001年から自然乾燥させたプレミアムアルプススプルースとフレイムメープルから作られたこの楽器は、比類のない深みと共鳴を提供します。木材の長期熟成により、細胞構造が安定し開放され、力強くかつ繊細な声を生み出しています。ニスは数ヶ月かけて薄い層で塗布され、各層は手で磨き込まれ、完全に硬化させました。この忍耐強いプロセスにより、木材を保護しながら自由に振動させる仕上がりが生まれ、倍音豊かで、コンサートホールを容易に満たすことができる音を生み出します。',
      },
      ko: {
        title: '마스터 시리즈 첼로',
        luthierNotes:
          '마스터 시리즈 첼로는 우리 공방의 정점을 이루는 작품입니다. 2001년부터 자연 건조된 프리미엄 알프스 스프루스와 플레임 메이플로 제작된 이 악기는 비교할 수 없는 깊이와 공명을 제공합니다. 목재의 장기 숙성은 세포 구조가 안정화되고 열리게 하여 강력하면서도 뉘앙스 있는 소리를 만들어냅니다. 니스는 수개월에 걸쳐 얇은 층으로 도포되었으며, 각 층은 손으로 문질러 완전히 경화되도록 했습니다. 이 인내심 있는 과정은 목재를 보호하면서 자유롭게 진동하게 하는 마감을 만들어내어, 배음이 풍부하고 콘서트홀을 수월하게 채울 수 있는 소리를 생산합니다.',
      },
      el: {
        title: 'Τσέλο Σειράς Master',
        luthierNotes:
          'Το Τσέλο Σειράς Master είναι μια κορυφαία επίτευξη του εργαστηρίου μας. Κατασκευασμένο από εξαιρετική αλπική ερυθρελάτη και φλογισμένο σφένδαμο που ξηραίνεται φυσικά από το 2001, αυτό το όργανο προσφέρει απαράμιλλο βάθος και αντήχηση. Η παρατεταμένη ωρίμανση του ξύλου επέτρεψε στην κυτταρική δομή να σταθεροποιηθεί και να ανοίξει, με αποτέλεσμα μια φωνή που είναι τόσο δυνατή όσο και αποχρωματισμένη. Το βερνίκι εφαρμόστηκε σε λεπτές στρώσεις για αρκετούς μήνες, κάθε στρώση τρίφτηκε με το χέρι και αφέθηκε να στεγνώσει πλήρως. Αυτή η υπομονετική διαδικασία δημιουργεί ένα φινίρισμα που προστατεύει το ξύλο ενώ του επιτρέπει να δονείται ελεύθερα.',
      },
    },
  },
  {
    instrumentType: 'violin' as const,
    model: 'Guarneri',
    status: 'sold' as const,
    stock: 0,
    price: 2200,
    year: 2024,
    image: 'violin-craftsmanship-warm-lighting.jpg',
    specs: {
      bodyWood: 'Maple',
      topWood: 'Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based',
      strings: 'Dominant',
      bodyLength: '356mm',
    },
    translations: {
      en: {
        title: 'Studio Violin No. 47',
        luthierNotes:
          'Studio Violin No. 47 was crafted for the advancing student or professional seeking excellent quality at an accessible price point. The instrument features our signature warm tone with surprising projection for its class. The carefully selected spruce and maple were aged naturally in our workshop, and the traditional varnish application gives it a beautiful golden-amber appearance. This violin has found its home with a promising young soloist in Vienna.',
      },
      ro: {
        title: 'Vioară de Studio Nr. 47',
        luthierNotes:
          'Vioara de Studio Nr. 47 a fost creată pentru studentul în progres sau profesionistul care caută o calitate excelentă la un preț accesibil. Instrumentul prezintă tonul nostru caracteristic cald, cu o proiecție surprinzătoare pentru clasa sa. Molidul și arțarul atent selectate au fost îmbătrânite natural în atelierul nostru, iar aplicarea tradițională a lacului îi conferă un aspect frumos auriu-chihlimbariu. Această vioară și-a găsit căminul la un tânăr solist promițător din Viena.',
      },
      de: {
        title: 'Studiovioline Nr. 47',
        luthierNotes:
          'Die Studiovioline Nr. 47 wurde für fortgeschrittene Studenten oder Profis geschaffen, die ausgezeichnete Qualität zu einem erschwinglichen Preis suchen. Das Instrument zeichnet sich durch unseren charakteristisch warmen Ton mit überraschender Projektion für seine Klasse aus. Die sorgfältig ausgewählte Fichte und der Ahorn wurden in unserer Werkstatt natürlich gealtert, und der traditionelle Lackauftrag verleiht ihr ein wunderschönes goldenes Bernstein-Aussehen. Diese Violine hat ihr Zuhause bei einem vielversprechenden jungen Solisten in Wien gefunden.',
      },
      fr: {
        title: 'Violon de Studio N° 47',
        luthierNotes:
          "Le Violon de Studio N° 47 a été conçu pour l'étudiant avancé ou le professionnel recherchant une excellente qualité à un prix accessible. L'instrument présente notre son chaud caractéristique avec une projection surprenante pour sa catégorie. L'épicéa et l'érable soigneusement sélectionnés ont été vieillis naturellement dans notre atelier, et l'application traditionnelle du vernis lui confère une belle apparence dorée-ambrée. Ce violon a trouvé sa maison auprès d'un jeune soliste prometteur à Vienne.",
      },
      nl: {
        title: 'Studioviool Nr. 47',
        luthierNotes:
          'Studioviool Nr. 47 werd vervaardigd voor de gevorderde student of professional die uitstekende kwaliteit zoekt tegen een toegankelijke prijs. Het instrument kenmerkt zich door onze kenmerkende warme toon met verrassende projectie voor zijn klasse. De zorgvuldig geselecteerde spar en esdoorn werden natuurlijk verouderd in onze werkplaats, en de traditionele laktoepassing geeft het een prachtige goudgele amber-uitstraling. Deze viool heeft zijn thuis gevonden bij een veelbelovende jonge solist in Wenen.',
      },
      ja: {
        title: 'スタジオヴァイオリン No. 47',
        luthierNotes:
          'スタジオヴァイオリン No. 47は、手頃な価格で優れた品質を求める上級学生やプロフェッショナルのために作られました。この楽器は、そのクラスにしては驚くべき投射力を持つ、私たちの特徴的な温かい音色を備えています。慎重に選ばれたスプルースとメープルは、私たちの工房で自然に熟成され、伝統的なニス塗装により美しい金琥珀色の外観を与えています。このヴァイオリンは、ウィーンの有望な若きソリストの元で新しい家を見つけました。',
      },
      ko: {
        title: '스튜디오 바이올린 No. 47',
        luthierNotes:
          '스튜디오 바이올린 No. 47은 합리적인 가격에 우수한 품질을 찾는 상급 학생이나 전문가를 위해 제작되었습니다. 이 악기는 그 등급에서 놀라운 투사력과 함께 우리의 시그니처 따뜻한 음색을 특징으로 합니다. 신중하게 선택된 스프루스와 메이플은 우리 공방에서 자연 숙성되었으며, 전통적인 니스 도포는 아름다운 황금 호박색 외관을 부여합니다. 이 바이올린은 비엔나의 유망한 젊은 솔리스트에게 새 집을 찾았습니다.',
      },
      el: {
        title: 'Βιολί Στούντιο Αρ. 47',
        luthierNotes:
          'Το Βιολί Στούντιο Αρ. 47 δημιουργήθηκε για τον προχωρημένο σπουδαστή ή επαγγελματία που αναζητά εξαιρετική ποιότητα σε προσιτή τιμή. Το όργανο διαθέτει τον χαρακτηριστικό μας ζεστό τόνο με εκπληκτική προβολή για την κατηγορία του. Η προσεκτικά επιλεγμένη ερυθρελάτη και ο σφένδαμος ωρίμασαν φυσικά στο εργαστήριό μας και η παραδοσιακή εφαρμογή βερνικιού του προσδίδει μια όμορφη χρυσή-κεχριμπαρένια εμφάνιση. Αυτό το βιολί βρήκε το σπίτι του σε έναν πολλά υποσχόμενο νεαρό σολίστ στη Βιέννη.',
      },
    },
  },
  {
    instrumentType: 'contrabass' as const,
    model: 'Busetto',
    status: 'available' as const,
    stock: 2,
    price: 12000,
    year: 2023,
    image: 'double-bass-contrabass-full-view.jpg',
    specs: {
      bodyWood: 'Willow',
      topWood: 'European Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Spirocore',
      bodyLength: '1120mm (3/4 size)',
      stringVibration: '1060mm',
    },
    translations: {
      en: {
        title: 'Grand Contrabass',
        luthierNotes:
          'Our Grand Contrabass is designed for the professional orchestral musician who demands both power and refinement. The willow back and sides provide exceptional resonance while keeping the weight manageable for extended playing. The European spruce top has been carefully graduated to produce a full-bodied sound with exceptional clarity in the upper registers. This instrument excels in both arco and pizzicato playing, making it equally suited for classical orchestral work and jazz performance.',
      },
      ro: {
        title: 'Contrabas Grand',
        luthierNotes:
          'Contrabasul nostru Grand este proiectat pentru muzicianul orchestral profesionist care cere atât putere, cât și rafinament. Fundul și lateralele din salcie oferă o rezonanță excepțională, menținând greutatea gestionabilă pentru cântat prelungit. Capacul din molid european a fost gradat cu grijă pentru a produce un sunet plin cu o claritate excepțională în registrele înalte. Acest instrument excelează atât în jocul arco, cât și pizzicato, fiind la fel de potrivit pentru lucrul orchestral clasic și performanța de jazz.',
      },
      de: {
        title: 'Grand Kontrabass',
        luthierNotes:
          'Unser Grand Kontrabass ist für den professionellen Orchestermusiker konzipiert, der sowohl Kraft als auch Raffinesse verlangt. Boden und Zargen aus Weide bieten außergewöhnliche Resonanz bei gleichzeitig handhabbarem Gewicht für längeres Spielen. Die europäische Fichtendecke wurde sorgfältig abgestuft, um einen vollmundigen Klang mit außergewöhnlicher Klarheit in den oberen Registern zu erzeugen. Dieses Instrument glänzt sowohl im Arco- als auch im Pizzicato-Spiel und eignet sich gleichermaßen für klassische Orchesterarbeit und Jazz-Performance.',
      },
      fr: {
        title: 'Contrebasse Grand',
        luthierNotes:
          "Notre Contrebasse Grand est conçue pour le musicien d'orchestre professionnel qui exige à la fois puissance et raffinement. Le fond et les éclisses en saule offrent une résonance exceptionnelle tout en maintenant un poids gérable pour un jeu prolongé. La table en épicéa européen a été soigneusement graduée pour produire un son corsé avec une clarté exceptionnelle dans les registres aigus. Cet instrument excelle tant en jeu arco qu'en pizzicato, le rendant également adapté au travail orchestral classique et à la performance jazz.",
      },
      nl: {
        title: 'Grand Contrabas',
        luthierNotes:
          'Onze Grand Contrabas is ontworpen voor de professionele orkestmusicus die zowel kracht als verfijning eist. De wilgenhouten rug en zijkanten bieden uitzonderlijke resonantie terwijl het gewicht beheersbaar blijft voor langdurig spelen. De Europese sparren bovenkant is zorgvuldig gegradueerd om een volle klank te produceren met uitzonderlijke helderheid in de hogere registers. Dit instrument excelleert in zowel arco- als pizzicatospel, waardoor het even geschikt is voor klassiek orkestwerk als jazzperformance.',
      },
      ja: {
        title: 'グランド・コントラバス',
        luthierNotes:
          '私たちのグランド・コントラバスは、パワーと洗練さの両方を求めるプロのオーケストラ奏者のために設計されています。柳の裏板と側板は、長時間の演奏でも扱いやすい重量を維持しながら、卓越した共鳴を提供します。ヨーロピアンスプルースの表板は、高音域で卓越した明瞭さを持つ豊かな音を生み出すよう慎重に厚みを調整されています。この楽器はアルコとピチカートの両方の演奏に優れており、クラシックオーケストラの仕事とジャズパフォーマンスに等しく適しています。',
      },
      ko: {
        title: '그랜드 콘트라베이스',
        luthierNotes:
          '우리의 그랜드 콘트라베이스는 파워와 세련됨 모두를 요구하는 프로 오케스트라 연주자를 위해 설계되었습니다. 버드나무 뒷판과 측판은 장시간 연주에도 관리 가능한 무게를 유지하면서 뛰어난 공명을 제공합니다. 유럽 스프루스 상판은 고음역에서 뛰어난 명료함과 함께 풍성한 소리를 내도록 세심하게 두께가 조절되었습니다. 이 악기는 아르코와 피치카토 연주 모두에서 뛰어나며, 클래식 오케스트라 작업과 재즈 연주에 모두 적합합니다.',
      },
      el: {
        title: 'Μεγάλο Κοντραμπάσο',
        luthierNotes:
          'Το Μεγάλο Κοντραμπάσο μας είναι σχεδιασμένο για τον επαγγελματία ορχηστρικό μουσικό που απαιτεί τόσο δύναμη όσο και φινέτσα. Η πλάτη και τα πλαϊνά από ιτιά προσφέρουν εξαιρετική αντήχηση διατηρώντας το βάρος διαχειρίσιμο για παρατεταμένο παίξιμο. Το καπάκι από ευρωπαϊκή ερυθρελάτη έχει βαθμονομηθεί προσεκτικά για να παράγει έναν πλούσιο ήχο με εξαιρετική καθαρότητα στα υψηλά ρεπερτόρια. Αυτό το όργανο διαπρέπει τόσο στο παίξιμο arco όσο και pizzicato.',
      },
    },
  },
  {
    instrumentType: 'viola' as const,
    model: 'Gasparo da Salò',
    status: 'available' as const,
    stock: 1,
    price: 4200,
    year: 2024,
    image: 'viola-instrument-wood-grain.jpg',
    specs: {
      bodyWood: 'Flamed Maple',
      topWood: 'Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based',
      strings: 'Dominant',
      bodyLength: '394mm (15.5")',
    },
    translations: {
      en: {
        title: 'Chamber Viola',
        luthierNotes:
          'The Chamber Viola was designed specifically for the demands of intimate ensemble playing while maintaining the projection needed for solo work. At 15.5 inches, it offers a comfortable playing experience without sacrificing the deep, rich tone that defines a fine viola. The flamed maple back showcases exceptional figure, and the spruce top responds beautifully across all dynamics. This instrument particularly excels in the middle register, producing the warm, vocal quality that chamber musicians prize.',
      },
      ro: {
        title: 'Violă de Cameră',
        luthierNotes:
          'Viola de Cameră a fost proiectată special pentru cerințele jocului de ansamblu intim, menținând în același timp proiecția necesară pentru lucrul solo. La 15,5 inci, oferă o experiență de cântat confortabilă fără a sacrifica tonul profund și bogat care definește o violă fină. Fundul din arțar flăcărat prezintă o figură excepțională, iar capacul din molid răspunde frumos pe toate dinamicile. Acest instrument excelează în special în registrul mediu, producând calitatea caldă, vocală pe care muzicienii de cameră o prețuiesc.',
      },
      de: {
        title: 'Kammerbratsche',
        luthierNotes:
          'Die Kammerbratsche wurde speziell für die Anforderungen des intimen Ensemblespiels entwickelt und behält gleichzeitig die für Soloarbeit benötigte Projektion. Mit 15,5 Zoll bietet sie ein komfortables Spielerlebnis ohne den tiefen, reichen Ton zu opfern, der eine feine Bratsche auszeichnet. Der geflammte Ahornboden zeigt außergewöhnliche Maserung, und die Fichtendecke reagiert wunderschön über alle Dynamiken. Dieses Instrument glänzt besonders im mittleren Register und erzeugt die warme, vokale Qualität, die Kammermusiker schätzen.',
      },
      fr: {
        title: 'Alto de Chambre',
        luthierNotes:
          "L'Alto de Chambre a été conçu spécifiquement pour les exigences du jeu d'ensemble intime tout en maintenant la projection nécessaire pour le travail solo. À 15,5 pouces, il offre une expérience de jeu confortable sans sacrifier le ton profond et riche qui définit un alto fin. Le fond en érable ondé présente une figure exceptionnelle, et la table en épicéa répond magnifiquement à toutes les dynamiques. Cet instrument excelle particulièrement dans le registre médium, produisant la qualité chaude et vocale que les musiciens de chambre apprécient.",
      },
      nl: {
        title: 'Kameraltviool',
        luthierNotes:
          'De Kameraltviool werd specifiek ontworpen voor de eisen van intiem ensemblespel terwijl de projectie behouden blijft die nodig is voor solowerk. Met 15,5 inch biedt het een comfortabele speelervaring zonder de diepe, rijke toon op te offeren die een fijne altviool definieert. De gevlamde esdoornhouten rug toont uitzonderlijke figuur, en de sparren bovenkant reageert prachtig op alle dynamieken. Dit instrument excelleert bijzonder in het middenregister en produceert de warme, vocale kwaliteit die kamermusici waarderen.',
      },
      ja: {
        title: '室内楽ヴィオラ',
        luthierNotes:
          '室内楽ヴィオラは、ソロ演奏に必要な投射力を維持しながら、親密なアンサンブル演奏の要求に特化して設計されました。15.5インチで、優れたヴィオラを特徴づける深く豊かな音色を犠牲にすることなく、快適な演奏体験を提供します。フレイムメープルの裏板は卓越した杢目を示し、スプルースの表板はすべてのダイナミクスで美しく反応します。この楽器は特に中音域で優れており、室内楽奏者が大切にする温かくボーカルのような質感を生み出します。',
      },
      ko: {
        title: '체임버 비올라',
        luthierNotes:
          '체임버 비올라는 독주 작업에 필요한 투사력을 유지하면서 친밀한 앙상블 연주의 요구에 맞게 특별히 설계되었습니다. 15.5인치로, 훌륭한 비올라를 정의하는 깊고 풍부한 음색을 희생하지 않으면서 편안한 연주 경험을 제공합니다. 플레임 메이플 뒷판은 뛰어난 무늬를 보여주고, 스프루스 상판은 모든 다이내믹에서 아름답게 반응합니다. 이 악기는 특히 중음역에서 뛰어나며, 실내악 연주자들이 소중히 여기는 따뜻하고 성악적인 품질을 생산합니다.',
      },
      el: {
        title: 'Βιόλα Μουσικής Δωματίου',
        luthierNotes:
          'Η Βιόλα Μουσικής Δωματίου σχεδιάστηκε ειδικά για τις απαιτήσεις του οικείου συνολικού παιξίματος διατηρώντας παράλληλα την προβολή που απαιτείται για σόλο εργασία. Στις 15,5 ίντσες, προσφέρει μια άνετη εμπειρία παιξίματος χωρίς να θυσιάζει τον βαθύ, πλούσιο τόνο που ορίζει μια εξαιρετική βιόλα. Η φλογισμένη σφενδάμινη πλάτη παρουσιάζει εξαιρετικό σχέδιο και η ερυθρελάτη ανταποκρίνεται όμορφα σε όλες τις δυναμικές. Αυτό το όργανο διαπρέπει ιδιαίτερα στο μεσαίο ρεπερτόριο.',
      },
    },
  },
  {
    instrumentType: 'violin' as const,
    model: 'Stradivari',
    status: 'sold' as const,
    stock: 0,
    price: 5800,
    year: 2022,
    image: 'vintage-violin-detailed-craftsmanship.jpg',
    specs: {
      bodyWood: "Bird's Eye Maple",
      topWood: 'Italian Spruce (Dolomites)',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, antiqued finish',
      strings: 'Evah Pirazzi Gold',
      bodyLength: '356mm',
    },
    translations: {
      en: {
        title: 'Heritage Violin No. 23',
        luthierNotes:
          "Heritage Violin No. 23 represents our finest work, featuring exceptional bird's eye maple and Italian spruce sourced from the Dolomites. This instrument was two years in the making, with extended aging between each stage of construction. The result is a violin with extraordinary tonal complexity—bright and focused for solo passages, yet warm and blending for ensemble work. It was awarded First Prize at the 2022 Romanian Luthier Competition and now resides with a concertmaster in Bucharest.",
      },
      ro: {
        title: 'Vioară Heritage Nr. 23',
        luthierNotes:
          'Vioara Heritage Nr. 23 reprezintă cea mai bună lucrare a noastră, prezentând arțar ochi de pasăre excepțional și molid italian provenit din Dolomiți. Acest instrument a fost realizat în doi ani, cu îmbătrânire extinsă între fiecare etapă de construcție. Rezultatul este o vioară cu o complexitate tonală extraordinară—strălucitoare și focalizată pentru pasajele solo, dar caldă și amestecată pentru lucrul de ansamblu. A fost premiată cu Premiul I la Concursul Românesc de Luterie 2022 și acum locuiește la un concert-maestru din București.',
      },
      de: {
        title: 'Heritage Violine Nr. 23',
        luthierNotes:
          'Die Heritage Violine Nr. 23 repräsentiert unser bestes Werk mit außergewöhnlichem Vogelaugen-Ahorn und italienischer Fichte aus den Dolomiten. Dieses Instrument war zwei Jahre in der Entstehung, mit verlängerter Alterung zwischen jeder Bauphase. Das Ergebnis ist eine Violine mit außerordentlicher tonaler Komplexität—hell und fokussiert für Solopassagen, aber warm und verschmelzend für Ensemblearbeit. Sie wurde mit dem ersten Preis beim Rumänischen Geigenbauerwettbewerb 2022 ausgezeichnet und befindet sich jetzt bei einem Konzertmeister in Bukarest.',
      },
      fr: {
        title: 'Violon Heritage N° 23',
        luthierNotes:
          "Le Violon Heritage N° 23 représente notre meilleur travail, présentant un érable moucheté exceptionnel et de l'épicéa italien provenant des Dolomites. Cet instrument a nécessité deux ans de fabrication, avec un vieillissement prolongé entre chaque étape de construction. Le résultat est un violon d'une complexité tonale extraordinaire—brillant et focalisé pour les passages solo, mais chaud et fondu pour le travail d'ensemble. Il a remporté le Premier Prix au Concours Roumain de Lutherie 2022 et réside maintenant chez un violon solo à Bucarest.",
      },
      nl: {
        title: 'Heritage Viool Nr. 23',
        luthierNotes:
          'De Heritage Viool Nr. 23 vertegenwoordigt ons beste werk, met uitzonderlijk vogeloog-esdoorn en Italiaanse spar uit de Dolomieten. Dit instrument was twee jaar in de maak, met verlengde veroudering tussen elke bouwfase. Het resultaat is een viool met buitengewone tonale complexiteit—helder en gefocust voor solopassages, maar warm en mengend voor ensemblewerk. Het werd bekroond met de Eerste Prijs bij de Roemeense Vioolbouwwedstrijd 2022 en verblijft nu bij een concertmeester in Boekarest.',
      },
      ja: {
        title: 'ヘリテージヴァイオリン No. 23',
        luthierNotes:
          'ヘリテージヴァイオリン No. 23は、ドロミテから調達した卓越したバーズアイメープルとイタリアンスプルースを特徴とする、私たちの最高傑作です。この楽器は製作に2年を要し、各建造段階の間に長期熟成を行いました。その結果、ソロパッセージでは明るく集中し、アンサンブル演奏では温かくブレンドする、驚異的な音色の複雑さを持つヴァイオリンが生まれました。2022年ルーマニア弦楽器製作コンクールで第一位を獲得し、現在はブカレストのコンサートマスターのもとにあります。',
      },
      ko: {
        title: '헤리티지 바이올린 No. 23',
        luthierNotes:
          '헤리티지 바이올린 No. 23은 돌로미테에서 조달한 뛰어난 버즈아이 메이플과 이탈리안 스프루스를 특징으로 하는 우리의 최고 작품을 대표합니다. 이 악기는 제작에 2년이 걸렸으며, 각 건조 단계 사이에 장기 숙성이 이루어졌습니다. 그 결과 독주 패시지에서는 밝고 집중되며, 앙상블 연주에서는 따뜻하고 어우러지는 놀라운 음색의 복잡성을 가진 바이올린이 탄생했습니다. 2022년 루마니아 현악기 제작 대회에서 1등상을 수상했으며, 현재 부쿠레슈티의 악장에게 있습니다.',
      },
      el: {
        title: 'Κληρονομικό Βιολί Αρ. 23',
        luthierNotes:
          'Το Κληρονομικό Βιολί Αρ. 23 αντιπροσωπεύει την καλύτερη δουλειά μας, διαθέτοντας εξαιρετικό σφένδαμο ματιού πουλιού και ιταλική ερυθρελάτη από τους Δολομίτες. Αυτό το όργανο χρειάστηκε δύο χρόνια για να κατασκευαστεί, με παρατεταμένη ωρίμανση μεταξύ κάθε σταδίου κατασκευής. Το αποτέλεσμα είναι ένα βιολί με εξαιρετική τονική πολυπλοκότητα—φωτεινό και εστιασμένο για σόλο περάσματα, αλλά ζεστό και αναμιγνυόμενο για εργασία συνόλου. Βραβεύτηκε με το Πρώτο Βραβείο στον Ρουμανικό Διαγωνισμό Οργανοποιών 2022.',
      },
    },
  },
  {
    instrumentType: 'cello' as const,
    model: 'Stradivari',
    status: 'available' as const,
    stock: 1,
    price: 6500,
    year: 2024,
    image: 'cello-dark-wood-professional.jpg',
    specs: {
      bodyWood: 'European Maple',
      topWood: 'Carpathian Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Larsen',
      bodyLength: '755mm',
    },
    translations: {
      en: {
        title: 'Professional Cello No. 12',
        luthierNotes:
          'Professional Cello No. 12 was built for the working musician who needs a reliable, beautiful-sounding instrument for daily performance. The European maple and Carpathian spruce combination produces a balanced tone across all registers, with particular strength in the singing upper positions. The traditional varnish has a warm amber color that will continue to develop character with years of playing. This cello responds equally well to aggressive bow strokes and the most delicate pianissimo.',
      },
      ro: {
        title: 'Violoncel Profesional Nr. 12',
        luthierNotes:
          'Violoncelul Profesional Nr. 12 a fost construit pentru muzicianul activ care are nevoie de un instrument de încredere, cu sunet frumos pentru performanța zilnică. Combinația de arțar european și molid carpatic produce un ton echilibrat pe toate registrele, cu o putere deosebită în pozițiile superioare cântătoare. Lacul tradițional are o culoare caldă de chihlimbar care va continua să dezvolte caracter cu anii de cântat. Acest violoncel răspunde la fel de bine la loviturile agresive de arcuș și la cele mai delicate pianissimo.',
      },
      de: {
        title: 'Professionelles Cello Nr. 12',
        luthierNotes:
          'Das Professionelle Cello Nr. 12 wurde für den arbeitenden Musiker gebaut, der ein zuverlässiges, schön klingendes Instrument für die tägliche Performance benötigt. Die Kombination aus europäischem Ahorn und Karpatenfichte erzeugt einen ausgewogenen Ton über alle Register, mit besonderer Stärke in den singenden oberen Positionen. Der traditionelle Lack hat eine warme Bernsteinfarbe, die mit Jahren des Spielens weiter Charakter entwickeln wird. Dieses Cello reagiert gleichermaßen gut auf aggressive Bogenstriche und das zarteste Pianissimo.',
      },
      fr: {
        title: 'Violoncelle Professionnel N° 12',
        luthierNotes:
          "Le Violoncelle Professionnel N° 12 a été construit pour le musicien actif qui a besoin d'un instrument fiable et au beau son pour la performance quotidienne. La combinaison d'érable européen et d'épicéa des Carpates produit un ton équilibré sur tous les registres, avec une force particulière dans les positions aiguës chantantes. Le vernis traditionnel a une couleur ambrée chaude qui continuera à développer du caractère avec les années de jeu. Ce violoncelle répond également bien aux coups d'archet agressifs et au pianissimo le plus délicat.",
      },
      nl: {
        title: 'Professionele Cello Nr. 12',
        luthierNotes:
          'Professionele Cello Nr. 12 werd gebouwd voor de werkende musicus die een betrouwbaar, mooi klinkend instrument nodig heeft voor dagelijkse optredens. De combinatie van Europees esdoorn en Karpaten-spar produceert een gebalanceerde toon over alle registers, met bijzondere kracht in de zingende hogere posities. De traditionele lak heeft een warme amberkleur die zich met jaren van spelen verder zal ontwikkelen. Deze cello reageert even goed op agressieve strijkstreken als op de meest delicate pianissimo.',
      },
      ja: {
        title: 'プロフェッショナル・チェロ No. 12',
        luthierNotes:
          'プロフェッショナル・チェロ No. 12は、毎日の演奏に信頼できる美しい音のする楽器を必要とするプロの音楽家のために作られました。ヨーロピアンメープルとカルパチアスプルースの組み合わせは、すべての音域でバランスの取れた音色を生み出し、特に歌うような高いポジションで強さを発揮します。伝統的なニスは温かい琥珀色で、演奏年数とともに個性を発展させ続けます。このチェロは、積極的なボウストロークと最もデリケートなピアニッシモの両方に等しくよく反応します。',
      },
      ko: {
        title: '프로페셔널 첼로 No. 12',
        luthierNotes:
          '프로페셔널 첼로 No. 12는 일상적인 연주를 위해 신뢰할 수 있고 아름다운 소리의 악기가 필요한 전문 연주자를 위해 제작되었습니다. 유럽 메이플과 카르파티아 스프루스의 조합은 모든 음역에서 균형 잡힌 음색을 생성하며, 특히 노래하는 듯한 고음 포지션에서 강점을 보입니다. 전통적인 니스는 따뜻한 호박색을 가지고 있으며 연주 년수와 함께 개성을 계속 발전시킬 것입니다. 이 첼로는 공격적인 활 스트로크와 가장 섬세한 피아니시모 모두에 동등하게 잘 반응합니다.',
      },
      el: {
        title: 'Επαγγελματικό Τσέλο Αρ. 12',
        luthierNotes:
          'Το Επαγγελματικό Τσέλο Αρ. 12 κατασκευάστηκε για τον ενεργό μουσικό που χρειάζεται ένα αξιόπιστο, όμορφα ηχητικό όργανο για καθημερινές παραστάσεις. Ο συνδυασμός ευρωπαϊκού σφενδάμου και καρπαθιανής ερυθρελάτης παράγει έναν ισορροπημένο τόνο σε όλα τα ρεπερτόρια, με ιδιαίτερη δύναμη στις τραγουδιστικές υψηλές θέσεις. Το παραδοσιακό βερνίκι έχει ένα ζεστό κεχριμπαρένιο χρώμα που θα συνεχίσει να αναπτύσσει χαρακτήρα με τα χρόνια παιξίματος. Αυτό το τσέλο ανταποκρίνεται εξίσου καλά σε επιθετικές κινήσεις δοξαριού και στο πιο λεπτό pianissimo.',
      },
    },
  },
  {
    instrumentType: 'contrabass' as const,
    model: 'Gamba',
    status: 'sold' as const,
    stock: 0,
    price: 9800,
    year: 2023,
    image: 'upright-bass-concert-hall.jpg',
    specs: {
      bodyWood: 'Willow',
      topWood: 'Engelmann Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based',
      strings: 'Spirocore Solo',
      bodyLength: '1120mm (3/4 size)',
      stringVibration: '1040mm',
    },
    translations: {
      en: {
        title: 'Concert Contrabass',
        luthierNotes:
          'The Concert Contrabass was commissioned by a principal bassist of a major European orchestra and built to their specifications. The combination of willow body and Engelmann spruce top produces exceptional clarity even in the lowest registers, with powerful projection that cuts through a full orchestra. After two years of heavy professional use, the instrument has developed even greater complexity and depth. This bass has found a new home with an orchestral musician in Germany.',
      },
      ro: {
        title: 'Contrabas de Concert',
        luthierNotes:
          'Contrabasul de Concert a fost comandat de un basist principal al unei orchestre europene majore și construit conform specificațiilor sale. Combinația dintre corpul din salcie și capacul din molid Engelmann produce o claritate excepțională chiar și în registrele cele mai joase, cu o proiecție puternică care străbate o orchestră completă. După doi ani de utilizare profesională intensă, instrumentul a dezvoltat o complexitate și profunzime și mai mari. Acest bas și-a găsit un nou cămin la un muzician orchestral din Germania.',
      },
      de: {
        title: 'Konzert-Kontrabass',
        luthierNotes:
          'Der Konzert-Kontrabass wurde von einem Solobassisten eines großen europäischen Orchesters in Auftrag gegeben und nach seinen Spezifikationen gebaut. Die Kombination aus Weidenkörper und Engelmann-Fichtendecke erzeugt außergewöhnliche Klarheit selbst in den tiefsten Registern, mit kraftvoller Projektion, die durch ein volles Orchester schneidet. Nach zwei Jahren intensiver professioneller Nutzung hat das Instrument noch größere Komplexität und Tiefe entwickelt. Dieser Bass hat ein neues Zuhause bei einem Orchestermusiker in Deutschland gefunden.',
      },
      fr: {
        title: 'Contrebasse de Concert',
        luthierNotes:
          "La Contrebasse de Concert a été commandée par un contrebassiste solo d'un grand orchestre européen et construite selon ses spécifications. La combinaison du corps en saule et de la table en épicéa Engelmann produit une clarté exceptionnelle même dans les registres les plus graves, avec une projection puissante qui traverse un orchestre complet. Après deux ans d'utilisation professionnelle intensive, l'instrument a développé une complexité et une profondeur encore plus grandes. Cette contrebasse a trouvé un nouveau foyer auprès d'un musicien d'orchestre en Allemagne.",
      },
      nl: {
        title: 'Concert Contrabas',
        luthierNotes:
          'De Concert Contrabas werd in opdracht gemaakt door een solo-bassist van een groot Europees orkest en gebouwd volgens zijn specificaties. De combinatie van wilgenhouten body en Engelmann-sparren bovenkant produceert uitzonderlijke helderheid zelfs in de laagste registers, met krachtige projectie die door een volledig orkest snijdt. Na twee jaar intensief professioneel gebruik heeft het instrument nog grotere complexiteit en diepte ontwikkeld. Deze bas heeft een nieuw thuis gevonden bij een orkestmusicus in Duitsland.',
      },
      ja: {
        title: 'コンサート・コントラバス',
        luthierNotes:
          'コンサート・コントラバスは、大規模なヨーロッパのオーケストラの首席奏者からの依頼を受け、彼らの仕様に合わせて製作されました。柳のボディとエンゲルマンスプルースのトップの組み合わせは、最低音域でも卓越した明瞭さを生み出し、フルオーケストラを貫く力強い投射力を持っています。2年間のハードなプロフェッショナルユースの後、この楽器はさらに大きな複雑さと深みを発達させました。このベースはドイツのオーケストラ奏者のもとで新しい家を見つけました。',
      },
      ko: {
        title: '콘서트 콘트라베이스',
        luthierNotes:
          '콘서트 콘트라베이스는 주요 유럽 오케스트라의 수석 베이시스트의 의뢰로 그의 사양에 맞춰 제작되었습니다. 버드나무 바디와 엥겔만 스프루스 상판의 조합은 가장 낮은 음역에서도 뛰어난 명료함을 생성하며, 풀 오케스트라를 관통하는 강력한 투사력을 가지고 있습니다. 2년간의 집중적인 전문적 사용 후, 이 악기는 더욱 큰 복잡성과 깊이를 발전시켰습니다. 이 베이스는 독일의 오케스트라 연주자에게 새 집을 찾았습니다.',
      },
      el: {
        title: 'Κοντραμπάσο Συναυλίας',
        luthierNotes:
          'Το Κοντραμπάσο Συναυλίας παραγγέλθηκε από έναν σόλο μπασίστα μιας μεγάλης ευρωπαϊκής ορχήστρας και κατασκευάστηκε σύμφωνα με τις προδιαγραφές του. Ο συνδυασμός του σώματος από ιτιά και του καπακιού από Engelmann ερυθρελάτη παράγει εξαιρετική καθαρότητα ακόμη και στα χαμηλότερα ρεπερτόρια, με ισχυρή προβολή που διαπερνά μια πλήρη ορχήστρα. Μετά από δύο χρόνια εντατικής επαγγελματικής χρήσης, το όργανο έχει αναπτύξει ακόμη μεγαλύτερη πολυπλοκότητα και βάθος. Αυτό το μπάσο βρήκε ένα νέο σπίτι σε έναν ορχηστρικό μουσικό στη Γερμανία.',
      },
    },
  },
]

async function seed() {
  console.log('🌱 Starting seed with localized content...')

  const payload = await getPayload({ config })

  // Delete existing data for fresh seed (order matters due to foreign keys)
  console.log('🗑️  Clearing existing data...')

  // Delete orders first (they reference instruments)
  const existingOrders = await payload.find({
    collection: 'orders',
    limit: 100,
  })

  for (const order of existingOrders.docs) {
    await payload.delete({
      collection: 'orders',
      id: order.id,
    })
  }
  console.log(`   Deleted ${existingOrders.docs.length} orders`)

  // Then delete instruments
  const existingInstruments = await payload.find({
    collection: 'instruments',
    limit: 100,
  })

  for (const instrument of existingInstruments.docs) {
    await payload.delete({
      collection: 'instruments',
      id: instrument.id,
    })
  }
  console.log(`   Deleted ${existingInstruments.docs.length} instruments`)

  // Finally delete media
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 100,
  })

  for (const media of existingMedia.docs) {
    await payload.delete({
      collection: 'media',
      id: media.id,
    })
  }
  console.log(`   Deleted ${existingMedia.docs.length} media files`)

  const publicDir = path.resolve(__dirname, '../public/seed')

  for (const instrument of instruments) {
    const englishTitle = instrument.translations.en.title
    console.log(`📦 Creating: ${englishTitle}`)

    // Upload the image first
    const imagePath = path.join(publicDir, instrument.image)

    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠️ Image not found: ${instrument.image}, skipping...`)
      continue
    }

    // Read the file
    const fileBuffer = fs.readFileSync(imagePath)
    const file = {
      name: instrument.image,
      data: fileBuffer,
      mimetype: 'image/jpeg',
      size: fileBuffer.length,
    }

    // Create media
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: englishTitle,
      },
      file,
    })

    console.log(`   📷 Uploaded image: ${media.id}`)

    // Create instrument with English (default locale)
    // Skip auto-translate hook since we have manual translations
    const createdInstrument = await payload.create({
      collection: 'instruments',
      locale: 'en',
      data: {
        title: instrument.translations.en.title,
        instrumentType: instrument.instrumentType,
        model: instrument.model,
        status: instrument.status,
        stock: instrument.stock ?? 1,
        price: instrument.price,
        year: instrument.year,
        mainImage: media.id,
        luthierNotes: instrument.translations.en.luthierNotes,
        specs: instrument.specs,
      },
      context: {
        skipAutoTranslate: true,
      },
    })

    console.log(`   ✅ Created instrument (EN): ${createdInstrument.id}`)

    // Add translations for other locales
    const otherLocales = locales.filter((l) => l !== 'en') as Locale[]

    for (const locale of otherLocales) {
      const translation = instrument.translations[locale]
      if (translation) {
        await payload.update({
          collection: 'instruments',
          id: createdInstrument.id,
          locale: locale,
          data: {
            title: translation.title,
            luthierNotes: translation.luthierNotes,
          },
          context: {
            skipAutoTranslate: true,
          },
        })
        console.log(`   🌍 Added ${locale.toUpperCase()} translation`)
      }
    }
  }

  console.log('\n🎉 Seed complete with all translations!')
  console.log('   Languages: EN, RO, DE, FR, NL, JA, KO, EL')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
