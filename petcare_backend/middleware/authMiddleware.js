import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login_page');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.set('Cache-Control', 'no-store');
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect('/login_page');
  }
}