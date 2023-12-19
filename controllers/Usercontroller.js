import User from '../Models/Usermodel.js'; // Import your User model (adjust the import path as needed)
import {s3 } from '../config/Awss3.js'
import AppError from '../utils/AppError.js';
import Room from '../Models/Roommodel.js';
import Notification from '../Models/Notificationmodel.js';
import  mongoose  from 'mongoose';

// Now you can use ObjectId in your code


  // get all users api

export const getAllUsers = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return the users as a JSON response
    res.status(200).json({ status:'true', count: users.length, data: users });
  } catch (error) {
    console.log(error);
    // Handle any errors that occur during the database query
    next(error)
  }
};

// get all users not currentuser api

export const getAllUsersnotcurrentuser = async (req, res, next) => {
  const userId = req.userId; 

  try {
    // Fetch all users from the database excluding the current user
    const users = await User.find({ _id: { $ne: userId } });

    // Return the users as a JSON response
    res.status(200).json({ status: 'true', count: users.length, data: users });
  } catch (error) {
    console.log(error);
    // Handle any errors that occur during the database query
    next(error);
  }
};



// edit profile datas api

export const editprofile = async (req, res, next) => {
  try {
    const userId = req.userId
    // Validate that the user exists
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Concurrently check the existence of the desired username, phone number, and email
    const [existingUserWithUsername, existingUserWithPhone, existingUserWithEmail] = await Promise.all([
      req.body.username && req.body.username !== user.username ? User.findOne({ username: req.body.username }) : null,
      req.body.phone && req.body.phone !== user.phone ? User.findOne({ phone: req.body.phone }) : null,
      req.body.email && req.body.email !== user.email ? User.findOne({ email: req.body.email }) : null
    ]);


    // Check if the desired username is already in use
    if (existingUserWithUsername) {
      throw new AppError('Username is already exist', 409);
    }

    // Check if the desired phone number is already in use
    if (existingUserWithPhone) {
      throw new AppError('Phone number is already in exist', 409);
    }

    // Check if the desired email is already in use
    if (existingUserWithEmail) {
      throw new AppError('Email is already in exist', 409);
    }

    // Update user fields based on the request data
    const allowedFields = [
      'username', 'email', 'phone', 'password', 'gender', 'dateOfBirth', 'Bio', 'profilepicture','purpose','profiletype','profileframe','profilecard','address','workingaddress','links'
      // Add more fields as needed
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    // Save the updated user document
    await user.save();

    // Respond with a success message and the updated user document
    res.status(200).json({ status: 'true', message: 'Profile updated successfully',data:user  });
  } catch (error) {
    console.error('Error updating profile:', error);
    next(error);
  }
};


// add profile picture

export const addprofilepicture = async (req, res, next) => {
  const userId = req.params.id;
  try {
    if (!req.file) {
      throw new AppError('No file uploaded.', 400)
    }

    const { originalname, buffer } = req.file;
    const params = {
      Bucket: 'ahabsimages',
      Key: `profile-pictures/${originalname}`, // Adjust the path and filename as needed
      Body: buffer,
    };

    // Upload the file to S3
    const uploadResponse = await s3.upload(params).promise();

    // Get the URL of the uploaded image
    const imageUrl = uploadResponse.Location;
    // Update the user's profile picture URL in the database
    await User.findByIdAndUpdate(userId, { profilepicture: imageUrl });


    return res.status(200).json({status:'true', message: 'profile uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    next(error)
  }
}

// current user api

export const currentuser=async(req,res,next)=>{
  const userId = req.params.id;
  try {
    // Fetch the user from the database based on the id parameter
    const user = await User.findById(userId);

    if (user) {
    res.status(200).json({status: 'true', user,});
    } else {
    throw new AppError('user not found',404)
    }
  } catch (err) {
   next(err)
  }
}

// followuser api

export const followuser = async (req, res, next) => {
       const currentUserId = req.userId; // Get the current user ID from req.body
       const friendId = req.params.id; // Get the friend's ID from route parameters
  try {

    // Fetch both the current user and the friend to follow concurrently using Promise.all

    const [currentUser, friendToFollow] = await Promise.all([
      User.findById(currentUserId),
      User.findById(friendId),
    ]);

    if (!friendToFollow) {
      throw new AppError('Friend not found',404)
    }
    
    // Check if the current user is already following the friend
    if (currentUser.following.includes(friendId)) {
      throw new AppError('You are already following this friend',400)
    }

    // Update the current user's following list
    currentUser.following.push(friendId);

    // Update the friend's followers list
    friendToFollow.followers.push(currentUserId);

    // Save both user documents
    await Promise.all([currentUser.save(), friendToFollow.save()]);
 // Create a notification for the friend who was followed
     const notification = new Notification({
      receiver: friendId,
      user: currentUserId,
      content:" started to following you.",
    });

      const data=  await notification.save();
      await data.populate('user','username')
    res.status(200).json({status:'true', message: 'You are now following this friend',notification:data });
  } catch (error) {
    console.error(error);
   next(error)
  }
};

// unfollowuser api

export const unfollowUser = async (req, res, next) => {
  const currentUserId =req.userId; // Get the current user ID from req.body
  const friendId = req.params.id; // Get the friend's ID from route parameters
  try {
    // Find the current user and the friend to unfollow
    const [currentUser, friendToUnfollow] = await Promise.all([
      User.findById(currentUserId),
      User.findById(friendId),
    ]);

    if (!currentUser || !friendToUnfollow) {
      throw new AppError('User not found',404)
    }

    // Check if the current user is not following the friend
    if (!currentUser.following.includes(friendId)) {
      throw new AppError('You are not following this friend',400)
    }

    // Remove the friend from the current user's following list
    currentUser.following = currentUser.following.filter(id => id.toString() !== friendId);

    // Remove the current user from the friend's followers list
    friendToUnfollow.followers = friendToUnfollow.followers.filter(id => id.toString() !== currentUserId);

    // Save both user documents
    await Promise.all([currentUser.save(), friendToUnfollow.save()]);

         // Delete the notification associated with this unfollow action
    await Notification.findOneAndDelete({
      receiver: friendId,
      user: currentUserId,
      content:" started to following you.",
    });

    res.status(200).json({status:'true', message: 'You have unfollowed this friend' });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// check follow status api

export const checkFollowStatus = async (req, res, next) => {
  const currentUserId = req.userId; // Get the current user ID from req.body
  const userIdToCheck = req.params.id; // Get the user's ID to check from route parameters

  try {
   // Fetch both the current user and the user to check concurrently using Promise.all
   const [currentUser, userToCheck] = await Promise.all([
    User.findById(currentUserId),
    User.findById(userIdToCheck),
  ]);

    if (!currentUser || !userToCheck) {
      // return res.status(404).json({ message: 'User not found' });
      throw new AppError('User not found ',404)
    }

    // Check if the current user is following the user to check
    const isFollowing = currentUser.following.includes(userIdToCheck);

    // Check if the user to check is following the current user
    const isFollowedBy = userToCheck.following.includes(currentUserId);

    // Check if it's a mutual follow (both follow each other)
    const isMutualFollow = isFollowing && isFollowedBy;

    if (isMutualFollow) {
      return res.status(200).json({ message: 'Both' });
    } else if (isFollowing) {
      return res.status(200).json({ message: 'following' });
    } else if (isFollowedBy) {
      return res.status(200).json({ message: 'follower' });
    } else {
      return res.status(200).json({ message: 'Neither' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// check bothfollow users get api

// export const checkbothFollow = async (req, res, next) => {
//   const currentUserId = req.userId; // Get the current user ID from req.body

//   try {
//     // Fetch both the current user and the user to check concurrently using Promise.all
//     const currentUser = await User.findById(currentUserId);

//     if (!currentUser) {
//       throw new AppError("User not found ", 404);
//     }
//     //  Promise.all to concurrently convert followers arrays to sets
//     const [setFollowersA, setFollowersB] = await Promise.all([
//       Promise.resolve(new Set(currentUser.followers.map(String))),
//       Promise.resolve(new Set(currentUser.following.map(String))),
//     ]);

//     const commonElementIds = [...setFollowersA].filter((element) =>
//       setFollowersB.has(element)
//     );

//     // Fetch the actual user objects for the common elements

//     // const commonElements = await User.find({ _id: { $in: commonElementIds } });

// const commonElements = await User.aggregate([
//   {
//     $match: {
//       _id: {
//         $in: commonElementIds.map(id => {
//           try {
//             // Newer versions of mongoose
//             return mongoose.Types.ObjectId(id);
//           } catch (error) {
//             // Older versions of mongoose
//             return new mongoose.Types.ObjectId(id);
//           }
//         })
//       }
//     }
//   },
//   {
//     $project: {
//       username: 1,
//       profilepicture: 1
//     }
//   }
// ]);

//     return res.status(200).json({status: "true",message: "data getted successfully",data: commonElements,});

//   } catch (error) {
//     console.error(error);
//     next(error)
//   }
// };


// check bothfollow users get api

export const checkbothFollow = async (req, res, next) => {
  try {
    const currentUserId = req.userId;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    const setFollowersA = new Set(currentUser.followers.map(String));
    const setFollowersB = new Set(currentUser.following.map(String));

  // common elements get
    const commonElementIds = [...setFollowersA].filter(element =>
      setFollowersB.has(element)
    );

    const commonElements = await User.find({
      _id: { $in: commonElementIds.map(id => new mongoose.Types.ObjectId(id)) }
    }, { username: 1, profilepicture: 1 });
    

    return res.status(200).json({
      status: "true",
      message: "Data retrieved successfully",
      data: commonElements
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};







// list followers api

export const listFollowers = async (req, res, next) => {
  const currentUserId = req.params.id; // Get the current user's ID from route parameters

  try {
    // Find the current user
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    // Get the IDs of the current user's followers
    const followerIds = currentUser.followers;

    // Fetch the follower profiles based on their IDs
    
    // Fetch the follower profiles based on their IDs, selecting only the specified fields
    const followers = await User.find(
      { _id: { $in: followerIds } },
      { username: 1, profilepicture: 1, _id: 1 }
    );
    res.status(200).json({
      status: 'true',
      followers,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// listFollowing api

export const listFollowing = async (req, res, next) => {
  const currentUserId = req.params.id; // Get the current user's ID from route parameters

  try {
    // Find the current user
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    // Get the IDs of the users that the current user is following
    const followingIds = currentUser.following;

    // Fetch the following profiles based on their IDs, selecting the desired fields
    const following = await User.find(
      { _id: { $in: followingIds } },
      { username: 1, profilepicture: 1, _id: 1 }
    );

    res.status(200).json({
      status: 'true',
      following,
    });
  } catch (error) {
    console.error(error);
   next(error)
  }
};

// create room api

export const createRoom = async (req, res, next) => {
  try {
    const selectedUserId = req.params.id;
    const createdByUserId = req.userId;

    // Check if a room with the same members exists
    const existingRoom = await Room.findOne({
      $and: [
        { 'members.user': selectedUserId },
        { 'members.user': createdByUserId },
      ],
    });
    
    if (existingRoom) {
      // If a room with the same members exists, return the existing room
      return res.status(200).json(existingRoom);
    }
    const newRoomName = `Room_${Date.now()}`;


     // Create a new room
     const newRoom = new Room({
      name: newRoomName,
      createdBy: createdByUserId,
      members: [
        { user: selectedUserId },
        { user: createdByUserId },
      ],
    });

    const room = await newRoom.save();
    res.status(201).json(room);
  } catch (err) {
    console.error('Error creating or checking the room:', err);
    next(err);
  }
};

// create  or Retrieve room api

export const createOrRetrieveRoom = async (req, res,next) => {
  try {
    const userId = req.params.id;
    const currentUser = req.userId; // Assuming you have user information in the request
    const roomName = req.body.roomName; // The room name from the request body

    // Check if a room already exists between the users
    const existingRoom = await Room.findOne({
      members: { $all: [currentUser._id, userId] },
    });

    if (existingRoom) {
      return res.status(200).json(existingRoom);
    }

    // Create a new room
    const newRoom = new Room({
      members: [currentUser._id, userId],
      name: roomName, // Optional: You can add a room name if provided
    });

    const savedRoom = await newRoom.save();

    return res.status(201).json(savedRoom);
  } catch (error) {
    console.error('Error creating or retrieving the room:', error);
    next(error)
  }
};


