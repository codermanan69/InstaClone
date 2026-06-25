import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context"
import { ToastProvider } from "./features/shared/context/ToastContext"
import { PostContextProvider } from "./features/posts/post.context"
import "./features/shared/global.scss"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PostContextProvider>
          <RouterProvider router={router} />
        </PostContextProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
