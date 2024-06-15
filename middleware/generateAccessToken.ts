import * as jwt from 'jsonwebtoken';

export const generateAccessToken = (id: string, time: string) => {
  const playold = {
    id,
  };
  return jwt.sign(playold, process.env.SECRET, { expiresIn: time });
};
