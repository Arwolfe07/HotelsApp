const mongoose = require('mongoose');
const Hotel = require('../models/hotel');
const cities = require('./cities');
const Jabber = require('jabber');
const jabber = new Jabber();

mongoose.connect('mongodb://localhost:27017/motelsdb', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const seedDB = async () => {
    await Hotel.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const price = Math.floor(Math.random() * 30) + 20;
        const random1000 = Math.floor(Math.random()*1000);
        const hotel = new Hotel({
            name: `${jabber.createWord(6)} ` + `${jabber.createWord(9)} Hotel`,
            description: `${jabber.createParagraph(30)}`,
            price: price,
            author: '63a33f2d71fd8c623bc63319',
            // image: 'https://source.unsplash.com/collection/VwPlC3bIur8',
            // image: 'https://images.unsplash.com/photo-1454388683759-ee76c15fee26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OHwxMzkwOTAyfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude,cities[random1000].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dmiwkobsc/image/upload/v1671793779/pp/bqob0thnyjif5s2cekl8.jpg',
                  filename: 'pp/bqob0thnyjif5s2cekl8'
                },
                {
                  url: 'https://res.cloudinary.com/dmiwkobsc/image/upload/v1671793782/pp/nsfshjj4ahcbsuaamueo.jpg',
                  filename: 'pp/nsfshjj4ahcbsuaamueo'
                }
              ],
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await hotel.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});


