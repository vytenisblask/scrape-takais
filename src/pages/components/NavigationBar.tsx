// NavigationBar.tsx
import React from "react";
import { Flex, Box, Divider } from "@chakra-ui/react";
import ColorModeSwitcher from "./ColorSwitcher";
import LogoIcon from "./LogoIcon";

const NavigationBar: React.FC = () => {
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Box>
          <LogoIcon />
        </Box>
        <Box>
          <ColorModeSwitcher />
        </Box>
      </Flex>
      <Divider />
    </>
  );
};

export default NavigationBar;
