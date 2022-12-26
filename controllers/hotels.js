const Hotel = require('../models/hotel');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.renderHotels = async (req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels })
}

module.exports.renderNewForm = (req, res) => {
    res.render('hotels/new');
}

module.exports.createNewHotel = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hotel.location,
        limit: 1
    }).send()
    const hotel = new Hotel(req.body.hotel);
    hotel.geometry = geoData.body.features[0].geometry;
    hotel.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.author = req.user._id;
    await hotel.save();
    // console.log(hotel);
    req.flash('success', 'Successfully created a new Hotel!');
    res.redirect(`/hotels/${hotel._id}`)
}

module.exports.showHotel = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!hotel) {
        req.flash('error', 'Cannot find that Hotel!');
        return res.redirect('/hotels')
    }
    res.render('hotels/show', { hotel })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
        req.flash('error', 'Cannot find that Hotel!');
        return res.redirect('/hotels')
    }
    res.render('hotels/edit', { hotel })
}

module.exports.updateHotel = async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id, { ...req.body.hotel });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.images.push(...imgs);
    await hotel.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await hotel.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully Updated the Hotel!')
    res.redirect(`/hotels/${hotel.id}`)
}

module.exports.deleteHotel = async (req, res) => {
    await Hotel.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully Deleted a Hotel');
    res.redirect('/hotels')
}