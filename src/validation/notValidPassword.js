const notValidPassword = (val) => {
  // https://regexr.com/8958j
  const regex = /^(?:(?=.*\d)(?=.*[A-Z]).{8,})$/;

  return !regex.test(val);
};

export default notValidPassword;
