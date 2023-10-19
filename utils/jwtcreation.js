// jwt/jwtUtils.js

import jwt from 'jsonwebtoken'
 // Make sure to set this securely in your environment

export const generateToken=(userId) =>{
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Adjust expiration as needed
  return token;
}

export const verifyToken=(token)=> {
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Token verification failed');
  }
}

