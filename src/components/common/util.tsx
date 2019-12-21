import React, {ReactNode, useState} from 'react';

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
