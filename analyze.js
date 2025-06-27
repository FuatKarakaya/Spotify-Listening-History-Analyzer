const fs = require('fs');
const path = require('path');

// ---- CONFIG ----
const DATA_DIR = './spotify_data';
const MIN_PLAY_DURATION = 30000;

// ---- HELPERS ----
function getAllJsonFiles(dirPath) {
    return fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.json'))
        .map(file => path.join(dirPath, file));
}

function loadStreamData(files) {
    let all = [];
    files.forEach(file => {
        const raw = fs.readFileSync(file);
        const data = JSON.parse(raw);
        all = all.concat(data);
    });
    return all;
}

function filterValidStreams(streams, minMs = MIN_PLAY_DURATION) {
    return streams.filter(entry => entry.ms_played >= minMs);
}

function filterStreamsByDateRange(streams, startDate = null, endDate = null) {
    return streams.filter(entry => {
        const ts = new Date(entry.ts);
        return (!startDate || ts >= new Date(startDate)) &&
               (!endDate || ts <= new Date(endDate));
    });
}

function getSongStats(streams) {
    const stats = {};
    streams.forEach(entry => {
        const title = entry.master_metadata_track_name || '(Unknown)';
        const artist = entry.master_metadata_album_artist_name || '(Unknown)';
        const key = `${title} - ${artist}`;
        if (!stats[key]) stats[key] = { count: 0, duration: 0 };
        stats[key].count += 1;
        stats[key].duration += entry.ms_played;
    });
    return stats;
}

function getArtistStats(streams) {
    const stats = {};
    streams.forEach(entry => {
        const artist = entry.master_metadata_album_artist_name || '(Unknown)';
        if (!stats[artist]) stats[artist] = { count: 0, duration: 0 };
        stats[artist].count += 1;
        stats[artist].duration += entry.ms_played;
    });
    return stats;
}

function sortStatsByDurationDescending(stats) {
    return Object.entries(stats).sort((a, b) => {
        const durA = typeof a[1] === 'object' ? a[1].duration : a[1];
        const durB = typeof b[1] === 'object' ? b[1].duration : b[1];
        return durB - durA;
    });
}

function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

// ---- SONGS ----
function printTopSongs(sortBy = "count", startDate = null, endDate = null, limit = 20) {
    let streams = filterStreamsByDateRange(validStreams, startDate, endDate);
    const songStats = getSongStats(streams);

    let sorted;
    if (sortBy === "count") {
        sorted = Object.entries(songStats).sort((a, b) => b[1].count - a[1].count);
    } else {
        sorted = sortStatsByDurationDescending(songStats);
    }

    console.log(`\n🎵 Top ${limit} Songs${startDate ? ` after ${startDate}` : ''}${endDate ? ` until ${endDate}` : ''}, sorted by ${sortBy}:`);
    for (let i = 0; i < Math.min(limit, sorted.length); i++) {
        const [title, data] = sorted[i];
        console.log(`${i + 1}. ${title} — ${data.count} plays, ${formatDuration(data.duration)}`);
    }
}

// ---- ARTISTS ----
function printTopArtists(sortBy = "count", startDate = null, endDate = null, limit = 20) {
    let streams = filterStreamsByDateRange(validStreams, startDate, endDate);
    const artistStats = getArtistStats(streams);

    let sorted;
    if (sortBy === "count") {
        sorted = Object.entries(artistStats).sort((a, b) => b[1].count - a[1].count);
    } else {
        sorted = Object.entries(artistStats).sort((a, b) => b[1].duration - a[1].duration);
    }

    console.log(`\n🎤 Top ${limit} Artists${startDate ? ` after ${startDate}` : ''}${endDate ? ` until ${endDate}` : ''}, sorted by ${sortBy}:`);
    for (let i = 0; i < Math.min(limit, sorted.length); i++) {
        const [artist, data] = sorted[i];
        console.log(`${i + 1}. ${artist} — ${data.count} plays, ${formatDuration(data.duration)}`);
    }
}

// ---- MAIN ----
const allStreams = loadStreamData(getAllJsonFiles(DATA_DIR));
const validStreams = filterValidStreams(allStreams);

// EXAMPLES
console.log("\n=== Songs by Count (Last 12 Months) ===");
printTopSongs("count", "2024-06-27T00:00:00Z", "2025-06-27T00:00:00Z", 50);

console.log("\n=== Songs by Duration (All Time) ===");
printTopSongs("duration", null, null, 30);

console.log("\n=== Artists by Duration (After 2024-11-29) ===");
printTopArtists("duration", "2024-11-29T00:00:00Z", null, 20);

console.log("\n=== Artists by Count (2024 only) ===");
printTopArtists("count", "2024-01-01T00:00:00Z", "2024-12-31T23:59:59Z", 20);
