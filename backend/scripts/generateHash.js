const bcrypt = require('bcryptjs');

const generateHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(`Salasana: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log('---');
};

// Luo hashit adminille ja harjoittelijalle
(async () => {
  await generateHash('admin123');      // Admin-salasana
  await generateHash('harjoittelija123'); // Harjoittelijan salasana
})();