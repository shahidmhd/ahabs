import User from '../Models/Usermodel.js'; // Import your User model (adjust the import path as needed)

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    
    // Return the users as a JSON response
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log(error);
    // Handle any errors that occur during the database query
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const editprofile=async(req,res)=>{
console.log(req.params.username);
}


export const addprofilepicture=async(req,res)=>{
  console.log(req.params.username);
  }
  