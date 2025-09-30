import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
       // get user details from frontend
       // Validation - not empty
       // check if user already exists : username, email
       // check for images, check for avatar
       // upload images to cloudinary, check if avatar is uploaded
       // create user object - create entry in db
       // remove password and refresh token from response
       // check for user creation
       // return response

       const {username, email, fullName, password} = req.body
       
       if([fullName, username, email, password].some((field) => field?.trim() === "")) {
              throw new ApiError(400, "All fields are required")
       }

       const existedUser = await User.findOne({ $or: [{username}, {email}]})

       if(existedUser) {
              throw new ApiError(409, "User already exists with same username or email");
       }

       const avatarLocalPath = req.files?.avatar[0]?.path;
       const coverImgLocalPath = req.files?.coverImg[0]?.path;
       
       if(!avatarLocalPath) {
              throw new ApiError(400, "Avatar is required");
       }

       const avatar = await uploadOnCloudinary(avatarLocalPath);
       const coverImg = await uploadOnCloudinary(coverImgLocalPath);

       if(!avatar) {
              throw new ApiError(500, "Could not upload avatar, please try again");
       }

       const user = await User.create({
              fullName,
              avatar: avatar.url,
              coverImg: coverImg?.url || "",
              username: username.toLowerCase(),
              email,
              password
       })

       const createdUser = await User.findById(user._id).select("-password -refreshToken");

       if(!createdUser) {
              throw new ApiError(500, "Something went wrong while registering user, please try again");
       }

       return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));

});

export { registerUser };
