import React, {ReactNode, useState} from 'react';
import {AsYouType} from 'libphonenumber-js';

export const HoverableDiv = ({
  children,
  className,
}: {
  children: (isHovered: boolean) => ReactNode;
  className: string;
}) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children(isHovered)}
    </div>
  );
};

export function parsePhoneInput(oldValue: string, newValue: string) {
  const parsedVal = new AsYouType('US').input(newValue);
  if (parsedVal === oldValue && parsedVal.indexOf(newValue) === 0) {
    return parsedVal.slice(0, -1);
  }
  return parsedVal;
}
