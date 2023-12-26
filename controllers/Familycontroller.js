import Family from "../Models/Familymodel.js";
import AppError from "../utils/AppError.js";

export const Addfamilymember = async (req, res, next) => {
  const userId = req.userId;
  const otherUserId = req.params.id; // Extracting otherUserId from req.params
  const relationshipType = req.body.relationship; // Extracting relationship type from req.body

  try {
    // Check if userId, otherUserId, or relationshipType is missing
    if (!userId || !otherUserId || !relationshipType) {
      throw new AppError("Required information missing", 400);
    }

    // Find the Family document for the current user
    let family = await Family.findOne({ currentUserId: userId });

    if (!family) {
      // If family document does not exist, create a new one
      family = new Family({ currentUserId: userId });
    }

    // Check if otherUserId and currentUserId are the same
if (userId.toString() === otherUserId.toString()) {
    throw new AppError("You cannot add yourself as a family member", 400);
  }

  // Check if otherUserId already exists in the specified relationship type array
if (family.relationships.hasOwnProperty(relationshipType)) {
    const relationshipArray = family.relationships[relationshipType];
  
    if (relationshipArray.includes(otherUserId)) {
      throw new AppError(`${otherUserId} already exists in ${relationshipType}`, 400);
    }
  
    // If otherUserId does not exist, push it to the array
    relationshipArray.push(otherUserId);
  } else {
    throw new AppError("Invalid relationship type", 400);
  }
  

    // Save the updated family document
    await family.save();

    res.status(201).json({
      status: "success",
      message: `Added ${otherUserId} to ${relationshipType}`,
      data: family
    });

  } catch (error) {
    console.error("Error adding family member:", error);
    next(error);
  }
};
