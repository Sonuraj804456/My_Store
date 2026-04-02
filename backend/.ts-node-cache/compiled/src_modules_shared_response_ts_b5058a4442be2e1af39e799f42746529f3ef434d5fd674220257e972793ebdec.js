"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = exports.success = void 0;
const success = (data) => ({
    success: true,
    data,
    error: null
});
exports.success = success;
const failure = (error) => ({
    success: false,
    data: null,
    error
});
exports.failure = failure;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zaGFyZWQvcmVzcG9uc2UudHMiLCJzb3VyY2VzIjpbIi9hcHAvc3JjL21vZHVsZXMvc2hhcmVkL3Jlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sRUFBRSxJQUFJO0lBQ2IsSUFBSTtJQUNKLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQyxDQUFDO0FBSlUsUUFBQSxPQUFPLFdBSWpCO0FBRUksTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEMsT0FBTyxFQUFFLEtBQUs7SUFDZCxJQUFJLEVBQUUsSUFBSTtJQUNWLEtBQUs7Q0FDTixDQUFDLENBQUM7QUFKVSxRQUFBLE9BQU8sV0FJakIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgc3VjY2VzcyA9IChkYXRhOiBhbnkpID0+ICh7XG4gIHN1Y2Nlc3M6IHRydWUsXG4gIGRhdGEsXG4gIGVycm9yOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IGZhaWx1cmUgPSAoZXJyb3I6IGFueSkgPT4gKHtcbiAgc3VjY2VzczogZmFsc2UsXG4gIGRhdGE6IG51bGwsXG4gIGVycm9yXG59KTtcbiJdfQ==