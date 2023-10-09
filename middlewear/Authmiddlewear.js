import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwtcreation.js";

const userAuthMid = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token is provided, return an error
    if (!token) {
      throw new AppError('Authentication failed: Token missing', 401);
    }

    // Verify the token and extract the user ID
    const { userId } = verifyToken(token);
    // If the token is invalid or doesn't contain a user ID, return an error
    if (!userId) {
      throw new AppError('Authentication failed: Invalid token', 401);
    }

    // Attach the user ID to the request for future use
    req.userId = userId;
    next();
  } catch (error) {
    // Handle any errors that occur during authentication
    next(error);
  }
};

export default userAuthMid;

