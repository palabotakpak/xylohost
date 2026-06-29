import { Helmet } from "react-helmet-async";
import { Icon } from "@iconify/react";
import UploadZone from "../components/UploadZone";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>XyloHost — Upload &amp; Share Any File Instantly</title>
        <meta name="description" content="Upload, share, and host any file type — images, videos, code, documents. Your files, your domain." />
        <meta property="og:title" content="XyloHost — Upload &amp; Share Any File" />
        <meta property="og:description" content="Upload, share, and host any file type instantly." />
        <meta property="og:type" content="website" />
      </Helmet>

      <main>
        {/* Hero */}
        <section className="relative bg-black min-h-screen md:min-h-0 pt-[160px] pb-[100px] md:pt-[180px] md:pb-[140px] flex flex-col items-center justify-center overflow-hidden">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[650px] h-[350px] md:h-[650px] rounded-full pointer-events-none z-0 opacity-40 select-none" 
            style={{
              background: "radial-gradient(circle, rgba(255, 192, 0, 0.12) 0%, rgba(255, 192, 0, 0) 70%)",
              filter: "blur(50px)"
            }}
          />

          <div className="relative z-10 max-w-[800px] mx-auto px-4 md:px-8 w-full flex flex-col items-center text-center">
            <div className="max-w-[680px] sm:max-w-full w-full mb-6 flex flex-col items-center">
              <h1 className="font-brand text-[clamp(24px,5.5vw,32px)] md:text-[clamp(32px,4.8vw,52px)] leading-[1.2] font-black tracking-tight text-white mb-10 md:mb-6 uppercase">
                Hosting <span className="bg-gradient-to-r from-gold-text via-gold to-yellow-500 bg-clip-text text-transparent">Apapun</span><br className="hidden sm:block" /> Instan
              </h1>
              <p className="font-display text-base md:text-[17.5px] leading-relaxed md:leading-[1.65] text-ash mb-[52px] md:mb-9">
                Seret dan lepaskan file apa pun.
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <UploadZone />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark-iron border-t border-border-color py-12 text-ash text-[14.5px]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className="max-w-[400px] md:max-w-full mx-auto flex flex-col gap-4 items-center text-center">
              <a href="/" className="flex items-center gap-2 text-white no-underline justify-center">
                <Icon icon="tabler:package" width="20" height="20" className="text-gold" />
                <span className="font-brand text-lg font-black tracking-[0.05em] uppercase">XYLO<span className="text-gold">HOST</span></span>
              </a>
              <p className="text-[13.5px] font-display leading-relaxed">
                Upload, share, and hosting file anda. Gratis dan cepat menggunakan CDN Global.
              </p>
            </div>
            <div className="border-t border-border-color mt-10 pt-[30px] flex flex-col md:flex-row justify-center items-center flex-wrap gap-3 md:gap-5">
              <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-ash/60">
                &copy; {new Date().getFullYear()} XYLOHOST
              </span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
