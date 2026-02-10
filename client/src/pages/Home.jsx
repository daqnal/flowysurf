import { useState } from "react";

import AuthModal from "../components/modals/AuthModal.jsx";
import MajorButton from "../components/buttons/MajorButton";
import MinorButton from "../components/buttons/MinorButton";
import { Plus, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { pushToast } from "../components/Toasts";

export default function Home({ setPageIndex }) {

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("login");

  const { user, logout } = useAuth();


  function createNewMap() {
    // clear any existing map in localStorage
    localStorage.removeItem("flowymap-v1");
    // navigate to Map
    setPageIndex(1);
  }

  const handleAuth = async (type) => {
    if (type === "logout") {
      await logout();
      pushToast(`Logged out successfully`, "success");
    } else {
      setAuthType(type);
      setShowAuthModal(true);
    }

  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md flex flex-col items-center">
          <img src={window.flowyTheme === "emerald" || window.flowyTheme === "nord" ? "/logo-light-mode.svg" : "/logo-dark-mode.svg"} alt="flowysurf logo" className="w-30 mb-2" />
          <h1 className="text-4xl font-bold">
            <i>flowysurf</i>
          </h1>
          <p className="py-6">
            Reimagine your project in a flowchart editor 🌊
          </p>
          <div className="flex flex-col gap-2 w-full px-8">
            {user ? (
              <div className="flex gap-2">
                <MajorButton
                  title={"Open map drive"}
                  onClick={() => setPageIndex(3)}
                  soft={false}
                />

                <div className="tooltip tooltip-right" data-tip="Create new map">
                  <MinorButton
                    icon={Plus}
                    onClick={() => createNewMap()}
                    soft={false}
                  />
                </div>
              </div>
            ) : (
              <MajorButton
                title={"Create new map"}
                onClick={() => createNewMap()}
                soft={false}
              />
            )}

            <div className="flex gap-2">

              {user ? (
                <div className="flex-1 flex gap-2">
                  <MajorButton title={"Logout"} soft={true} onClick={() => handleAuth("logout")}></MajorButton>
                  <MajorButton title={"Settings"} soft={true} onClick={() => setPageIndex(2)}></MajorButton>
                </div>
              ) : (
                <div className="flex-1 flex gap-2">
                  <MajorButton title={"Login"} soft={true} onClick={() => handleAuth("login")}></MajorButton>
                  <MajorButton title={"Register"} soft={true} onClick={() => handleAuth("register")}></MajorButton>
                  <div className="tooltip tooltip-bottom" data-tip="Settings">
                    <MinorButton
                      icon={Settings}
                      pageId={2}
                      setPageIndex={setPageIndex}
                    />
                  </div>
                </div>
              )
              }
            </div>

            {showAuthModal && <AuthModal type={authType} setShowAuthModal={setShowAuthModal} />}
          </div>
        </div>
      </div>
    </div>
  );
}
