const crypto = require('crypto');

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'food-delivery-app-secret-key-2024';
const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET_KEY).digest();
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function encryptCardNumber(text) {
  if (!text) return null;
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend IV to encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    console.error('Encryption error:', err.message);
    throw new Error('Failed to encrypt card number');
  }
}

function decryptCardNumber(encryptedText) {
  if (!encryptedText) return null;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      // If not in new format, might be old unencrypted data
      return encryptedText;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err.message);
    // If decryption fails, return the original (might be old unencrypted data)
    return encryptedText;
  }
}

function getLast4Digits(cardNumber) {
  if (!cardNumber) return 'N/A';
  
  try {
    // Try to decrypt first
    const decrypted = decryptCardNumber(cardNumber);
    // If it's still encrypted (decryption failed), use original
    const number = decrypted.length > 20 ? cardNumber : decrypted;
    // Extract last 4 digits
    const digits = number.replace(/\D/g, ''); // Remove non-digits
    return digits.slice(-4) || 'N/A';
  } catch (err) {
    // If all else fails, try to extract from original
    const digits = cardNumber.replace(/\D/g, '');
    return digits.slice(-4) || 'N/A';
  }
}

module.exports = {
  encryptCardNumber,
  decryptCardNumber,
  getLast4Digits
};

