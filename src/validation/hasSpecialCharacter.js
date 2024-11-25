const hasSpecialCharacter = (val) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  // https://regexr.com/86mur

  return !regex.test(val);
};

export default hasSpecialCharacter;
