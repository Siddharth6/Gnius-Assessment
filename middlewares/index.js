exports.ers = (res, status, errmsg) => {
    return res.status(status).json({
        error: errmsg
    });
};

exports.createResponseObject = (obj, keys) => {
    let retval = {};
    
    keys.map((key) => {
        retval[key] = obj[key];
    });

    return retval;
};