import menubar from "../../Models/Admin/Menu.js";
import cloudinary from "../../utils/cloudinary.js"

export const AddMenus = async (req, res, next) => {
    try {
      console.log(req.body, "ddddddddddatr");
      console.log(req.file, "filllles");
  
      // Check if req.file is available
      if (!req.file) {
        throw new Error('File not provided');
      }
  
      const { name, icon, title, description } = req.body;
  
      const result = await cloudinary.uploader.upload(req.file.path); 
      const imageurl = result.url;
  
      const datas = await menubar.create({ name, icon, title, description, image: imageurl });
  
      res.status(201).json({
        success: true,
        message: "Added Successfully",
        data: datas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error,
        message: error.message,
      });
      console.log(error);
      next(error);
    }
  };
  
export const GetAllMenus = async(req,res,next)=>{
    try {
        const datas = await menubar.find()
        res.status(201).json({
            success:true,
            message:"data Get sucessfully",
            data:datas
            })
    } catch (error) {
        res.status(500).json({
            success:false,
            error:error,
            message:error.message
        })
        console.log(error);
        next(error)
    }
}