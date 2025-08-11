const userModel = require("../models/userModel");
const cloudinary = require("cloudinary").v2;

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    if (!users) {
      res.status(404).json({
        status: "error",
        message: "Users not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "Could not find user",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const updateSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(400).json({
        status: "error",
        message: "User does not exist",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "user updated successfully",
      user,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const deleteSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User does not exist",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "User deleted succesfully",
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const userData = await userModel.findById(_id).select("-password");
    if (!userData) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      userData,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, age, gender } = req.body;
    const imageFile = req.file;
    if (!name || !age || !gender) {
      res.status(400).json({
        status: "error",
        message: "missing details",
      });
      return;
    }
    const user = await userModel.findByIdAndUpdate(
      _id,
      { name, age, gender },
      { new: true }
    );
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      const userImage = await userModel.findByIdAndUpdate(
        _id,
        { image: imageUrl },
        { new: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Update successfull",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};





module.exports = {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  getUserProfile,
  updateUserProfile,
  
};
