export default function CollectionCard() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <card className="w-1/3 bg-white border border-gray-100 rounded-lg text-center hover:shadow-lg align-center">
        <a href="">
          <img src="https://picsum.photos/500/300" className="rounded-t-lg" />
        </a>
        <a href="">
          <div className="flex justify-center">
            <img
              src="https://picsum.photos/50/50"
              className="rounded-full object-center border-4 border-white -mt-6 shadow-lg align-center"
            />
          </div>
        </a>
        <p className="font-bold pt-3 pb-2"> Angry Pitbull Club </p>

        <p className="font-semibold p-2 text-sm text-gray-500">
          {" "}
          by{" "}
          <a href="#" className="text-blue-500 hover:text-blue-700">
            {" "}
            OfficialAPC{" "}
          </a>{" "}
        </p>

        <p className="px-10 py-2 mb-5 text-gray-500">
          {" "}
          A collection of 10,000 Angry Pitbulls. Angry Pitbull Club is a
          collection of 10,000 unique, digital Pitbull NFT collectibles that
          represent community...{" "}
        </p>
      </card>
    </div>
  );
}
