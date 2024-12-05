const API_URL = '/api';

// Populate dropdowns
async function refreshDropdowns() {
    const [genres, artists, albums] = await Promise.all([
        fetch(`${API_URL}/genres`).then(res => res.json()),
        fetch(`${API_URL}/artists`).then(res => res.json()),
        fetch(`${API_URL}/albums`).then(res => res.json())
    ]);

    const genreDropdown = document.getElementById('albumGenre');
    genreDropdown.innerHTML = genres.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('');

    const artistDropdown = document.getElementById('trackArtist');
    artistDropdown.innerHTML = artists.map(artist => `<option value="${artist.name}">${artist.name}</option>`).join('');

    const albumDropdown = document.getElementById('trackAlbum');
    albumDropdown.innerHTML = albums.map(album => `<option value="${album.title}">${album.title} (${album.releaseYear})</option>`).join('');
}

// Add Artist
async function addArtist() {
    const name = document.getElementById('artistName').value.trim();
    if (!name) return alert('Artist name is required');
    await fetch(`${API_URL}/artists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    alert('Artist added successfully');
    refresh();
}

// Add Genre
async function addGenre() {
    const name = document.getElementById('genreName').value.trim();
    if (!name) return alert('Genre name is required');
    await fetch(`${API_URL}/genres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    alert('Genre added successfully');
    refresh();
}

// Add Album
async function addAlbum() {
    const title = document.getElementById('albumName').value.trim();
    const releaseYear = document.getElementById('albumYear').value;
    if (!title || !releaseYear) return alert('Album name and genre are required');
    await fetch(`${API_URL}/albums`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, releaseYear })
    });
    alert('Album added successfully');
    refresh();
}

// Add Track
async function addTrack() {
    const title = document.getElementById('trackTitle').value.trim();
    const artist = document.getElementById('trackArtist').value;
    const album = document.getElementById('trackAlbum').value;
    const genre = document.getElementById('albumGenre').value;
    const duration = document.getElementById('trackDuration').value;
    if (!title || !artist || !album || !genre || !duration) return alert('Track title, artist, and album are required');
    await fetch(`${API_URL}/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, album, genre, duration })
    });
    alert('Track added successfully');
    refresh();
}

// Fetch and display data
async function fetchData() {
    const [artists, genres, albums, tracks] = await Promise.all([
        fetch(`${API_URL}/artists`).then(res => res.json()),
        fetch(`${API_URL}/genres`).then(res => res.json()),
        fetch(`${API_URL}/albums`).then(res => res.json()),
        fetch(`${API_URL}/tracks`).then(res => res.json())
    ]);
    console.log(tracks);
    const dataDisplay = document.getElementById('dataDisplay');
    dataDisplay.innerHTML = `
    <h3>Artists</h3>
    <ul>${artists.map(a => `<li onclick="tracksByArtist('${a.name}')"><div>${a.name}</div> <button onclick="removeArtist('${a.name}')">Remove</button></li>`).join('')}</ul>
    <h3>Genres</h3>
    <ul>${genres.map(g => `<li onclick="tracksByGenre('${g.name}')"><div>${g.name}</div> <button onclick="removeGenre('${g.name}')">Remove</button></li>`).join('')}</ul>
    <h3>Albums</h3>
    <ul>${albums.map(a => `<li onclick="tracksByAlbum('${a.title}')"><div>${a.title} (Release Year: ${a.releaseYear})</div> <button onclick="removeAlbum('${a.title}')">Remove</button></li>`).join('')}</ul>
    <h3>Tracks</h3>
    <ul>${tracks.map(t => `<li><div>${t.title} - ${t.duration} (Artist: ${t.artist}, Album: ${t.album}, Genre: ${t.genre})</div> <button onclick="removeTrack('${t.title}')">Remove</button></li>`).join('')}</ul>
  `;
}

// Remove Artist
async function removeArtist(name) {
    await fetch(`${API_URL}/artists/` + encodeURIComponent(name), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    alert('Artist removed successfully');
    refresh();
}

// Remove Genre
async function removeGenre(name) {
    await fetch(`${API_URL}/genres/` + encodeURIComponent(name), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    alert('Genre removed successfully');
    refresh();
}

// Remove Album
async function removeAlbum(title) {
    await fetch(`${API_URL}/albums/` + encodeURIComponent(title), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    alert('Album removed successfully');
    refresh();
}

// Remove Track
async function removeTrack(title) {
    await fetch(`${API_URL}/tracks/` + encodeURIComponent(title), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    alert('Track removed successfully');
    refresh();
}

async function tracksByArtist(artist) {
    console.log(artist)
    const tracks = await fetch(`${API_URL}/tracks/by-artist/${artist}`).then(res => res.json());
    console.log(tracks);
    const dataDisplay = document.getElementById('dataDisplayTracks');
    dataDisplay.innerHTML = `
    <h3>Tracks performed by: ${artist}</h3>
    <ul>${tracks.map(t => `<li><div>${t.title} - ${t.duration} (Album: ${t.album}, Genre: ${t.genre})</div> <button onclick="removeTrack('${t.title}')">Remove</button></li>`).join('')}</ul>
  `;
}

async function tracksByGenre(genre) {
    const tracks = await fetch(`${API_URL}/tracks/by-genre/${genre}`).then(res => res.json());
    console.log(tracks);
    const dataDisplay = document.getElementById('dataDisplayTracks');
    dataDisplay.innerHTML = `
    <h3>Tracks belong to: ${genre}</h3>
    <ul>${tracks.map(t => `<li><div>${t.title} - ${t.duration} (Artist: ${t.artist}, Album: ${t.album})</div> <button onclick="removeTrack('${t.title}')">Remove</button></li>`).join('')}</ul>
  `;
}

async function tracksByAlbum(album) {
    const tracks = await fetch(`${API_URL}/tracks/by-album/${album}`).then(res => res.json());
    console.log(tracks);
    const dataDisplay = document.getElementById('dataDisplayTracks');
    dataDisplay.innerHTML = `
    <h3>Tracks part of: ${album}</h3>
    <ul>${tracks.map(t => `<li><div>${t.title} - ${t.duration} (Artist: ${t.artist}, Genre: ${t.genre})</div> <button onclick="removeTrack('${t.title}')">Remove</button></li>`).join('')}</ul>
  `;
}


function refresh() {
    fetchData();
    refreshDropdowns();
}

refresh();


