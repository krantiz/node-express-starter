const roleCheck = {
  authorise: (roles) => {
    return function(req, res, next) {
      // console.log('roles', roles)
      const userData = req?.tokenData?.data?.user
      // console.log('userData', userData)

      try {
        if (!roles.includes(userData.role)) {
          return res.status(403).json({ message: 'User not authorized' });
        }
        next();
      } catch (err) {
        console.error(err)
        return res.status(401).json({ message: 'Something went wrong!' });
      }
    };
  },
};

module.exports = roleCheck;
