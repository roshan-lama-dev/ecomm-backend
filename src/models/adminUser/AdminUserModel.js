import AdminUserSchema from "./AdminUserSchema.js";

//create new user
export const createAdmin = (obj) => {
  return AdminUserSchema(obj).save();
};

// find user by filter. @filter must be an object
export const findAdmin = (filter) => {
  return AdminUserSchema.findOne(filter);
};

// find user by filter and update.
export const findAdminAndUpdate = (filter, obj) => {
  return AdminUserSchema.findOneAndUpdate(filter, obj, { new: true });
};
