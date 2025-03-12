import React, { useState } from "react";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openEventModal } from "../../features/eventModal/eventModalSlice";

function Header({ viewType, onDateChange, currentDate = new Date() }) {
  const [view, setView] = useState(viewType);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePrev = () => {
    let newDate;
    switch (viewType) {
      case "month":
        newDate = subMonths(currentDate, 1);
        break;
      case "week":
        newDate = subWeeks(currentDate, 1);
        break;
      case "day":
        newDate = subDays(currentDate, 1);
        break;
      default:
        return;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    let newDate;
    switch (viewType) {
      case "month":
        newDate = addMonths(currentDate, 1);
        break;
      case "week":
        newDate = addWeeks(currentDate, 1);
        break;
      case "day":
        newDate = addDays(currentDate, 1);
        break;
      default:
        return;
    }
    onDateChange(newDate);
  };

  const getTitle = () => {
    switch (viewType) {
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
        return `${format(startOfWeek(currentDate, { weekStartsOn: 0 }), "d MMM, yy")} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), "d MMM, yy")}`;
      case "day":
        return format(currentDate, "d MMMM yyyy");
      default:
        return "";
    }
  };

  const handleSelect = (e) => {
    const selectedView = e.target.value;
    setView(selectedView);
    switch (selectedView) {
      case "month":
        navigate("/month");
        break;
      case "week":
        navigate("/week");
        break;
      case "day":
        navigate("/day");
        break;
      default:
        break;
    }
  };

  const handleAddEvent = () => {
    dispatch(
      openEventModal({
        modalType: "add",
        eventInfo: {
          eventDate: format(currentDate, "yyyy-MM-dd"),
          eventTitle: "",
          eventStartTime: "",
          eventEndTime: "",
          eventAttendees: "",
        },
      })
    );
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white shadow rounded-b-lg">
      {/* Previous and Next buttons */}
      <div className="flex items-center space-x-1">
        <button className="p-2 rounded-full cursor-pointer hover:bg-gray-300" onClick={handlePrev}>
          <ChevronLeft size={24} />
        </button>
        <button className="p-2 rounded-full cursor-pointer hover:bg-gray-300" onClick={handleNext}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Title */}
      <span className="text-xl font-semibold text-center min-w-[180px]">
        {getTitle()}
      </span>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 cursor-pointer"
        >
          Add Event
        </button>
        <button
          onClick={handleToday}
          className="border border-gray-300 p-2 px-4 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          Today
        </button>
        <select
          value={view}
          className="border border-gray-300 p-2 rounded-full hover:bg-gray-300 cursor-pointer"
          onChange={handleSelect}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>
    </div>
  );
}

export default Header;
