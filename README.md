# 🛸 Cosmic Pişti Pro — Premium Multiplayer Card Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2014.0.0-blue.svg)](https://nodejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7.5-orange.svg)](https://socket.io)

**Pişti Pro** is a premium, web-based, real-time multiplayer implementation of the classic Turkish card game **Pişti**. Set against a breathtaking cosmic backdrop, the game features glassmorphic UI elements, fluid 3D card mechanics, atmospheric ambient glows, a smart offline AI, and robust online multiplayer lobbies powered by Socket.io and PeerJS.

---

## 🌟 Key Features

*   🌌 **Cosmic Aesthetics**: Immersive twinkling stars, active rotating nebulae, and high-fidelity ambient felt glows that make card-playing out of this world.
*   🌐 **Real-time Multiplayer**: Instantly generate secure lobby codes (e.g., `GXYZ`) to challenge friends in real-time, backed by authoritative server validation.
*   🤖 **Advanced AI Opponents**: Play offline against custom AI bots with adjustable difficulty levels (**Normal AI** & **Pro AI**) featuring card memory tracking.
*   🃏 **Tactile 3D Cards**: Fluid CSS 3D card flips, realistic dealing paths, organic table pile offsets, and dynamic hover-tilt effects.
*   🏆 **Dynamic Scoreboard**: Instant card counts, game status announcements (e.g., *Pişti!*, *Vale Piştisi!*), and a detailed game-over scorecard calculating card majorities (+3 points), special card points, and Piştis.
*   🔊 **Cinematic Sound Effects**: Engaging audio cues for dealing, capturing, scoring a Pişti, and general gameplay (with a mute toggle).

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Client)**
*   **Structure & Semantics**: HTML5 with optimized layout.
*   **Styling & Micro-animations**: Pure CSS3 variables, glassmorphism filters, 3D perspective transforms, and hardware-accelerated animations.
*   **Logic**: Authoritative client-side card rendering, offline AI logic, and responsive viewport sizing (fully playable on Mobile, Tablet & Desktop).
*   **P2P WebRTC**: Integrated PeerJS library for serverless peer connection support.

### **Backend (Server)**
*   **Server**: Node.js & Express framework.
*   **Sockets**: Socket.io for fully synchronized room states, turn management, and anti-cheat card calculations.

---

## 🚀 Getting Started (Local Development)

### **Prerequisites**
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### **1. Install Dependencies**
Navigate to the project directory and install the required modules:
```bash
npm install
```

### **2. Start the Server**
Launch the local Node.js server:
```bash
npm start
```
You should see:
```text
🛸 Cosmic Pişti Server is running on port 3000
🔗 Local link: http://localhost:3000
```

### **3. Open the Game**
Open your favorite web browser and navigate to:
```text
http://localhost:3000
```

---

## 🃏 Game Rules & Scoring

### **Core Gameplay**
1.  Both players start with 4 cards in hand, and 4 cards are dealt to the center pile (3 face down, 1 face up).
2.  On your turn, play a card onto the pile.
3.  **Capture**: If your played card matches the **rank** (e.g., A, 8, K) of the top card on the pile, or if you play a **Jack (J)**, you capture the entire pile.
4.  **Pişti**: If the pile contains only **one card** and you play a matching card, you score a **Pişti** (+10 points).
5.  **Double Pişti (Jack Pişti)**: If the pile contains only **one Jack (J)** and you play another Jack, you score a **Double Pişti** (+20 points).

### **Score Breakdown**
*   **As (A)**: +1 point each
*   **Vale (J)**: +1 point each
*   **Karo 10 (♦10)**: +3 points
*   **Sinek 2 (♣2)**: +2 points
*   **Card Majority Bonus**: The player who captures the most cards (27 or more out of 52) receives a **+3 points** bonus.

---

## 🛠️ GitHub'a Nasıl Yüklenir? (How to Push to GitHub)

Projeyi kendi GitHub hesabınızda yayınlamak için aşağıdaki adımları sırasıyla uygulayabilirsiniz:

### **1. GitHub'da Yeni Bir Depo (Repository) Oluşturun**
1.  Tarayıcınızda [GitHub](https://github.com) sitesine gidin ve giriş yapın.
2.  Sağ üst köşedeki **`+`** (Artı) butonuna tıklayıp **`New repository`** seçeneğini seçin.
3.  Repository name alanına `pisti-pro-multiplayer` veya istediğiniz bir adı yazın.
4.  **`Initialize this repository with`** altındaki hiçbir seçeneği seçmeyin (Readme, gitignore vb. eklemeyin çünkü biz zaten oluşturduk).
5.  En alttaki yeşil **`Create repository`** butonuna tıklayın.

### **2. Bilgisayarınızda Terminali Açın ve Kodları Girin**
Projenizin ana dizininde (bu klasörde) terminalde şu komutları sırasıyla çalıştırın:

```bash
# 1. Projeyi GitHub reposuna bağlayın (Kendi GitHub kullanıcı adınızı ve repo adınızı yazın)
git remote add origin https://github.com/<KULLANICI_ADINIZ>/<REPO_ADINIZ>.git

# 2. Ana dal adını 'main' olarak ayarlayın
git branch -M main

# 3. Kodları GitHub'a yükleyin
git push -u origin main
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **Antigravity**
