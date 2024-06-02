import "./Lab.css";

const Lab: React.FC = () => {
  return (
    <div className="h-screen w-screen flex justify-around items-center">
      <div
        className="bg-blue-500 w-[70vh] h-[70vh] rounded-full"
        style={{
          animation: "setIntoPlace 0.2s linear",
          transformStyle: "preserve-3d",
        }}
      ></div>
    </div>
  );
};

export default Lab;
