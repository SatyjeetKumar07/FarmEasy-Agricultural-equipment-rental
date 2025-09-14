const express = require('express');
const router = express.Router();
const {
  createClient,
  getClientsByOwner,
  getClientsByFarmer,
  updateClientStatus
} = require('../controllers/clientController');
const validateToken = require('../middleware/validateTokenHandler');

router.post('/', validateToken, createClient);
router.get('/owner/:ownerId', validateToken, getClientsByOwner);
router.get('/farmer/:farmerId', validateToken, getClientsByFarmer);
router.put('/:clientId', validateToken, updateClientStatus);

module.exports = router;
