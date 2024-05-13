import { useParams } from "react-router-dom";

function Color() {
  let params = useParams();
  return (
    <main
      className={`flex flex-row w-full h-full bg-${params.color}-600 text-gray-200`}
    >
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

export default Color;
