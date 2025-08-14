import React from 'react';

interface ComponentProps {
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ children }) => {
  return (
    <div className="component">
      {children}
    </div>
  );
};

export default Component;