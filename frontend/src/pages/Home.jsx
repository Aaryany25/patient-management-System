import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { Calendar, Clock, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const { slots, fetchSlots, bookAppointment, loading, error } = useStore();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    problem: ''
  });
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setBookingStatus('submitting');
    const result = await bookAppointment({
      ...formData,
      slotId: selectedSlot.id
    });

    if (result.success) {
      setBookingStatus('success');
      setSelectedSlot(null);
      setFormData({ name: '', phone: '', age: '', problem: '' });
      setTimeout(() => setBookingStatus(null), 3000);
    } else {
      setBookingStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
          Book Your Appointment
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Select a time that works for you and fill in your details. Our doctors are ready to help you feel better.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {bookingStatus === 'success' && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 mb-8 border border-green-100">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">Appointment booked successfully! We will see you soon.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Column: Slots */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold text-slate-800">Available Slots</h2>
          </div>
          
          {loading && !slots.length ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-200 rounded-xl w-full"></div>
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500">No slots available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {slots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedSlot?.id === slot.id 
                      ? 'border-primary bg-sky-50 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-sky-200 hover:shadow-sm'
                  }`}
                >
                  <Clock className={`w-5 h-5 mb-2 ${selectedSlot?.id === slot.id ? 'text-primary' : 'text-slate-400'}`} />
                  <span className={`font-semibold ${selectedSlot?.id === slot.id ? 'text-primary' : 'text-slate-700'}`}>
                    {slot.time}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">{slot.date}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Booking Form */}
        <div className={`transition-opacity duration-300 ${selectedSlot ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500"></div>
            
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Patient Details</h2>
            
            {selectedSlot && (
              <div className="bg-sky-50 text-sky-800 p-3 rounded-lg text-sm mb-6 flex justify-between items-center border border-sky-100">
                <span className="font-medium">Selected Slot:</span>
                <span className="font-bold">{selectedSlot.time} on {selectedSlot.date}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="e.g. 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Health Problem / Reason</label>
                <textarea
                  name="problem"
                  required
                  rows="3"
                  value={formData.problem}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  placeholder="Please describe your symptoms briefly..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!selectedSlot || bookingStatus === 'submitting'}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Submit
                {bookingStatus === 'submitting' ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
