const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');

//Define route for out trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(tripsController.tripsAddTrip);

//GET Method routes tripsFindByCode - requires parameter
//PUT Method routes tripsUpdateTrip - requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(tripsController.tripsUpdateTrip);

module.exports = router;