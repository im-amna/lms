import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Youtube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to Enroll");
      }
      if (isAlreadyEnrolled) {
        return toast.warn("Already Enrolled");
      }
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl,
        "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token} ` } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    //const findCourse = allCourses.find((course) => course._id === id);
    //setCourseData(findCourse);
    //}, [ id]);
    fetchCourseData();
  }, []);
  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  if (!courseData) {
    return <Loading />;
  }
  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

      {/* Left column */}
      <div className="max-w-xl z-10 text-gray-500">
        <h1 className=" md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
          {courseData.courseTitle}
        </h1>
        <p
          className=" pt-4 md:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription.slice(0, 200),
          }}
        ></p>
        {/*Ratings nd Reviews*/}
        <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
          <p>{calculateRating(courseData)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(courseData))
                    ? assets.star
                    : assets.star_blank
                }
                alt=""
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-blue-600">
            ({courseData.courseRatings.length}
            {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
          </p>
          <p>
            {courseData.enrolledStudents.length}
            {courseData.enrolledStudents.length > 1 ? "students" : "student"}
          </p>
        </div>
        <p className="text-sm">
          {" "}
          Course by{" "}
          <span className="text-blue-600  underline">
            {courseData.educator.name}
          </span>
        </p>
        <div className="pt-8 text-gray-800">
          <h2 className="text-xl font-semibold ">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-4 ">
                    <img
                      className={` transform transition-transform ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt="arrow icon "
                    />
                    <p className="font-medium md:text-base text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm md:text-default ">
                    {chapter.chapterContent.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600  border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={assets.play_icon}
                          alt="play icon"
                          className="w-4 h-4 mt-1 "
                        />
                        <div className="flex items-center justify-between w-full text-gray-800  text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.isPreviewFree && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    videoId: lecture.lectureUrl
                                      .split("/")
                                      .pop(),
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Preview
                              </p>
                            )}
                            <p>
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className=" pt-3  rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p>
          </div>
          <div className="absolute top-0 right-0 z-10 min-w-[300px] sm:min-w-[420px] max-w-course-card h-[85vh]">
            <div className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-200 flex flex-col h-full">
              {/* Thumbnail */}
              {/* Preview*/}
              {playerData ? (
                <Youtube
                  videoId={playerData.videoId}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <img
                  src={courseData.courseThumbnail}
                  alt="Course Thumbnail"
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Scrollable Content */}
              <div className="p-5 flex-1 overflow-y-auto">
                {/* Limited time offer */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    className="w-4 h-4"
                    src={assets.time_left_clock_icon}
                    alt="time left clock icon"
                  />

                  <p className="text-red-500 text-sm">
                    <span className="font-medium">5 days</span> left at this
                    price
                  </p>
                </div>

                {/* Price Section */}
                <div className="flex gap-3 items-center pt-2">
                  <p className="text-gray-800 md:text-4xl text-2xl font-bold">
                    {currency}
                    {(
                      courseData.coursePrice -
                      (courseData.discount * courseData.coursePrice) / 100
                    ).toFixed(2)}
                  </p>
                  <p className="md:text-lg text-gray-500 line-through">
                    {currency}
                    {courseData.coursePrice}
                  </p>
                  <p className="md:text-lg text-green-600 font-medium">
                    {courseData.discount}% off
                  </p>
                </div>

                {/* Duration & Lessons */}
                <div className="flex items-center text-sm md:text-base gap-4 pt-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <img
                      src={assets.time_clock_icon}
                      alt="clock icon"
                      className="w-4 h-4"
                    />
                    <p>{calculateCourseDuration(courseData)}</p>
                  </div>

                  <div className="h-4 w-px bg-gray-300"></div>

                  <div className="flex items-center gap-1">
                    <img
                      src={assets.lesson_icon}
                      alt="lesson icon"
                      className="w-4 h-4"
                    />
                    <p>{calculateNoOfLectures(courseData)} lessons</p>
                  </div>
                </div>

                {/* What's in the course */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    What’s in the course?
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>✔️ Lifetime access with free updates</li>
                    <li>✔️ Step-by-step, hands-on project guidance</li>
                    <li>✔️ Downloadable resources and source code</li>
                    <li>✔️ Quizzes to test your knowledge</li>
                    <li>✔️ Certificate of completion</li>
                  </ul>
                </div>
              </div>

              {/* Sticky CTA Section */}
              <div className="p-5 border-t bg-white sticky bottom-0">
                <button
                  onClick={enrollCourse}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-300"
                >
                  {isAlreadyEnrolled ? "Already Enrolled" : " Enroll Now"}
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  🎓 Certificate included · 💸 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
