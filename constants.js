exports.errorName = {
    USER_DOESNT_EXIST: 'USER_DOESNT_EXIST',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    SERVER_ERROR: 'SERVER_ERROR',
    INCORRECT_PASSWORD: 'INCORRECT_PASSWORD'
}

exports.errorType = {
    USER_DOESNT_EXIST: {
        message: 'user does not exist',
        statuscode: 200
    },
    USER_ALREADY_EXISTS: {
        message: 'User is already exists.',
        statusCode: 403
    },
    SERVER_ERROR: {
        message: 'Server error.',
        statusCode: 500
    },
    INCORRECT_PASSWORD: {
        message: 'password is incorrect',
        statusCode: 200
    }
}