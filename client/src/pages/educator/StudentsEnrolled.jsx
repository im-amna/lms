import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const StudentsEnrolled = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUser(); // ✅ Direct Clerk se user lo
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + `/api/educator/enrolled-students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
    // ✅ isEducator ke bajaye direct Clerk role check
    if (user?.publicMetadata?.role === "educator") {
      fetchEnrolledStudents();
    }
  }, [user]); // ✅ user pe watch karo

  return (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {/* Loading state */}
            {loading && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && enrolledStudents?.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                  No students enrolled yet.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              enrolledStudents?.map((item, index) => (
                <tr key={index} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                    <img
                      src={item.student.imageUrl}
                      alt={`${item.student.name}'s profile`}
                      className="w-9 h-9 rounded-full"
                    />
                    <span className="truncate">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsEnrolled;