module.exports = {
    adminAuth: (req, res, next) => {
        console.log('Admin middleware');
        next();
    },
    userAuth: (req, res, next) => {
        console.log('User middleware');
        next();
    }
};
