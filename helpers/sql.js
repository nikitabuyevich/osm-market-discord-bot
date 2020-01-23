const validAccountsWhereStatement = 'WHERE u.gm <> 1 AND u.ban_expire <= CURRENT_TIMESTAMP AND `job` <> 900 AND `job` <> 910 AND `job` <> 500 AND `str` <> 0 AND `dex` <> 0 AND `int` <> 0 AND `luk` <> 0';
module.exports.validAccountsWhereStatement = validAccountsWhereStatement;

module.exports.validAccounts = `
    FROM wvsbeta.characters as b
    INNER JOIN wvsbeta.users as u
    ON b.userid = u.id
    ${validAccountsWhereStatement}
`;
