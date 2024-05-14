import { Mouse, Volume2 } from "lucide-react";
import Button from "../component/Button";

function StoryTemplate() {
  return (
    <main className="flex flex-row w-full h-full bg-green-600 text-gray-200">
      <div className="absolute left-[40px] bottom-[40px] flex flex-col">
        <Button
          className="mb-[10px] p-[7.5px] bg-black bg-opacity-25 rounded-full flex items-center justify-center border-2 border-white border-opacity-50"
          onClick={() => {}}
        >
          <Mouse />
        </Button>
        <Button
          className="p-[7.5px] bg-black bg-opacity-25 rounded-full flex items-center justify-center border-2 border-white border-opacity-50"
          onClick={() => {}}
        >
          <Volume2 />
        </Button>
      </div>

      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex justify-between w-full h-full">
          <div>Loom is...</div>
          <div className="flex justify-end items-end">...in progress</div>
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}

export default StoryTemplate;
