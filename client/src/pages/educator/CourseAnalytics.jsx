import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const { allCourses, currency } = useContext(AppContext);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const foundCourse = allCourses.find((c) => c.id === courseId);
    setCourse(foundCourse);
  }, [allCourses, courseId]);

  if (!course) {
    return <p className="p-8 text-gray-500">Loading course analytics...</p>;
  }

  // Dummy data for charts
  const earningsData = course.enrolledStudents.map((student, i) => ({
    name: Student`${i + 1}`,
    earning: course.coursePrice - (course.discount * course.coursePrice) / 100,
  }));

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {course.courseTitle} - Analytics
        </h1>
        <Link
          to="/educator/my-courses"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Courses
        </Link>
      </div>

      {/* Course Overview */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={course.courseThumbnail}
            alt="thumbnail"
            className="w-28 h-20 object-cover rounded-md border"
          />
          <div>
            <h2 className="text-lg font-semibold">{course.courseTitle}</h2>
            <p className="text-gray-500">
              Published on {new Date(course.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Price:</span> {currency}
              {course.coursePrice}
            </p>
            <p>
              <span className="font-semibold">Students:</span>{" "}
              {course.enrolledStudents.length}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Earnings by Student</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="earning" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment Trend */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earning" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
