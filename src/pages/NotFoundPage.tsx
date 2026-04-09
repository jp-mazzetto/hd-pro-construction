import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
    <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">Error 404</p>
      <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white">
        Page Not Found
      </h1>
      <p className="mt-4 text-sm leading-7 text-slate-300">
        This URL does not exist. Return to a valid page to continue browsing services and plans.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-slate-950 transition hover:bg-orange-400"
        >
          Home
        </Link>
        <Link
          to="/services"
          className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-orange-300 hover:text-orange-300"
        >
          Services
        </Link>
      </div>
    </div>
  </main>
);

export default NotFoundPage;
