const express = require('express');
const { getAllArtists, addArtist, deleteArtist } = require('../controllers/artistController');


const router = express.Router();

router.get('/', getAllArtists);
router.post('/', addArtist);
router.delete('/:name', deleteArtist);

module.exports = router;