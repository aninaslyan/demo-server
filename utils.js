import fs from "fs";

const db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));

export const findUserByEmail = (email) => {
    return db.users.find(user => user.email === email);
}
