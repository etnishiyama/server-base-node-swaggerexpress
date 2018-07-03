function handleUserNames(user) {
  const newUser = user;

  if (user.name && user.lastname && !user.fullname) {
    newUser.fullname = `${user.name} ${user.lastname}`;
  } else if (user.fullname && !user.name && !user.lastname) {
    const names = user.fullname.split(' ');
    const [first] = names;
    newUser.name = first;
    names.splice(0, 1);
    newUser.lastname = names.length > 0 ? names.join(' ') : '';
  }

  return newUser;
}

function getRandomNumber(min, max) {
  const num = Math.random() * (max - min) + min;
  return num.toFixed(2);
}

export {
  handleUserNames,
  getRandomNumber,
};
