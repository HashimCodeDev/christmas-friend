import ChristmasFriendSelector from '../components/ChristmasFriendSelector';

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 via-green-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">
            🎄 Christmas Friend 🎄
          </h1>
          <p className="text-gray-600 text-lg">
            Discover your Secret Santa!
          </p>
        </div>
        <ChristmasFriendSelector />
      </div>
    </main>
  );
}
