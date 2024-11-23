import express from 'express';
import auth from '../middlewares/auth.js';
import {ViewTender,CreateTender,Tender,PlaceBid,ViewBid,updateTender} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/create-tender',auth('createTender'), CreateTender);
router.patch('/tender',auth('createTender'), updateTender);
router.get('/view-tender',auth('viewTender'), ViewTender);
router.get('/tender/:id',auth('viewTender'), Tender);
router.post('/bid',auth('placeBid'), PlaceBid);
router.get('/bid/:tenderId',auth('viewBid'), ViewBid);
export default router;