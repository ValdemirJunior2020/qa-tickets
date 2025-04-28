export const isAdminEmail = (email) => {
  const admins = ["admin@admin.com", "infojr.83@gmail.com"];
  return admins.includes(email);
};
