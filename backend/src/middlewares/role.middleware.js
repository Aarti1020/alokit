import ApiError from "../utils/ApiError.js";

const normalizeRole = (role = "") => (role === "super_admin" ? "superAdmin" : role);

const authorize = (...roles) => {
  return (req, res, next) => {
    const allowedRoles = roles.map(normalizeRole);
    const currentRole = normalizeRole(req.user?.role);

    if (!req.user || !allowedRoles.includes(currentRole)) {
      return next(new ApiError(403, "You are not allowed to access this resource."));
    }
    next();
  };
};

export default authorize;
