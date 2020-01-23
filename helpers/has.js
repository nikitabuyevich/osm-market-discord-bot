module.exports.role = (roles, role) => {
  let has = false;
  roles.forEach((potentialRole) => {
    if (potentialRole.id === role.id) {
      has = true;
    }
  });

  return has;
};

module.exports.discordUsername = (discordAccounts, discordUsername) => {
  let has = false;
  discordAccounts.forEach((discordAccount) => {
    if (discordAccount.discordUsername.toLowerCase() === discordUsername.toLowerCase()) {
      has = true;
    }
  });

  return has;
};

