/**
 * PİŞTİ PRO - PREMIUM GAME ENGINE
 * Core Javascript Logic & Interactive Animations
 */

// --- SOUND CONTROLLER (Web Audio API Synthesizer) ---
class SoundEffectsController {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            // Audio context can only be started via user interaction
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Card Deal Sound (slide / whoosh)
    playDeal() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const bufferSize = this.ctx.sampleRate * 0.12; // 120ms
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    // Play card to table (snap/tap sound)
    playPlayCard() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Normal Capture Sound (melodic chime)
    playCapture() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        const freqs = [330, 440, 554, 659]; // A Major Arpeggio
        freqs.forEach((f, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + index * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.25);
        });
    }

    // Pişti Sound (highly energetic triumphant chime)
    playPisti() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        // Shiny cascading high-pitch tones
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major high arpeggio
        freqs.forEach((f, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + index * 0.05;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, start);
            
            // Vibrato
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 15;
            lfoGain.gain.value = 10;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            gain.gain.setValueAtTime(0.15, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            lfo.start(start);
            osc.start(start);
            lfo.stop(start + 0.4);
            osc.stop(start + 0.4);
        });
    }

    // Victorious game end theme
    playGameWin() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const chords = [
            [261.63, 329.63, 392.00], // C
            [349.23, 440.00, 523.25], // F
            [392.00, 493.88, 587.33], // G
            [523.25, 659.25, 783.99]  // C
        ];
        
        chords.forEach((chord, chordIdx) => {
            const chordStart = now + chordIdx * 0.4;
            chord.forEach((freq) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, chordStart);
                
                gain.gain.setValueAtTime(0.1, chordStart);
                gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.6);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(chordStart);
                osc.stop(chordStart + 0.6);
            });
        });
    }

    // Melancholic game end theme
    playGameLose() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const chords = [
            [220.00, 261.63, 329.63], // Am
            [196.00, 246.94, 293.66], // G
            [174.61, 220.00, 261.63], // F
            [164.81, 207.65, 246.94]  // E
        ];
        
        chords.forEach((chord, chordIdx) => {
            const chordStart = now + chordIdx * 0.5;
            chord.forEach((freq) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, chordStart);
                
                gain.gain.setValueAtTime(0.12, chordStart);
                gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.7);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(chordStart);
                osc.stop(chordStart + 0.7);
            });
        });
    }
}

// Instantiate Sound Controller
const sfx = new SoundEffectsController();

// --- GAME STATE MANAGER ---
const GameState = {
    deck: [],
    playerHand: [],
    aiHand: [],
    pile: [],
    playerCaptured: [],
    aiCaptured: [],
    playerPistiCount: 0,
    aiPistiCount: 0,
    
    // Tracking for scoring
    playerPistis: [], // logs of Pisti objects { rank: 'J', double: true/false }
    aiPistis: [],

    lastCollector: null, // who captured cards last (gets remaining cards on table)
    aiDifficulty: 'normal', // 'normal' or 'pro'
    isLocked: false, // locks gameplay during animations
    turn: 'player', // 'player' or 'ai'
    
    // Pro AI Memory tracking
    playedCardsMemory: {
        'A': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 
        '7': 0, '8': 0, '9': 0, '10': 0, 'J': 0, 'Q': 0, 'K': 0
    },

    // --- NEW MULTIPLAYER VARIABLES ---
    gameMode: 'local', // 'local' or 'online'
    myPlayerIndex: 0, // 0 = Player 1, 1 = Player 2
    roomCode: null,
    opponentName: 'Rakip (AI)',
    playerName: 'Siz'
};

// --- DATA DEFINITIONS & CONSTANTS ---
const SUITS = [
    { symbol: '♠', name: 'Maca', color: 'black' },
    { symbol: '♥', name: 'Kupa', color: 'red' },
    { symbol: '♦', name: 'Karo', color: 'red' },
    { symbol: '♣', name: 'Sinek', color: 'black' }
];

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// --- DECK MANAGEMENT ---
function createDeck() {
    const deck = [];
    SUITS.forEach(suit => {
        RANKS.forEach(rank => {
            let point = 0;
            // Standard Turkish Pişti Point System
            if (rank === 'A') point = 1;
            else if (rank === 'J') point = 1;
            else if (suit.symbol === '♦' && rank === '10') point = 3; // Karo 10
            else if (suit.symbol === '♣' && rank === '2') point = 2;  // Sinek 2
            
            deck.push({
                suit: suit.symbol,
                suitName: suit.name,
                suitColor: suit.color,
                rank: rank,
                point: point,
                id: `${suit.symbol}-${rank}`
            });
        });
    });
    return deck;
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// --- DOM RENDERERS ---
const playerHandEl = document.getElementById('player-hand');
const aiHandEl = document.getElementById('ai-hand');
const centerPileEl = document.getElementById('center-pile');
const pileCounterEl = document.getElementById('pile-counter');
const deckVisualEl = document.getElementById('deck-stack-visual');
const deckRemainingCountEl = document.getElementById('deck-remaining-count');
const statusBarEl = document.getElementById('status-bar');

function renderPlayerHand() {
    playerHandEl.innerHTML = '';
    GameState.playerHand.forEach((card, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-3d player-playable flipped';
        cardContainer.style.zIndex = index + 10;
        cardContainer.setAttribute('data-card-id', card.id);
        
        cardContainer.innerHTML = createCardHTML(card);
        
        // Playable click handler
        cardContainer.addEventListener('click', () => {
            if (GameState.isLocked || GameState.turn !== 'player') return;
            playPlayerCard(card, cardContainer);
        });
        
        playerHandEl.appendChild(cardContainer);
    });
}

function renderAIHand() {
    aiHandEl.innerHTML = '';
    GameState.aiHand.forEach((card, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-3d'; // Renders face down (unflipped)
        cardContainer.style.zIndex = index + 10;
        
        // In online mode, we don't know opponent's ranks beforehand, so we use dummy cards
        const cardObj = GameState.gameMode === 'online' ? { suit: '♠', rank: 'A', suitColor: 'black' } : card;
        cardContainer.innerHTML = createCardHTML(cardObj);
        
        aiHandEl.appendChild(cardContainer);
    });
}

function renderPile() {
    // We clean existing elements except the shadow background
    const existingShadow = centerPileEl.querySelector('.pile-shadow');
    const existingCounter = centerPileEl.querySelector('.pile-counter-badge');
    centerPileEl.innerHTML = '';
    centerPileEl.appendChild(existingShadow);
    centerPileEl.appendChild(existingCounter);

    const len = GameState.pile.length;
    if (len === 0) {
        pileCounterEl.textContent = 'Boş Masa';
        return;
    }

    pileCounterEl.textContent = `${len} Kart`;

    // Render cards. Only the top card is face up, previous cards are stacked beneath it.
    GameState.pile.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card-3d pile-card';
        
        // Flip only the top card
        if (index === len - 1) {
            cardEl.classList.add('flipped');
        }
        
        // Natural visual disorder/offset in physical card stack
        const randX = (index * 2) - (len * 0.8) + (Math.sin(index) * 3);
        const randY = (index * 1.5) - (len * 0.5) + (Math.cos(index) * 3);
        const randRot = (index * 3) - (len * 1.5) + (Math.sin(index * 2) * 5);
        
        cardEl.style.transform = `translate(${randX}px, ${randY}px) rotate(${randRot}deg)`;
        if (index === len - 1) {
            cardEl.style.transform += ` rotateY(180deg)`; // keep flipped aspect
        }
        cardEl.style.zIndex = index + 10;
        
        cardEl.innerHTML = createCardHTML(card);
        centerPileEl.appendChild(cardEl);
    });
}

function createCardHTML(card) {
    const isRed = card.suitColor === 'red';
    const isCourt = ['J', 'Q', 'K'].includes(card.rank);
    
    // Rich SVG/Character layout inside vector cards
    return `
        <!-- CARD BACK -->
        <div class="card-face card-back"></div>
        <!-- CARD FRONT -->
        <div class="card-face card-front ${isRed ? 'red-suit' : ''} ${isCourt ? 'court-card' : ''}">
            <div class="card-top-left">
                <span class="card-rank">${card.rank}</span>
                <span class="card-suit-mini">${card.suit}</span>
            </div>
            <div class="card-center-suit">
                ${isCourt ? getCourtSymbol(card.rank, card.suit) : card.suit}
            </div>
            <div class="card-bottom-right">
                <span class="card-rank">${card.rank}</span>
                <span class="card-suit-mini">${card.suit}</span>
            </div>
        </div>
    `;
}

function getCourtSymbol(rank, suit) {
    // Return stylized representations or classic emojis for court cards
    if (rank === 'J') return '👑'; // Knave/Jack
    if (rank === 'Q') return '👸'; // Queen
    if (rank === 'K') return '🤴'; // King
    return suit;
}

function updateStatsUI() {
    document.getElementById('player-score-val').textContent = calculateRealtimeScore('player');
    document.getElementById('ai-score-val').textContent = calculateRealtimeScore('ai');
    
    // Update labels dynamically for online mode nicknames!
    const playerLabelEl = document.querySelector('#score-card-player .player-label');
    const aiLabelEl = document.querySelector('#score-card-ai .player-label');
    
    if (GameState.gameMode === 'online') {
        playerLabelEl.textContent = GameState.playerName;
        aiLabelEl.textContent = GameState.opponentName;
    } else {
        playerLabelEl.textContent = 'Siz';
        aiLabelEl.textContent = 'Rakip (AI)';
    }

    document.getElementById('player-cards-count').textContent = GameState.playerCaptured.length;
    document.getElementById('ai-cards-count').textContent = GameState.aiCaptured.length;
    
    document.getElementById('player-pisti-count').textContent = GameState.playerPistiCount;
    document.getElementById('ai-pisti-count').textContent = GameState.aiPistiCount;
    
    deckRemainingCountEl.textContent = GameState.deck.length;
    
    // Toggle deck visual stack on table
    if (GameState.deck.length > 8) {
        deckVisualEl.className = 'deck-stack-on-table visible';
    } else if (GameState.deck.length > 0) {
        deckVisualEl.className = 'deck-stack-on-table visible';
        const cards = deckVisualEl.querySelectorAll('.deck-back-card');
        if (cards.length > 2) cards[2].style.display = 'none';
    } else {
        deckVisualEl.className = 'deck-stack-on-table';
    }
}

// Helper to estimate currently scored points in UI
function calculateRealtimeScore(side) {
    const cards = side === 'player' ? GameState.playerCaptured : GameState.aiCaptured;
    const pistis = side === 'player' ? GameState.playerPistis : GameState.aiPistis;
    
    let score = 0;
    // Count card points
    cards.forEach(c => score += c.point);
    // Count Pişti points
    pistis.forEach(p => score += p.double ? 20 : 10);
    
    return score;
}

// --- GAMEPLAY TRIGGERS ---
function dealNextHand() {
    if (GameState.deck.length === 0) return false;
    
    // Deal 4 cards to player and AI
    for (let i = 0; i < 4; i++) {
        GameState.playerHand.push(GameState.deck.pop());
        GameState.aiHand.push(GameState.deck.pop());
    }
    
    sfx.playDeal();
    
    // Add visual dealing delay to feel realistic
    GameState.isLocked = true;
    renderPlayerHand();
    renderAIHand();
    updateStatsUI();
    
    setTimeout(() => {
        GameState.isLocked = false;
        setStatusBarText();
    }, 500);
    
    return true;
}

function playPlayerCard(card, cardDOM) {
    if (GameState.gameMode === 'online') {
        GameState.isLocked = true;
        
        // Remove visually from hand immediately to feel snappy
        GameState.playerHand = GameState.playerHand.filter(c => c.id !== card.id);
        
        sfx.playPlayCard();
        const rectSource = cardDOM.getBoundingClientRect();
        const pileDOM = document.getElementById('center-pile');
        const rectTarget = pileDOM.getBoundingClientRect();
        
        const deltaX = rectTarget.left - rectSource.left + (rectTarget.width / 2) - (rectSource.width / 2);
        const deltaY = rectTarget.top - rectSource.top + (rectTarget.height / 2) - (rectSource.height / 2);
        
        cardDOM.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease';
        cardDOM.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(10deg) scale(0.9) rotateY(180deg)`;
        cardDOM.style.opacity = '0.9';
        cardDOM.style.zIndex = '999';
        
        setTimeout(() => {
            if (conn && conn.open) {
                if (isHost) {
                    processOnlineCardPlay(card, 0); // Host plays directly
                } else {
                    conn.send({
                        type: 'play-card',
                        card: card
                    });
                }
            }
        }, 400);
        return;
    }
    
    // --- OFFLINE LOCAL PLAY ---
    GameState.isLocked = true;
    sfx.playPlayCard();
    
    // Remove card from player hand
    GameState.playerHand = GameState.playerHand.filter(c => c.id !== card.id);
    
    // Smooth transition from player hand to center pile
    const rectSource = cardDOM.getBoundingClientRect();
    const pileDOM = document.getElementById('center-pile');
    const rectTarget = pileDOM.getBoundingClientRect();
    
    const deltaX = rectTarget.left - rectSource.left + (rectTarget.width / 2) - (rectSource.width / 2);
    const deltaY = rectTarget.top - rectSource.top + (rectTarget.height / 2) - (rectSource.height / 2);
    
    cardDOM.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease';
    cardDOM.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(10deg) scale(0.9) rotateY(180deg)`;
    cardDOM.style.opacity = '0.9';
    cardDOM.style.zIndex = '999';
    
    setTimeout(() => {
        // Add card to pile
        GameState.pile.push(card);
        
        // Log in Pro AI memory
        GameState.playedCardsMemory[card.rank]++;
        
        renderPlayerHand();
        renderPile();
        
        // Evaluate Capture
        evaluateTurn('player', card);
    }, 400);
}

function playAICard() {
    if (GameState.aiHand.length === 0) return;
    
    GameState.isLocked = true;
    statusBarEl.textContent = 'Yapay Zeka düşünüyor...';
    statusBarEl.className = 'status-bar ai-turn';
    
    // Pro/Normal decision process
    const decisionTime = 800 + Math.random() * 600; // Realistic human delay
    
    setTimeout(() => {
        const card = selectAICard();
        GameState.aiHand = GameState.aiHand.filter(c => c.id !== card.id);
        
        // Select matching card element in AI DOM to animate
        const aiCards = aiHandEl.querySelectorAll('.card-3d');
        const animatedCard = aiCards[aiCards.length - 1]; // pick last card in visual hand
        
        if (animatedCard) {
            sfx.playPlayCard();
            const rectSource = animatedCard.getBoundingClientRect();
            const pileDOM = document.getElementById('center-pile');
            const rectTarget = pileDOM.getBoundingClientRect();
            
            const deltaX = rectTarget.left - rectSource.left;
            const deltaY = rectTarget.top - rectSource.top;
            
            animatedCard.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease';
            animatedCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(-10deg) scale(0.9) rotateY(180deg)`;
            animatedCard.style.opacity = '0.9';
            animatedCard.style.zIndex = '999';
        }
        
        setTimeout(() => {
            GameState.pile.push(card);
            GameState.playedCardsMemory[card.rank]++;
            
            renderAIHand();
            renderPile();
            
            evaluateTurn('ai', card);
        }, 400);
        
    }, decisionTime);
}

function selectAICard() {
    const hand = GameState.aiHand;
    const len = GameState.pile.length;
    
    // Top card currently on the board
    const topCard = len > 0 ? GameState.pile[len - 1] : null;
    
    // --- EVALUATE IMMEDIATELY PLAYABLE ACTIONS ---
    
    // 1. Check for Pişti opportunity (Must have exactly 1 card in pile, and match rank)
    if (len === 1 && topCard) {
        const match = hand.find(c => c.rank === topCard.rank);
        if (match) return match;
    }
    
    // 2. Check for standard match capture
    if (topCard) {
        const match = hand.find(c => c.rank === topCard.rank);
        if (match) return match;
    }
    
    // 3. Pro Strategy: Check if pile has valuable points and AI has a Jack (J)
    const hasJack = hand.find(c => c.rank === 'J');
    if (hasJack && len > 1) {
        // Count value currently in pile
        let pilePoints = 0;
        GameState.pile.forEach(c => pilePoints += c.point);
        
        // If pile points or bulk is high, play Jack to capture
        if (pilePoints >= 3 || len >= 4 || GameState.aiDifficulty === 'pro') {
            return hasJack;
        }
    }
    
    // --- PLAY DISCARD CARDS (No immediate capture possible) ---
    
    // If Pro AI: use memory and risk analysis
    if (GameState.aiDifficulty === 'pro') {
        // Filter out Jack if we want to save it
        const nonJacks = hand.filter(c => c.rank !== 'J');
        const playableSet = nonJacks.length > 0 ? nonJacks : hand;
        
        // Find the safest card to play:
        // A card is safest if most of its rank matches are already out of the game (cannot be matched easily by player)
        // Or cards that hold 0 points
        let bestCard = playableSet[0];
        let bestSafetyScore = -99;
        
        playableSet.forEach(card => {
            let safety = 0;
            const playedCount = GameState.playedCardsMemory[card.rank];
            
            // If 3 of this rank have already been played, the 4th is 100% safe from match/pişti
            if (playedCount === 3) safety += 100;
            
            // Prefer low value cards to discard
            if (card.point === 0) safety += 10;
            else safety -= 15; // penalize playing Aces, Karo 10, Sinek 2
            
            // Prefer ranks that have been seen already
            safety += playedCount * 2;
            
            if (safety > bestSafetyScore) {
                bestSafetyScore = safety;
                bestCard = card;
            }
        });
        
        return bestCard;
    }
    
    // Normal AI: Play a random non-Jack card if possible, to save the Jack
    const nonJacks = hand.filter(c => c.rank !== 'J');
    if (nonJacks.length > 0) {
        return nonJacks[Math.floor(Math.random() * nonJacks.length)];
    }
    
    return hand[Math.floor(Math.random() * hand.length)];
}

// --- EVALUATE TURN RULES ---
function evaluateTurn(playedBy, cardPlayed) {
    const len = GameState.pile.length;
    
    // Capture check: We need at least 2 cards in pile
    if (len >= 2) {
        const topCard = GameState.pile[len - 1];
        const prevCard = GameState.pile[len - 2];
        
        // Capture conditions: Match rank OR play Jack (J)
        const isMatch = topCard.rank === prevCard.rank;
        const isJackCapture = topCard.rank === 'J';
        
        if (isMatch || isJackCapture) {
            // Determine if it was a PİŞTİ
            let isPisti = false;
            let isDoublePisti = false;
            
            if (len === 2 && isMatch) {
                isPisti = true;
                if (topCard.rank === 'J') {
                    isDoublePisti = true; // Vale Piştisi
                }
            }
            
            // Process Capture animation and data
            GameState.lastCollector = playedBy;
            
            setTimeout(() => {
                const capturedCards = [...GameState.pile];
                GameState.pile = [];
                
                if (playedBy === 'player') {
                    GameState.playerCaptured.push(...capturedCards);
                    if (isPisti) {
                        GameState.playerPistiCount++;
                        GameState.playerPistis.push({ rank: topCard.rank, double: isDoublePisti });
                        triggerAnnouncement('PİŞTİ!', isDoublePisti ? '+20 PUAN (ÇİFT VALE)' : '+10 PUAN', 'pisti');
                        sfx.playPisti();
                        launchConfetti();
                    } else {
                        triggerAnnouncement('KAZANDINIZ!', `${capturedCards.length} Kart Toplandı`, 'capture');
                        sfx.playCapture();
                    }
                    animateCaptureDOM('player');
                } else {
                    GameState.aiCaptured.push(...capturedCards);
                    if (isPisti) {
                        GameState.aiPistiCount++;
                        GameState.aiPistis.push({ rank: topCard.rank, double: isDoublePisti });
                        triggerAnnouncement('YAPAY ZEKA PİŞTİ YAPTI!', isDoublePisti ? 'Rakip +20 Puan Aldı' : 'Rakip +10 Puan Aldı', 'ai-pisti');
                        sfx.playPisti();
                    } else {
                        triggerAnnouncement('RAKİP ALDI!', `${capturedCards.length} Kart Topladı`, 'ai-capture');
                        sfx.playCapture();
                    }
                    animateCaptureDOM('ai');
                }
                
                renderPile();
                updateStatsUI();
                nextTurn();
            }, 300);
            return;
        }
    }
    
    // Normal play, no capture
    nextTurn();
}

function nextTurn() {
    updateStatsUI();
    
    // Check if hands are empty
    if (GameState.playerHand.length === 0 && GameState.aiHand.length === 0) {
        const dealt = dealNextHand();
        if (!dealt) {
            // Deck is empty, evaluate final game end!
            endGame();
            return;
        }
        // Dealt successfully, player turn starts
        GameState.turn = 'player';
        GameState.isLocked = false;
        setStatusBarText();
        return;
    }
    
    // Switch turn
    GameState.turn = GameState.turn === 'player' ? 'ai' : 'player';
    GameState.isLocked = false;
    setStatusBarText();
    
    if (GameState.turn === 'ai') {
        playAICard();
    }
}

function setStatusBarText() {
    if (GameState.turn === 'player') {
        statusBarEl.textContent = 'Sıra Sizde! Kartınızı seçin.';
        statusBarEl.className = 'status-bar your-turn';
    } else {
        statusBarEl.textContent = GameState.gameMode === 'online' ? `${GameState.opponentName} oynuyor...` : 'Yapay Zeka oynuyor...';
        statusBarEl.className = 'status-bar ai-turn';
    }
}

// --- DYNAMIC CAPTURE ANIMATION ---
function animateCaptureDOM(winner) {
    const pileDOM = document.getElementById('center-pile');
    const cards = pileDOM.querySelectorAll('.pile-card');
    
    const targetSelector = winner === 'player' ? '.collect-pile.player' : '.collect-pile.ai';
    const targetDOM = document.querySelector(targetSelector);
    if (!targetDOM) return;
    
    const rectTarget = targetDOM.getBoundingClientRect();
    
    cards.forEach(cardDOM => {
        const rectSource = cardDOM.getBoundingClientRect();
        const deltaX = rectTarget.left - rectSource.left + (rectTarget.width/2) - (rectSource.width/2);
        const deltaY = rectTarget.top - rectSource.top + (rectTarget.height/2) - (rectSource.height/2);
        
        cardDOM.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease';
        cardDOM.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.4) rotate(45deg)`;
        cardDOM.style.opacity = '0';
    });
}

// --- FULLSCREEN ANNOUNCEMENTS ---
function triggerAnnouncement(title, subtitle, type) {
    const el = document.getElementById('game-announcement');
    const titleEl = document.getElementById('announcement-title');
    const subtitleEl = document.getElementById('announcement-subtitle');
    
    titleEl.textContent = title;
    subtitleEl.textContent = subtitle;
    
    // Add distinct styling based on capture types
    el.className = 'game-announcement';
    if (type === 'pisti') {
        el.classList.add('pisti-announcement');
    }
    
    el.classList.add('visible');
    
    setTimeout(() => {
        el.classList.remove('visible');
    }, 1500);
}

// --- GAME OVER CALCULATIONS & DISPLAY ---
function endGame() {
    GameState.isLocked = true;
    statusBarEl.textContent = 'Oyun bitti! Skorlar hesaplanıyor...';
    
    // 1. Give remaining cards on table to last collector
    if (GameState.pile.length > 0) {
        const remaining = [...GameState.pile];
        GameState.pile = [];
        
        if (GameState.lastCollector === 'player') {
            GameState.playerCaptured.push(...remaining);
            statusBarEl.textContent = `Yerde kalan ${remaining.length} kart son toplayan Oyuncuya verildi.`;
        } else if (GameState.lastCollector === 'ai') {
            GameState.aiCaptured.push(...remaining);
            statusBarEl.textContent = `Yerde kalan ${remaining.length} kart son toplayan Yapay Zekaya verildi.`;
        }
        
        renderPile();
        updateStatsUI();
    }
    
    // Let table update, wait 1.5s then show details modal
    setTimeout(() => {
        showGameOverModal();
    }, 1500);
}

function showGameOverModal() {
    const playerC = GameState.playerCaptured;
    const aiC = GameState.aiCaptured;
    
    // 1. Cards Bulk Bonus (+3 Puan)
    let playerBulkPoint = 0;
    let aiBulkPoint = 0;
    
    if (playerC.length > aiC.length) {
        playerBulkPoint = 3;
    } else if (aiC.length > playerC.length) {
        aiBulkPoint = 3;
    }
    
    // 2. Count Specials and Cards Points
    let playerSpecials = 0;
    playerC.forEach(c => playerSpecials += c.point);
    
    let aiSpecials = 0;
    aiC.forEach(c => aiSpecials += c.point);
    
    // 3. Count Piştiler Points
    let playerPistiPoint = 0;
    GameState.playerPistis.forEach(p => playerPistiPoint += p.double ? 20 : 10);
    
    let aiPistiPoint = 0;
    GameState.aiPistis.forEach(p => aiPistiPoint += p.double ? 20 : 10);
    
    // 4. Totals
    const playerTotal = playerPistiPoint + playerSpecials + playerBulkPoint;
    const aiTotal = aiPistiPoint + aiSpecials + aiBulkPoint;
    
    // Apply values to breakdown DOM
    document.getElementById('breakdown-player-pisti').textContent = playerPistiPoint;
    document.getElementById('breakdown-ai-pisti').textContent = aiPistiPoint;
    
    document.getElementById('breakdown-player-specials').textContent = playerSpecials;
    document.getElementById('breakdown-ai-specials').textContent = aiSpecials;
    
    document.getElementById('breakdown-player-bulk').textContent = playerBulkPoint > 0 ? '+3 Puan' : '0';
    document.getElementById('breakdown-ai-bulk').textContent = aiBulkPoint > 0 ? '+3 Puan' : '0';
    
    document.getElementById('breakdown-player-total').textContent = playerTotal;
    document.getElementById('breakdown-ai-total').textContent = aiTotal;
    
    document.getElementById('breakdown-player-cards-total').textContent = playerC.length;
    document.getElementById('breakdown-ai-cards-total').textContent = aiC.length;
    
    // Display result message
    const titleEl = document.getElementById('game-over-title');
    const messageEl = document.getElementById('game-over-message');
    
    if (playerTotal > aiTotal) {
        titleEl.textContent = '🏆 TEBRİKLER, KAZANDINIZ!';
        titleEl.style.background = 'var(--gold-gradient)';
        titleEl.style.webkitBackgroundClip = 'text';
        titleEl.style.webkitTextFillColor = 'transparent';
        messageEl.textContent = `Yapay Zekayı ${playerTotal} - ${aiTotal} skorla yenerek şampiyon oldunuz!`;
        sfx.playGameWin();
        launchConfetti();
    } else if (aiTotal > playerTotal) {
        titleEl.textContent = '💀 KAYBETTİNİZ...';
        titleEl.style.background = 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)';
        titleEl.style.webkitBackgroundClip = 'text';
        titleEl.style.webkitTextFillColor = 'transparent';
        messageEl.textContent = `Yapay Zeka maçı ${aiTotal} - ${playerTotal} skorla kazandı. Bir dahaki sefere bol şans!`;
        sfx.playGameLose();
    } else {
        titleEl.textContent = '🤝 BERABERE!';
        titleEl.style.color = '#fff';
        titleEl.style.webkitTextFillColor = '#fff';
        messageEl.textContent = `Kıran kırana geçen maç ${playerTotal} - ${aiTotal} beraberlikle bitti!`;
        sfx.playGameWin();
    }
    
    document.getElementById('game-over-modal').classList.add('visible');
}

// --- CONFETTI LAUNCHER ---
function launchConfetti() {
    const colors = ['#f3e0aa', '#dfb15b', '#2ecc71', '#ff3838', '#00d2d3'];
    for (let i = 0; i < 60; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = `${Math.random() * 100}vw`;
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.transform = `scale(${0.5 + Math.random()})`;
        
        // Random fall timing & drift
        const duration = 2 + Math.random() * 2;
        conf.style.animation = `confettiFall ${duration}s ease-out forwards`;
        conf.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.body.appendChild(conf);
        
        // Remove from DOM when done
        setTimeout(() => conf.remove(), (duration + 0.5) * 1000);
    }
}

// --- INIT GAME LOGIC ---
function startNewGame() {
    // 1. Reset Arrays & scores
    GameState.deck = createDeck();
    shuffle(GameState.deck);
    
    GameState.playerHand = [];
    GameState.aiHand = [];
    GameState.pile = [];
    
    GameState.playerCaptured = [];
    GameState.aiCaptured = [];
    GameState.playerPistiCount = 0;
    GameState.aiPistiCount = 0;
    GameState.playerPistis = [];
    GameState.aiPistis = [];
    GameState.lastCollector = null;
    GameState.isLocked = false;
    
    // Clear Memory
    Object.keys(GameState.playedCardsMemory).forEach(key => {
        GameState.playedCardsMemory[key] = 0;
    });

    // 2. Deal Initial Table Pile (3 face down, 1 face up)
    for (let i = 0; i < 4; i++) {
        const card = GameState.deck.pop();
        GameState.pile.push(card);
        GameState.playedCardsMemory[card.rank]++;
    }
    
    // 3. Deal hands
    for (let i = 0; i < 4; i++) {
        GameState.playerHand.push(GameState.deck.pop());
        GameState.aiHand.push(GameState.deck.pop());
    }

    // 4. Reset Modals
    document.getElementById('start-modal').classList.remove('visible');
    document.getElementById('game-over-modal').classList.remove('visible');

    // 5. Play Deal Sound & Render Everything
    sfx.playDeal();
    renderPlayerHand();
    renderAIHand();
    renderPile();
    updateStatsUI();
    
    // Player plays first
    GameState.turn = 'player';
    setStatusBarText();
}

// --- DOM EVENT LISTENERS & MODAL UTILS ---

// Difficulty Selection
const diffNormalBtn = document.getElementById('diff-normal-btn');
const diffProBtn = document.getElementById('diff-pro-btn');

diffNormalBtn.addEventListener('click', () => {
    GameState.aiDifficulty = 'normal';
    diffNormalBtn.classList.add('active');
    diffProBtn.classList.remove('active');
});

diffProBtn.addEventListener('click', () => {
    GameState.aiDifficulty = 'pro';
    diffProBtn.classList.add('active');
    diffNormalBtn.classList.remove('active');
});

// Sound Toggle
const soundBtn = document.getElementById('sound-toggle-btn');
soundBtn.addEventListener('click', () => {
    const isEnabled = sfx.toggle();
    soundBtn.textContent = isEnabled ? '🔊' : '🔇';
});

// Rules Modals
const rulesToggleBtn = document.getElementById('rules-toggle-btn');
const rulesModal = document.getElementById('rules-modal');
const closeRulesBtn = document.getElementById('close-rules-btn');

rulesToggleBtn.addEventListener('click', () => {
    rulesModal.classList.add('visible');
});

closeRulesBtn.addEventListener('click', () => {
    rulesModal.classList.remove('visible');
});

// Start & Restart buttons
document.getElementById('start-game-btn').addEventListener('click', startNewGame);
document.getElementById('restart-game-btn').addEventListener('click', () => {
    document.getElementById('game-over-modal').classList.remove('visible');
    // Open start modal again to choose mode/difficulty
    document.getElementById('start-modal').classList.add('visible');
});

// --- MULTIPLAYER TAB & BUTTON ACTIONS ---
const tabSingleBtn = document.getElementById('tab-single-btn');
const tabMultiBtn = document.getElementById('tab-multi-btn');
const singlePanel = document.getElementById('single-panel');
const multiPanel = document.getElementById('multi-panel');
const lobbyWaitingPanel = document.getElementById('lobby-waiting-panel');

tabSingleBtn.addEventListener('click', () => {
    tabSingleBtn.classList.add('active');
    tabMultiBtn.classList.remove('active');
    singlePanel.classList.add('active');
    multiPanel.classList.remove('active');
    lobbyWaitingPanel.classList.remove('active');
    GameState.gameMode = 'local';
});

tabMultiBtn.addEventListener('click', () => {
    tabMultiBtn.classList.add('active');
    tabSingleBtn.classList.remove('active');
    multiPanel.classList.add('active');
    singlePanel.classList.remove('active');
    lobbyWaitingPanel.classList.remove('active');
    GameState.gameMode = 'online';
});

// --- PEERJS WEBRTC P2P MULTIPLAYER CONTROLLER ---
let peer = null;
let conn = null;
let isHost = false;

// Generate 5-character Room Code
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Create Room Action (Host)
document.getElementById('btn-create-room').addEventListener('click', () => {
    const nick = document.getElementById('nickname-input').value.trim();
    const name = nick ? nick : 'Oyuncu 1';
    GameState.playerName = name;
    
    // Generate Room Code
    const roomCode = generateRoomCode();
    GameState.roomCode = roomCode;
    
    // Show spinner and code
    document.getElementById('display-room-code').textContent = roomCode;
    document.getElementById('lobby-player-1').textContent = name;
    
    document.getElementById('multi-panel').classList.remove('active');
    document.getElementById('lobby-waiting-panel').classList.add('active');
    
    // Initialize Host Peer
    isHost = true;
    GameState.myPlayerIndex = 0; // Host is Player 1
    
    // We register the peer on the public PeerJS server using the room code
    peer = new Peer('pisti-pro-' + roomCode);
    
    peer.on('open', (id) => {
        console.log('Host Peer registered successfully with ID:', id);
    });
    
    peer.on('connection', (connection) => {
        conn = connection;
        setupConnectionListeners();
    });
    
    peer.on('error', (err) => {
        console.error('PeerJS Host Error:', err);
        alert('Oda oluşturulurken bir hata oluştu veya bu oda kodu kullanımda. Lütfen tekrar deneyin.');
        location.reload();
    });
});

// Join Room Action (Guest)
document.getElementById('btn-join-room').addEventListener('click', () => {
    const nick = document.getElementById('nickname-input').value.trim();
    const name = nick ? nick : 'Oyuncu 2';
    GameState.playerName = name;
    
    const roomCode = document.getElementById('join-code-input').value.trim().toUpperCase();
    if (!roomCode) {
        alert('Lütfen geçerli bir oda kodu girin!');
        return;
    }
    
    GameState.roomCode = roomCode;
    isHost = false;
    GameState.myPlayerIndex = 1; // Guest is Player 2
    
    // Show waiting panel lobby
    document.getElementById('lobby-player-1').textContent = 'Oda Sahibi';
    document.getElementById('lobby-player-2').textContent = name;
    document.getElementById('slot-player-2').classList.add('active');
    document.getElementById('slot-player-2').querySelector('.player-status-tag').className = 'player-status-tag';
    document.getElementById('slot-player-2').querySelector('.player-status-tag').textContent = 'Bağlanıyor...';
    
    document.getElementById('display-room-code').textContent = roomCode;
    document.getElementById('multi-panel').classList.remove('active');
    document.getElementById('lobby-waiting-panel').classList.add('active');
    
    // Initialize Guest Peer with dynamic ID
    peer = new Peer();
    
    peer.on('open', (id) => {
        console.log('Guest Peer opened. Connecting to Host ID: pisti-pro-' + roomCode);
        conn = peer.connect('pisti-pro-' + roomCode);
        setupConnectionListeners();
    });
    
    peer.on('error', (err) => {
        console.error('PeerJS Guest Connection Error:', err);
        alert('Odaya bağlanılamadı. Kodun doğru olduğundan ve oda sahibinin beklediğinden emin olun!');
        location.reload();
    });
});

// Leave Lobby Action
document.getElementById('btn-leave-lobby').addEventListener('click', () => {
    location.reload();
});

// Setup Connection Event Listeners
function setupConnectionListeners() {
    if (!conn) return;
    
    conn.on('open', () => {
        console.log('Direct WebRTC Data Connection established!');
        
        // Handshake: Guest sends their name to Host
        if (!isHost) {
            conn.send({
                type: 'handshake',
                name: GameState.playerName
            });
        }
    });
    
    conn.on('data', (data) => {
        handleIncomingData(data);
    });
    
    conn.on('close', () => {
        alert('Rakip oyundan ayrıldı veya bağlantı koptu.');
        location.reload();
    });
    
    conn.on('error', (err) => {
        console.error('Connection Data Error:', err);
        alert('Bağlantı hatası oluştu.');
        location.reload();
    });
}

// Handle Incoming WebRTC Messages
function handleIncomingData(data) {
    if (data.type === 'handshake') {
        GameState.opponentName = data.name;
        
        document.getElementById('lobby-player-2').textContent = data.name;
        document.getElementById('slot-player-2').classList.add('active');
        document.getElementById('slot-player-2').querySelector('.player-status-tag').className = 'player-status-tag';
        document.getElementById('slot-player-2').querySelector('.player-status-tag').textContent = 'Bağlandı';
        
        // Host sends confirmation back with their name
        conn.send({
            type: 'handshake-reply',
            name: GameState.playerName
        });
        
        // Host shuffles, deals and triggers game start after 1s delay
        setTimeout(() => {
            startPeerGame();
        }, 1200);
    }
    else if (data.type === 'handshake-reply') {
        GameState.opponentName = data.name;
    }
    else if (data.type === 'game-start') {
        GameState.gameMode = 'online';
        GameState.opponentName = data.opponentName;
        
        // Set local state variables
        GameState.deck = { length: data.deckRemaining };
        GameState.pile = data.pile;
        GameState.playerHand = data.hand;
        GameState.aiHand = Array(4).fill({}); // Opponent card count dummy wrapper
        
        GameState.playerCaptured = [];
        GameState.aiCaptured = [];
        GameState.playerPistiCount = 0;
        GameState.aiPistiCount = 0;
        GameState.playerPistis = [];
        GameState.aiPistis = [];
        
        // Close modal
        document.getElementById('start-modal').classList.remove('visible');
        
        sfx.playDeal();
        renderPlayerHand();
        renderAIHand();
        renderPile();
        updateStatsUI();
        
        // Guest turn sync (data.turnIdx === 1 means it is Guest's turn)
        GameState.turn = (data.turnIdx === 1) ? 'player' : 'ai';
        GameState.isLocked = false;
        setStatusBarText();
    }
    else if (data.type === 'play-card') {
        // Host receives played card from Guest (guestIdx = 1)
        processOnlineCardPlay(data.card, 1);
    }
    else if (data.type === 'opponent-played-card') {
        // Receives confirmation of opponent play (Host or Guest)
        executeOnlineCardAction(data.card, data.playerPlayedIdx, data.isCapture, data.isPisti, data.isDoublePisti);
    }
    else if (data.type === 'turn-updated') {
        GameState.turn = (data.turnIdx === GameState.myPlayerIndex) ? 'player' : 'ai';
        GameState.aiHand = Array(data.playersHandCount[1 - GameState.myPlayerIndex]).fill({});
        renderAIHand();
        setStatusBarText();
        GameState.isLocked = false;
    }
    else if (data.type === 'hands-dealt') {
        GameState.isLocked = true;
        GameState.playerHand = data.hand;
        GameState.aiHand = Array(4).fill({});
        GameState.deck = { length: data.deckRemaining };
        
        sfx.playDeal();
        renderPlayerHand();
        renderAIHand();
        updateStatsUI();
        
        setTimeout(() => {
            GameState.isLocked = false;
            setStatusBarText();
        }, 500);
    }
    else if (data.type === 'game-over') {
        displayPeerGameOverModal(data.scores, data.remainingHandled, data.remainingCardsCount, data.finalCollectorIdx);
    }
}

// Host Authoritative Shuffle and Game Start Engine
function startPeerGame() {
    GameState.gameMode = 'online';
    GameState.deck = createDeck();
    shuffle(GameState.deck);
    GameState.pile = [];
    GameState.lastCollector = null;
    
    // 1. Deal center pile
    for (let i = 0; i < 4; i++) {
        GameState.pile.push(GameState.deck.pop());
    }
    
    // 2. Deal hands (Host gets 4, Guest gets 4)
    const hostHand = [];
    const guestHand = [];
    for (let i = 0; i < 4; i++) {
        hostHand.push(GameState.deck.pop());
        guestHand.push(GameState.deck.pop());
    }
    
    GameState.playerHand = hostHand;
    GameState.aiHand = Array(4).fill({});
    
    GameState.playerCaptured = [];
    GameState.aiCaptured = [];
    GameState.playerPistiCount = 0;
    GameState.aiPistiCount = 0;
    GameState.playerPistis = [];
    GameState.aiPistis = [];
    
    // Random turn index (0 = Host, 1 = Guest)
    const turnIdx = Math.floor(Math.random() * 2);
    
    // Send Game Start packet to Guest
    if (conn && conn.open) {
        conn.send({
            type: 'game-start',
            pile: GameState.pile,
            hand: guestHand,
            opponentName: GameState.playerName,
            turnIdx: turnIdx,
            deckRemaining: GameState.deck.length
        });
    }
    
    // Sync host screen
    document.getElementById('start-modal').classList.remove('visible');
    
    sfx.playDeal();
    renderPlayerHand();
    renderAIHand();
    renderPile();
    updateStatsUI();
    
    GameState.turn = (turnIdx === 0) ? 'player' : 'ai';
    GameState.isLocked = false;
    setStatusBarText();
}

// Host authoritative action evaluator
function processOnlineCardPlay(card, playerIdx) {
    if (playerIdx === 1) {
        // Decrease Guest hand count visually on Host screen
        GameState.aiHand.pop();
        renderAIHand();
    }
    
    // Push card to center pile
    GameState.pile.push(card);
    const len = GameState.pile.length;
    
    // Evaluate capture rules
    let isCapture = false;
    let isPisti = false;
    let isDoublePisti = false;
    
    if (len >= 2) {
        const topCard = GameState.pile[len - 1];
        const prevCard = GameState.pile[len - 2];
        
        const isMatch = topCard.rank === prevCard.rank;
        const isJackCapture = topCard.rank === 'J';
        
        if (isMatch || isJackCapture) {
            isCapture = true;
            GameState.lastCollector = playerIdx;
            
            // Pişti
            if (len === 2 && isMatch) {
                isPisti = true;
                if (topCard.rank === 'J') {
                    isDoublePisti = true;
                }
            }
        }
    }
    
    // Broadcast play confirmation package to guest
    if (conn && conn.open) {
        conn.send({
            type: 'opponent-played-card',
            card: card,
            playerPlayedIdx: playerIdx,
            isCapture: isCapture,
            isPisti: isPisti,
            isDoublePisti: isDoublePisti,
            pileLen: len
        });
    }
    
    // Process on Host screen
    executeOnlineCardAction(card, playerIdx, isCapture, isPisti, isDoublePisti);
}

// Visually process cards and trigger sounds on Guest and Host
function executeOnlineCardAction(card, playerIdx, isCapture, isPisti, isDoublePisti) {
    GameState.isLocked = true;
    
    const isMe = (playerIdx === GameState.myPlayerIndex);
    
    // Opponent playing card animation
    if (!isMe) {
        sfx.playPlayCard();
        const aiCards = aiHandEl.querySelectorAll('.card-3d');
        const animatedCard = aiCards[aiCards.length - 1];
        
        if (animatedCard) {
            const rectSource = animatedCard.getBoundingClientRect();
            const pileDOM = document.getElementById('center-pile');
            const rectTarget = pileDOM.getBoundingClientRect();
            
            const deltaX = rectTarget.left - rectSource.left;
            const deltaY = rectTarget.top - rectSource.top;
            
            animatedCard.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease';
            animatedCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(-10deg) scale(0.9) rotateY(180deg)`;
            animatedCard.style.opacity = '0.9';
            animatedCard.style.zIndex = '999';
        }
    }
    
    setTimeout(() => {
        if (isMe) {
            // Already removed visually on play, just push to pile and render
            if (GameState.myPlayerIndex === 1) {
                // Guest pushes to local pile
                GameState.pile.push(card);
            }
            renderPlayerHand();
            renderPile();
        } else {
            // Opponent card flying finishes
            if (GameState.myPlayerIndex === 0) {
                // Host already pushed it in processOnlineCardPlay, just render
                renderAIHand();
                renderPile();
            } else {
                // Guest pushes and renders
                GameState.pile.push(card);
                GameState.aiHand.pop();
                renderAIHand();
                renderPile();
            }
        }
        
        if (isCapture) {
            setTimeout(() => {
                const capturedCards = [...GameState.pile];
                GameState.pile = [];
                
                const winnerRole = (playerIdx === GameState.myPlayerIndex) ? 'player' : 'ai';
                
                if (winnerRole === 'player') {
                    GameState.playerCaptured.push(...capturedCards);
                    if (isPisti) {
                        GameState.playerPistiCount++;
                        GameState.playerPistis.push({ rank: card.rank, double: isDoublePisti });
                        triggerAnnouncement('PİŞTİ!', isDoublePisti ? '+20 PUAN (ÇİFT VALE)' : '+10 PUAN', 'pisti');
                        sfx.playPisti();
                        launchConfetti();
                    } else {
                        triggerAnnouncement('KAZANDINIZ!', `${capturedCards.length} Kart Toplandı`, 'capture');
                        sfx.playCapture();
                    }
                    animateCaptureDOM('player');
                    renderPlayerHand(); // Clean up player hand DOM wrapper!
                } else {
                    GameState.aiCaptured.push(...capturedCards);
                    if (isPisti) {
                        GameState.aiPistiCount++;
                        GameState.aiPistis.push({ rank: card.rank, double: isDoublePisti });
                        triggerAnnouncement(`${GameState.opponentName.toUpperCase()} PİŞTİ YAPTI!`, isDoublePisti ? 'Rakip +20 Puan Aldı' : 'Rakip +10 Puan Aldı', 'ai-pisti');
                        sfx.playPisti();
                    } else {
                        triggerAnnouncement(`${GameState.opponentName.toUpperCase()} ALDI!`, `${capturedCards.length} Kart Topladı`, 'ai-capture');
                        sfx.playCapture();
                    }
                    animateCaptureDOM('ai');
                }
                
                renderPile();
                updateStatsUI();
                GameState.isLocked = false;
            }, 300);
        } else {
            GameState.isLocked = false;
        }
        
        // Authoritative Host evaluates turn progression
        if (isHost) {
            setTimeout(() => {
                evaluateHostNextTurn();
            }, 600);
        }
    }, isMe ? 0 : 400);
}

// Host processes turns and deals hands WebRTC
function evaluateHostNextTurn() {
    const p1HandLen = GameState.playerHand.length; // Host card count
    const p2HandLen = GameState.aiHand.length; // Guest card count (stored in aiHand on host)
    
    if (p1HandLen === 0 && p2HandLen === 0) {
        // Both hands empty, deal new hands or end game
        if (GameState.deck.length >= 8) {
            const hostHand = [];
            const guestHand = [];
            for (let i = 0; i < 4; i++) {
                hostHand.push(GameState.deck.pop());
                guestHand.push(GameState.deck.pop());
            }
            
            GameState.playerHand = hostHand;
            GameState.aiHand = Array(4).fill({});
            
            // Broadcast dealing to Guest
            if (conn && conn.open) {
                conn.send({
                    type: 'hands-dealt',
                    hand: guestHand,
                    deckRemaining: GameState.deck.length
                });
            }
            
            sfx.playDeal();
            renderPlayerHand();
            renderAIHand();
            updateStatsUI();
            
            toggleHostTurn();
        } else {
            // End Game!
            endHostGame();
        }
    } else {
        // Regular turn change
        toggleHostTurn();
    }
}

function toggleHostTurn() {
    const currentHostTurn = GameState.turn; // 'player' is Host, 'ai' is Guest
    const nextTurnIdx = (currentHostTurn === 'player') ? 1 : 0;
    
    GameState.turn = (nextTurnIdx === 0) ? 'player' : 'ai';
    setStatusBarText();
    
    // Broadcast turn update to guest
    if (conn && conn.open) {
        conn.send({
            type: 'turn-updated',
            turnIdx: nextTurnIdx,
            playersHandCount: [GameState.playerHand.length, GameState.aiHand.length]
        });
    }
}

function endHostGame() {
    let remainingHandled = false;
    let remainingCardsCount = GameState.pile.length;
    let finalCollectorIdx = null;
    
    // Give remaining cards on table to last collector
    if (remainingCardsCount > 0 && GameState.lastCollector !== null) {
        const remaining = [...GameState.pile];
        GameState.pile = [];
        
        finalCollectorIdx = GameState.lastCollector;
        if (finalCollectorIdx === 0) {
            GameState.playerCaptured.push(...remaining);
        } else {
            GameState.aiCaptured.push(...remaining);
        }
        remainingHandled = true;
    }
    
    // Calculate Scorecards
    const hostScoreCard = calculateRealtimeScore('player');
    const guestScoreCard = calculateRealtimeScore('ai');
    
    const hostCardsCount = GameState.playerCaptured.length;
    const guestCardsCount = GameState.aiCaptured.length;
    
    let hostPistiPoints = 0;
    GameState.playerPistis.forEach(p => hostPistiPoints += p.double ? 20 : 10);
    
    let guestPistiPoints = 0;
    GameState.aiPistis.forEach(p => guestPistiPoints += p.double ? 20 : 10);
    
    const scores = [
        {
            role: 'host',
            cardsCaptured: hostCardsCount,
            pistiPoints: hostPistiPoints,
            specialPoints: hostScoreCard - hostPistiPoints,
            bulkPoints: 0,
            totalScore: hostScoreCard
        },
        {
            role: 'guest',
            cardsCaptured: guestCardsCount,
            pistiPoints: guestPistiPoints,
            specialPoints: guestScoreCard - guestPistiPoints,
            bulkPoints: 0,
            totalScore: guestScoreCard
        }
    ];
    
    // Card majority bonus (+3 points)
    if (hostCardsCount > guestCardsCount) {
        scores[0].bulkPoints = 3;
        scores[0].totalScore += 3;
    } else if (guestCardsCount > hostCardsCount) {
        scores[1].bulkPoints = 3;
        scores[1].totalScore += 3;
    }
    
    // Broadcast end to Guest
    if (conn && conn.open) {
        conn.send({
            type: 'game-over',
            scores: scores,
            remainingHandled: remainingHandled,
            remainingCardsCount: remainingCardsCount,
            finalCollectorIdx: finalCollectorIdx
        });
    }
    
    displayPeerGameOverModal(scores, remainingHandled, remainingCardsCount, finalCollectorIdx);
}

function calculateRealtimeScore(role) {
    const cards = (role === 'player') ? GameState.playerCaptured : GameState.aiCaptured;
    const pistis = (role === 'player') ? GameState.playerPistis : GameState.aiPistis;
    
    let score = 0;
    cards.forEach(c => score += c.point);
    pistis.forEach(p => score += p.double ? 20 : 10);
    return score;
}

function displayPeerGameOverModal(scores, remainingHandled, remainingCardsCount, finalCollectorIdx) {
    GameState.isLocked = true;
    statusBarEl.textContent = 'Oyun bitti! Skorlar hesaplanıyor...';
    
    const hostScore = scores[0];
    const guestScore = scores[1];
    
    const isHostMe = (GameState.myPlayerIndex === 0);
    const myScore = isHostMe ? hostScore : guestScore;
    const opScore = isHostMe ? guestScore : hostScore;
    
    // Handle remaining cards visually
    if (remainingHandled && finalCollectorIdx !== null) {
        const isMeCollector = (finalCollectorIdx === GameState.myPlayerIndex);
        const remaining = [...GameState.pile];
        GameState.pile = [];
        
        if (isMeCollector) {
            GameState.playerCaptured.push(...remaining);
            statusBarEl.textContent = `Yerde kalan ${remaining.length} kart size verildi.`;
        } else {
            GameState.aiCaptured.push(...remaining);
            statusBarEl.textContent = `Yerde kalan ${remaining.length} kart ${GameState.opponentName}'e verildi.`;
        }
        
        renderPile();
        updateStatsUI();
    }
    
    setTimeout(() => {
        // Apply values to breakdown DOM
        document.getElementById('breakdown-player-pisti').textContent = myScore.pistiPoints;
        document.getElementById('breakdown-ai-pisti').textContent = opScore.pistiPoints;
        
        document.getElementById('breakdown-player-specials').textContent = myScore.specialPoints;
        document.getElementById('breakdown-ai-specials').textContent = opScore.specialPoints;
        
        document.getElementById('breakdown-player-bulk').textContent = myScore.bulkPoints > 0 ? '+3 Puan' : '0';
        document.getElementById('breakdown-ai-bulk').textContent = opScore.bulkPoints > 0 ? '+3 Puan' : '0';
        
        document.getElementById('breakdown-player-total').textContent = myScore.totalScore;
        document.getElementById('breakdown-ai-total').textContent = opScore.totalScore;
        
        document.getElementById('breakdown-player-cards-total').textContent = myScore.cardsCaptured;
        document.getElementById('breakdown-ai-cards-total').textContent = opScore.cardsCaptured;
        
        const titleEl = document.getElementById('game-over-title');
        const messageEl = document.getElementById('game-over-message');
        
        const tableHeaderPlayer = document.querySelector('.scoreboard-table th.player-col');
        const tableHeaderAI = document.querySelector('.scoreboard-table th.ai-col');
        tableHeaderPlayer.textContent = GameState.playerName;
        tableHeaderAI.textContent = GameState.opponentName;
        
        if (myScore.totalScore > opScore.totalScore) {
            titleEl.textContent = '🏆 TEBRİKLER, KAZANDINIZ!';
            titleEl.style.background = 'var(--gold-gradient)';
            titleEl.style.webkitBackgroundClip = 'text';
            titleEl.style.webkitTextFillColor = 'transparent';
            messageEl.textContent = `${GameState.opponentName}'i ${myScore.totalScore} - ${opScore.totalScore} skorla yenerek maçı kazandınız!`;
            sfx.playGameWin();
            launchConfetti();
        } else if (opScore.totalScore > myScore.totalScore) {
            titleEl.textContent = '💀 KAYBETTİNİZ...';
            titleEl.style.background = 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)';
            titleEl.style.webkitBackgroundClip = 'text';
            titleEl.style.webkitTextFillColor = 'transparent';
            messageEl.textContent = `${GameState.opponentName} maçı ${opScore.totalScore} - ${myScore.totalScore} skorla kazandı.`;
            sfx.playGameLose();
        } else {
            titleEl.textContent = '🤝 BERABERE!';
            titleEl.style.color = '#fff';
            titleEl.style.webkitTextFillColor = '#fff';
            messageEl.textContent = `Kıran kırana geçen maç ${myScore.totalScore} - ${opScore.totalScore} beraberlikle bitti!`;
            sfx.playGameWin();
        }
        
        document.getElementById('game-over-modal').classList.add('visible');
    }, 1500);
}

// --- DYNAMIC SPACE BG STARS GENERATOR ---
function createSpaceBackground() {
    const spaceBg = document.getElementById('space-bg');
    if (!spaceBg) return;
    
    // Prevent duplicate star generation
    if (spaceBg.querySelectorAll('.star').length > 0) return;
    
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        star.style.opacity = Math.random() * 0.7 + 0.3;
        
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 5;
        star.style.setProperty('--twinkle-duration', `${duration}s`);
        star.style.animationDelay = `${delay}s`;
        
        spaceBg.appendChild(star);
    }
}

// Generate stars on load
document.addEventListener('DOMContentLoaded', createSpaceBackground);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    createSpaceBackground();
}
