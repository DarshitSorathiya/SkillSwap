const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log("Error Handler called");
      next(err);
    });
  };
};

export { asyncHandler };