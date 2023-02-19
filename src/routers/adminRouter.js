import express from "express";
import {
  createAdmin,
  findAdmin,
  findAdminAndUpdate,
} from "../models/adminUser/AdminUserModel.js";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/bcrypt.js";
import { adminSignUpEmailVerification } from "../utils/emails.js";

// admin resitration
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);

    req.body.password = hashPassword(req.body.password);

    req.body.verificationCode = uuidv4();
    const result = await createAdmin(req.body);

    if (result?._id) {
      // we need to crate unique url and sent email to the client
      //process for the email
      const uniqueUrl = `http://localhost:3000/verify?c=${result.verificationCode}&email=${result.email}`;

      //call email service
      adminSignUpEmailVerification(result, uniqueUrl);

      res.json({
        status: "success",
        message:
          "We have sent an email verification link to your email. Please chek your meail (junk as well if not found in inbox) and follow the instructiosn to activate your account.",
      });

      return;
    }
    res.json({
      status: "error",
      message: "Error, Unable to create new admin, Try again latere",
    });
  } catch (error) {
    error.errorCode = 500;
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.errorCode = 200;
      error.message =
        "There is already an account exist associated with this email.";
    }
    next(error);
  }
});

// email verfication

router.post("/verify-email", async (req, res, next) => {
  try {
    console.log(req.body);
    const obj = {
      status: "active",
      verificationCode: "",
      isEmailVerified: true,
    };

    const result = await findAdminAndUpdate(req.body, obj);

    result?._id
      ? res.json({
          status: "success",
          message: "Your email is verified",
        })
      : res.json({
          status: "error",
          message: "Invalid Link",
        });
  } catch (error) {
    next(error);
  }
});

//admin login

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await findAdmin({ email });

    if (admin?.status === "inactive") {
      return res.json({
        status: "error",
        message:
          "Your account is inactive. Please follow the link to activate your account",
      });
    }

    if (admin?._id) {
      const isPasswordMatch = comparePassword(password, admin.password);
      if (isPasswordMatch) {
        admin.password = undefined;
        admin.__v = undefined;

        return res.json({
          status: "success",
          message: "Login is successfull",
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

export default router;
