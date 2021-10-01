import bcrypt from "bcrypt";
import fs from "fs";
import express from "express";

import { findUserByEmail, generateToken } from "../utils";
import { fileOption } from "../constants";

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

  if (!user) {
    return res.status(404).json({
      error: "Invalid Credentials"
    });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    if (result) {
      const token = generateToken(user.email, user.id, user.isAdmin, user.name);

      return res.status(200).json({
        token,
        user,
      });
    }
    res.status(401).json({
      message: "Authentication failed"
    });
  });
});

router.post("/signup", (req, res) => {
  const { email, password, name = '', isAdmin = false } = req.body;
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
          name,
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
              user: newUser,
            });
          }
        });
      }
    });
  }
});

export default router;
