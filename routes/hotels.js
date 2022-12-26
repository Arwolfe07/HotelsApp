const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHotel } = require('../middleware');
const hotels = require('../controllers/hotels');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(hotels.renderHotels))
    .post(isLoggedIn, upload.array('image'), validateHotel, catchAsync(hotels.createNewHotel))


router.get('/new', isLoggedIn, hotels.renderNewForm)

router.route('/:id')
    .get(catchAsync(hotels.showHotel))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHotel, catchAsync(hotels.updateHotel))
    .delete(isLoggedIn, isAuthor, catchAsync(hotels.deleteHotel))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hotels.renderEditForm))

module.exports = router;