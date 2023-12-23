const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export default ctrlWrapper;
