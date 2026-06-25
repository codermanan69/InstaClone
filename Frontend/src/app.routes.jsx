import { createBrowserRouter, Navigate } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Feed from "./features/posts/pages/Feed"
import Profile from "./features/profile/pages/Profile"
import Search from "./features/search/pages/Search"
import Notifications from "./features/notifications/pages/Notifications"
import MainLayout from "./features/shared/components/MainLayout"
import { ProtectedRoute, PublicRoute } from "./features/shared/components/RouteGuards"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        )
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>
        )
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Feed />
            },
            {
                path: "profile/:username",
                element: <Profile />
            },
            {
                path: "search",
                element: <Search />
            },
            {
                path: "notifications",
                element: <Notifications />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
])