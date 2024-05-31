const User =require("../models/users")
const getAllUsers = async(req,res) => {
   try {
    const users = await User.find();
    if(!users || users.length===0)
        {
            return res.status(404).json({message:"No Users Found"});
        }
    res.status(200).json(users)
      

    } catch(error) {
        next(error)

    }
};

module.exports = getAllUsers;
