let userdetails = (req, res, next) => {
    res.json({
        success: true,
        message: 'successfull',
        user: {
            name: req.user.name,
            type: req.user.type,
            _id: req.user._id,
            emailid: req.user.emailid,
            contact: req.user.contact,
            organisation: req.user.organisation,
            avatar: req.user.avatar,
            bio: req.user.bio,
        }
    });
};

module.exports = { userdetails };