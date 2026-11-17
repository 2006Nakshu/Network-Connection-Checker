const dns = require("dns").promises;
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

        const startTime = Date.now();

        const result = await dns.lookup(hostname);

        const responseTime = Date.now() - startTime;

        const newCheck = new NetworkCheck({
            hostname,
            ipAddress: result.address,
            status: "Online",
            responseTime
        });

        await newCheck.save();

        res.json({
            success: true,
            hostname,
            alive: true,
            ip: result.address,
            time: responseTime
        });

    } catch (error) {

        try {
            const newCheck = new NetworkCheck({
                hostname: req.body.hostname,
                ipAddress: "N/A",
                status: "Offline",
                responseTime: 0
            });

            await newCheck.save();
        } catch (err) {
            console.log(err);
        }

        res.json({
            success: true,
            hostname: req.body.hostname,
            alive: false,
            ip: "N/A",
            time: 0
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