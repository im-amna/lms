import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const StudentsEnrolled = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUser();

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);

      const isDemo = window.location.pathname.startsWith("/demo");

      let response;

      if (isDemo) {
        response = await axios.get(
          backendUrl + "/api/educator/demo/students"
        );
      } else {
        const token = await getToken();

        response = await axios.get(
          backendUrl + "/api/educator/enrolled-students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const { data } = response;

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isDemo = window.location.pathname.startsWith("/demo");

    if (isDemo || user?.publicMetadata?.role === "educator") {
      fetchEnrolledStudents();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-start md:p-8 p-4 pt-8">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-300">
        <table className="table-fixed md:table-auto w-full">
          <thead className="border-b text-left">
            <tr>
              <th className="px-4 py-3 hidden sm:table-cell">#</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Course Title</th>
              <th className="px-4 py-3 hidden sm:table-cell">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : enrolledStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  No Students Found
                </td>
              </tr>
            ) : (
              enrolledStudents.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={item.student.imageUrl}
                      alt={item.student.name}
                      className="w-9 h-9 rounded-full"
                    />
                    <span>{item.student.name}</span>
                  </td>

                  <td className="px-4 py-3">
                    {item.courseTitle}
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsEnrolled;
