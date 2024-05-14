import { Mouse, Volume2 } from "lucide-react";
import Button from "../component/Button";

export default function StoryTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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

      {children}
    </>
  );
}
