'use client'

import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Heading,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    VStack,
    IconButton,
    HStack,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Spinner,
    Text,
} from '@chakra-ui/react'
import { FiEdit2, FiPlus, FiRefreshCcw, FiTrash } from 'react-icons/fi'
import { useRef, useState } from 'react'
import { fetchEmpresas } from '@/lib/actions/empresa/fetchEmpresas'
import useSWR from "swr";

interface Empresa {
    id: number
    name: string
    cnpj: string
}

export default function CompaniesPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    // const [companies, setCompanies] = useState<Empresa[]>([
    //     { id: 1, name: 'Empresa A', cnpj: '12.345.678/0001-90', email: 'contato@empresa-a.com', phone: '(11) 3333-4444' },
    //     { id: 2, name: 'Empresa B', cnpj: '98.765.432/0001-10', email: 'contato@empresa-b.com', phone: '(11) 5555-6666' },
    // ])


    const {
        data: companies,
        error,
        isLoading,
        mutate: reload
    } = useSWR<Empresa[]>('/api/empresas', fetchEmpresas);


    const [editingCompany, setEditingCompany] = useState<Empresa | null>(null)
    const [deletingCompany, setDeletingCompany] = useState<Empresa | null>(null)

    const [formData, setFormData] = useState<Partial<Empresa>>({})
    const toast = useToast()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const [search, setSearch] = useState('');

    const filteredCompanies = companies?.filter(company =>
        company.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        // const newCompany: Empresa = {
        //     id: companies?.length || 0 + 1,
        //     name: formData.name || '',
        //     cnpj: formData.cnpj || ''
        // }
        // }
        // setCompanies([...companies, newCompany])
        // onCreateClose()
        // setFormData({})
        // toast({
        //     title: 'Empresa criada com sucesso!',
        //     status: 'success',
        //     duration: 3000,
        //     isClosable: true,
        // })
    }

    const handleEdit = (company: Empresa) => {
        setEditingCompany(company)
        setFormData(company)
        onEditOpen()
    }



    const handleDelete = (company: Empresa) => {
        setDeletingCompany(company)
        onDeleteOpen()
    }

    const confirmDelete = () => {
        // if (!deletingCompany) return

        // const updatedCompanies = companies.filter(company => company.id !== deletingCompany.id)
        // setCompanies(updatedCompanies)
        // onDeleteClose()
        // setDeletingCompany(null)
        // toast({
        //     title: 'Empresa removida com sucesso!',
        //     status: 'success',
        //     duration: 3000,
        //     isClosable: true,
        // })
    }


    const handleUpdate = () => {
        if (!editingCompany) return

        // const updatedCompanies = companies.map(company => {
        //     if (company.id === editingCompany.id) {
        //         return {
        //             ...company,
        //             name: formData.name || company.name,
        //             cnpj: formData.cnpj || company.cnpj,
        //             email: formData.email || company.email,
        //             phone: formData.phone || company.phone,
        //         }
        //     }
        //     return company
        // })

        // setCompanies(updatedCompanies)
        onEditClose()
        setEditingCompany(null)
        setFormData({})
        toast({
            title: 'Empresa atualizada com sucesso!',
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }



    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading>Empresas</Heading>

            </HStack>

            <Box bg="white" p={6} rounded="lg" shadow="base">
                <HStack justify="space-between" mb={4}>
                    <Input placeholder="Pesquisar empresa" onChange={(e) => setSearch(e.target.value)} />
                    <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onCreateOpen}>
                        Nova Empresa
                    </Button>
                    <Button leftIcon={<FiRefreshCcw />} colorScheme="blue" onClick={() => reload()} />
                </HStack>
                {isLoading && (
                    <Box textAlign="center" my={10}>
                        <Spinner size="xl" />
                    </Box>
                )}
                {error && (
                    <Box textAlign="center" my={10}>
                        <Text color="red.500">{error.message}</Text>
                    </Box>
                )}

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>CNPJ</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>

                        {filteredCompanies?.map((company) => (
                            <Tr key={company.id}>
                                <Td>{company.name}</Td>
                                <Td>{company.cnpj}</Td>
                                <Td>
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FiEdit2 />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(company)}
                                    />
                                    <IconButton
                                        aria-label="Excluir"
                                        icon={<FiTrash />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleDelete(company)}
                                    />

                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal de Criação */}
            <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Nova Empresa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nome da empresa"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>CNPJ</FormLabel>
                                <Input
                                    value={formData.cnpj || ''}
                                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                    placeholder="00.000.000/0000-00"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onCreateClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="blue" onClick={handleCreate}>
                            Criar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal de Edição */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Empresa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nome da empresa"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>CNPJ</FormLabel>
                                <Input
                                    value={formData.cnpj || ''}
                                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                    placeholder="00.000.000/0000-00"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onEditClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="blue" onClick={handleUpdate}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal de Confirmação de Remoção */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Remover Empresa
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja remover a empresa {deletingCompany?.name}? Esta ação não pode ser desfeita.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                Remover
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
} 