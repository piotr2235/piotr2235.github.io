import React, { useState } from 'react';
import { GamePhase, Player, GameData } from './types';
import { generateGameData } from './services/ai';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { 
  Users, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  BrainCircuit,
  Fingerprint,
  List,
  Settings,
  Check,
  EyeOff,
  MessageSquareOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Helper to generate IDs safely in any environment
const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const CATEGORIES = [
  "Zwierzęta",
  "Jedzenie",
  "Kraje",
  "Znane Osoby",
  "Filmy",
  "Przedmioty Domowe",
  "Sport",
  "Zawody",
  "Pojazdy",
  "Miasta",
  "Marki",
  "Technologia",
  "Wydarzenia Historyczne",
  "Rośliny",
  "Ubrania"
];

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameData, setGameData] = useState<GameData | null>(null);
  
  // Game Config
  const [imposterCount, setImposterCount] = useState(1);
  const [namesInput, setNamesInput] = useState("");
  
  // New Configs
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORIES]);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [imposterHideCategory, setImposterHideCategory] = useState(false);
  const [imposterHideHint, setImposterHideHint] = useState(false);
  
  // Game State
  const [currentPlayerReveal, setCurrentPlayerReveal] = useState<Player | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);

  // --- Setup Phase ---
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namesInput.trim()) return;
    
    const newPlayer: Player = {
      id: generateId(),
      name: namesInput.trim(),
      isImposter: false,
      hasSeenRole: false
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    setNamesInput("");
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const toggleAllCategories = (select: boolean) => {
    if (select) {
      setSelectedCategories([...CATEGORIES]);
    } else {
      setSelectedCategories([]);
    }
  };

  const startGame = async () => {
    if (players.length < 3) {
      alert("Potrzeba co najmniej 3 graczy!");
      return;
    }

    if (imposterCount >= players.length) {
      alert("Zbyt wielu oszustów!");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Wybierz przynajmniej jedną kategorię!");
      return;
    }
    
    setPhase(GamePhase.LOADING);
    
    // Assign imposters
    const shuffledIndices = [...Array(players.length).keys()]
      .sort(() => 0.5 - Math.random());
    
    const imposterIndices = shuffledIndices.slice(0, imposterCount);
    
    const updatedPlayers = players.map((p, idx) => ({
      ...p,
      isImposter: imposterIndices.includes(idx),
      hasSeenRole: false
    }));
    
    setPlayers(updatedPlayers);

    // Pick Random Category from Selection
    const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];

    // Fetch AI data
    try {
      const data = await generateGameData(randomCategory);
      setGameData(data);
      setPhase(GamePhase.REVEAL);
    } catch (err) {
      console.error(err);
      alert("Nie udało się rozpocząć gry. Sprawdź połączenie.");
      setPhase(GamePhase.SETUP);
    }
  };

  // --- Reveal Phase ---
  const selectPlayerForReveal = (player: Player) => {
    if (player.hasSeenRole) return;
    setCurrentPlayerReveal(player);
    setRevealOpen(false);
  };

  const markSeen = () => {
    if (!currentPlayerReveal) return;
    
    setPlayers(prev => prev.map(p => 
      p.id === currentPlayerReveal.id ? { ...p, hasSeenRole: true } : p
    ));
    setCurrentPlayerReveal(null);
    setRevealOpen(false);

    // Check if all seen
    const allSeen = players.every(p => 
      (p.id === currentPlayerReveal.id) ? true : p.hasSeenRole
    );
    
    if (allSeen) {
      setPhase(GamePhase.PLAYING);
    }
  };

  const resetGame = () => {
    setPhase(GamePhase.SETUP);
    setPlayers([]);
    setGameData(null);
    setImposterCount(1);
    setRevealOpen(false);
    setCurrentPlayerReveal(null);
  };

  // --- Render Helpers ---
  const getImposterCountOptions = () => {
    const maxImposters = Math.max(1, Math.floor((players.length - 1) / 2)); 
    const options = [];
    for (let i = 1; i <= maxImposters; i++) {
      options.push(i);
    }
    if (options.length === 0) return [1];
    return options;
  };

  return (
    <div className="min-h-screen bg-neon-dark text-white p-4 md:p-8 relative overflow-hidden font-sans selection:bg-neon-pink selection:text-white pb-16">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple mb-2 neon-text tracking-wider">
            INPOSTOR
          </h1>
          <p className="text-neon-blue/60 font-display tracking-widest text-sm uppercase">
            Znajdź oszusta • Ukryj prawdę
          </p>
        </header>

        {/* SETUP PHASE */}
        {phase === GamePhase.SETUP && (
          <div className="space-y-6">
            <Card title="Lobby">
              <form onSubmit={handleAddPlayer} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={namesInput}
                  onChange={(e) => setNamesInput(e.target.value)}
                  placeholder="Imię gracza..."
                  className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-colors text-lg"
                />
                <Button type="submit" disabled={!namesInput.trim()}>
                  <Users size={20} />
                </Button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar mb-4">
                {players.length === 0 && (
                  <p className="text-gray-500 text-center italic py-4">
                    Brak graczy. Dodaj kogoś!
                  </p>
                )}
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg border border-white/5 hover:border-neon-blue/30 transition-all animate-fade-in">
                    <span className="font-medium">{player.name}</span>
                    <button 
                      onClick={() => removePlayer(player.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Settings size={16} className="rotate-45" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Fingerprint size={16} />
                  Liczba Oszustów
                </label>
                <select 
                  value={imposterCount}
                  onChange={(e) => setImposterCount(Number(e.target.value))}
                  className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-colors text-white"
                >
                  {getImposterCountOptions().map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Oszust' : 'Oszustów'}</option>
                  ))}
                </select>
              </div>
            </Card>

            <Card title="Konfiguracja Gry">
              {/* Category Selector */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowCategoryList(!showCategoryList)}
                  className="w-full flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <List size={18} className="text-neon-blue" />
                    <span>Kategorie ({selectedCategories.length})</span>
                  </span>
                  {showCategoryList ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showCategoryList && (
                  <div className="mt-2 bg-black/20 rounded-lg p-4 border border-white/10 animate-fade-in">
                    <div className="flex gap-2 mb-4">
                      <button 
                        onClick={() => toggleAllCategories(true)}
                        className="text-xs bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue px-3 py-1.5 rounded transition-colors"
                      >
                        Zaznacz wszystko
                      </button>
                      <button 
                        onClick={() => toggleAllCategories(false)}
                        className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded transition-colors"
                      >
                        Odznacz wszystko
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`text-left px-3 py-2 rounded text-sm transition-all flex items-center justify-between ${
                            selectedCategories.includes(cat)
                              ? 'bg-neon-blue/20 text-white border border-neon-blue/50'
                              : 'bg-white/5 text-gray-500 border border-transparent hover:border-gray-600'
                          }`}
                        >
                          {cat}
                          {selectedCategories.includes(cat) && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Impostor Handicaps */}
              <div>
                <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Settings size={14} /> Utrudnienia dla Oszusta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setImposterHideCategory(!imposterHideCategory)}
                    className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${
                      imposterHideCategory 
                        ? 'bg-neon-pink/20 border-neon-pink text-white shadow-[0_0_10px_rgba(255,0,255,0.2)]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <EyeOff size={20} className={imposterHideCategory ? 'text-neon-pink' : 'text-gray-500'} />
                    <div className="text-left">
                      <div className="font-bold text-sm">Ukryj Kategorię</div>
                      <div className="text-xs opacity-70">Oszust nie widzi tematu</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setImposterHideHint(!imposterHideHint)}
                    className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${
                      imposterHideHint 
                        ? 'bg-neon-pink/20 border-neon-pink text-white shadow-[0_0_10px_rgba(255,0,255,0.2)]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <MessageSquareOff size={20} className={imposterHideHint ? 'text-neon-pink' : 'text-gray-500'} />
                    <div className="text-left">
                      <div className="font-bold text-sm">Brak Wskazówki</div>
                      <div className="text-xs opacity-70">Tylko dla Oszusta</div>
                    </div>
                  </button>
                </div>
              </div>
            </Card>

            <Button 
              fullWidth 
              onClick={startGame}
              disabled={players.length < 3 || selectedCategories.length === 0}
              className="py-4 text-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                 {players.length < 3 ? `Dodaj jeszcze ${3 - players.length} graczy` : 'Zainicjuj Protokół'} <Play size={24} fill="currentColor" />
              </span>
            </Button>
          </div>
        )}

        {/* LOADING PHASE */}
        {phase === GamePhase.LOADING && (
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-neon-blue rounded-full border-t-transparent animate-spin"></div>
              <BrainCircuit className="absolute inset-0 m-auto text-neon-blue animate-pulse" size={40} />
            </div>
            <p className="text-xl font-display animate-pulse text-neon-blue">
              GENEROWANIE TOŻSAMOŚCI...
            </p>
          </div>
        )}

        {/* REVEAL PHASE */}
        {phase === GamePhase.REVEAL && (
          <div className="space-y-6">
             {!currentPlayerReveal ? (
               <Card title="Przekaż urządzenie">
                 <p className="text-gray-300 mb-6">
                   Przekazuj telefon każdemu graczowi po kolei. Kliknij swoje imię, aby poznać swoją rolę.
                 </p>
                 <div className="grid grid-cols-1 gap-3">
                   {players.map((player) => (
                     <button
                       key={player.id}
                       onClick={() => selectPlayerForReveal(player)}
                       disabled={player.hasSeenRole}
                       className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                         player.hasSeenRole 
                           ? 'bg-green-900/20 border-green-500/30 text-gray-400 cursor-not-allowed' 
                           : 'bg-neon-panel border-neon-blue/30 text-white hover:bg-neon-blue/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                       }`}
                     >
                       <span className="text-lg font-bold">{player.name}</span>
                       {player.hasSeenRole ? (
                         <CheckCircle2 className="text-green-500" />
                       ) : (
                         <span className="text-xs uppercase tracking-widest bg-neon-blue/10 px-2 py-1 rounded border border-neon-blue/30 text-neon-blue">
                           Sprawdź
                         </span>
                       )}
                     </button>
                   ))}
                 </div>
               </Card>
             ) : (
               <Card className="text-center py-12 relative overflow-hidden">
                  {!revealOpen ? (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold text-white">
                        Witaj, {currentPlayerReveal.name}
                      </h2>
                      <p className="text-gray-400">
                        Upewnij się, że nikt inny nie patrzy na ekran.
                      </p>
                      <Fingerprint className="w-24 h-24 mx-auto text-neon-purple animate-pulse-slow" />
                      <Button onClick={() => setRevealOpen(true)} className="mx-auto">
                        Odkryj Tożsamość
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-fade-in">
                      <div>
                        <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Twoja Rola</p>
                        <h2 className={`text-4xl font-display font-bold mb-2 ${currentPlayerReveal.isImposter ? 'text-neon-pink' : 'text-neon-blue'}`}>
                          {currentPlayerReveal.isImposter ? 'OSZUST' : 'AGENT'}
                        </h2>
                      </div>

                      <div className="bg-black/40 p-6 rounded-lg border border-white/10 mx-4">
                        {currentPlayerReveal.isImposter ? (
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-gray-400 uppercase mb-1">Kategoria</p>
                              {imposterHideCategory ? (
                                <p className="text-xl text-gray-500 font-mono">??? UKRYTA ???</p>
                              ) : (
                                <p className="text-xl text-white font-bold">{gameData?.category}</p>
                              )}
                            </div>
                            
                            {!imposterHideHint && (
                              <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-gray-400 uppercase mb-1">Wskazówka</p>
                                <p className="text-lg text-neon-pink italic">"{gameData?.imposterHint}"</p>
                              </div>
                            )}

                            <div className="pt-4 border-t border-white/10">
                              <p className="text-sm text-gray-400">
                                {imposterHideHint && imposterHideCategory 
                                  ? "Powodzenia! Nie wiesz nic. Musisz zgadywać z kontekstu." 
                                  : "Udawaj, że znasz hasło. Wtop się w tłum."}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                             <div>
                              <p className="text-xs text-gray-400 uppercase mb-1">Kategoria</p>
                              <p className="text-xl text-white font-bold">{gameData?.category}</p>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                              <p className="text-xs text-gray-400 uppercase mb-1">Tajne Hasło</p>
                              <p className="text-3xl text-neon-blue font-display font-bold">{gameData?.secretWord}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Button onClick={markSeen} variant="secondary" fullWidth>
                        Rozumiem, schowaj
                      </Button>
                    </div>
                  )}
               </Card>
             )}
          </div>
        )}

        {/* PLAYING PHASE */}
        {phase === GamePhase.PLAYING && (
          <div className="space-y-6">
            <Card className="text-center py-8">
              <div className="mb-8">
                <h2 className="text-4xl font-display font-bold text-white mb-2">
                  GRA W TOKU
                </h2>
                <p className="text-neon-blue animate-pulse">
                  Debata trwa...
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-xl border border-white/10 mb-8">
                <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Kategoria</p>
                <p className="text-2xl font-bold text-white">{gameData?.category}</p>
              </div>

              <div className="grid gap-4">
                <Button onClick={() => setPhase(GamePhase.RESULT)} variant="primary" fullWidth>
                   Zakończ i Głosuj
                </Button>
              </div>
            </Card>
            
            <div className="grid grid-cols-3 gap-2 text-center opacity-50">
              {players.map(p => (
                <div key={p.id} className="bg-white/5 p-2 rounded text-xs truncate">
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === GamePhase.RESULT && (
          <div className="space-y-6">
            <Card className="text-center">
              <h2 className="text-3xl font-display font-bold text-white mb-8">
                Prawda Wychodzi na Jaw
              </h2>
              
              <div className="space-y-6 mb-8">
                 <div className="bg-neon-pink/10 border border-neon-pink/30 p-6 rounded-xl">
                   <p className="text-neon-pink text-sm uppercase tracking-widest mb-2">Oszust(ci)</p>
                   <div className="space-y-1">
                    {players.filter(p => p.isImposter).map(imp => (
                      <p key={imp.id} className="text-2xl font-bold text-white">{imp.name}</p>
                    ))}
                   </div>
                 </div>

                 <div className="bg-neon-blue/10 border border-neon-blue/30 p-6 rounded-xl">
                   <p className="text-neon-blue text-sm uppercase tracking-widest mb-2">Tajne Hasło</p>
                   <p className="text-2xl font-bold text-white">{gameData?.secretWord}</p>
                 </div>
              </div>

              <Button onClick={resetGame} variant="outline" fullWidth className="group">
                <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                Nowa Gra
              </Button>
            </Card>
          </div>
        )}
      </div>
      
      {/* Credit Footer */}
      <div className="fixed bottom-2 right-2 z-50 pointer-events-none">
        <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
          <p className="text-[10px] text-gray-400 font-display uppercase tracking-widest">
            Made by <span className="text-neon-blue">Piotr Czarnocki</span>
          </p>
        </div>
      </div>
    </div>
  );
}