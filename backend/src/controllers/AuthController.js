// Pure function factory to create Auth controller
const createAuthController = (authService) => {
  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const isValid = await authService.validateCredentials(email, password);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { token } = authService.createSession(email);
      
      // Pure function to set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      next(error);
    }
  };

  const logout = async (req, res, next) => {
    try {
      res.clearCookie('token');
      res.json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  };

  return { login, logout };
};

module.exports = { createAuthController };
