const express = require('express');
const { getAllAlbums, addAlbum, deleteAlbum } = require('../controllers/albumController');


const router = express.Router();

router.get('/', getAllAlbums);
router.post('/', addAlbum);
router.delete('/:title', deleteAlbum);

module.exports = router;