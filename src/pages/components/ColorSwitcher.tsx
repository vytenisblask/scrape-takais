// ColorSwitcher.tsx
import React from 'react';
import { useColorMode, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const ColorModeSwitcher: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      isRound={true}
      aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    />
  );
};

export default ColorModeSwitcher;
