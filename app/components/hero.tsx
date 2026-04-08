export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-sky-500 px-4 py-20 text-center text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl">
        <span className="mb-4 inline-block text-5xl">✈️</span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Your Travel Bucket List
          <br />
          <span className="text-amber-300">Starts Here</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-teal-100 sm:text-xl">
          Search any country in the world and start planning your next
          adventure. Save your favorites and keep track of where you want to go.
        </p>
      </div>
    </section>
  );
}
