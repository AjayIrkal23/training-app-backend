import { FastifyInstance } from "fastify";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserByEmpId,
  updateUser,
  deleteUser,
  bulkUpdateUsers,
  bulkDeleteUsers,
} from "../controllers/user.controller";
import { verifyJWT } from "../plugins/auth.middleware";

export async function userRoutes(server: FastifyInstance) {
  // Public routes
  server.post("/createUser", createUser);
  server.post("/login", loginUser);

  // Protected routes grouped under a sub-plugin with JWT hook
  server.register(async (protectedRoutes) => {
    protectedRoutes.addHook("onRequest", verifyJWT);

    protectedRoutes.post("/logout", logoutUser);
    protectedRoutes.get("/users", getAllUsers);
    protectedRoutes.get("/users/:empId", getUserByEmpId);
    protectedRoutes.put("/editUsers/:empId", updateUser);
    protectedRoutes.delete("/users/:empId", deleteUser);
    protectedRoutes.put("/users/bulk-update", bulkUpdateUsers);
    protectedRoutes.post("/users/bulk-delete", bulkDeleteUsers);
  });
}
