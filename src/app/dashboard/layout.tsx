'use client'

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  Link,
  Collapse,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiBriefcase,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const menuItems = [
    { name: "Dashboard", icon: FiHome, path: "/dashboard" },
    { name: "Perfil", icon: FiUser, path: "/dashboard/profile" },
    {
      name: "Cadastros",
      icon: FiBriefcase,
      children: [
        { name: "Empresas", path: "/dashboard/empresa" },
        { name: "Regionais", path: "/dashboard/regional" },
        { name: "Subestações", path: "/dashboard/subestacao" },
        { name: "Equipamentos", path: "/dashboard/equipamento" },
      ],
    },
    {
      name: "Manutenção",
      icon: FiBriefcase,
      children: [
        { name: "Tipos de Manutenção", path: "/dashboard/tipoManutencao" },
        { name: "Notas Plano de Manutenção", path: "/dashboard/notaPlanoManutencao" },
      ],
    },
    {
      name: "Defeitos",
      icon: FiBriefcase,
      children: [
        { name: "Grupos de Defeito", path: "/dashboard/grupoDeDefeito" },
        { name: "Grupos x Equipamentos", path: "/dashboard/grupoDefeitoEquipamento" },
        { name: "Subgrupos de Defeito", path: "/dashboard/subgrupoDefeito" },
        { name: "Defeitos", path: "/dashboard/defeito" },
      ],
    },
    { name: "KPI", icon: FiBriefcase, path: "/dashboard/kpi" },
  ];

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        py={5}
      >
        <VStack spacing={4} align="stretch" height="100%" overflow="auto">
          <Box px={5}>
            <Text fontSize="xl" fontWeight="bold">
              Dashboard
            </Text>
          </Box>
          <VStack spacing={1} align="stretch">
            {menuItems.map((item) => {
              if (item.children) {
                return (
                  <Box key={item.name}>
                    <HStack
                      px={5}
                      py={3}
                      _hover={{ bg: "blue.50", cursor: "pointer" }}
                      onClick={() => toggleMenu(item.name)}
                      justify="space-between"
                    >
                      <HStack>
                        <Icon as={item.icon} />
                        <Text color="gray.700">{item.name}</Text>
                      </HStack>
                      <Icon as={openMenus[item.name] ? FiChevronDown : FiChevronRight} />
                    </HStack>
                    <Collapse in={openMenus[item.name]}>
                      <VStack spacing={1} align="stretch" pl={8}>
                        {item.children.map((sub) => (
                          <Link
                            key={sub.path}
                            as={NextLink}
                            href={sub.path}
                            py={2}
                            color={pathname === sub.path ? "blue.500" : "gray.600"}
                            bg={pathname === sub.path ? "blue.50" : "transparent"}
                            _hover={{ bg: "blue.50", color: "blue.500" }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </VStack>
                    </Collapse>
                  </Box>
                );
              }

              return (
                <Link
                  key={item.path}
                  as={NextLink}
                  href={item.path}
                  px={5}
                  py={3}
                  bg={pathname === item.path ? "blue.50" : "transparent"}
                  color={pathname === item.path ? "blue.500" : "gray.600"}
                  _hover={{
                    bg: "blue.50",
                    color: "blue.500",
                  }}
                >
                  <HStack>
                    <Icon as={item.icon} />
                    <Text>{item.name}</Text>
                  </HStack>
                </Link>
              );
            })}
          </VStack>
          <Box px={5} mt="auto">
            <Link
              as={NextLink}
              href="#"
              onClick={() => signOut()}
              px={5}
              py={3}
              display="flex"
              alignItems="center"
              color="red.500"
              _hover={{
                bg: "red.50",
              }}
            >
              <HStack>
                <Icon as={FiLogOut} />
                <Text>Sair</Text>
              </HStack>
            </Link>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" p={8} overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}