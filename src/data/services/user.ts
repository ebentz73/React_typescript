export function update(user, reqBody) {
  const updatedUser = Object.assign(user, reqBody);

  return updatedUser.save();
}
