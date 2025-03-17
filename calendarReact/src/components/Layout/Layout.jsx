import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeEventModal } from '@/features/eventModal/eventModalSlice';
import Header from "@/components/Header/Header";
import EventModal from '@/components/Modals/EventModal';
import EventDetailsModal from '@/components/Modals/EventDetailsModal';

function Layout() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const eventModal = useSelector((state) => state.eventModal);
  const location = useLocation();

  const viewType = (() => {
    const pathSegments = location.pathname.split("/");
    switch (pathSegments[1]) {
      case "week":
        return "week";
      case "day":
        return "day";
      default:
        return "month";
    }
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <Header viewType={viewType} currentDate={currentDate} onDateChange={setCurrentDate} />
      {eventModal.isModalOpen && (eventModal.modalType === "add" || eventModal.modalType === "edit") && (
        <EventModal onClose={() => dispatch(closeEventModal())} />
      )}
      {eventModal.isModalOpen && eventModal.modalType === "display" && (
        <EventDetailsModal onClose={() => dispatch(closeEventModal())} />
      )}

      <Outlet context={{ viewType, currentDate }} className="flex-1" />
    </div>
  )

}

export default Layout