import Link from 'next/link';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6 selection:bg-amber-500 selection:text-white">
      <div className="max-w-md w-full bg-neutral-800 p-10 rounded-3xl border border-neutral-700 shadow-2xl text-center">
        <div className="w-20 h-20 bg-neutral-700/50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-neutral-400 mb-8">
          The checkout process was not completed. No charges were made to your account. You can securely try again whenever you are ready.
        </p>

        <Link 
          href="/" 
          className="block w-full bg-white text-black hover:bg-neutral-200 font-bold py-4 px-6 rounded-xl transition-all shadow-lg active:scale-[0.98]"
        >
          Try Booking Again
        </Link>
      </div>
    </div>
  );
}
