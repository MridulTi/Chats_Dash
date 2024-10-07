import { Outlet } from "react-router-dom";
import { Navbar, TopBar } from "../../Components/Navbar";
import { useError } from "../../Context/ErrorContext";
import ErrorModal from "../../Components/ErrorModal";

const MainLayout = () => {
  const{error,closeError}=useError()

  return (
    <div className="relative overflow-hidden">
      <Navbar/>
      <TopBar/>
      <div className="z-10 bg-indigo-50">
        <Outlet />
      </div>
      <div className=" w-full">
      {/* <Footer/> */}

      </div>
      {error&&<ErrorModal message={error} onClose={closeError}/>}

    </div>
  );
};

export default MainLayout;
