import Link from 'next/link';

export default function Success() {
  const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://chat.whatsapp.com/placeholder";

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6 selection:bg-green-500 selection:text-white">
      <div className="max-w-xl w-full bg-neutral-800 p-10 rounded-3xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <svg className="w-32 h-32 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        </div>

        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        <h1 className="text-4xl font-black mb-4 relative z-10">Payment Successful!</h1>
        <p className="text-lg text-neutral-300 mb-8 relative z-10">
          Thank you for booking your tickets for the Srinivasakalyanam Rugby 2026 event. We look forward to seeing you there!
        </p>

        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-700 mb-8 relative z-10">
          <h2 className="text-xl font-bold mb-3">Next Step: Join the WhatsApp Group</h2>
          <p className="text-neutral-400 mb-6 text-sm">Please join our official WhatsApp group for important event updates, schedules, and communication with other attendees.</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
            Join WhatsApp Group
          </a>
        </div>

        <Link href="/" className="inline-block text-neutral-400 hover:text-white transition-colors relative z-10 underline underline-offset-4">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
}
