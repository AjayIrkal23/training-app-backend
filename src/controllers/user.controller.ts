import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../models/User";
import bcrypt from "bcrypt";

// ✅ Create new user
export const createUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    let newUser = new User(request.body);
    newUser.active = false;
    const savedUser = await newUser.save();
    return reply.code(201).send(savedUser);
  } catch (error) {
    return reply
      .code(400)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Login user and return full user without password
export const loginUser = async (
  request: FastifyRequest<{ Body: { empId: string; password: string } }>,
  reply: FastifyReply
) => {
  try {
    const { empId, password } = request.body;
    const user = await User.findOne({ empId });

    if (!user || !(await user.comparePassword(password))) {
      return reply.code(401).send({ message: "Invalid credentials" });
    }

    if (!user.active) {
      return reply
        .code(401)
        .send({ message: "Account Inactive Please Contact Admin" });
    }

    const token = user.generateJWT();
    await user.save();

    // Convert user document to plain object and remove password
    const userObj = user.toObject();
    delete userObj.password;

    return reply.send({
      token,
      user: userObj,
    });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Logout user
export const logoutUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) return reply.code(401).send({ message: "Token not found" });

    const user = await User.findOne({ jwtoken: token });
    if (!user) return reply.code(401).send({ message: "Invalid session" });

    user.jwtoken = undefined;
    await user.save();

    return reply.send({ message: "Logout successful" });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Get all users without password and token
export const getAllUsers = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const users = await User.find().select("-password -jwtoken"); // 👈 Exclude fields
    return reply.send(users);
  } catch (error) {
    return reply
      .code(500)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Get user by empId (excluding password and token)
export const getUserByEmpId = async (
  request: FastifyRequest<{ Params: { empId: string } }>,
  reply: FastifyReply
) => {
  try {
    const user = await User.findOne({ empId: request.params.empId }).select(
      "-password -jwtoken"
    );
    if (!user) return reply.code(404).send({ message: "User not found" });
    return reply.send(user);
  } catch (error) {
    return reply
      .code(500)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Update user by empId using $set and model-level validation
export const updateUser = async (
  request: FastifyRequest<{
    Params: { empId: string };
    Body: Record<string, any>;
  }>,
  reply: FastifyReply
) => {
  try {
    const { empId } = request.params;
    const updateData = { ...request.body };

    // 🔐 Manually hash password if it's present in the update
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findOneAndUpdate(
      { empId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -jwtoken"); // 👈 hide sensitive fields in response

    if (!updatedUser) {
      return reply.code(404).send({ message: "User not found" });
    }

    return reply.send(updatedUser);
  } catch (error) {
    return reply
      .code(400)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Delete user by empId
export const deleteUser = async (
  request: FastifyRequest<{ Params: { empId: string } }>,
  reply: FastifyReply
) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      empId: request.params.empId,
    });
    if (!deletedUser)
      return reply.code(404).send({ message: "User not found" });
    return reply.send({ message: "User deleted successfully" });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Bulk update users using $set and password hashing
export const bulkUpdateUsers = async (
  request: FastifyRequest<{
    Body: {
      updates: {
        empId: string;
        data: Record<string, any>;
      }[];
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { updates } = request.body;

    const results = await Promise.all(
      updates.map(async ({ empId, data }) => {
        const updateData = { ...data };

        // 🔐 Handle password hashing if needed
        if (updateData.password) {
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        return await User.findOneAndUpdate(
          { empId },
          { $set: updateData },
          { new: true, runValidators: true }
        ).select("-password -jwtoken");
      })
    );

    return reply.send({ updated: results });
  } catch (error) {
    return reply
      .code(400)
      .send({ message: error instanceof Error ? error.message : error });
  }
};

// ✅ Bulk delete users
export const bulkDeleteUsers = async (
  request: FastifyRequest<{ Body: { empIds: string[] } }>,
  reply: FastifyReply
) => {
  try {
    const { empIds } = request.body;
    const result = await User.deleteMany({ empId: { $in: empIds } });
    return reply.send({ deletedCount: result.deletedCount });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: error instanceof Error ? error.message : error });
  }
};
