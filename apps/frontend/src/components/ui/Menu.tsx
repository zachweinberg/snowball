import { Menu as MenuHUI, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  options: Array<{ label: string; onClick: () => void }>;
  button: () => any;
}

const Menu: React.FunctionComponent<Props> = ({ options, button }: Props) => {
  return (
    <MenuHUI as="div" className="relative inline-block">
      <div>
        <MenuHUI.Button>{button}</MenuHUI.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-75"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <MenuHUI.Items className="absolute right-0 z-50 w-48 py-2 mt-2 space-y-1 origin-top-right bg-white border rounded-md shadow-lg border-lightgray">
          {options.map((opt) => (
            <div key={opt.label}>
              <MenuHUI.Item>
                {({ active }) => (
                  <button
                    className="text-dark hover:bg-lightgray font-medium py-2 px-4 text-[0.9rem] w-full text-left hover:text-dark"
                    onClick={opt.onClick}
                  >
                    {opt.label}
                  </button>
                )}
              </MenuHUI.Item>
            </div>
          ))}
        </MenuHUI.Items>
      </Transition>
    </MenuHUI>
  );
};

export default Menu;
