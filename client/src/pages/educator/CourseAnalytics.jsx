import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CourseAnalytics = () => {
  const { id } = useParams();
  const location = useLocation();

  const { backendUrl, currency, getToken } = useContext(AppContext);

  const [course, setCourse] = useState(null);

  const isDemo = location.pathname.startsWith("/demo");

  const fetchCourse = async () => {
    try {
      let response;

      if (isDemo) {
        response = await axios.get(
          `${backendUrl}/api/educator/demo/course/${id}`
        );
      } else {
        const token = await getToken();

        response = await axios.get(
          `${backendUrl}/api/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        setCourse(response.data.courseData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  const earningsData = course.enrolledStudents.map((student, index) => ({
    name: `Student ${index + 1}`,
    earning:
      course.coursePrice -
      (course.discount * course.coursePrice) / 100,
  }));

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {course.courseTitle} Analytics
        </h1>

        <Link
          to={isDemo ? "/demo/my-courses" : "/educator/my-courses"}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <img
          src={course.courseThumbnail}
          alt=""
          className="w-44 rounded mb-4"
        />

        <h2 className="text-xl font-semibold">
          {course.courseTitle}
        </h2>

        <p className="mt-2">
          Students :
          <b> {course.enrolledStudents.length}</b>
        </p>

        <p>
          Price :
          <b>
            {" "}
            {currency}
            {course.coursePrice}
          </b>
        </p>
      </div>

      {earningsData.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          No students enrolled yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="mb-4 font-semibold">
              Earnings
            </h3>

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

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="mb-4 font-semibold">
              Enrollment Trend
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="earning"
                  stroke="#10b981"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
};

export default CourseAnalytics;
