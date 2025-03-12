import { format } from "date-fns";
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

function DayCalendar() {
  const dispatch = useDispatch();
  const { currentDate } = useOutletContext();
  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const hours = Array.from({ length: 24 }, (_, index) => index);
  const events = JSON.parse(localStorage.getItem("events")) || [];

  const dayEvents = events.filter((event) => event.eventDate === formattedDate);

  const handleSlotClick = (hour) => {
    const formattedStartTime = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    dispatch(
      openEventModal({
        modalType: "add",
        eventInfo: {
          eventDate: formattedDate,
          eventStartTime: formattedStartTime,
        },
      })
    );
  };

  return (
    <div className="flex flex-col flex-1 mt-18.5">
      {hours.map((hour) => {
        const formattedHourLabel =
          hour === 0
            ? "12 AM"
            : hour < 12
              ? `${hour} AM`
              : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`;

        const slotEvents = dayEvents.filter((event) => {
          return parseInt(event.eventStartTime.split(":")[0], 10) === hour;
        });

        const overlappedEvents = calculateOverlaps(slotEvents);

        return (
          <div key={hour} className="flex border-b border-gray-200 h-16">
            <div className="w-16 border-r border-gray-200 flex items-center justify-end pr-2 text-xs text-gray-500">
              {formattedHourLabel}
            </div>

            <div
              className="flex-1 relative bg-white hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSlotClick(hour)}
            >
              <div className="mt-1 px-1 overflow-y-auto max-h-full">
                {overlappedEvents.map((event) => (
                  <div key={event.eventId} className="mb-1" >
                    <Event
                      event={event}
                      overlapCount={event.overlapCount}
                      eventIndex={event.eventIndex}
                      groupIndex={event.groupIndex}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DayCalendar;