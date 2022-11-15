import React from 'react';
import Link from '../ui/Link';

const Footer: React.FunctionComponent = () => {
  return (
    <footer className="flex-shrink-0 text-xs bg-white border-t border-gray">
      <div className="flex-col items-center justify-between px-4 py-6 mx-auto md:flex max-w-7xl">
        <div className="flex items-center justify-center">
          <p className="mr-2">Have feedback?</p>
          <Link
            href="/contact"
            className="font-semibold underline text-evergreen hover:opacity-70"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
