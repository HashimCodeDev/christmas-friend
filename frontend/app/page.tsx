import ChristmasFriendSelector from '../components/ChristmasFriendSelector';

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border-2 border-emerald-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            🎄 Christmas Friend 🎄
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Discover your Secret Santa!
          </p>
        </div>
        <ChristmasFriendSelector />
      </div>
    </main>
  );
}
