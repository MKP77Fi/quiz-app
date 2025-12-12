import logo from "../assets/Logo.png";

export default function Header() {
  return (
    // h-[90px]: Tarkka korkeus vanilla-css mukaan
    // border-border-subtle: Himmeä reuna
    <header className="w-full bg-background border-b border-border-subtle h-[90px] flex items-center shadow-sm">
      <div className="container mx-auto px-6 md:px-10 flex flex-row justify-between items-center w-full">
        
        {/* LOGO */}
        <div className="flex-shrink-0 flex items-center">
          <img
            src={logo}
            alt="TSW Group logo"
            // object-contain ja max-h rajoittavat koon
            className="h-16 md:h-20 w-auto object-contain" 
          />
        </div>

        {/* LINKKI */}
        <nav className="ml-auto flex items-center">
          <a
            href="https://mp005840.nube.fi/tswgroup/"
            className="text-primary no-underline hover:text-accent-orange transition-colors duration-300 font-medium text-base md:text-lg whitespace-nowrap"
          >
            TSW Group -etusivulle &rarr;
          </a>
        </nav>
        
      </div>
    </header>
  );
}