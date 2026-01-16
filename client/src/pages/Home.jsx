import { useState } from "react";

import AuthModal from "../components/AuthModal";
import MajorButton from "../components/buttons/MajorButton";
import MinorButton from "../components/buttons/MinorButton";
import { CodeXml, Settings } from "lucide-react";

export default function Home({ setPageIndex }) {

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("login");

  // file input ref-less handler: create input on demand to avoid adding DOM refs
  // function openFlowFileAndLoad() {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = ".flowy,application/json";
  //   input.onchange = async (e) => {
  //     const file = e.target.files && e.target.files[0];
  //     if (!file) return;
  //     try {
  //       const text = await file.text();
  //       const parsed = JSON.parse(text);
  //       // save into localStorage under the same key Map will read
  //       localStorage.setItem("flowymap-v1", JSON.stringify(parsed));
  //       // navigate to Map
  //       pushToast(`Loaded ${file.name}`, "success");
  //       setPageIndex(1);
  //     } catch (err) {
  //       console.error("Failed to load .flowy file", err);
  //       pushToast("Failed to open file: invalid .flowy content", "error");
  //     }
  //   };
  //   input.click();
  // }

  function createNewMap() {
    // clear any existing map in localStorage
    localStorage.removeItem("flowymap-v1");
    // navigate to Map
    setPageIndex(1);
  }

  function handleAuth(type) {
    if (type === "login") {
      setAuthType("login");
    } else {
      setAuthType("register");
    }
    setShowAuthModal(true);
  }

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
            <MajorButton
              title={"Open map editor"}
              onClick={() => createNewMap()}
              soft={false}
            />

            <div className="flex gap-2">

              <div className="flex-1 flex gap-2">
                <MajorButton title={"Login"} soft={true} onClick={() => handleAuth("login")}></MajorButton>
                <MajorButton title={"Register"} soft={true} onClick={() => handleAuth("register")}></MajorButton>
              </div>

              <div className="tooltip tooltip-bottom" data-tip="Settings">
                <MinorButton
                  icon={Settings}
                  pageId={2}
                  setPageIndex={setPageIndex}
                />
              </div>

              <div className="tooltip tooltip-bottom" data-tip="Source code ↗">
                <MinorButton
                  icon={CodeXml}
                  address={"https://git.dgd.sh/dan/flowysurf"}
                />
              </div>
            </div>

            {showAuthModal && <AuthModal type={authType} setShowAuthModal={setShowAuthModal} />}
          </div>
        </div>
      </div>
    </div>
  );
}
