import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const verifyJWT = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("No token provided");

    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET) as { empId: string };

    // fetch user to compare stored token
    const user = await User.findOne({ empId: payload.empId });
    if (!user || user.jwtoken !== token) {
      throw new Error("Token is expired or revoked");
    }

    req.user = payload as any;
  } catch (err) {
    return reply.status(401).send({
      success: false,
      expired: true,
      message: "Unauthorized or session expired",
    });
  }
};
