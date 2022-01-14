// the database

const mongoose = require('mongoose');

 async function main() {
         await mongoose.connect('mongodb://localhost:27017/yelpcamp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
         })
        console.log('DATABASE CONNECTED')
        }

    main().catch(err => {
        console.log('ERROR, CONNECTION FAILED'),
        console.log(err)
    });


    // ejs, file and directory links


    // NB: the .. before the forward slash is there to go back by one directory
    const Campground = require('../models/campground')
    const cities = require('./cities')
    const {  places, descriptors } = require('./seedHelpers');

    // My code
    
    const sample = array => array[Math.floor(Math.random() * array.length)];

    const seedDB = async () => {
        await Campground.deleteMany({});
        for(let i = 0; i < 300; i++){
            const random1000 = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10;
            const camp = new Campground({
                author: '61d384b382e39f4c86c98cf5',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic, pariatur. Earum, sapiente! Numquam amet enim consequatur, ratione inventore vitae tempore! Commodi fugiat accusantium quia, eaque aut sunt illum repellat recusandae!',
                price,
                geometry: {
                   type: 'Point',
                    coordinates: [ 
                      cities[random1000].longitude,  
                      cities[random1000].latitude 
                    ] 
                  },
                images: [
                    {
                      url: 'https://res.cloudinary.com/lstew9821/image/upload/v1641814926/YelpCamp/u9xim1qmzhltdkzffyxq.jpg',
                      filename: 'YelpCamp/u9xim1qmzhltdkzffyxq',
                    },
                    {
                      url: 'https://res.cloudinary.com/lstew9821/image/upload/v1641814928/YelpCamp/xanzpigg8i6gtynfzfma.jpg',
                      filename: 'YelpCamp/xanzpigg8i6gtynfzfma',
                    },
                    {
                      url: 'https://res.cloudinary.com/lstew9821/image/upload/v1641814928/YelpCamp/bkx3qmvjbqvekvrdsk3c.jpg',
                      filename: 'YelpCamp/bkx3qmvjbqvekvrdsk3c',
                    }
                  ]
        })
        await camp.save();
    }
}

seedDB()


// refresh your file on gitbash with node seeds/index.js