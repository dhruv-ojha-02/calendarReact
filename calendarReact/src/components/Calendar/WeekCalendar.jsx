import { startOfWeek, format, isToday } from "date-fns";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { openEventModal } from "../../features/eventModal/eventModalSlice";
import Event from "../Event/Event";

function calculateOverlaps(events) {
  if (!events || events.length === 0) return [];

  events.sort((a, b) => a.eventStartTime.localeCompare(b.eventStartTime));

  let activeEvents = [];
  let groupedEvents = [];

  events.forEach((event) => {
    // check whether overlapping overlapping events or not by removing events that have already ended
    activeEvents = activeEvents.filter(
      (e) => e.eventEndTime > event.eventStartTime
    );

    activeEvents.push(event);
    // Assigning additional data (eventIndex, overlapCount and groupIndex) to overlapped events
    groupedEvents.push({
      ...event,
      eventIndex: activeEvents.findIndex((e) => e.eventId === event.eventId),
      overlapCount: activeEvents.length,
      groupIndex: groupedEvents.length,
    });
  });

  return groupedEvents;
}

function WeekCalendar() {
  const dispatch = useDispatch();
  const { currentDate } = useOutletContext();

  // Determine start of week (Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const events = JSON.parse(localStorage.getItem("events")) || [];

  return (
    <div className="flex flex-col flex-1 mt-18.5">
      {/* Weekdays Header */}
      <div className="flex border-b border-gray-200">
        {/* Empty cell for time labels */}
        <div className="w-16 border-r border-gray-200"></div>
        {days.map((day, index) => (
          <div
            key={index}
            className={`flex-1 border-r border-gray-200 p-2 text-center text-xs font-semibold ${isToday(day)
              ? "bg-blue-500 text-white font-bold"
              : "text-gray-700"
              }`}
          >
            <div>{format(day, "EEE")}</div>
            <div>{format(day, "d MMM")}</div>
          </div>
        ))}
      </div>

      {/* Hour Rows */}
      {hours.map((hour) => {
        const formattedHourLabel =
          hour === 0
            ? "12 AM"
            : hour < 12
              ? `${hour} AM`
              : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`;

        return (
          <div key={hour} className="flex border-b border-gray-200 h-16">
            {/* Time Label Column */}
            <div className="w-16 border-r border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500">
              {formattedHourLabel}
            </div>

            {/* 7 Day Slots for this hour */}
            {days.map((day, index) => {
              const cellDate = format(day, "yyyy-MM-dd");
              const dayEvents = events.filter((event) => event.eventDate === cellDate);
              const slotEvents = dayEvents.filter((event) => {
                const eventHour = parseInt(event.eventStartTime.split(":")[0], 10);
                return eventHour === hour;
              });

              const overlappedEvents = calculateOverlaps(slotEvents);

              const handleSlotClick = () => {
                const formattedStartTime = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                dispatch(
                  openEventModal({
                    modalType: "add",
                    eventInfo: {
                      eventDate: cellDate,
                      eventStartTime: formattedStartTime,
                    },
                  })
                );
              };

              return (
                <div
                  key={index}
                  className="flex-1 border-r border-gray-200 bg-white hover:bg-gray-50 cursor-pointer relative"
                  onClick={handleSlotClick}
                >
                  <div className="mt-1 px-1 overflow-y-auto max-h-full">
                    {overlappedEvents.map((event) => (
                      <div key={event.eventId} className="mb-1">
                        <Event
                          key={event.eventId}
                          event={event}
                          overlapCount={event.overlapCount}
                          eventIndex={event.eventIndex}
                          groupIndex={event.groupIndex}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default WeekCalendar;