import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'blisko.state.v1';

const COLORS = {
  bg: '#07100D',
  panel: '#0D1915',
  panel2: '#11231C',
  line: '#20362C',
  text: '#F3F7F4',
  muted: '#91A79B',
  gold: '#D8B76A',
  green: '#6ED39A',
  blue: '#78A7FF',
  red: '#F27A7A',
};

const SCRIPTURES = [
  { ref: 'Ps 23', title: 'Zaufanie', reflection: 'Nie musisz znać całej drogi. Wystarczy kolejny krok wykonany z zaufaniem.' },
  { ref: 'Mt 6, 25–34', title: 'Bez lęku o jutro', reflection: 'Oddaj Bogu to, czego dziś nie jesteś w stanie kontrolować.' },
  { ref: 'J 15, 1–11', title: 'Trwanie', reflection: 'Relacja rośnie przez obecność, nie przez perfekcję.' },
  { ref: 'Flp 4, 4–9', title: 'Pokój', reflection: 'Zauważ, czym karmisz dziś swoje myśli i co możesz powierzyć Bogu.' },
  { ref: 'Rz 12, 9–21', title: 'Dobro w praktyce', reflection: 'Wybierz dziś jedną konkretną sytuację, w której odpowiesz dobrem.' },
  { ref: 'Łk 15, 11–32', title: 'Powrót', reflection: 'Bóg nie czeka na idealny moment. Możesz wrócić teraz.' },
  { ref: 'Mt 5, 1–12', title: 'Błogosławieństwa', reflection: 'Siła nie zawsze wygląda jak przewaga. Czasem wygląda jak łagodność.' },
  { ref: 'Ps 139', title: 'Być poznanym', reflection: 'Nie musisz udawać przed Bogiem. Zacznij modlitwę od prawdy.' },
  { ref: 'Jk 1, 19–27', title: 'Słuchać i robić', reflection: 'Wiara staje się realna wtedy, gdy przechodzi w działanie.' },
  { ref: '1 Kor 13, 1–13', title: 'Miłość', reflection: 'Pomyśl, komu dzisiaj najbardziej potrzebna jest od Ciebie cierpliwość.' },
  { ref: 'Ps 46', title: 'Cisza', reflection: 'Nie każdą rzecz trzeba od razu rozwiązać. Czasem trzeba najpierw się zatrzymać.' },
  { ref: 'Łk 10, 38–42', title: 'Jedna rzecz potrzebna', reflection: 'Zobacz, czy nie próbujesz dziś zrobić wszystkiego kosztem obecności.' },
  { ref: 'Mt 11, 28–30', title: 'Odpoczynek', reflection: 'Możesz przynieść Bogu także zmęczenie, nie tylko dobre wyniki.' },
  { ref: 'Prz 3, 5–6', title: 'Prowadzenie', reflection: 'Nie opieraj całego bezpieczeństwa na tym, że wszystko rozumiesz.' },
  { ref: 'Ef 4, 25–32', title: 'Nowy sposób reagowania', reflection: 'Jedna dobra reakcja może zmienić klimat całego dnia.' },
  { ref: 'Kol 3, 12–17', title: 'Wdzięczność', reflection: 'Wdzięczność nie neguje problemów. Pomaga zobaczyć także dobro.' },
  { ref: 'Ps 121', title: 'Pomoc', reflection: 'Nie musisz nieść wszystkiego sam.' },
  { ref: 'Mk 4, 35–41', title: 'Burza', reflection: 'Lęk może być głośny. To nie znaczy, że ma ostatnie słowo.' },
  { ref: 'J 8, 1–11', title: 'Miłosierdzie', reflection: 'Prawda i miłosierdzie nie muszą się wykluczać.' },
  { ref: 'Mi 6, 8', title: 'Prosto', reflection: 'Dziś nie potrzebujesz wielkiego gestu. Wystarczy uczciwość, dobro i pokora.' },
  { ref: 'Ps 27', title: 'Odwaga', reflection: 'Nie czekaj, aż zniknie każdy lęk. Możesz działać pomimo niego.' },
  { ref: 'Mt 7, 24–27', title: 'Fundament', reflection: 'To, co powtarzasz codziennie, buduje więcej niż pojedynczy zryw.' },
  { ref: 'Łk 6, 27–36', title: 'Miłość trudna', reflection: 'Najbardziej wartościowe dobro często kosztuje najwięcej ego.' },
  { ref: 'Ga 5, 22–26', title: 'Owoce', reflection: 'Sprawdź dziś nie tylko co osiągnąłeś, ale jakim człowiekiem byłeś.' },
  { ref: 'Ps 51', title: 'Szczerość', reflection: 'Przyznanie się do błędu może być początkiem zmiany, nie końcem.' },
  { ref: 'J 13, 1–17', title: 'Służba', reflection: 'Zrób dziś coś dobrego, czego nikt nie musi zauważyć.' },
  { ref: '2 Kor 12, 7–10', title: 'Słabość', reflection: 'Nie każda słabość przekreśla drogę. Czasem uczy zależności od Boga.' },
  { ref: 'Ps 103', title: 'Pamiętać dobro', reflection: 'Przypomnij sobie dziś jedną rzecz, za którą naprawdę chcesz podziękować.' },
  { ref: 'Mt 18, 21–35', title: 'Przebaczenie', reflection: 'Przebaczenie nie zawsze usuwa konsekwencje, ale może zatrzymać łańcuch krzywdy.' },
  { ref: 'J 14, 1–7', title: 'Niech się nie trwoży serce', reflection: 'Gdy robi się chaotycznie, wróć do tego, co naprawdę jest fundamentem.' },
  { ref: 'Ps 130', title: 'Czekanie', reflection: 'Nie każda odpowiedź przychodzi szybko. Czekanie też może być częścią wiary.' },
  { ref: 'Łk 18, 9–14', title: 'Pokora', reflection: 'Modlitwa nie potrzebuje wizerunku. Potrzebuje prawdy.' },
  { ref: 'Rz 8, 31–39', title: 'Nadzieja', reflection: 'Nie oceniaj całej historii po jednym trudnym rozdziale.' },
  { ref: 'Mt 25, 31–40', title: 'Dobro dla drugiego', reflection: 'Relacja z Bogiem sprawdza się także w tym, jak traktujesz ludzi.' },
  { ref: 'Ps 34', title: 'Bliskość', reflection: 'Możesz przyjść do Boga również wtedy, gdy jesteś rozbity.' },
  { ref: 'J 21, 15–19', title: 'Nowy początek', reflection: 'Błąd nie musi mieć ostatniego słowa. Ważne jest, co zrobisz dalej.' },
  { ref: 'Hbr 12, 1–3', title: 'Wytrwałość', reflection: 'Nie patrz tylko na tempo. Patrz, czy nadal idziesz w dobrym kierunku.' },
  { ref: 'Ps 90', title: 'Mądrość dnia', reflection: 'Dzień jest ograniczony. Wybierz dobrze, czemu dziś oddasz uwagę.' },
  { ref: 'Mt 22, 34–40', title: 'Najważniejsze', reflection: 'Miłość do Boga i człowieka porządkuje resztę.' },
  { ref: 'Jk 4, 6–10', title: 'Zbliżyć się', reflection: 'Nie musisz czekać na idealny nastrój, żeby zrobić krok w stronę Boga.' },
];

const defaultState = {
  days: {},
  intentions: [],
  questions: [],
};

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function prettyDate(key) {
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
}

function scriptureForDay() {
  const epoch = new Date('2026-01-01T12:00:00');
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const days = Math.floor((now - epoch) / 86400000);
  return SCRIPTURES[((days % SCRIPTURES.length) + SCRIPTURES.length) % SCRIPTURES.length];
}

function makeDay() {
  return {
    morningPrayer: '',
    dailyAction: '',
    gratitudes: ['', '', ''],
    eveningThank: '',
    eveningGood: '',
    eveningHard: '',
    tomorrowTrust: '',
  };
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Label({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

function PrimaryButton({ title, onPress, disabled = false }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryButton, disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function SmallButton({ title, onPress, danger = false }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.smallButton, danger && styles.smallDanger, pressed && styles.pressed]}>
      <Text style={[styles.smallButtonText, danger && styles.smallDangerText]}>{title}</Text>
    </Pressable>
  );
}

export default function App() {
  const [state, setState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState('today');
  const [newIntention, setNewIntention] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);

  const [silenceMinutes, setSilenceMinutes] = useState(5);
  const [silenceSeconds, setSilenceSeconds] = useState(5 * 60);
  const [silenceRunning, setSilenceRunning] = useState(false);
  const [silenceModal, setSilenceModal] = useState(false);
  const intervalRef = useRef(null);

  const dayKey = todayKey();
  const day = state.days[dayKey] || makeDay();
  const scripture = useMemo(() => scriptureForDay(), [dayKey]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            days: parsed.days || {},
            intentions: parsed.intentions || [],
            questions: parsed.questions || [],
          });
        }
      } catch (e) {
        console.warn('Nie udało się wczytać danych', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) => console.warn('Nie udało się zapisać danych', e));
  }, [state, hydrated]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function updateDay(patch) {
    setState((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dayKey]: { ...makeDay(), ...(prev.days[dayKey] || {}), ...patch },
      },
    }));
  }

  function updateGratitude(index, value) {
    const list = [...(day.gratitudes || ['', '', ''])];
    list[index] = value;
    updateDay({ gratitudes: list });
  }

  function addIntention() {
    const text = newIntention.trim();
    if (!text) return;
    setState((prev) => ({
      ...prev,
      intentions: [
        { id: `${Date.now()}-${Math.random()}`, text, status: 'active', createdAt: new Date().toISOString() },
        ...prev.intentions,
      ],
    }));
    setNewIntention('');
  }

  function toggleIntention(id) {
    setState((prev) => ({
      ...prev,
      intentions: prev.intentions.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'active' ? 'answered' : 'active', closedAt: item.status === 'active' ? new Date().toISOString() : null }
          : item
      ),
    }));
  }

  function deleteIntention(id) {
    setState((prev) => ({ ...prev, intentions: prev.intentions.filter((item) => item.id !== id) }));
  }

  function addQuestion() {
    const text = newQuestion.trim();
    if (!text) return;
    setState((prev) => ({
      ...prev,
      questions: [{ id: `${Date.now()}-${Math.random()}`, text, createdAt: new Date().toISOString() }, ...prev.questions],
    }));
    setNewQuestion('');
  }

  function deleteQuestion(id) {
    setState((prev) => ({ ...prev, questions: prev.questions.filter((item) => item.id !== id) }));
  }

  function chooseSilence(minutes) {
    if (silenceRunning) return;
    setSilenceMinutes(minutes);
    setSilenceSeconds(minutes * 60);
  }

  function startSilence() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSilenceSeconds(silenceMinutes * 60);
    setSilenceRunning(true);
    setSilenceModal(true);
    intervalRef.current = setInterval(() => {
      setSilenceSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setSilenceRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopSilence() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setSilenceRunning(false);
    setSilenceModal(false);
    setSilenceSeconds(silenceMinutes * 60);
  }

  const silenceText = `${String(Math.floor(silenceSeconds / 60)).padStart(2, '0')}:${String(silenceSeconds % 60).padStart(2, '0')}`;

  const completedDays = Object.entries(state.days)
    .filter(([, d]) => {
      const g = (d.gratitudes || []).some((x) => x.trim());
      return d.morningPrayer?.trim() || d.dailyAction?.trim() || g || d.eveningThank?.trim() || d.eveningGood?.trim() || d.eveningHard?.trim() || d.tomorrowTrust?.trim();
    })
    .sort((a, b) => b[0].localeCompare(a[0]));

  function TodayScreen() {
    return (
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>DZISIAJ • {prettyDate(dayKey).toUpperCase()}</Text>
        <Text style={styles.title}>Zacznij od obecności.</Text>
        <Text style={styles.subtitle}>Nie musisz robić wszystkiego. Wystarczy szczera chwila.</Text>

        <Card style={styles.scriptureCard}>
          <Text style={styles.scriptureRef}>{scripture.ref}</Text>
          <Text style={styles.scriptureTitle}>{scripture.title}</Text>
          <Text style={styles.scriptureReflection}>{scripture.reflection}</Text>
          <Text style={styles.scriptureHint}>Przeczytaj ten fragment w swojej Biblii lub aplikacji biblijnej.</Text>
        </Card>

        <Card>
          <Label>PORANNA MODLITWA WŁASNYMI SŁOWAMI</Label>
          <TextInput
            value={day.morningPrayer}
            onChangeText={(v) => updateDay({ morningPrayer: v })}
            placeholder="Co dziś chcesz powiedzieć Bogu?"
            placeholderTextColor={COLORS.muted}
            multiline
            style={styles.textarea}
          />
        </Card>

        <Card>
          <Label>JEDEN KROK NA DZIŚ</Label>
          <Text style={styles.helper}>Nie wynik. Jedna konkretna rzecz, którą chcesz dziś przeżyć lepiej.</Text>
          <TextInput
            value={day.dailyAction}
            onChangeText={(v) => updateDay({ dailyAction: v })}
            placeholder="Np. odpowiem spokojnie zamiast impulsywnie"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </Card>

        <Card>
          <Label>WDZIĘCZNOŚĆ</Label>
          <Text style={styles.helper}>Wystarczy jedna rzecz. Pozostałe możesz dopisać wieczorem.</Text>
          <TextInput
            value={(day.gratitudes || ['', '', ''])[0]}
            onChangeText={(v) => updateGratitude(0, v)}
            placeholder="Dziś dziękuję za..."
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </Card>

        <Pressable onPress={() => setTab('silence')} style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}>
          <View>
            <Text style={styles.linkTitle}>Chwila ciszy</Text>
            <Text style={styles.linkSubtitle}>5, 10 albo 15 minut bez pośpiechu.</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
      </ScrollView>
    );
  }

  function IntentionsScreen() {
    const active = state.intentions.filter((x) => x.status === 'active');
    const answered = state.intentions.filter((x) => x.status === 'answered');
    return (
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>INTENCJE</Text>
        <Text style={styles.title}>To, co chcesz powierzyć.</Text>
        <Text style={styles.subtitle}>Nie chodzi o liczbę. Zapisz to, do czego chcesz wracać w modlitwie.</Text>

        <Card>
          <Label>NOWA INTENCJA</Label>
          <TextInput
            value={newIntention}
            onChangeText={setNewIntention}
            placeholder="Za kogo lub o co chcesz się modlić?"
            placeholderTextColor={COLORS.muted}
            multiline
            style={styles.textareaSmall}
          />
          <PrimaryButton title="Dodaj intencję" onPress={addIntention} disabled={!newIntention.trim()} />
        </Card>

        <Text style={styles.sectionTitle}>W modlitwie</Text>
        {active.length === 0 ? <Text style={styles.empty}>Nie masz jeszcze zapisanych intencji.</Text> : null}
        {active.map((item) => (
          <Card key={item.id}>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.meta}>Dodano {new Date(item.createdAt).toLocaleDateString('pl-PL')}</Text>
            <View style={styles.rowWrap}>
              <SmallButton title="Oznacz jako wysłuchaną / zamkniętą" onPress={() => toggleIntention(item.id)} />
              <SmallButton title="Usuń" danger onPress={() => deleteIntention(item.id)} />
            </View>
          </Card>
        ))}

        {answered.length > 0 ? <Text style={styles.sectionTitle}>Zamknięte / wysłuchane</Text> : null}
        {answered.map((item) => (
          <Card key={item.id} style={styles.dimCard}>
            <Text style={styles.itemText}>{item.text}</Text>
            <View style={styles.rowWrap}>
              <SmallButton title="Przywróć" onPress={() => toggleIntention(item.id)} />
              <SmallButton title="Usuń" danger onPress={() => deleteIntention(item.id)} />
            </View>
          </Card>
        ))}
      </ScrollView>
    );
  }

  function JournalScreen() {
    return (
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>DZIENNIK</Text>
        <Text style={styles.title}>Zamknij dzień bez osądzania.</Text>
        <Text style={styles.subtitle}>Zauważ dobro, nazwij słabość i oddaj jutro Bogu.</Text>

        <Card>
          <Label>3 RZECZY, ZA KTÓRE DZIĘKUJĘ</Label>
          {(day.gratitudes || ['', '', '']).map((value, index) => (
            <TextInput
              key={index}
              value={value}
              onChangeText={(v) => updateGratitude(index, v)}
              placeholder={`${index + 1}. Dziękuję za...`}
              placeholderTextColor={COLORS.muted}
              style={[styles.input, index < 2 && styles.inputGap]}
            />
          ))}
        </Card>

        <Card>
          <Label>ZA CO DZIŚ DZIĘKUJĘ BOGU?</Label>
          <TextInput value={day.eveningThank} onChangeText={(v) => updateDay({ eveningThank: v })} placeholder="Jedna rzecz, która była dziś dobra..." placeholderTextColor={COLORS.muted} multiline style={styles.textareaSmall} />
        </Card>

        <Card>
          <Label>GDZIE DZIŚ ZROBIŁEM DOBRO?</Label>
          <TextInput value={day.eveningGood} onChangeText={(v) => updateDay({ eveningGood: v })} placeholder="Co warto zachować?" placeholderTextColor={COLORS.muted} multiline style={styles.textareaSmall} />
        </Card>

        <Card>
          <Label>GDZIE ZABRAKŁO MI MIŁOŚCI, CIERPLIWOŚCI LUB PRAWDY?</Label>
          <TextInput value={day.eveningHard} onChangeText={(v) => updateDay({ eveningHard: v })} placeholder="Bez tłumaczenia się. Po prostu szczerze." placeholderTextColor={COLORS.muted} multiline style={styles.textareaSmall} />
        </Card>

        <Card>
          <Label>CO POWIERZAM BOGU NA JUTRO?</Label>
          <TextInput value={day.tomorrowTrust} onChangeText={(v) => updateDay({ tomorrowTrust: v })} placeholder="Co nie musi już dziś zostać rozwiązane?" placeholderTextColor={COLORS.muted} multiline style={styles.textareaSmall} />
        </Card>

        <SmallButton title={historyOpen ? 'Ukryj historię' : 'Pokaż historię'} onPress={() => setHistoryOpen((x) => !x)} />
        {historyOpen ? (
          <View style={styles.historyWrap}>
            {completedDays.length === 0 ? <Text style={styles.empty}>Historia pojawi się, gdy zapiszesz pierwsze refleksje.</Text> : null}
            {completedDays.slice(0, 30).map(([key, d]) => (
              <Card key={key} style={styles.historyCard}>
                <Text style={styles.historyDate}>{prettyDate(key)}</Text>
                {d.dailyAction?.trim() ? <Text style={styles.historyLine}>Krok: {d.dailyAction}</Text> : null}
                {(d.gratitudes || []).filter((x) => x.trim()).length ? <Text style={styles.historyLine}>Wdzięczność: {(d.gratitudes || []).filter((x) => x.trim()).join(' • ')}</Text> : null}
                {d.eveningGood?.trim() ? <Text style={styles.historyLine}>Dobro: {d.eveningGood}</Text> : null}
                {d.eveningHard?.trim() ? <Text style={styles.historyLine}>Do poprawy: {d.eveningHard}</Text> : null}
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>
    );
  }

  function SilenceScreen() {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>CISZA</Text>
        <Text style={styles.title}>Nie musisz nic produkować.</Text>
        <Text style={styles.subtitle}>Usiądź. Oddychaj spokojnie. Bądź obecny przed Bogiem.</Text>

        <Card style={styles.silenceCard}>
          <Text style={styles.silenceBig}>{silenceMinutes} min</Text>
          <Text style={styles.helperCenter}>Bez punktów, bez streaka, bez oceny.</Text>
          <View style={styles.minuteRow}>
            {[5, 10, 15].map((m) => (
              <Pressable key={m} onPress={() => chooseSilence(m)} style={[styles.minuteChip, silenceMinutes === m && styles.minuteChipActive]}>
                <Text style={[styles.minuteChipText, silenceMinutes === m && styles.minuteChipTextActive]}>{m} min</Text>
              </Pressable>
            ))}
          </View>
          <PrimaryButton title="Rozpocznij ciszę" onPress={startSilence} />
        </Card>

        <Card>
          <Label>PROSTA WSKAZÓWKA</Label>
          <Text style={styles.itemText}>Gdy myśli uciekają, nie walcz z nimi. Zauważ je i spokojnie wróć do obecności.</Text>
        </Card>
      </ScrollView>
    );
  }

  function QuestionsScreen() {
    return (
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>PYTANIA</Text>
        <Text style={styles.title}>Nie wszystko musisz rozumieć od razu.</Text>
        <Text style={styles.subtitle}>Zapisuj pytania do Boga, wiary, siebie i życia. Nie musisz od razu znać odpowiedzi.</Text>

        <Card>
          <Label>NOWE PYTANIE</Label>
          <TextInput value={newQuestion} onChangeText={setNewQuestion} placeholder="Co jest teraz dla Ciebie niejasne lub trudne?" placeholderTextColor={COLORS.muted} multiline style={styles.textareaSmall} />
          <PrimaryButton title="Zapisz pytanie" onPress={addQuestion} disabled={!newQuestion.trim()} />
        </Card>

        {state.questions.length === 0 ? <Text style={styles.empty}>Nie masz jeszcze zapisanych pytań.</Text> : null}
        {state.questions.map((item) => (
          <Card key={item.id}>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.meta}>{new Date(item.createdAt).toLocaleDateString('pl-PL')}</Text>
            <SmallButton title="Usuń" danger onPress={() => deleteQuestion(item.id)} />
          </Card>
        ))}
      </ScrollView>
    );
  }

  const screens = {
    today: <TodayScreen />,
    intentions: <IntentionsScreen />,
    journal: <JournalScreen />,
    silence: <SilenceScreen />,
    questions: <QuestionsScreen />,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>BLISKO</Text>
            <Text style={styles.brandSub}>modlitwa • Pismo • wdzięczność • cisza</Text>
          </View>
        </View>

        <View style={styles.flex}>{screens[tab]}</View>

        <View style={styles.nav}>
          {[
            ['today', 'Dziś'],
            ['intentions', 'Intencje'],
            ['journal', 'Dziennik'],
            ['silence', 'Cisza'],
            ['questions', 'Pytania'],
          ].map(([key, label]) => (
            <Pressable key={key} onPress={() => setTab(key)} style={styles.navItem}>
              <View style={[styles.navDot, tab === key && styles.navDotActive]} />
              <Text style={[styles.navText, tab === key && styles.navTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </KeyboardAvoidingView>

      <Modal visible={silenceModal} animationType="fade" transparent={false} onRequestClose={stopSilence}>
        <SafeAreaView style={styles.silenceModal}>
          <Text style={styles.modalEyebrow}>CISZA PRZED BOGIEM</Text>
          <Text style={styles.modalTimer}>{silenceText}</Text>
          <Text style={styles.modalText}>{silenceSeconds === 0 ? 'Nie spiesz się z końcem.' : 'Nie musisz niczego udowadniać.'}</Text>
          <Pressable onPress={stopSilence} style={styles.modalStop}>
            <Text style={styles.modalStopText}>{silenceSeconds === 0 ? 'Zakończ' : 'Przerwij'}</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  topBar: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  brand: { color: COLORS.gold, fontSize: 24, fontWeight: '900', letterSpacing: 2.5 },
  brandSub: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  scroll: { padding: 20, paddingBottom: 120 },
  eyebrow: { color: COLORS.gold, fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: COLORS.text, fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 20 },
  card: { backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, padding: 18, marginBottom: 14 },
  scriptureCard: { borderColor: '#4A4024', backgroundColor: '#111A14' },
  scriptureRef: { color: COLORS.gold, fontSize: 14, fontWeight: '900', letterSpacing: 0.8 },
  scriptureTitle: { color: COLORS.text, fontSize: 24, fontWeight: '900', marginTop: 8 },
  scriptureReflection: { color: COLORS.text, fontSize: 16, lineHeight: 24, marginTop: 10 },
  scriptureHint: { color: COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 14 },
  label: { color: COLORS.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginBottom: 10 },
  helper: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  helperCenter: { color: COLORS.muted, fontSize: 12, textAlign: 'center', marginBottom: 18 },
  input: { backgroundColor: '#08120E', borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, color: COLORS.text, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  inputGap: { marginBottom: 10 },
  textarea: { minHeight: 120, backgroundColor: '#08120E', borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, color: COLORS.text, padding: 14, fontSize: 15, textAlignVertical: 'top' },
  textareaSmall: { minHeight: 88, backgroundColor: '#08120E', borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, color: COLORS.text, padding: 14, fontSize: 15, textAlignVertical: 'top', marginBottom: 12 },
  primaryButton: { backgroundColor: COLORS.gold, borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  primaryButtonText: { color: '#151209', fontSize: 14, fontWeight: '900' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
  smallButton: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, alignSelf: 'flex-start', marginTop: 10, marginRight: 8 },
  smallButtonText: { color: COLORS.text, fontSize: 12, fontWeight: '800' },
  smallDanger: { borderColor: '#553030' },
  smallDangerText: { color: COLORS.red },
  linkCard: { backgroundColor: COLORS.panel2, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linkTitle: { color: COLORS.text, fontWeight: '900', fontSize: 17 },
  linkSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  arrow: { color: COLORS.gold, fontSize: 24, fontWeight: '900' },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '900', marginTop: 10, marginBottom: 10 },
  empty: { color: COLORS.muted, fontSize: 13, lineHeight: 19, marginBottom: 14 },
  itemText: { color: COLORS.text, fontSize: 15, lineHeight: 22 },
  meta: { color: COLORS.muted, fontSize: 11, marginTop: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  dimCard: { opacity: 0.78 },
  historyWrap: { marginTop: 14 },
  historyCard: { backgroundColor: '#0A1511' },
  historyDate: { color: COLORS.gold, fontWeight: '900', marginBottom: 8 },
  historyLine: { color: COLORS.text, fontSize: 13, lineHeight: 19, marginTop: 4 },
  silenceCard: { alignItems: 'stretch', paddingVertical: 26 },
  silenceBig: { color: COLORS.text, fontSize: 52, fontWeight: '900', textAlign: 'center', letterSpacing: -1.5 },
  minuteRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
  minuteChip: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 5 },
  minuteChipActive: { borderColor: COLORS.gold, backgroundColor: '#1D1A0F' },
  minuteChipText: { color: COLORS.muted, fontWeight: '800' },
  minuteChipTextActive: { color: COLORS.gold },
  nav: { height: 72, borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: '#08110E', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: Platform.OS === 'android' ? 4 : 0 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  navDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#31483D', marginBottom: 6 },
  navDotActive: { backgroundColor: COLORS.gold },
  navText: { color: COLORS.muted, fontSize: 10, fontWeight: '800' },
  navTextActive: { color: COLORS.text },
  silenceModal: { flex: 1, backgroundColor: '#030806', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalEyebrow: { color: COLORS.gold, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  modalTimer: { color: COLORS.text, fontSize: 86, fontWeight: '900', letterSpacing: -3, marginTop: 18 },
  modalText: { color: COLORS.muted, fontSize: 15, marginTop: 10, textAlign: 'center' },
  modalStop: { marginTop: 50, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  modalStopText: { color: COLORS.text, fontWeight: '900' },
});
