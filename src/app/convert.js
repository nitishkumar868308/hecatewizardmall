const fs = require('fs');

// 1. Aapki original file read karna
const rawData = fs.readFileSync('cities.json');
const cities = JSON.parse(rawData);

// 2. Data ko transform karna (Aapke bataye huye format mein)
const transformedData = cities.map(city => ({
    id: city.id,
    name: city.name,
    state_id: city.state_id,
    state_code: city.state_code,
    state_name: city.state_name,
    country_id: city.country_id,
    country_code: city.country_code,
    country_name: city.country_name,
    latitude: city.latitude,
    longitude: city.longitude,
    active: true, // Naya field
    deleted: 0,   // Naya field
    createdAt: "2024-05-23T10:00:00.000Z" // Naya field
}));

// 3. Nayi file save karna
fs.writeFileSync('converted_cities.json', JSON.stringify(transformedData, null, 4));

console.log("Done! 'converted_cities.json' ban gayi hai.");