import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, isToday, getMonth, getYear } from "date-fns";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openEventModal } from "../../features/eventModal/eventModalSlice";
import Event from "../Event/Event";

function MonthCalendar() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const { currentDate } = useOutletContext();
  const dispatch = useDispatch();

  const month = getMonth(currentDate);
  const year = getYear(currentDate);
  const startDate = startOfWeek(startOfMonth(new Date(year, month)));
  const endDate = endOfWeek(endOfMonth(new Date(year, month)));
  const days = eachDayOfInterval({ start: startDate, end: endDate }); //provides you the dates as an array of given interval
  const events = JSON.parse(localStorage.getItem("events")) || [];

  // opens the event modal to add new event
  function handleClick(day) {
    dispatch(openEventModal({
      modalType: "add",
      eventInfo: {
        eventDate: format(day, "yyyy-MM-dd"),
      }
    }))
  }

  return (
    <div className="flex flex-col flex-1 mt-18.5">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-700 bg-gray-100 p-2">
        {weekdays.map((day, index) => (
          <div key={index} className="p-3">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 border border-gray-300">
        {days.map((day, index) => {
          const cellDate = format(day, "yyyy-MM-dd");
          const cellEvents = events.filter((event) =>
            event.eventDate === cellDate
          )
          return (
            < div
              key={index}
              className={`flex flex-col items-center justify-start h-35 border border-gray-200  ${day.getMonth() !== month ? "text-gray-400" : "text-black"}`}
              onClick={() => handleClick(day)}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${isToday(day) ? "bg-blue-500 text-white font-bold" : ""
                  }`}
              >
                {format(day, "d")}
              </span>
              {/* Event Container */}
              <div className="mt-1 rounded-md mb-1 cursor-pointer w-[calc(100%-0.5rem)] overflow-scroll">
                {cellEvents.map((event) => (
                  <div key={event.eventId}>
                    <Event event={event} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div >
  );
}

export default MonthCalendar;