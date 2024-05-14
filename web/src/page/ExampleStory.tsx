export default function ExampleStory() {
  return (
    <main className="flex flex-row w-full h-full bg-green-600 text-gray-200">
      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex justify-between items-center w-full h-full">
          <div>I AM</div>
          <div className="flex justify-end"> THE STORY</div>
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}
