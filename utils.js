import fs from "fs";
import jwt from "jsonwebtoken";

import { expiresIn, secret_key } from "./constants";

const db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));

export const findUserByEmail = (email) => {
    return db.users.find(user => user.email === email);
}

export const generateToken = (email, id, isAdmin, name) => {
  return jwt.sign(
    {
      id,
      email,
      name,
      isAdmin,
    },
    secret_key,
    {
      expiresIn
    }
  );
}
