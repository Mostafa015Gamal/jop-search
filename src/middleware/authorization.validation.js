const isAuthorized = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.roles))
      return next(new Error("Not Authorized!", { cause: 401 }));
    return next();
  };
};

export default isAuthorized;
