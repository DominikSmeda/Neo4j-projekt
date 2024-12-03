const express = require('express');
const { getAllTracks, addTrack, getTracksByGenre, getTracksByArtist, getTracksByAlbum, deleteTrack } = require('../controllers/trackController');


const router = express.Router();

router.get('/', getAllTracks);
router.post('/', addTrack);
router.get('/by-genre/:genreName', getTracksByGenre);
router.get('/by-artist/:artistName', getTracksByArtist);
router.get('/by-album/:albumName', getTracksByAlbum);
router.delete('/:title', deleteTrack)

module.exports = router;
