const Footer = () => {
  return (
    <footer className="w-full bg-white/90 border-t border-gray-200 shadow-inner rounded-t-xl h-16 flex items-center justify-center">
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Dev Tinder. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
