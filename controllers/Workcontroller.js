import Work from "../Models/Workstatusmodell.js";
import AppError from "../utils/AppError.js";

export const createWorkStatus = async (req, res, next) => {
  const userId = req.userId;

  try {
    if (!userId) {
      throw new AppError("User not found", 404);
    }

    const {
      isPublic,
      workTitle,
      workLocation,
      workingType,
      workingFor,
      typeofOrganization,
      dateOfJoining,
      currentlyWorking,
      dateOfResign,
      developedSkills,
    } = req.body;
    // Check if there is no data in req.body
    if (!Object.keys(req.body).length) {
      throw new AppError("No data provided", 400);
    }

    const updateObject = {};
    if (workTitle) updateObject.workTitle = workTitle;
    if (workLocation) updateObject.workLocation = workLocation;
    if (workingType) updateObject.workingType = workingType;
    if (workingFor) updateObject.workingFor = workingFor;
    if (typeofOrganization)
      updateObject.typeofOrganization = typeofOrganization;
    if (dateOfJoining) updateObject.dateOfJoining = dateOfJoining;
    if (currentlyWorking !== undefined)
      updateObject.currentlyWorking = currentlyWorking;
    if (dateOfResign) updateObject.dateOfResign = dateOfResign;
    if (developedSkills) updateObject.developedSkills = developedSkills;
    if (isPublic !== undefined) updateObject.isPublic = isPublic;

    // Find the education record for the given user and update only the specified fields or create a new one
    const updatedwork = await Work.findOneAndUpdate(
      { userId },
      { $set: updateObject },
      { new: true, upsert: true } // Return the updated document and create a new one if not found
    );

    return res.status(200).json({
      status: "true",
      message: "Work status updated or created successfully",
      data: updatedwork,
    });
  } catch (error) {
    console.error("Error updating or creating work status:", error);
    next(error);
  }
};

// get workoutstatus currentuser

export const getworkoutstatus = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Use findOne to get profile details for the specific userId
    const WorkDetails = await Work.findOne({ userId });

    if (!WorkDetails) {
      // Handle the case where no matching profile details are found
      throw new AppError('User Workdetails not found', 404);
    }

    // Return the profile details if found
    return res.status(200).json({
      status: 'true',
      message: 'Workstatus retrieved successfully',
      data: WorkDetails,
    });
  } catch (error) {
    console.error("Error retrieving Workdetails:", error);
    next(error);
  }
}