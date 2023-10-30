import Notification from "../Models/Notificationmodel.js";


export const getallnotification = async (req, res, next) => {
    try {
      const userId = req.userId;
  
      // Find notifications where userId matches the receiver field
      const notifications = await Notification.find({ receiver: userId }).populate('user', 'username profilepicture');;
  
      res.status(200).json({ status: 'true', data: notifications });
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      next(error);
    }
  };
  