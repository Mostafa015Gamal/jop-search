const globalErrorHandler = (error, req, res, next) => {
  const status = error.cause || 500;
  return res.status(status).json({ error: error.message, stack: error.stack });
};

export default globalErrorHandler;
