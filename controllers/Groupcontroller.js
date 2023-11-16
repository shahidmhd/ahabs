import Group from "../Models/Groupmodel.js"
import { s3 } from '../config/Awss3.js'
import AppError from "../utils/AppError.js";

export const creategroup = async (req, res, next) => {
    try {
        const createdByUserId = req.userId;
        // Destructure properties from the request body
        const { name, description, participants } = req.body;
    
        // Check if the group chat name already exists
        const existingGroupChat = await Group.findOne({ name });
    
        if (existingGroupChat) {
          throw new AppError('Group name already exists', 400);
        }
    
        let imageUrl = null;
    
        // Check if an image was uploaded
        if (req.file) {
          // Upload the file to S3
          const { originalname, buffer } = req.file;
          const params = {
            Bucket: 'shahidbucketsample',
            Key: `groupprofile/${originalname}`,// Adjust the path and filename as needed
            Body: buffer,
          };
    
          // Upload the file to S3
          const uploadResponse = await s3.upload(params).promise();
    
          // Get the URL of the uploaded image
          imageUrl = uploadResponse.Location;
        }

         // Add the current user to the participants array from req.body
    const updatedParticipants = participants ? [...participants, createdByUserId] : [createdByUserId];
    
        // Create a new GroupChat instance
        const newGroupChat = new Group({
            createdBy:[createdByUserId],
          name,
          description,
          image: imageUrl,
          participants:updatedParticipants,
        });
    
        // Save the new group chat to the database
        const savedGroupChat = await newGroupChat.save();
    
        // Respond with the saved group chat
        res.status(200).json({status:"true",message: 'Group created successfully',data:savedGroupChat});
      } catch (error) {
        // Handle errors
        console.error(error);
       next(error)
      }
    };


    export const editgroup = async (req, res, next) => {
        try {
            const userId = req.userId;
          const { groupId } = req.params;
          const { name, description, participants } = req.body;
      
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId);
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }
   // Check if the user making the request is the creator of the group
   if (!existingGroupChat.createdBy.includes(userId)) {
     // Respond with an error if the user is not the creator
     throw new AppError('Unauthorized: You are not the creator of this group', 403);
   }
          if (name && name !== existingGroupChat.name) {
            // Check if the new group name already exists
            const existingGroupWithName = await Group.findOne({ name });
      
            if (existingGroupWithName) {
              // Respond with an error if the name already exists
              throw new AppError('Group name already exists', 400);
            }
          }
      
      
          // Check if a new image was uploaded
          if (req.file) {
            // Check if an image is associated with the existing group chat
            if (existingGroupChat.image) {
              // Delete the existing image from S3
              const existingKey = existingGroupChat.image.split('/').pop(); // Extract the existing filename
              const deleteParams = {
                Bucket: 'ahabs',
                Key: `groupprofile/${existingKey}`,
              };
              await s3.deleteObject(deleteParams).promise();
            }
      
            // Upload the new image to S3
            const { originalname, buffer } = req.file;
            const params = {
              Bucket: 'ahabs',
              Key: `groupprofile/${originalname}`, // Adjust the path and filename as needed
              Body: buffer,
            };
      
            // Upload the file to S3
            const uploadResponse = await s3.upload(params).promise();
      
            // Get the URL of the uploaded image
            existingGroupChat.image = uploadResponse.Location;
          }
      
          // Update the group chat data
          existingGroupChat.name = name || existingGroupChat.name;
          existingGroupChat.description = description || existingGroupChat.description;
          existingGroupChat.participants = participants || existingGroupChat.participants;
      
          // Save the updated group chat to the database
          const updatedGroupChat = await existingGroupChat.save();
      
          // Respond with the updated group chat
          res.status(200).json({status:"true",message: 'Group edited successfully',data:updatedGroupChat});
        } catch (error) {
          // Handle errors
          console.error(error);
        next(error)
        }
      };


      export const deletegroup = async (req, res, next) => {
        try {
          const { groupId } = req.params;
          const userId = req.userId;
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId);
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }

              // Check if the current user is the creator of the group
    if (!existingGroupChat.createdBy.includes(userId)) {
        // Respond with an error if the user is not the creator
        throw new AppError('Unauthorized: You are not the creator of this group', 403);
      }
  
      
          // Check if an image is associated with the existing group chat
          if (existingGroupChat.image) {
            // Delete the existing image from S3
            const existingKey = existingGroupChat.image.split('/').pop(); // Extract the existing filename
            const deleteParams = {
              Bucket: 'ahabs',
              Key: `groupprofile/${existingKey}`,
            };
            await s3.deleteObject(deleteParams).promise();
          }
      
          // Remove the group chat from the database
          await Group.deleteOne({ _id: groupId });

      
          // Respond with a success message
          res.status(200).json({ status: "true", message: 'Group deleted successfully' });
        } catch (error) {
          // Handle errors
          console.error(error);
          next(error);
        }
      };


      export const addUserToGroup = async (req, res, next) => {
        try {
          const { groupId } = req.params;
          const { userIdToAdd } = req.body;
          const currentUserId = req.userId;
      
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId);
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }
      
          // Check if the current user is the creator of the group
          if (!existingGroupChat.createdBy.includes(currentUserId)) {
            // Respond with an error if the user is not the creator
            throw new AppError('Unauthorized: You are not the creator of this group', 403);
          }
      
          // Check if the user to add is already a participant
          if (existingGroupChat.participants.includes(userIdToAdd)) {
            throw new AppError('User is already a participant in the group', 400);
          }
      
          // Add the user to the participants array
          existingGroupChat.participants.push(userIdToAdd);
      
          // Save the updated group chat to the database
          const updatedGroupChat = await existingGroupChat.save();
      
          // Respond with the updated group chat
          res.status(200).json({ status: "true", message: 'User added to the group successfully', data: updatedGroupChat });
        } catch (error) {
          // Handle errors
          console.error(error);
          next(error);
        }
      };

      export const removeUserFromGroup = async (req, res, next) => {
        try {
          const { groupId, userIdToRemove } = req.params;
          const currentUserId = req.userId; // Assuming you have the user ID in the request
      
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId);
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }
          // Check if the user making the request is the creator of the group
          if (!existingGroupChat.createdBy.includes(currentUserId)) {
            // Respond with an error if the user is not the creator
            throw new AppError('Unauthorized: You are not the creator of this group', 403);
          }

           // Check if the user to remove is the current user
    if (userIdToRemove === currentUserId) {
        throw new AppError('Cannot remove yourself from the group', 400);
      }
          
      
          // Check if the user to remove is a participant in the group
          if (!existingGroupChat.participants.includes(userIdToRemove)) {
            throw new AppError('User is not a participant in the group', 400);
          }
      

            // Remove the user from the participants array
    existingGroupChat.participants = existingGroupChat.participants.filter(
        participantId => participantId.toString() !== userIdToRemove.toString()
      );
  
      // If the user to remove is the creator of the group, remove them from the createdBy array
      if (existingGroupChat.createdBy.includes(userIdToRemove)) {
        existingGroupChat.createdBy = existingGroupChat.createdBy.filter(
          creatorId => creatorId.toString() !== userIdToRemove.toString()
        );
      }
      
          // Save the updated group chat to the database
          const updatedGroupChat = await existingGroupChat.save();
      
          // Respond with the updated group chat
          res.status(200).json({ status: "true", message: 'User removed from the group successfully', data: updatedGroupChat });
        } catch (error) {
          // Handle errors
          console.error(error);
          next(error);
        }
      };
      
    export const exitGroup = async (req, res, next) => {
        try {
          const { groupId } = req.params;
          const userIdToRemove = req.userId;
      
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId);
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }
      
          // Check if the user is a participant in the group
          if (!existingGroupChat.participants.includes(userIdToRemove)) {
            throw new AppError('User is not a participant in the group', 400);
          }
      
          // Check if the user is the creator of the group
          if (existingGroupChat.createdBy.includes(userIdToRemove)) {
            // If the user is the creator and there are other participants
            if (existingGroupChat.participants.length > 1) {
              // Remove the user from the createdBy array
              existingGroupChat.createdBy = existingGroupChat.createdBy.filter(
                creatorId => creatorId.toString() !== userIdToRemove.toString()
              );
      
              // Randomly select a new creator from the participants
              const randomParticipantIndex = Math.floor(Math.random() * existingGroupChat.participants.length);
              const newCreatorId = existingGroupChat.participants[randomParticipantIndex];
        // Add the new creator to the createdBy array
        existingGroupChat.createdBy.push(newCreatorId);
              // Remove the userIdToRemove from the participants array
              existingGroupChat.participants = existingGroupChat.participants.filter(
                participantId => participantId.toString() !== userIdToRemove.toString()
              );
            } else {
              // If the user is the only participant, delete the group
              await Group.deleteOne({ _id: groupId });
              return res.status(200).json({ status: "true", message: 'Group deleted successfully' });
            }
          } else {
            // If the user is not the creator, remove the user from the participants array
            existingGroupChat.participants = existingGroupChat.participants.filter(
              participantId => participantId.toString() !== userIdToRemove.toString()
            );
          }
      
          // Save the updated group chat to the database
          const updatedGroupChat = await existingGroupChat.save();
      
          // Respond with the updated group chat
          res.status(200).json({ status: "true", message: 'User exited the group successfully', data: updatedGroupChat });
        } catch (error) {
          // Handle errors
          console.error(error);
          next(error);
        }
      };
      
      
      export const addAdmin = async (req, res, next) => {
        try {
          const { groupId} = req.params;
          const { userIdToAdd } = req.body;
          const currentUserId = req.userId;
      
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId);
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }
      
          // Check if the current user is the creator of the group (admin)
          if (!existingGroupChat.createdBy.includes(currentUserId)) {
            // Respond with an error if the user is not the creator (admin)
            throw new AppError('Unauthorized: You are not the admin of this group', 403);
          }
      
          // Check if the user to add as an admin is already a participant
          if (!existingGroupChat.participants.includes(userIdToAdd)) {
            throw new AppError('User is not a participant in the group', 400);
          }
      
          // Check if the user to add as an admin is already an admin
          if (existingGroupChat.createdBy.includes(userIdToAdd)) {
            throw new AppError('User is already an admin in the group', 400);
          }
      
            // Check if the user to add as a participant is already an admin
    if (!existingGroupChat.createdBy.includes(userIdToAdd)) {
        // If not, add them to the createdBy array (making them an admin)
        existingGroupChat.createdBy.push(userIdToAdd);
      }
  
      // Save the updated group chat to the database
      const updatedGroupChat = await existingGroupChat.save();
        
      
          // Respond with the updated group chat
          res.status(200).json({ status: "true", message: 'User added as an admin to the group successfully', data: updatedGroupChat });
        } catch (error) {
          // Handle errors
          console.error(error);
          next(error);
        }
      };
      

      export const removeAdmin = async (req, res, next) => {
        try {
          const { groupId } = req.params;
          const { userIdToRemove } = req.body;
          const currentUserId = req.userId;
      
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId);
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }
      
          // Check if the current user is the creator of the group (admin)
          if (!existingGroupChat.createdBy.includes(currentUserId)) {
            // Respond with an error if the user is not the creator (admin)
            throw new AppError('Unauthorized: You are not the admin of this group', 403);
          }
      
          // Check if the user to remove as an admin is already a participant
          if (!existingGroupChat.participants.includes(userIdToRemove)) {
            throw new AppError('User is not a participant in the group', 400);
          }
      
          // Check if the user to remove as an admin is actually an admin
          if (!existingGroupChat.createdBy.includes(userIdToRemove)) {
            throw new AppError('User is not an admin in the group', 400);
          }
      
          // Check if the user to remove as an admin is the current user
          if (userIdToRemove.toString() === currentUserId.toString()) {
            throw new AppError('Cannot remove your own admin status', 400);
          }
      
          // Remove the user from the createdBy array (revoking admin status)
          existingGroupChat.createdBy = existingGroupChat.createdBy.filter(
            adminId => adminId.toString() !== userIdToRemove.toString()
          );
      
          // Save the updated group chat to the database
          const updatedGroupChat = await existingGroupChat.save();
      
          // Respond with the updated group chat
          res.status(200).json({
            status: "true",
            message: 'User removed as an admin from the group successfully',
            data: updatedGroupChat
          });
        } catch (error) {
          // Handle errors
          console.error(error);
          next(error);
        }
      };
      
      

      export const getGroupMembers = async (req, res, next) => {
        try {
          const { groupId } = req.params;
      
          // Check if the group chat exists
          const existingGroupChat = await Group.findById(groupId).populate('participants');
      
          if (!existingGroupChat) {
            // Respond with an error if the group chat does not exist
            throw new AppError('Group not found', 404);
          }
      
          // Get the list of group members with their details populated
          const groupMembers = existingGroupChat.participants;
      
          // Respond with the list of group members
          res.status(200).json({ status: 'true', data: groupMembers });
        } catch (error) {
          // Handle errors
          console.error(error);
          next(error);
        }
      };