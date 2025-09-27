import MajorButton from "../components/MajorButton";
import MinorButton from "../components/MinorButton";
import TinyButton from "../components/TinyButton";
import { CodeXml, Settings } from "lucide-react";

export default function Home({ setPageIndex }) {
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
          <div className="flex gap-2 w-full">
            <MajorButton
              title={"Create new map"}
              setPageIndex={setPageIndex}
              pageId={1}
            />

            <TinyButton
              icon={Settings}
              pageId={2}
              setPageIndex={setPageIndex}
            />

            <TinyButton
              icon={CodeXml}
              address={"https://github.com/daqnal/flowymap"}
            />

            {/* <div className="flex gap-2">
              <MinorButton
                title="Settings"
                setPageIndex={setPageIndex}
                pageId={2}
              />
              <TinyButton
                icon={CodeXml}
                address={"https://github.com/daqnal/flowymap"}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
