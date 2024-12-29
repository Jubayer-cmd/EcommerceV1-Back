import bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { sendEmail } from './sentResetMail';
import envConfig from '../../../config/envConfig';
import { jwtHelpers } from '../../../utils/jwtHelpers';

const prisma = new PrismaClient();
// creating user
const createUserService = async (data: any): Promise<User | null> => {
  console.log('checl', data, envConfig.bycrypt_salt_rounds);
  const hashedPassword = await bcrypt.hash(
    data?.password,
    Number(envConfig.bycrypt_salt_rounds),
  );
  data.password = hashedPassword;
  const result = await prisma.user.create({
    data: data,
  });
  if (!result) {
    throw new ApiError(400, 'failed to create User');
  }
  return result;
};

const getByEmailFromDB = async (email: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log('check the result', result);
  return result;
};

const getByPhoneFromDB = async (phone: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      phone: phone,
    },
  });
  console.log('check the result', result);
  return result;
};

// checkPassword
const checkPassword = async (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(givenPassword, savedPassword);
};

const loginUserService = async (payload: {
  email?: string;
  phone?: string;
  password: string;
}): Promise<ILoginUserResponse> => {
  const { email, phone, password } = payload;

  let isUserExist;

  if (phone) {
    isUserExist = await getByPhoneFromDB(phone);
  } else if (email) {
    isUserExist = await getByEmailFromDB(email);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email or phone is required');
  }

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await checkPassword(password, isUserExist.password))
  ) {
    throw new ApiError(401, 'Password is incorrect');
  }

  // Create access token & refresh token
  const { id, role } = isUserExist;
  console.log('check the role', role, id);
  const accessToken = jwtHelpers.createToken(
    { id, role, email: isUserExist.email },
    envConfig.jwt.secret as Secret,
    envConfig.jwt.expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { id, role, email: isUserExist.email },
    envConfig.jwt.refresh_secret as Secret,
    envConfig.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// getrefresh
const getRefreshTokenService = async (
  token: string,
): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      envConfig.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(403, 'Invalid Refresh Token');
  }

  const { email } = verifiedToken;

  // checking deleted user's refresh token

  const isUserExist = await getByEmailFromDB(email);
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
      email: isUserExist.email,
    },
    envConfig.jwt.secret as Secret,
    envConfig.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  id: string | '',
  payload: { oldPassword: string; newPassword: string },
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await checkPassword(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  // hash password before saving
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(envConfig.bycrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  const passResetToken = await jwtHelpers.createResetToken(
    { email: user.email },
    envConfig.jwt.secret as string,
    '50m',
  );

  console.log(passResetToken);

  const resetLink: string = envConfig.clientUrl + `token=${passResetToken}`;

  console.log('profile:', resetLink);

  await sendEmail(
    user.email,
    `
      <div>
        <p>Hi, ${user.name}</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `,
  );

  return {
    message: 'Check your email!',
  };
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const { email, newPassword } = payload;

  // Use count instead of findUnique to check if the user exists
  const userExists = await prisma.user.count({
    where: {
      email: email,
    },
  });

  if (!userExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  // Check if the token is valid
  const isVerified = await jwtHelpers.verifyToken(
    token,
    envConfig.jwt.secret as string,
  );

  if (isVerified.email !== email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token!');
  }

  console.log(isVerified);

  if (!isVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token!');
  }

  // Hash the new password
  const password = await bcrypt.hash(
    newPassword,
    Number(envConfig.bycrypt_salt_rounds),
  );

  // Update the user's password
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: password,
    },
  });
};

const getUserDetails = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return result;
};
export const authService = {
  createUserService,
  loginUserService,
  getByEmailFromDB,
  getRefreshTokenService,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserDetails,
};
