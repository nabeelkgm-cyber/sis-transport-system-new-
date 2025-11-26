// app/admin/dashboard/page.tsx
'use client';

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transport Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your transport system overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-medium">admin</span>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Students</p>
              <h2 className="text-4xl font-bold text-gray-800">2814</h2>
              <p className="text-gray-500 text-sm mt-2">FN: 716 | AN: 473</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Total Buses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Buses</p>
              <h2 className="text-4xl font-bold text-gray-800">51</h2>
              <p className="text-gray-500 text-sm mt-2">Capacity: 4280 seats</p>
            </div>
            <div className="text-4xl">🚌</div>
          </div>
        </div>

        {/* Total Capacity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Capacity</p>
              <h2 className="text-4xl font-bold text-gray-800">4280</h2>
              <p className="text-gray-500 text-sm mt-2">FN: 2140 | AN: 2140</p>
            </div>
            <div className="text-4xl">💺</div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students Using Transport */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Students Using Transport</p>
              <h2 className="text-4xl font-bold text-gray-800">1189</h2>
              <p className="text-gray-500 text-sm mt-2">FN: 716 | AN: 473</p>
            </div>
            <div className="text-4xl">🎓</div>
          </div>
        </div>

        {/* FN Utilization */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">FN Utilization</p>
              <h2 className="text-4xl font-bold text-gray-800">33%</h2>
              <p className="text-gray-500 text-sm mt-2">716 / 2140 seats</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* AN Utilization */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">AN Utilization</p>
              <h2 className="text-4xl font-bold text-gray-800">22%</h2>
              <p className="text-gray-500 text-sm mt-2">473 / 2140 seats</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>
    </div>
  );
}