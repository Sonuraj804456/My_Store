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
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const drizzle_1 = require("better-auth/adapters/drizzle");
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const schema = __importStar(require("./auth.schema"));
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, drizzle_1.drizzleAdapter)(db_1.db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    // 🔐 COOKIE CONFIG (THIS WAS MISSING)
    cookies: {
        session: {
            name: "better-auth.session",
            options: {
                httpOnly: true,
                sameSite: "lax", // ✅ REQUIRED for localhost cross-port
                secure: false, // ✅ MUST be false on localhost
                path: "/",
            },
        },
    },
    callbacks: {
        //@ts-ignore
        jwt: async ({ token, user }) => {
            token.role = user?.role ?? "CREATOR";
            return token;
        },
        //@ts-ignore
        session: async ({ session, token }) => {
            session.user.role = token.role;
            return session;
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
    },
    secret: env_1.env.BETTER_AUTH_SECRET,
    baseURL: env_1.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGguY29yZS50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGguY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBeUM7QUFDekMsMERBQThEO0FBQzlELHdDQUFxQztBQUNyQywwQ0FBdUM7QUFDdkMsc0RBQXdDO0FBRTNCLFFBQUEsSUFBSSxHQUFHLElBQUEsd0JBQVUsRUFBQztJQUM3QixRQUFRLEVBQUUsSUFBQSx3QkFBYyxFQUFDLE9BQUUsRUFBRTtRQUMzQixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDdkIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ3ZCLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtTQUNsQztLQUNGLENBQUM7SUFFRixnQkFBZ0IsRUFBRTtRQUNoQixPQUFPLEVBQUUsSUFBSTtLQUNkO0lBRUQsc0NBQXNDO0lBQ3RDLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxxQkFBcUI7WUFDM0IsT0FBTyxFQUFFO2dCQUNQLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxLQUFLLEVBQUksc0NBQXNDO2dCQUN6RCxNQUFNLEVBQUUsS0FBSyxFQUFNLCtCQUErQjtnQkFDbEQsSUFBSSxFQUFFLEdBQUc7YUFDVjtTQUNGO0tBQ0Y7SUFFRCxTQUFTLEVBQUU7UUFDVCxZQUFZO1FBQ1osR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzdCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksSUFBSSxTQUFTLENBQUM7WUFDckMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsWUFBWTtRQUNaLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQy9CLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0tBQzVCO0lBRUQsTUFBTSxFQUFFLFNBQUcsQ0FBQyxrQkFBa0I7SUFDOUIsT0FBTyxFQUFFLFNBQUcsQ0FBQyxlQUFlLElBQUksdUJBQXVCO0NBQ3hELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJldHRlckF1dGggfSBmcm9tIFwiYmV0dGVyLWF1dGhcIjtcbmltcG9ydCB7IGRyaXp6bGVBZGFwdGVyIH0gZnJvbSBcImJldHRlci1hdXRoL2FkYXB0ZXJzL2RyaXp6bGVcIjtcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9kYlwiO1xuaW1wb3J0IHsgZW52IH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9lbnZcIjtcbmltcG9ydCAqIGFzIHNjaGVtYSBmcm9tIFwiLi9hdXRoLnNjaGVtYVwiO1xuXG5leHBvcnQgY29uc3QgYXV0aCA9IGJldHRlckF1dGgoe1xuICBkYXRhYmFzZTogZHJpenpsZUFkYXB0ZXIoZGIsIHtcbiAgICBwcm92aWRlcjogXCJwZ1wiLFxuICAgIHNjaGVtYToge1xuICAgICAgdXNlcjogc2NoZW1hLnVzZXIsXG4gICAgICBzZXNzaW9uOiBzY2hlbWEuc2Vzc2lvbixcbiAgICAgIGFjY291bnQ6IHNjaGVtYS5hY2NvdW50LFxuICAgICAgdmVyaWZpY2F0aW9uOiBzY2hlbWEudmVyaWZpY2F0aW9uLFxuICAgIH0sXG4gIH0pLFxuXG4gIGVtYWlsQW5kUGFzc3dvcmQ6IHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICB9LFxuXG4gIC8vIPCflJAgQ09PS0lFIENPTkZJRyAoVEhJUyBXQVMgTUlTU0lORylcbiAgY29va2llczoge1xuICAgIHNlc3Npb246IHtcbiAgICAgIG5hbWU6IFwiYmV0dGVyLWF1dGguc2Vzc2lvblwiLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgc2FtZVNpdGU6IFwibGF4XCIsICAgLy8g4pyFIFJFUVVJUkVEIGZvciBsb2NhbGhvc3QgY3Jvc3MtcG9ydFxuICAgICAgICBzZWN1cmU6IGZhbHNlLCAgICAgLy8g4pyFIE1VU1QgYmUgZmFsc2Ugb24gbG9jYWxob3N0XG4gICAgICAgIHBhdGg6IFwiL1wiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIGNhbGxiYWNrczoge1xuICAgIC8vQHRzLWlnbm9yZVxuICAgIGp3dDogYXN5bmMgKHsgdG9rZW4sIHVzZXIgfSkgPT4ge1xuICAgICAgdG9rZW4ucm9sZSA9IHVzZXI/LnJvbGUgPz8gXCJDUkVBVE9SXCI7XG4gICAgICByZXR1cm4gdG9rZW47XG4gICAgfSxcbiAgICAvL0B0cy1pZ25vcmVcbiAgICBzZXNzaW9uOiBhc3luYyAoeyBzZXNzaW9uLCB0b2tlbiB9KSA9PiB7XG4gICAgICBzZXNzaW9uLnVzZXIucm9sZSA9IHRva2VuLnJvbGU7XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBleHBpcmVzSW46IDYwICogNjAgKiAyNCAqIDcsXG4gIH0sXG5cbiAgc2VjcmV0OiBlbnYuQkVUVEVSX0FVVEhfU0VDUkVULFxuICBiYXNlVVJMOiBlbnYuQkVUVEVSX0FVVEhfVVJMID8/IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXG59KTtcbiJdfQ==