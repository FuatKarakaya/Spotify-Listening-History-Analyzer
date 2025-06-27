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
```

## Usage: `printTopSongs` & `printTopArtists`

At the bottom of your `analyze.js`, you can call these functions with different parameters to get exactly the stats you want.

### `printTopSongs(sortBy, startDate, endDate, limit)`

- **`sortBy`**: `"count"` (play count) or `"duration"` (total listening time)  
- **`startDate`**, **`endDate`**: ISO-formatted strings (e.g. `"2024-01-01T00:00:00Z"`), or `null` for unbounded  
- **`limit`**: Number of top items to display (default: `20`)

```js
// EXAMPLES
console.log("\n=== Songs by Count (Last 12 Months) ===");
printTopSongs("count", "2024-06-27T00:00:00Z", "2025-06-27T00:00:00Z", 50);

console.log("\n=== Songs by Duration (All Time) ===");
printTopSongs("duration", null, null, 30);

console.log("\n=== Artists by Duration (After 2024-11-29) ===");
printTopArtists("duration", "2024-11-29T00:00:00Z", null, 20);

console.log("\n=== Artists by Count (2024 only) ===");
printTopArtists("count", "2024-01-01T00:00:00Z", "2024-12-31T23:59:59Z", 20);

