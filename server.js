/**
 * PİŞTİ PRO - MULTIPLAYER GAME SERVER
 * Authoritative real-time game state manager using Node.js, Express & Socket.io
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Port configuration (supports cloud environments like Render/Railway)
const PORT = process.env.PORT || 3000;

// Serve static client files (index.html, style.css, app.js) directly
app.use(express.static(path.join(__dirname, '.')));

// --- DECK & GAME RULES HELPER FUNCTIONS ---
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
    const deck = [];
    SUITS.forEach(suit => {
        const color = (suit === '♥' || suit === '♦') ? 'red' : 'black';
        const suitName = suit === '♠' ? 'Maca' : suit === '♥' ? 'Kupa' : suit === '♦' ? 'Karo' : 'Sinek';
        
        RANKS.forEach(rank => {
            let point = 0;
            if (rank === 'A' || rank === 'J') point = 1;
            else if (suit === '♦' && rank === '10') point = 3; // Karo 10
            else if (suit === '♣' && rank === '2') point = 2;  // Sinek 2
            
            deck.push({
                suit: suit,
                suitName: suitName,
                suitColor: color,
                rank: rank,
                point: point,
                id: `${suit}-${rank}`
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

// Map to store active game rooms
// Key: roomCode (e.g. "GXYZ"), Value: Room State Object
const rooms = new Map();

// Generate unique 5-letter uppercase room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    do {
        code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (rooms.has(code));
    return code;
}

// --- REAL-TIME SOCKET CONNECTION MANAGMENT ---
io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // 1. CREATE ROOM
    socket.on('create-room', (nickname) => {
        const roomCode = generateRoomCode();
        const nicknameClean = nickname ? nickname.trim().substring(0, 15) : 'Kurucu';
        
        const roomState = {
            code: roomCode,
            players: [
                {
                    socketId: socket.id,
                    name: nicknameClean,
                    hand: [],
                    captured: [],
                    pistis: [],
                    score: 0
                }
            ],
            deck: [],
            pile: [],
            turnIdx: 0, // 0 = Player 1, 1 = Player 2
            lastCollectorIdx: null,
            gameStarted: false
        };

        rooms.set(roomCode, roomState);
        socket.join(roomCode);
        
        socket.emit('room-created', {
            roomCode: roomCode,
            players: roomState.players.map(p => ({ name: p.name, id: p.socketId }))
        });
        
        console.log(`[Room] Created ${roomCode} by player ${nicknameClean} (${socket.id})`);
    });

    // 2. JOIN ROOM
    socket.on('join-room', ({ roomCode, nickname }) => {
        const code = roomCode ? roomCode.trim().toUpperCase() : '';
        const nicknameClean = nickname ? nickname.trim().substring(0, 15) : 'Misafir';

        if (!rooms.has(code)) {
            socket.emit('error-msg', 'Oda bulunamadı. Lütfen kodu kontrol edin.');
            return;
        }

        const room = rooms.get(code);

        if (room.gameStarted) {
            socket.emit('error-msg', 'Oyun zaten başladı. Odaya giriş yapamazsınız.');
            return;
        }

        if (room.players.length >= 2) {
            socket.emit('error-msg', 'Oda dolu (Maksimum 2 oyuncu).');
            return;
        }

        // Add player to room
        const newPlayer = {
            socketId: socket.id,
            name: nicknameClean,
            hand: [],
            captured: [],
            pistis: [],
            score: 0
        };
        room.players.push(newPlayer);
        socket.join(code);

        console.log(`[Room] Player ${nicknameClean} joined room ${code}`);

        // Notify room members
        io.to(code).emit('room-updated', {
            players: room.players.map(p => ({ name: p.name, id: p.socketId }))
        });

        // Trigger game start automatically once both players are ready
        if (room.players.length === 2) {
            startMultiplayerGame(room);
        }
    });

    // 3. PLAY CARD
    socket.on('play-card', ({ roomCode, card }) => {
        const code = roomCode ? roomCode.trim().toUpperCase() : '';
        if (!rooms.has(code)) return;

        const room = rooms.get(code);
        if (!room.gameStarted) return;

        const playerIdx = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIdx === -1 || playerIdx !== room.turnIdx) {
            socket.emit('error-msg', 'Sıra sizde değil!');
            return;
        }

        const player = room.players[playerIdx];
        
        // Remove card from player hand
        player.hand = player.hand.filter(c => c.id !== card.id);
        
        // Add to pile
        room.pile.push(card);
        const len = room.pile.length;

        // Determine Match or Vale captures
        let isCapture = false;
        let isPisti = false;
        let isDoublePisti = false;

        if (len >= 2) {
            const topCard = room.pile[len - 1];
            const prevCard = room.pile[len - 2];
            
            const isMatch = topCard.rank === prevCard.rank;
            const isJackCapture = topCard.rank === 'J';

            if (isMatch || isJackCapture) {
                isCapture = true;
                room.lastCollectorIdx = playerIdx;

                // Evaluate Pişti
                if (len === 2 && isMatch) {
                    isPisti = true;
                    if (topCard.rank === 'J') {
                        isDoublePisti = true; // Vale Piştisi
                    }
                }
            }
        }

        // Prepare response data
        const responseData = {
            playerPlayedId: socket.id,
            cardPlayed: card,
            turnIdx: room.turnIdx,
            isCapture: isCapture,
            isPisti: isPisti,
            isDoublePisti: isDoublePisti,
            pileLen: len
        };

        if (isCapture) {
            const capturedCards = [...room.pile];
            room.pile = [];
            
            player.captured.push(...capturedCards);
            if (isPisti) {
                player.pistis.push({ rank: card.rank, double: isDoublePisti });
            }
            
            responseData.capturedCount = capturedCards.length;
            
            // Broadcast capture state
            io.to(code).emit('card-captured', responseData);
        } else {
            // Broadcast regular play
            io.to(code).emit('card-played', responseData);
        }

        // Move to next turn after dealing animations finish (delay client-side is 600ms)
        setTimeout(() => {
            evaluateNextTurn(room);
        }, 500);
    });

    // 4. DISCONNECT / LEAVE ROOM
    socket.on('disconnect', () => {
        console.log(`[Socket] Disconnected: ${socket.id}`);
        
        // Find rooms containing this socket
        for (const [code, room] of rooms.entries()) {
            const playerIdx = room.players.findIndex(p => p.socketId === socket.id);
            if (playerIdx !== -1) {
                console.log(`[Room] Player ${room.players[playerIdx].name} disconnected from room ${code}`);
                
                // Notify the opponent
                socket.to(code).emit('opponent-left', {
                    message: 'Rakibinizin bağlantısı koptu. Oyun lobiye yönlendiriliyor.'
                });
                
                // Destroy room
                rooms.delete(code);
                break;
            }
        }
    });
});

// --- SERVER-AUTHORITATIVE GAME CONTROLLER ---
function startMultiplayerGame(room) {
    room.gameStarted = true;
    room.deck = createDeck();
    shuffle(room.deck);

    room.pile = [];
    room.lastCollectorIdx = null;

    // Deal center pile (3 face down, 1 face up)
    for (let i = 0; i < 4; i++) {
        room.pile.push(room.deck.pop());
    }

    // Deal hands
    dealHands(room);

    // Randomize starting turn index (0 or 1)
    room.turnIdx = Math.floor(Math.random() * 2);

    // Sync initial state to both clients
    room.players.forEach((player, index) => {
        io.to(player.socketId).emit('game-start', {
            roomCode: room.code,
            pile: room.pile,
            hand: player.hand,
            opponentName: room.players[1 - index].name,
            opponentHandCount: 4,
            turnIdx: room.turnIdx,
            deckRemaining: room.deck.length,
            yourIndex: index
        });
    });

    console.log(`[Game] Started in room ${room.code}. Initial turn: Player ${room.players[room.turnIdx].name}`);
}

function dealHands(room) {
    if (room.deck.length < 8) return false;

    room.players.forEach(player => {
        player.hand = [];
        for (let i = 0; i < 4; i++) {
            player.hand.push(room.deck.pop());
        }
    });

    return true;
}

function evaluateNextTurn(room) {
    const p0 = room.players[0];
    const p1 = room.players[1];

    // Check if hands are empty
    if (p0.hand.length === 0 && p1.hand.length === 0) {
        // Deal next hands
        const dealt = dealHands(room);
        
        if (dealt) {
            // Hands dealt, sync new hands to respective clients
            room.players.forEach((player, index) => {
                io.to(player.socketId).emit('hands-dealt', {
                    hand: player.hand,
                    opponentHandCount: 4,
                    deckRemaining: room.deck.length
                });
            });
            // Keep same turn order or toggle? Standard is player next in sequence plays.
            // Sockets logic continues.
        } else {
            // Deck is empty, evaluate final game totals!
            endMultiplayerGame(room);
            return;
        }
    }

    // Toggle Turn index
    room.turnIdx = 1 - room.turnIdx;
    
    // Broadcast active turn update
    io.to(room.code).emit('turn-updated', {
        turnIdx: room.turnIdx,
        playersHandCount: room.players.map(p => p.hand.length)
    });
}

function endMultiplayerGame(room) {
    console.log(`[Game] Ended in room ${room.code}. Calculating scores...`);

    // Give remaining pile cards to last collector
    let remainingHandled = false;
    let remainingCardsCount = room.pile.length;
    let finalCollectorSocketId = null;

    if (remainingCardsCount > 0 && room.lastCollectorIdx !== null) {
        const remaining = [...room.pile];
        room.pile = [];
        
        const collector = room.players[room.lastCollectorIdx];
        collector.captured.push(...remaining);
        finalCollectorSocketId = collector.socketId;
        remainingHandled = true;
    }

    // Score Calculations
    const scores = room.players.map(p => {
        let cardScore = 0;
        p.captured.forEach(c => cardScore += c.point);

        let pistiScore = 0;
        p.pistis.forEach(ps => pistiScore += ps.double ? 20 : 10);

        return {
            socketId: p.socketId,
            cardsCaptured: p.captured.length,
            pistiPoints: pistiScore,
            specialPoints: cardScore,
            bulkPoints: 0, // calculated below
            totalScore: cardScore + pistiScore
        };
    });

    // Card majority bonus (+3 points)
    const c0 = scores[0].cardsCaptured;
    const c1 = scores[1].cardsCaptured;
    if (c0 > c1) {
        scores[0].bulkPoints = 3;
        scores[0].totalScore += 3;
    } else if (c1 > c0) {
        scores[1].bulkPoints = 3;
        scores[1].totalScore += 3;
    }

    // Broadcast results
    io.to(room.code).emit('game-over', {
        scores: scores,
        players: room.players.map(p => ({ id: p.socketId, name: p.name })),
        remainingHandled: remainingHandled,
        remainingCardsCount: remainingCardsCount,
        finalCollectorSocketId: finalCollectorSocketId
    });

    // Close the room after game completes
    rooms.delete(room.code);
}

// Run Server
server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛸 Cosmic Pişti Server is running on port ${PORT}`);
    console.log(`🔗 Local link: http://localhost:${PORT}`);
    console.log(`====================================================`);
});
