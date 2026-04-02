"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const store_routes_1 = __importDefault(require("./modules/stores/store.routes"));
const store_admin_routes_1 = __importDefault(require("./modules/stores/store.admin.routes"));
const product_routes_1 = __importDefault(require("./modules/products/product.routes"));
const product_public_routes_1 = __importDefault(require("./modules/products/product.public.routes"));
const order_routes_1 = __importDefault(require("./modules/orders/order.routes")); // 👈 ADD
const message_routes_1 = __importDefault(require("./modules/messages/message.routes"));
const download_routes_1 = __importDefault(require("./modules/download/download.routes"));
const payout_routes_1 = __importDefault(require("./modules/payout/payout.routes"));
const error_handler_1 = require("./modules/shared/error-handler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
/* =========================
   API ROUTES
========================= */
app.get("/v1/api/health", async (_req, res) => {
    let dbStatus = "disconnected";
    try {
        await db_1.db.query.stores.findFirst();
        dbStatus = "connected";
    }
    catch {
        dbStatus = "disconnected";
    }
    res.json({
        status: "ok",
        db: dbStatus,
        jobs: "running",
        version: "v1",
    });
});
app.use("/v1/api/auth", auth_routes_1.default);
app.use("/v1/api/users", user_routes_1.default);
app.use("/v1/api/stores", store_routes_1.default);
app.use("/v1/api/products", product_routes_1.default);
app.use("/v1/api", product_public_routes_1.default);
app.use("/v1/api", order_routes_1.default); // 👈 ADD THIS
app.use("/v1/api", message_routes_1.default);
app.use("/v1/api", download_routes_1.default);
app.use("/v1/api", payout_routes_1.default);
app.use("/v1/api/admin", store_admin_routes_1.default);
/* =========================
   ERROR HANDLER
========================= */
app.use(error_handler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvYXBwLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsc0RBQWdEO0FBQ2hELG9DQUFpQztBQUVqQyw2RUFBb0Q7QUFDcEQsOEVBQXFEO0FBQ3JELGlGQUF3RDtBQUN4RCw2RkFBbUU7QUFDbkUsdUZBQThEO0FBQzlELHFHQUEyRTtBQUMzRSxpRkFBd0QsQ0FBQyxTQUFTO0FBQ2xFLHVGQUE4RDtBQUM5RCx5RkFBZ0U7QUFDaEUsbUZBQTBEO0FBRTFELGtFQUE4RDtBQUU5RCxNQUFNLEdBQUcsR0FBWSxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUUvQixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUV4QixHQUFHLENBQUMsR0FBRyxDQUNMLElBQUEsY0FBSSxFQUFDO0lBQ0gsTUFBTSxFQUFFLHVCQUF1QjtJQUMvQixXQUFXLEVBQUUsSUFBSTtDQUNsQixDQUFDLENBQ0gsQ0FBQztBQUVGOzs0QkFFNEI7QUFFNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzVDLElBQUksUUFBUSxHQUFHLGNBQWMsQ0FBQztJQUU5QixJQUFJLENBQUM7UUFDSCxNQUFNLE9BQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLFFBQVEsR0FBRyxXQUFXLENBQUM7SUFDekIsQ0FBQztJQUFDLE1BQU0sQ0FBQztRQUNQLFFBQVEsR0FBRyxjQUFjLENBQUM7SUFDNUIsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxNQUFNLEVBQUUsSUFBSTtRQUNaLEVBQUUsRUFBRSxRQUFRO1FBQ1osSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsSUFBSTtLQUNkLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUscUJBQVUsQ0FBQyxDQUFDO0FBQ3BDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHFCQUFVLENBQUMsQ0FBQztBQUNyQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHNCQUFXLENBQUMsQ0FBQztBQUN2QyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLHdCQUFhLENBQUMsQ0FBQztBQUMzQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSwrQkFBbUIsQ0FBQyxDQUFDO0FBQ3hDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLHNCQUFXLENBQUMsQ0FBQyxDQUFDLGNBQWM7QUFDL0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsd0JBQWEsQ0FBQyxDQUFDO0FBQ2xDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLHlCQUFjLENBQUMsQ0FBQztBQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSx1QkFBWSxDQUFDLENBQUM7QUFDakMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsNEJBQWdCLENBQUMsQ0FBQztBQUUzQzs7NEJBRTRCO0FBRTVCLEdBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQVksQ0FBQyxDQUFDO0FBRXRCLGtCQUFlLEdBQUcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb3JzIGZyb20gXCJjb3JzXCI7XG5pbXBvcnQgZXhwcmVzcywgeyB0eXBlIEV4cHJlc3MgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgZGIgfSBmcm9tIFwiLi9jb25maWcvZGJcIjtcblxuaW1wb3J0IGF1dGhSb3V0ZXMgZnJvbSBcIi4vbW9kdWxlcy9hdXRoL2F1dGgucm91dGVzXCI7XG5pbXBvcnQgdXNlclJvdXRlcyBmcm9tIFwiLi9tb2R1bGVzL3VzZXJzL3VzZXIucm91dGVzXCI7XG5pbXBvcnQgc3RvcmVSb3V0ZXMgZnJvbSBcIi4vbW9kdWxlcy9zdG9yZXMvc3RvcmUucm91dGVzXCI7XG5pbXBvcnQgYWRtaW5TdG9yZVJvdXRlcyBmcm9tIFwiLi9tb2R1bGVzL3N0b3Jlcy9zdG9yZS5hZG1pbi5yb3V0ZXNcIjtcbmltcG9ydCBwcm9kdWN0Um91dGVzIGZyb20gXCIuL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdC5yb3V0ZXNcIjtcbmltcG9ydCBwcm9kdWN0UHVibGljUm91dGVzIGZyb20gXCIuL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdC5wdWJsaWMucm91dGVzXCI7XG5pbXBvcnQgb3JkZXJSb3V0ZXMgZnJvbSBcIi4vbW9kdWxlcy9vcmRlcnMvb3JkZXIucm91dGVzXCI7IC8vIPCfkYggQUREXG5pbXBvcnQgbWVzc2FnZVJvdXRlcyBmcm9tIFwiLi9tb2R1bGVzL21lc3NhZ2VzL21lc3NhZ2Uucm91dGVzXCI7XG5pbXBvcnQgZG93bmxvYWRSb3V0ZXMgZnJvbSBcIi4vbW9kdWxlcy9kb3dubG9hZC9kb3dubG9hZC5yb3V0ZXNcIjtcbmltcG9ydCBwYXlvdXRSb3V0ZXMgZnJvbSBcIi4vbW9kdWxlcy9wYXlvdXQvcGF5b3V0LnJvdXRlc1wiO1xuXG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiLi9tb2R1bGVzL3NoYXJlZC9lcnJvci1oYW5kbGVyXCI7XG5cbmNvbnN0IGFwcDogRXhwcmVzcyA9IGV4cHJlc3MoKTtcblxuYXBwLnVzZShleHByZXNzLmpzb24oKSk7XG5cbmFwcC51c2UoXG4gIGNvcnMoe1xuICAgIG9yaWdpbjogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICBjcmVkZW50aWFsczogdHJ1ZSxcbiAgfSlcbik7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIEFQSSBST1VURVNcbj09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuYXBwLmdldChcIi92MS9hcGkvaGVhbHRoXCIsIGFzeW5jIChfcmVxLCByZXMpID0+IHtcbiAgbGV0IGRiU3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIjtcblxuICB0cnkge1xuICAgIGF3YWl0IGRiLnF1ZXJ5LnN0b3Jlcy5maW5kRmlyc3QoKTtcbiAgICBkYlN0YXR1cyA9IFwiY29ubmVjdGVkXCI7XG4gIH0gY2F0Y2gge1xuICAgIGRiU3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIjtcbiAgfVxuXG4gIHJlcy5qc29uKHtcbiAgICBzdGF0dXM6IFwib2tcIixcbiAgICBkYjogZGJTdGF0dXMsXG4gICAgam9iczogXCJydW5uaW5nXCIsXG4gICAgdmVyc2lvbjogXCJ2MVwiLFxuICB9KTtcbn0pO1xuXG5hcHAudXNlKFwiL3YxL2FwaS9hdXRoXCIsIGF1dGhSb3V0ZXMpO1xuYXBwLnVzZShcIi92MS9hcGkvdXNlcnNcIiwgdXNlclJvdXRlcyk7XG5hcHAudXNlKFwiL3YxL2FwaS9zdG9yZXNcIiwgc3RvcmVSb3V0ZXMpO1xuYXBwLnVzZShcIi92MS9hcGkvcHJvZHVjdHNcIiwgcHJvZHVjdFJvdXRlcyk7XG5hcHAudXNlKFwiL3YxL2FwaVwiLCBwcm9kdWN0UHVibGljUm91dGVzKTtcbmFwcC51c2UoXCIvdjEvYXBpXCIsIG9yZGVyUm91dGVzKTsgLy8g8J+RiCBBREQgVEhJU1xuYXBwLnVzZShcIi92MS9hcGlcIiwgbWVzc2FnZVJvdXRlcyk7XG5hcHAudXNlKFwiL3YxL2FwaVwiLCBkb3dubG9hZFJvdXRlcyk7XG5hcHAudXNlKFwiL3YxL2FwaVwiLCBwYXlvdXRSb3V0ZXMpO1xuYXBwLnVzZShcIi92MS9hcGkvYWRtaW5cIiwgYWRtaW5TdG9yZVJvdXRlcyk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIEVSUk9SIEhBTkRMRVJcbj09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuYXBwLnVzZShlcnJvckhhbmRsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBhcHA7Il19