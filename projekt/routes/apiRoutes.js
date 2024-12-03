const express = require('express');

const artistRoutes = require('./artistRoutes');
const albumRoutes = require('./albumRoutes');
const trackRoutes = require('./trackRoutes');
const genreRoutes = require('./genreRoutes');


const router = express.Router();

router.use('/artists', artistRoutes);
router.use('/albums', albumRoutes);
router.use('/tracks', trackRoutes);
router.use('/genres', genreRoutes);


module.exports = router;