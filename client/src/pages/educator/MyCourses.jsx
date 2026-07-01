import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyCourses = () => {
  const { currency, backendUrl, getToken } = useContext(AppContext);

  const [courses, setCourses] = useState(null);

  const navigate = useNavigate();

  const isDemo = window.location.pathname.startsWith("/demo");

  const fetchEducatorCourses = async () => {
    try {
      let response;

      if (isDemo) {
        response = await axios.get(
          backendUrl + "/api/educator/demo/courses"
        );
      } else {
        const token = await getToken();

        response = await axios.get(
          backendUrl + "/api/educator/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  if (!courses) return <Loading />;

  return (
    <div className="md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">
          {isDemo ? "Demo Courses" : "My Courses"}
        </h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  All Courses
                </th>
                <th className="px-4 py-3 font-semibold">
                  Earnings
                </th>
                <th className="px-4 py-3 font-semibold">
                  Students
                </th>
                <th className="px-4 py-3 font-semibold">
                  Published On
                </th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() =>
                    navigate(
                      `${isDemo ? "/demo" : "/educator"}/course/${course._id}`
                    )
                  }
                >
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center gap-3">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-16 h-12 rounded object-cover"
                    />

                    <Link
                      to={`${
                        isDemo ? "/demo" : "/educator"
                      }/course/${course._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden md:block text-blue-600 hover:underline truncate"
                    >
                      {course.courseTitle}
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
