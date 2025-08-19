// scripts/hash-password.js
const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = process.argv[2];

  if (!password) {
    console.error('Usage: node scripts/hash-password.js <your_password_here>');
    process.exit(1);
  }

  try {
    // A salt round of 12 is a good, secure default
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    
    // Encode the hash in Base64 to avoid issues with special characters in .env files
    const base64EncodedHash = Buffer.from(hashedPassword).toString('base64');
    
    console.log('Your Base64-encoded hashed password is:');
    console.log(base64EncodedHash);
    console.log('\nCopy this value into your .env.local file for the ADMIN_PASSWORD variable.');
    console.log('It is now safe to use without quotes, though using them is still good practice.');
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

hashPassword();
