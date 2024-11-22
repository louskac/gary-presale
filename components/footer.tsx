import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full bg-dark-blue py-6">
      <div className="container text-xl mx-auto flex flex-col justify-between items-center px-4 gap-6 text-base">
        <div className="text-white text-center">
          <p className="font-bold">Coingarage s.r.o.</p>
          <p>Revoluční 1082/8, Nové Město (Praha 1),</p>
          <p>110 00 Prague, Czech Republic</p>
        </div>
        <div className="text-gary-yellow text-center">
          <a href="mailto:support@helpgary.com" className="underline">
            support@helpgary.com
          </a>
        </div>
        <div className="text-white text-center">
          <p>&copy; 2024</p>
          <p>
            All Rights Reserved by <strong>HELP{'\u00A0'}GARY</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
