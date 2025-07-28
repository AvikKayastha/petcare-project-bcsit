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

export function allowUserOnly(req, res, next) {
  if (req.user && req.user.role === 'owner') {
    return next();
  } else {
    return res.status(403).send("Access denied: Users only.");
  }
}

export function allowCaretakerOnly(req, res, next) {
  if (req.user && req.user.role === 'caretaker') {
    return next();
  } else {
    return res.status(403).send("Access denied: Caretakers only.");
  }
}
