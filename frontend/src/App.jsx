import { createBrowserRouter, Navigate, RouterProvider, useActionData } from "react-router-dom";
import {Login,Register} from "./Pages/Reg_Log/Login.jsx"
import MainLayout from "./Pages/More/MainLayout";
import Home from "./Pages/Home";
import { useAuth } from "./Context/Context";
import AllPage from "./Pages/More/AllPage.jsx";
import Analytics from "./Pages/Analytics.jsx";

function App() {
  const {isLogin}=useAuth()
  const router = createBrowserRouter([
    {
      path: "*",
      element: <Navigate to={isLogin ? "/app/dashboard" : "/reg-log/login"} />,
    },
    {
      path:"/reg-log",
      element:<AllPage/>,
      children:[
        {
          path:"/reg-log/login",
          element:<Login/>
        },
        {
          path:"/reg-log/signup",
          element:<Register/>
        }
      ]
    },
    {
      path: "/app",
      element: <MainLayout/>,
      children:[
        {
          path:"/app/dashboard/",
          element:<Home/>
        },
        {
          path:"/app/analytics/",
          element:<Analytics/>
        },
      ],
    },

  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
