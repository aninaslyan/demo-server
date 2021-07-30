import bcrypt from "bcrypt";
import fs from "fs";
import express from "express";
import jwt from "jsonwebtoken";

import { findUserByEmail } from "../utils";
import { fileOption, expiresIn, secret_key } from "../constants";

const router = express.Router();
const db = JSON.parse(fs.readFileSync('./db.json', fileOption));

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = findUserByEmail(email);

  if (user) {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            id: user.id
          },
          secret_key,
          {
            expiresIn: expiresIn
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          token,
          user,
        });
      }
      res.status(401).json({
        message: "Auth failed"
      });
    });
  } else {
    res.status(500).json({
      error: "User not found"
    });
  }
});

router.post("/signup", (req, res) => {
  const { email, password, isAdmin = false } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = findUserByEmail(email);

  if (user) {
    return res.status(409).json({
      message: "Email already exists"
    });
  } else {
    bcrypt.hash(password, 10, (err, hashedPass) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      } else {
        const newUser = {
          id: db.users.length + 1,
          email,
          password: hashedPass,
          isAdmin,
        };

        db.users.push(newUser);
        const fileContent = JSON.stringify(db);

        fs.writeFile('./db.json', fileContent, fileOption, (error) => {
          if (error) {
            res.status(500).json({
              error: err
            });
          } else {
            res.status(201).json({
              message: "User created",
              user: newUser,
            });
          }
        });
      }
    });
  }
});

export default router;
