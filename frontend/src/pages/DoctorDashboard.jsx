import { useEffect } from 'react';
import useStore from '../store/useStore';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';

const DoctorDashboard = () => {
  const { appointments, fetchAppointments, loading, error } = useStore();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Your Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage your scheduled appointments and patient details.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      {loading && !appointments.length ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl w-full"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-700">No appointments yet</h3>
          <p className="text-slate-500 mt-2">When patients book slots, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
            >
              {/* Left side: Time & Date */}
              <div className="bg-sky-50 p-6 md:w-64 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-sky-100">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-lg">{appointment.slot.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sky-700">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{appointment.slot.date}</span>
                </div>
              </div>

              {/* Right side: Patient Info */}
              <div className="p-6 flex-1 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" /> Patient Name
                    </h3>
                    <p className="font-semibold text-slate-800 text-lg">{appointment.name}</p>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md mt-1 font-medium">
                      Age: {appointment.age}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Contact
                    </h3>
                    <p className="text-slate-800">{appointment.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Reason for Visit
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-[calc(100%-1.5rem)]">
                    <p className="text-slate-700 text-sm whitespace-pre-wrap">{appointment.problem}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
