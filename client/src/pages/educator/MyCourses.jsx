import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ toast import missing tha

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const navigate = useNavigate(); // ✅ Navigate → useNavigate hook

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + `/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

 useEffect(() => {
  fetchEducatorCourses();
}, []);

  return courses ? (
    // ✅ h-screen aur justify-between hataya — footer fix ho jayega
    <div className="md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published on</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr
                  key={course._id} // ✅ MongoDB ka _id use karo, id nahi
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/educator/course/${course._id}`)} // ✅ navigate() function call karo
                >
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail} // ✅ backendUrl + path
                      alt="Course"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <Link
                      to={`/educator/course/${course._id}`}
                      className="truncate hidden md:block text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {course.courseTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length * course.coursePrice -
                        (course.discount * course.coursePrice) / 100
                    )}
                  </td>
                  <td className="px-4 py-3">{course.enrolledStudents.length}</td>
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
  ) : (
    <Loading />
  );
};

export default MyCourses;