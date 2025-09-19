import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {

  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  console.log("REQ FILE:", req.file);
  console.log("REQ FILES:", req.files);
  console.log("BODY:", req.body);

  // Destructure required fields from request body
  const { fullname, username, email, password } = req.body
  // console.log("email", email)

  // Validation: ensure none of the required fields are empty
  if ([fullname, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }
// Check if user already exists (by email OR username)

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (existedUser) {
    throw new ApiError(409, "User with email or username existed")
  }

    // Extract local file path for avatar (must be uploaded by user)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path

    // Extract local file path for cover image (optional upload)
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

    // If avatar is missing → throw error
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }
  // Upload avatar image to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

    // Upload cover image to Cloudinary (if provided)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Double-check: if avatar upload failed → throw error
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }

    //  Create new user in database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

    // Fetch created user (excluding sensitive fields like password + refreshToken)
  const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // If user creation failed somehow → throw error
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user")
  }

    // Success → return created user response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
})

export { registerUser }