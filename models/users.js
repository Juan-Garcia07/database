const usersModel = {
    getALL:`
          SELECT
                *
          FROM
                Users
                `,
                getByID:`
                        SELECT
                              *
                        FROM
                             Users
                       WHERE
                            id=?
                `,
}

module.exports = usersModel;