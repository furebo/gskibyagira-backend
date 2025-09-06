// middleware/auth.js
import jwt from 'jsonwebtoken';

 const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, etc. }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}


export default auth