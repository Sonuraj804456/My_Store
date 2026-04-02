"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = createStore;
exports.getOwnStore = getOwnStore;
exports.updateOwnStore = updateOwnStore;
exports.deleteOwnStore = deleteOwnStore;
exports.getPublicStore = getPublicStore;
exports.adminListStores = adminListStores;
exports.adminGetStoreById = adminGetStoreById;
exports.adminSuspendStore = adminSuspendStore;
exports.adminUnsuspendStore = adminUnsuspendStore;
exports.adminRestoreStore = adminRestoreStore;
const api_error_1 = require("../shared/api-error");
const response_1 = require("../shared/response");
const storeService = __importStar(require("./store.service"));
async function createStore(req, res) {
    const userId = req.user.id;
    const store = await storeService.createStore(userId, req.body);
    res.status(201).json((0, response_1.success)(store));
}
async function getOwnStore(req, res) {
    const userId = req.user.id;
    const store = await storeService.getOwnStore(userId);
    res.json((0, response_1.success)(store));
}
async function updateOwnStore(req, res) {
    const userId = req.user.id;
    const store = await storeService.updateOwnStore(userId, req.body);
    res.json((0, response_1.success)(store));
}
async function deleteOwnStore(req, res) {
    const userId = req.user.id;
    await storeService.softDeleteStore(userId);
    res.status(204).send();
}
// PUBLIC
async function getPublicStore(req, res) {
    const username = req.params.username;
    const store = await storeService.getPublicStoreByUsername(username);
    res.json((0, response_1.success)(store));
}
// ADMIN
async function adminListStores(req, res) {
    const stores = await storeService.adminListStores();
    res.json((0, response_1.success)(stores));
}
async function adminGetStoreById(req, res) {
    const { id } = req.params;
    const store = await storeService.adminGetStoreById(id);
    res.json((0, response_1.success)(store));
}
async function adminSuspendStore(req, res) {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason || typeof reason !== "string") {
        throw new api_error_1.ApiError(400, "Reason is required to suspend a store");
    }
    const store = await storeService.adminSuspendStore(id, reason, req.user?.id || "system");
    res.json((0, response_1.success)(store));
}
async function adminUnsuspendStore(req, res) {
    const { id } = req.params;
    const store = await storeService.adminUnsuspendStore(id, req.user?.id || "system");
    res.json((0, response_1.success)(store));
}
async function adminRestoreStore(req, res) {
    const { id } = req.params;
    const store = await storeService.adminRestoreStore(id);
    res.json((0, response_1.success)(store));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUuY29udHJvbGxlci50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLGtDQUtDO0FBRUQsa0NBS0M7QUFFRCx3Q0FLQztBQUVELHdDQUtDO0FBR0Qsd0NBS0M7QUFHRCwwQ0FHQztBQUVELDhDQU1DO0FBRUQsOENBVUM7QUFFRCxrREFJQztBQUVELDhDQU1DO0FBOUVELG1EQUErQztBQUMvQyxpREFBNkM7QUFDN0MsOERBQWdEO0FBRXpDLEtBQUssVUFBVSxXQUFXLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDM0QsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFFM0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxrQkFBTyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDM0QsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFFM0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBQSxrQkFBTyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVNLEtBQUssVUFBVSxjQUFjLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDOUQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLElB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QUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFFMUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFBLGtCQUFPLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgQXBpRXJyb3IgfSBmcm9tIFwiLi4vc2hhcmVkL2FwaS1lcnJvclwiO1xuaW1wb3J0IHsgc3VjY2VzcyB9IGZyb20gXCIuLi9zaGFyZWQvcmVzcG9uc2VcIjtcbmltcG9ydCAqIGFzIHN0b3JlU2VydmljZSBmcm9tIFwiLi9zdG9yZS5zZXJ2aWNlXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTdG9yZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgY29uc3QgdXNlcklkID0gcmVxLnVzZXIuaWQ7XG5cbiAgY29uc3Qgc3RvcmUgPSBhd2FpdCBzdG9yZVNlcnZpY2UuY3JlYXRlU3RvcmUodXNlcklkLCByZXEuYm9keSk7XG4gIHJlcy5zdGF0dXMoMjAxKS5qc29uKHN1Y2Nlc3Moc3RvcmUpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE93blN0b3JlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICBjb25zdCB1c2VySWQgPSByZXEudXNlci5pZDtcblxuICBjb25zdCBzdG9yZSA9IGF3YWl0IHN0b3JlU2VydmljZS5nZXRPd25TdG9yZSh1c2VySWQpO1xuICByZXMuanNvbihzdWNjZXNzKHN0b3JlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVPd25TdG9yZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgY29uc3QgdXNlcklkID0gcmVxLnVzZXIuaWQ7XG5cbiAgY29uc3Qgc3RvcmUgPSBhd2FpdCBzdG9yZVNlcnZpY2UudXBkYXRlT3duU3RvcmUodXNlcklkLCByZXEuYm9keSk7XG4gIHJlcy5qc29uKHN1Y2Nlc3Moc3RvcmUpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU93blN0b3JlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICBjb25zdCB1c2VySWQgPSByZXEudXNlci5pZDtcblxuICBhd2FpdCBzdG9yZVNlcnZpY2Uuc29mdERlbGV0ZVN0b3JlKHVzZXJJZCk7XG4gIHJlcy5zdGF0dXMoMjA0KS5zZW5kKCk7XG59XG5cbi8vIFBVQkxJQ1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFB1YmxpY1N0b3JlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuIGNvbnN0IHVzZXJuYW1lID0gcmVxLnBhcmFtcy51c2VybmFtZSBhcyBzdHJpbmc7XG5cbiAgY29uc3Qgc3RvcmUgPSBhd2FpdCBzdG9yZVNlcnZpY2UuZ2V0UHVibGljU3RvcmVCeVVzZXJuYW1lKHVzZXJuYW1lKTtcbiAgcmVzLmpzb24oc3VjY2VzcyhzdG9yZSkpO1xufVxuXG4vLyBBRE1JTlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkbWluTGlzdFN0b3JlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgY29uc3Qgc3RvcmVzID0gYXdhaXQgc3RvcmVTZXJ2aWNlLmFkbWluTGlzdFN0b3JlcygpO1xuICByZXMuanNvbihzdWNjZXNzKHN0b3JlcykpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRtaW5HZXRTdG9yZUJ5SWQocmVxOiBSZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PixcbiAgcmVzOiBSZXNwb25zZSkge1xuICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuXG4gIGNvbnN0IHN0b3JlID0gYXdhaXQgc3RvcmVTZXJ2aWNlLmFkbWluR2V0U3RvcmVCeUlkKGlkKTtcbiAgcmVzLmpzb24oc3VjY2VzcyhzdG9yZSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRtaW5TdXNwZW5kU3RvcmUocmVxOiBSZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PiwgcmVzOiBSZXNwb25zZSkge1xuICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICBjb25zdCB7IHJlYXNvbiB9ID0gcmVxLmJvZHk7XG5cbiAgaWYgKCFyZWFzb24gfHwgdHlwZW9mIHJlYXNvbiAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiUmVhc29uIGlzIHJlcXVpcmVkIHRvIHN1c3BlbmQgYSBzdG9yZVwiKTtcbiAgfVxuXG4gIGNvbnN0IHN0b3JlID0gYXdhaXQgc3RvcmVTZXJ2aWNlLmFkbWluU3VzcGVuZFN0b3JlKGlkLCByZWFzb24sIHJlcS51c2VyPy5pZCB8fCBcInN5c3RlbVwiKTtcbiAgcmVzLmpzb24oc3VjY2VzcyhzdG9yZSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRtaW5VbnN1c3BlbmRTdG9yZShyZXE6IFJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+LCByZXM6IFJlc3BvbnNlKSB7XG4gIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gIGNvbnN0IHN0b3JlID0gYXdhaXQgc3RvcmVTZXJ2aWNlLmFkbWluVW5zdXNwZW5kU3RvcmUoaWQsIHJlcS51c2VyPy5pZCB8fCBcInN5c3RlbVwiKTtcbiAgcmVzLmpzb24oc3VjY2VzcyhzdG9yZSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRtaW5SZXN0b3JlU3RvcmUocmVxOiBSZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PixcbiAgcmVzOiBSZXNwb25zZSkge1xuICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuXG4gIGNvbnN0IHN0b3JlID0gYXdhaXQgc3RvcmVTZXJ2aWNlLmFkbWluUmVzdG9yZVN0b3JlKGlkKTtcbiAgcmVzLmpzb24oc3VjY2VzcyhzdG9yZSkpO1xufVxuIl19