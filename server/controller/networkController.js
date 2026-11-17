const ping = require("ping");
const NetworkCheck = require("../models/NetworkCheck");

// Check Network Connection
exports.checkConnection = async (req, res) => {
    try {
        const { hostname } = req.body;

        if (!hostname) {
            return res.status(400).json({
                success: false,
                message: "Hostname is required"
            });
        }

        const result = await ping.promise.probe(hostname);

        const newCheck = new NetworkCheck({
            hostname,
            ipAddress: result.numeric_host,
            status: result.alive ? "Online" : "Offline",
            responseTime: Number(result.time)
        });

        await newCheck.save();

        res.json({
            success: true,
            hostname,
            alive: result.alive,
            ip: result.numeric_host,
            time: result.time
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get All Network Checks
exports.getAllChecks = async (req, res) => {
    try {
        const checks = await NetworkCheck.find().sort({ checkedAt: -1 });
        res.json(checks);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Network Check
exports.deleteCheck = async (req, res) => {
    try {
        await NetworkCheck.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};