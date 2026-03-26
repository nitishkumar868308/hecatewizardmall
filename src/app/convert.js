const fs = require('fs');
const path = require('path');

// Read JSON
const rawData = fs.readFileSync('cities.json');
const cities = JSON.parse(rawData);

// ✅ DB column order (match Prisma model)
const headers = [
  "id",
  "name",
  "state_id",
  "state_code",
  "state_name",
  "country_id",
  "country_code",
  "country_name",
  "latitude",
  "longitude",
  "active",
  "deleted",
  "createdAt"
];

// Convert JSON → CSV
const rows = cities.map(c => [
  c.id,
  `"${c.name}"`,
  c.state_id ?? '',
  c.state_code ? `"${c.state_code}"` : '',
  c.state_name ? `"${c.state_name}"` : '',
  c.country_id ?? '',
  c.country_code ? `"${c.country_code}"` : '',
  c.country_name ? `"${c.country_name}"` : '',
  c.latitude ? `"${c.latitude}"` : '',
  c.longitude ? `"${c.longitude}"` : '',
  true,   // active
  0,      // deleted
  `"2024-05-23T10:00:00.000Z"`
].join(','));

// Combine
const csvData = [headers.join(','), ...rows].join('\n');

// Save file
fs.writeFileSync(path.join(__dirname, 'cities_fixed.csv'), csvData);

console.log("✅ cities_fixed.csv ready 🚀");