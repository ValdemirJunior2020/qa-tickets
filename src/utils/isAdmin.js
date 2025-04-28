export const isAdminEmail = (email) => {
  const admins = [
    "admin@admin.com",
    "infojr.83@gmail.com",
    "concentrix@hotelplanner.com",
    "buwelo@hotelplanner.com",
    "tep@hotelplanner.com",
    "karen@hotelplanner.com",
    "april@hotelplanner.com"
  ];
  return admins.includes(email);
};
