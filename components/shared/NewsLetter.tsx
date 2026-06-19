export default function NewsLetter() {
  return (
    <section className="mt-20 mb-20 flex flex-col items-center text-white">
      <div className="flex flex-col items-center">
        <h2 className="text-center max-w-2xl text-4xl md:text-5xl font-medium mb-4">
          Subscribe{" "}
          <span className="bg-linear-to-t from-[#102622] to-[#21302e] p-1 bg-left inline-block bg-no-repeat">
            newsletter
          </span>
        </h2>
        <p className="mt-3 text-muted-foreground text-sm max-w-96 mx-auto text-center">
          A visual collection of our most recent works - each piece crafted with
          intention, emotion, and style.
        </p>
      </div>
      <div className="flex items-center justify-center mt-10 border border-slate-700 focus-within:outline focus-within:outline-[#19201F] text-sm rounded-full h-14 max-w-xl w-full">
        <input
          className="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-slate-400"
          placeholder="Enter your email address"
          type="text"
        />
        <button className="bg-[#1c2725] text-white rounded-full h-11 mr-1 mx-auto px-5 md:px-10 flex items-center justify-center hover:bg-[#19201F] active:scale-95 transition">
          Subscribe
        </button>
      </div>
    </section>
  );
}
