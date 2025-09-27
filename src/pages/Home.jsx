import MajorButton from "../components/buttons/MajorButton";
import MinorButton from "../components/buttons/MinorButton";
import { pushToast } from "../components/Toasts";
import { CodeXml, Settings } from "lucide-react";

export default function Home({ setPageIndex }) {
  // file input ref-less handler: create input on demand to avoid adding DOM refs
  function openFlowFileAndLoad() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".flowy,application/json";
    input.onchange = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        // save into localStorage under the same key Map will read
        localStorage.setItem("flowymap-v1", JSON.stringify(parsed));
        // navigate to Map
        pushToast(`Loaded ${file.name}`, "success");
        setPageIndex(1);
      } catch (err) {
        console.error("Failed to load .flowy file", err);
        pushToast("Failed to open file: invalid .flowy content", "error");
      }
    };
    input.click();
  }

  function createNewMap() {
    // clear any existing map in localStorage
    localStorage.removeItem("flowymap-v1");
    // navigate to Map
    setPageIndex(1);
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            <i>flowymap</i>
          </h1>
          <p className="py-6">
            Project management tool to map your project's flow
          </p>
          <div className="flex flex-col gap-2 w-full">
            <MajorButton
              title={"Create new map"}
              onClick={() => createNewMap()}
            />

            <div className="flex gap-2">

              <MajorButton title={"Open map from file"} onClick={openFlowFileAndLoad} />

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
                  address={"https://github.com/daqnal/flowymap"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
