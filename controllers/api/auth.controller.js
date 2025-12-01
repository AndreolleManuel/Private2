import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { getUserByMail, createUser, getRoleByName } from "../../services/index.js";
import { BadRequestError, ConflictError, NotFoundError, ForbiddenError, httpStatusCodes } from "../../utils/index.js";

export const authController = {

  // method to register a new user
  async registerUser(req, res) {
    const userData = req.body;
    const userPassword = userData.password;
    const userConfirmPassword = userData.confirmPassword;

    if (userData.confirmPassword) {
      if (userPassword !== userConfirmPassword) {
        throw new BadRequestError("Passwords do not match", { field: "confirmPassword", value: userConfirmPassword });
      }
    }
    const hashedPassword = await argon2.hash(userPassword);

    const existingUser = await getUserByMail(userData.mail);
    if (existingUser) {
      throw new ConflictError("Email already taken", { field: "mail", value: userData.mail });
    }

    // set the default role to "user"
    if (!userData.role) {
      userData.role = "user";
    }
    const userRole = await getRoleByName(userData.role);
    if (!userRole) {
      throw new NotFoundError("Default role not found", { field: "role", value: userData.role });
    }

    // create the new user
    const newUser = await createUser({ mail: userData.mail, password: hashedPassword, role_id: userRole.id });

    // Create a JWT token for the new user
    const token = jwt.sign({ mail: newUser.mail, role: userRole.name, id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // send a success response
    res.status(httpStatusCodes.CREATED).json({ message: "User registered successfully", mail: newUser.mail, role: userData.role, token });
  },

  // Controller for user login
  async login(req, res) {
    const userData = req.body;
    const user = await getUserByMail(userData.mail);
    if (!user) {
      throw new NotFoundError("Invalid email or password");
    }
    const isPasswordValid = await argon2.verify(user.password, userData.password);
    if (!isPasswordValid) {
      throw new ForbiddenError("Invalid password");
    }
    // Generate the JWT token
    const token = jwt.sign({ mail: user.mail, role: user.role.name, id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Authenticate the user
    res.status(httpStatusCodes.OK).json({ message: "Login successful", token, user: { id: user.id, mail: user.mail, role: user.role.name } });
  },
};