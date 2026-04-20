'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [yajamaniTickets, setYajamaniTickets] = useState(1);
  const [freeQuantity, setFreeQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ yajamani: 0, free: 0 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsappRequested: true,
  });

  const [donationAmount, setDonationAmount] = useState({
    Food: 10,
    Hall: 50,
    Flowers: 20,
  });

  const fetchCounts = async () => {
    try {
      const res = await fetch('/api/tickets-count');
      const data = await res.json();
      setCounts(data);
    } catch(e) { }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleCheckoutYajamani = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketType: 'yajamani',
          quantity: yajamaniTickets,
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'An error occurred. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/free-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: freeQuantity,
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Tickets booked successfully!');
        if (formData.whatsappRequested) {
          window.open(process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://chat.whatsapp.com/placeholder", "_blank");
        }
        await fetchCounts();
      } else {
        alert(data.error || 'An error occurred. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (purpose: string) => {
    setLoading(true);
    try {
      const amount = donationAmount[purpose as keyof typeof donationAmount];
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose,
          amount,
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('An error occurred. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isYajamaniSoldOut = counts.yajamani >= 30;
  const isFreeSoldOut = counts.free >= 300;

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-amber-500 selection:text-white pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-image.jpg" 
            alt="Srinivasakalyanam Event" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/50" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm">
            Srinivasakalyanam 2026
          </h1>
          <p className="text-xl md:text-3xl text-neutral-200 font-medium mb-8">
            A Divine Wedding Ceremony in Rugby
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-base text-neutral-300 bg-black/40 backdrop-blur-md rounded-2xl py-3 px-6 max-w-2xl mx-auto border border-white/10 shadow-2xl">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              5th July 2026
            </span>
            <span className="hidden md:block text-neutral-500">•</span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Edward Street, Indian Samaj Hall, Rugby
            </span>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="max-w-6xl mx-auto px-6 mt-16 z-20 relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center tracking-tight">Secure Your Place</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Yajamani Ticket */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-800/50 border border-amber-500/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col group relative overflow-hidden">
            <div className="mb-6 relative z-10">
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Premium Experience</span>
              <h3 className="text-2xl font-bold mt-4 mb-2">Yajamani Ticket</h3>
              <p className="text-neutral-400">Perform the sacred rituals and be deeply involved in the ceremony. Limited to 30 families.</p>
              <div className="mt-2 text-sm text-neutral-400 bg-neutral-900/50 p-2 rounded-lg inline-block border border-neutral-700">
                {counts.yajamani} / 30 Booked
              </div>
            </div>
            <div className="text-4xl font-black mb-8 text-amber-500 relative z-10 tracking-tight">
              £51 <span className="text-lg text-neutral-500 font-normal">/ family</span>
            </div>
            
            <div className="mt-auto relative z-10 space-y-6">
              {!isYajamaniSoldOut ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Number of tickets</label>
                    <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-xl p-2 w-max shadow-inner">
                      <button type="button" onClick={() => setYajamaniTickets(Math.max(1, yajamaniTickets - 1))} className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors font-bold text-lg hover:text-amber-500">-</button>
                      <span className="w-8 text-center font-semibold text-lg">{yajamaniTickets}</span>
                      <button type="button" onClick={() => setYajamaniTickets(Math.min(30 - counts.yajamani, yajamaniTickets + 1))} className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors font-bold text-lg hover:text-amber-500">+</button>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckoutYajamani}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg"
                  >
                    {loading ? 'Processing...' : 'Book Yajamani Ticket'}
                  </button>
                </>
              ) : (
                <div className="w-full bg-red-900/40 text-red-400 border border-red-500/30 font-bold py-4 px-6 rounded-xl text-center text-lg">
                  SOLD OUT
                </div>
              )}
            </div>
          </div>

          {/* Free Ticket */}
          <div className="bg-neutral-800 border border-neutral-700 p-8 rounded-3xl hover:border-neutral-500 transition-all duration-300 flex flex-col relative overflow-hidden">
            <div className="mb-6 relative z-10">
              <span className="bg-neutral-700 text-neutral-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">General Admission</span>
              <h3 className="text-2xl font-bold mt-4 mb-2">Free Ticket</h3>
              <p className="text-neutral-400">Witness the divine ceremony and receive blessings. Limited to 300 seats.</p>
              <div className="mt-2 text-sm text-neutral-400 bg-neutral-900/50 p-2 rounded-lg inline-block border border-neutral-700">
                {counts.free} / 300 Booked
              </div>
            </div>
            <div className="text-4xl font-black mb-8 relative z-10 tracking-tight">
              Free
            </div>
            
            <div className="mt-auto relative z-10">
              {!isFreeSoldOut ? (
                <form onSubmit={handleFreeTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Phone</label>
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Number of tickets</label>
                    <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-xl p-2 w-max shadow-inner">
                      <button type="button" onClick={() => setFreeQuantity(Math.max(1, freeQuantity - 1))} className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors font-bold text-lg hover:text-blue-400">-</button>
                      <span className="w-8 text-center font-semibold text-lg">{freeQuantity}</span>
                      <button type="button" onClick={() => setFreeQuantity(Math.min(300 - counts.free, freeQuantity + 1))} className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors font-bold text-lg hover:text-blue-400">+</button>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-700 cursor-pointer hover:bg-neutral-800 transition-colors">
                    <input type="checkbox" checked={formData.whatsappRequested} onChange={e => setFormData({...formData, whatsappRequested: e.target.checked})} className="w-5 h-5 rounded border-neutral-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-neutral-900 bg-neutral-700" />
                    <span className="text-sm font-medium text-neutral-300">Join our WhatsApp group for updates</span>
                  </label>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg mt-4"
                  >
                    {loading ? 'Processing...' : 'Register for Free Tickets'}
                  </button>
                </form>
              ) : (
                <div className="w-full bg-red-900/40 text-red-400 border border-red-500/30 font-bold py-4 px-6 rounded-xl text-center text-lg h-full flex items-center justify-center min-h-[300px]">
                  SOLD OUT
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Donation Section */}
      <section className="max-w-5xl mx-auto px-6 mt-20 z-20 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Support Our Event</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">Your generous contributions help us organize this divine ceremony. Donations are fully optional but deeply appreciated.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Donate Food */}
          <div className="bg-neutral-800/80 border border-neutral-700/50 p-6 rounded-2xl flex flex-col items-center text-center hover:border-neutral-500 transition-colors">
            <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Donate for Food</h3>
            <p className="text-sm text-neutral-400 mb-6 flex-1">Help us provide Annadanam (free meals) to all attendees.</p>
            
            <div className="w-full">
              <label className="block text-xs text-neutral-400 mb-1 text-left">Custom Amount (£)</label>
              <div className="flex bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden mb-4">
                <span className="flex items-center justify-center px-4 bg-neutral-800 text-neutral-400 font-bold">£</span>
                <input type="number" min="1" value={donationAmount.Food} onChange={(e) => setDonationAmount({...donationAmount, Food: Number(e.target.value)})} className="w-full bg-transparent px-3 py-3 focus:outline-none text-white font-semibold" />
              </div>
              <button disabled={loading} onClick={() => handleDonate('Food')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm">
                Donate Now
              </button>
            </div>
          </div>

          {/* Donate Hall */}
          <div className="bg-neutral-800/80 border border-neutral-700/50 p-6 rounded-2xl flex flex-col items-center text-center hover:border-neutral-500 transition-colors">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Donate for Hall</h3>
            <p className="text-sm text-neutral-400 mb-6 flex-1">Support the costs of securing the venue.</p>
            
            <div className="w-full">
              <label className="block text-xs text-neutral-400 mb-1 text-left">Custom Amount (£)</label>
              <div className="flex bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden mb-4">
                <span className="flex items-center justify-center px-4 bg-neutral-800 text-neutral-400 font-bold">£</span>
                <input type="number" min="1" value={donationAmount.Hall} onChange={(e) => setDonationAmount({...donationAmount, Hall: Number(e.target.value)})} className="w-full bg-transparent px-3 py-3 focus:outline-none text-white font-semibold" />
              </div>
              <button disabled={loading} onClick={() => handleDonate('Hall')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm">
                Donate Now
              </button>
            </div>
          </div>

          {/* Donate Flowers */}
          <div className="bg-neutral-800/80 border border-neutral-700/50 p-6 rounded-2xl flex flex-col items-center text-center hover:border-neutral-500 transition-colors">
            <div className="w-16 h-16 bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Donate for Flowers</h3>
            <p className="text-sm text-neutral-400 mb-6 flex-1">Contribute to the beautiful floral decorations.</p>
            
            <div className="w-full">
              <label className="block text-xs text-neutral-400 mb-1 text-left">Custom Amount (£)</label>
              <div className="flex bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden mb-4">
                <span className="flex items-center justify-center px-4 bg-neutral-800 text-neutral-400 font-bold">£</span>
                <input type="number" min="1" value={donationAmount.Flowers} onChange={(e) => setDonationAmount({...donationAmount, Flowers: Number(e.target.value)})} className="w-full bg-transparent px-3 py-3 focus:outline-none text-white font-semibold" />
              </div>
              <button disabled={loading} onClick={() => handleDonate('Flowers')} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
