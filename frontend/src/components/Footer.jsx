export default function Footer() {
  return (
    // border-t border-border-subtle: Yläreuna
    // text-white/70: Hieman läpinäkyvä valkoinen teksti
    <footer className="w-full py-6 mt-auto border-t border-border-subtle bg-background flex justify-center items-center">
      <p className="text-center text-white/70 text-sm font-sans">
        © {new Date().getFullYear()} TSW Group – Ajolupaharjoittelu
      </p>
    </footer>
  );
}