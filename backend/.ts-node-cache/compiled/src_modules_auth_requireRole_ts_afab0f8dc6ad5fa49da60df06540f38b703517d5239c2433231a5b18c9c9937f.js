"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const response_1 = require("../shared/response");
function requireRole(role) {
    return function (req, res, next) {
        if (!req.user)
            return res.status(401).json((0, response_1.failure)({ message: "Unauthorized" }));
        // Log roles for debugging (will appear in server logs)
        console.info("[requireRole] user role:", String(req.user.role), "required:", String(role));
        if (String(req.user.role) !== String(role)) {
            console.warn("[requireRole] role mismatch - access denied");
            return res.status(403).json((0, response_1.failure)({ message: "Forbidden" }));
        }
        next();
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL3JlcXVpcmVSb2xlLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL2F1dGgvcmVxdWlyZVJvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxrQ0FjQztBQWhCRCxpREFBNkM7QUFFN0MsU0FBZ0IsV0FBVyxDQUFDLElBQW1CO0lBQzdDLE9BQU8sVUFBVSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzlELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSTtZQUFFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxrQkFBTyxFQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVqRix1REFBdUQ7UUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxNQUFNLENBQUUsR0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFcEcsSUFBSSxNQUFNLENBQUUsR0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNwRCxPQUFPLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7WUFDNUQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFBLGtCQUFPLEVBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxJQUFJLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSBcIi4uL3R5cGVzL3JvbGVzXCI7XG5pbXBvcnQgeyBmYWlsdXJlIH0gZnJvbSBcIi4uL3NoYXJlZC9yZXNwb25zZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZVJvbGUocm9sZTogUm9sZXMgfCBSb2xlcykge1xuICByZXR1cm4gZnVuY3Rpb24gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKCFyZXEudXNlcikgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKGZhaWx1cmUoeyBtZXNzYWdlOiBcIlVuYXV0aG9yaXplZFwiIH0pKTtcblxuICAgIC8vIExvZyByb2xlcyBmb3IgZGVidWdnaW5nICh3aWxsIGFwcGVhciBpbiBzZXJ2ZXIgbG9ncylcbiAgICBjb25zb2xlLmluZm8oXCJbcmVxdWlyZVJvbGVdIHVzZXIgcm9sZTpcIiwgU3RyaW5nKChyZXEgYXMgYW55KS51c2VyLnJvbGUpLCBcInJlcXVpcmVkOlwiLCBTdHJpbmcocm9sZSkpO1xuXG4gICAgaWYgKFN0cmluZygocmVxIGFzIGFueSkudXNlci5yb2xlKSAhPT0gU3RyaW5nKHJvbGUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbcmVxdWlyZVJvbGVdIHJvbGUgbWlzbWF0Y2ggLSBhY2Nlc3MgZGVuaWVkXCIpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAzKS5qc29uKGZhaWx1cmUoeyBtZXNzYWdlOiBcIkZvcmJpZGRlblwiIH0pKTtcbiAgICB9XG5cbiAgICBuZXh0KCk7XG4gIH07XG59XG4iXX0=