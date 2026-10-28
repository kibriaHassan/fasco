const User = require('../models/User');
const {
  signToken,
  setTokenCookie,
  clearTokenCookie,
} = require('../middleware/auth');

function validatePasswords(password, confirmPassword) {
  if (password !== confirmPassword) {
    const err = new Error('Passwords do not match');
    err.status = 400;
    throw err;
  }
  if (password.length < 6) {
    const err = new Error('Password must be at least 6 characters');
    err.status = 400;
    throw err;
  }
}

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    validatePasswords(password, confirmPassword);

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    const token = signToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    setTokenCookie(res, token);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (_req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+resetOtp +resetOtpExpires'
    );

    if (!user) {
      return res.json({
        message: 'If that email exists, an OTP has been sent',
      });
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    console.log(`[FASCO] Password reset OTP for ${email}: ${otp}`);

    res.json({
      message: 'OTP generated for password reset',
      otp,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+resetOtp +resetOtpExpires'
    );

    if (
      !user ||
      user.resetOtp !== String(otp) ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    validatePasswords(password, confirmPassword);

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +resetOtp +resetOtpExpires'
    );

    if (
      !user ||
      user.resetOtp !== String(otp) ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = password;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};
