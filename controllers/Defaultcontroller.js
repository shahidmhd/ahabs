import profiletype from '../Models/Profiletypemodel.js';
import worktype from '../Models/Workingtypemodel.js'; 
import dresstype from '../Models/Dressmodel.js'; 



  // get all profiletype api

export const getAllprofiletypes = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const profiletypes = await profiletype.find();

    // Return the users as a JSON response
    res.status(200).json({ status:'true',data: profiletypes });
  } catch (error) {
    console.log(error);
    // Handle any errors that occur during the database query
    next(error)
  }
};


  // get all worktypes api

  export const getAllworktypes = async (req, res, next) => {
    try {
      // Fetch all users from the database
      const worktypes = await worktype.find();
  
      // Return the users as a JSON response
      res.status(200).json({ status:'true',data: worktypes });
    } catch (error) {
      console.log(error);
      // Handle any errors that occur during the database query
      next(error)
    }
  };
  

  // get all dresstype api

  export const getAlldresstypes = async (req, res, next) => {
    try {
      // Fetch all users from the database
      const dresstypes = await dresstype.find();
  
      // Return the users as a JSON response
      res.status(200).json({ status:'true',data: dresstypes });
    } catch (error) {
      console.log(error);
      // Handle any errors that occur during the database query
      next(error)
    }
  };