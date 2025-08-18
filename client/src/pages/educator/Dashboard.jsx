import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  // Use optional chaining (?) and fallback dummy data
  const earningsData = dashboardData?.earningsHistory || [
    { month: "Jan", earnings: 200 },
    { month: "Feb", earnings: 450 },
    { month: "Mar", earnings: 300 },
    { month: "Apr", earnings: 600 },
    { month: "May", earnings: 800 },
  ];

  const enrollmentsData = dashboardData?.courseEnrollments || [
    { course: "React", students: 25 },
    { course: "Node.js", students: 18 },
    { course: "Python", students: 32 },
    { course: "Java", students: 15 },
  ];

  const revenueData = dashboardData?.courseRevenue || [
    { course: "React", revenue: 1200 },
    { course: "Node.js", revenue: 900 },
    { course: "Python", revenue: 1600 },
    { course: "Java", revenue: 600 },
  ];
  // Colors for Pie slices
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  {
    /*return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5  items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="patients_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-500 ">Total Enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.appointments_icon} alt="appointments_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500 ">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="patients_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {currency}
                {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-500 ">Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20"></div>
          <table className="table-fixed md:table-auto w-full overflow-hidden ">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell ">
                  #
                </th>
                <th className="px-4 py-3 font-semibold ">Student Name</th>
                <th className=" px-4 py-3 font-semibold">Course Title</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 text-center hidden sm:table-cell ">
                    {index + 1}
                  </td>
                  <td className="md:px-4 px-2 py-3 flex items-center space-x-3 ">
                    <img
                      src={item.student.imageUrl}
                      alt="profile"
                      className="w-9 h-9 rounded-full"
                    />
                    <span className="truncate">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;*/
  }
  return dashboardData ? (
    <div className="min-h-screen flex flex-col gap-10 md:p-8 p-4 bg-gradient-to-b from-blue-50 to-white">
      {/* Top Stats Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* Total Enrollments */}
        <div className="flex items-center gap-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 p-5 rounded-2xl">
          <img
            src={assets.patients_icon}
            alt="patients_icon"
            className="w-12 h-12"
          />
          <div>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-gray-500 text-sm">Total Enrollments</p>
          </div>
        </div>

        {/* Total Courses */}
        <div className="flex items-center gap-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 p-5 rounded-2xl">
          <img
            src={assets.appointments_icon}
            alt="appointments_icon"
            className="w-12 h-12"
          />
          <div>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData.totalCourses}
            </p>
            <p className="text-gray-500 text-sm">Total Courses</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="flex items-center gap-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 p-5 rounded-2xl">
          <img
            src={assets.earning_icon}
            alt="earning_icon"
            className="w-12 h-12"
          />
          <div>
            <p className="text-3xl font-bold text-green-600">
              {currency}
              {dashboardData.totalEarnings}
            </p>
            <p className="text-gray-500 text-sm">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 w-full">
        {/* Earnings Trend */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            📊 Earnings Trend
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollments per Course */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            📈 Enrollments per Course
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={enrollmentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="students"
                fill="#10b981"
                barSize={40}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            💰 Revenue Distribution
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="revenue"
                nameKey="course"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {revenueData.map((entry, index) => (
                  <Cell
                    key={Cell - { index }}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Enrollments Table */}
      <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <h2 className="p-5 text-lg font-semibold text-gray-700 border-b">
          📋 Latest Enrollments
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-center hidden sm:table-cell">
                  #
                </th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Course Title</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-3 text-center hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 flex items-center gap-3">
                    <img
                      src={item.student.imageUrl}
                      alt="profile"
                      className="w-9 h-9 rounded-full border border-gray-200"
                    />
                    <span className="truncate font-medium text-gray-700">
                      {item.student.name}
                    </span>
                  </td>
                  <td className="px-6 py-3 truncate text-gray-600">
                    {item.courseTitle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
