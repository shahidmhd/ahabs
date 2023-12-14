
//  add profile details

import Profiledetails from "../Models/Profiledetailsmodel.js";
import AppError from "../utils/AppError.js";

export const createprofiledetails = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Destructure the relevant fields from req.body
    const {
      isPublic,
      birth,
      gender,
      religion,
      citizenship,
      language,
      habits,
      interest,
    } = req.body;

     // Check if there is no data in req.body
     if (!Object.keys(req.body).length) {
        throw new AppError('No data provided', 400);
      }
  

    // Use findOneAndUpdate with upsert option
    const result = await Profiledetails.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          isPublic,
          birth,
          gender,
          religion,
          citizenship,
          language,
          habits,
          interest,
        },
      },
      { new: true, upsert: true } // Return the updated document and create a new one if not found
    );

    return res.status(200).json({
      status: 'true',
      message:'Profile details upsert successfully',
      data: result,
    });
  } catch (error) {
    console.error("Error creating/updating profile details:", error);
    next(error);
  }
};


// get currentuserprofiledetail

export const getprofiledetails = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Use findOne to get profile details for the specific userId
    const profileDetails = await Profiledetails.findOne({ userId });

    if (!profileDetails) {
      // Handle the case where no matching profile details are found
      throw new AppError('User profiledetails not found', 404);
    }

    // Return the profile details if found
    return res.status(200).json({
      status: 'true',
      message: 'Profile details retrieved successfully',
      data: profileDetails,
    });
  } catch (error) {
    console.error("Error retrieving profile details:", error);
    next(error);
  }
};