const express = require('express');
const { getAllGenres, addGenre, deleteGenre } = require('../controllers/genreController');


const router = express.Router();

router.get('/', getAllGenres);
router.post('/', addGenre);
router.delete('/:name', deleteGenre);

module.exports = router;
