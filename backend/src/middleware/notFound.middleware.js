/**
 * 404 Not Found Handler
 */
const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
};

module.exports = notFoundMiddleware;
