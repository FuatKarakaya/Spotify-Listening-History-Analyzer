# 🎧 Spotify Listening History Analyzer (Node.js)

A simple, flexible Node.js tool to analyze your full Spotify listening history downloaded via the [Spotify Data Request Portal](https://www.spotify.com/account/privacy/). It outputs the top songs and artists by number of plays and listening duration — with customizable date ranges and filters.

---

## ✅ Features

- 🔍 **Top songs** and **top artists**
- 🕒 Filter by **date range** (start & end)
- ⏱️ Sort by **play count** or **listening time**
- 🎯 Only counts streams **longer than 30 seconds**
- 📅 Includes **offline** and **private** sessions if synced

---

## 📦 Setup Instructions

### 1. **Requirements**
- [Node.js](https://nodejs.org/) (v14 or newer)

### 2. **Download your data from Spotify**
- Visit [spotify.com/account/privacy](https://www.spotify.com/account/privacy)
- Request your **extended listening history**
- When it’s ready, download the `.zip` file
- Extract all `Streaming_History_Audio_*.json` files

### 3. **Project Structure**

Place your JSON files into a folder called `spotify_data`, like this:

spotify-analyzer/
├── analyze.js
├── README.md
├── spotify_data/
│ ├── Streaming_History_Audio_2023_0.json
│ ├── Streaming_History_Audio_2024_1.json
│ └── ...


### 4. **Run the script**

In your terminal:

```bash
node analyze.js
