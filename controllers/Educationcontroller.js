import Education from "../Models/Educationmodel.js";
import AppError from "../utils/AppError.js";

export const createEducationStatus = async (req, res, next) => {
    const userId = req.userId;

    try {
      if (!userId) {
        throw new AppError('User not found', 404);
      }
  
      const { institutionName, termOfStudy, admissionDate, stillStudying, completionDate, developedSkills, isPublic } = req.body;
  
      // Check if there is no data in req.body
      if (!Object.keys(req.body).length) {
        throw new AppError('No data provided', 400);
      }
  
      // Construct the update object with only the fields that are provided in the request body
      const updateObject = {};
      if (institutionName) updateObject.institutionName = institutionName;
      if (termOfStudy) updateObject.termOfStudy = termOfStudy;
      if (admissionDate) updateObject.admissionDate = admissionDate;
      if (stillStudying !== undefined) updateObject.stillStudying = stillStudying;
      if (completionDate) updateObject.completionDate = completionDate;
      if (developedSkills) updateObject.developedSkills = developedSkills;
      if (isPublic !== undefined) updateObject.isPublic = isPublic;
  
      // Find the education record for the given user and update only the specified fields or create a new one
      const updatedEducation = await Education.findOneAndUpdate(
        { userId },
        { $set: updateObject },
        { new: true, upsert: true } // Return the updated document and create a new one if not found
      );
  
      return res.status(200).json({
        status: 'true',
        message: 'Education status updated or created successfully',
        data: updatedEducation,
      });
    } catch (error) {
      console.error('Error updating or creating education status:', error);
      next(error);
    }
};


// get Educationstatus currentuser

export const getEducationstatus = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Use findOne to get profile details for the specific userId
    const EducationDetails = await Education.findOne({ userId });

    if (!EducationDetails) {
      // Handle the case where no matching profile details are found
      throw new AppError('User Educationdetails not found', 404);
    }

    // Return the profile details if found
    return res.status(200).json({
      status: 'true',
      message: 'Educationstatus retrieved successfully',
      data: EducationDetails,
    });
  } catch (error) {
    console.error("Error retrieving Educationdetails:", error);
    next(error);
  }
}