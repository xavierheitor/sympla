// EmpresaPage.tsx
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
    Input,
    HStack,
    IconButton,
    useToast,
    Spinner,
    Text,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from '@chakra-ui/react'
import { FiEdit2, FiPlus, FiRefreshCcw, FiTrash } from 'react-icons/fi'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { fetchEmpresas } from '@/lib/actions/empresa/fetchEmpresas'
import { Empresa } from '@/lib/definitions/models/Empresa'
import ModalWrapper from '@/lib/components/ModalWrapper'
import EmpresaForm from './EmpresaForm'
import { deleteEmpresa } from '@/lib/actions/empresa/deleteEmpresa'

export default function EmpresaPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const { data: companies, error, isLoading, mutate: reload } = useSWR<Empresa[]>('/api/empresas', fetchEmpresas)
    const [editingCompany, setEditingCompany] = useState<Empresa | null>(null)
    const [deletingCompany, setDeletingCompany] = useState<Empresa | null>(null)
    const [search, setSearch] = useState('')
    const toast = useToast()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const filteredCompanies = companies?.filter((company) =>
        company.nome.toLowerCase().includes(search.toLowerCase())
    )

    const handleEdit = (company: Empresa) => {
        setEditingCompany(company)
        onEditOpen()
    }

    const handleDelete = (company: Empresa) => {
        setDeletingCompany(company)
        onDeleteOpen()
    }

    const confirmDelete = async () => {
        // Aqui você pode fazer uma chamada para deletar a empresa via API
        const result = await deleteEmpresa({ success: true, message: 'Empresa removida com sucesso' }, deletingCompany?.id || 0)
        if (result.success) {
            toast({
                title: 'Empresa removida com sucesso!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            onDeleteClose()
            reload()
        } else {
            toast({
                title: 'Erro ao remover empresa!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading>Empresas</Heading>
            </HStack>

            <Box bg="white" p={6} rounded="lg" shadow="base">
                <HStack justify="space-between" mb={4}>
                    <Input placeholder="Pesquisar empresa" onChange={(e) => setSearch(e.target.value)} />
                    <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onCreateOpen} />
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
                                <Td>{company.nome}</Td>
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
            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Nova Empresa">
                <EmpresaForm
                    empresa={null}
                    onSuccess={() => {
                        onCreateClose()
                        reload()
                    }}
                />
            </ModalWrapper>

            {/* Modal de Edição */}
            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Empresa">
                <EmpresaForm
                    empresa={editingCompany}
                    onSuccess={() => {
                        onEditClose()
                        setEditingCompany(null)
                        reload()
                    }}
                />
            </ModalWrapper>

            {/* Modal de Confirmação de Remoção */}
            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Remover Empresa
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Tem certeza que deseja remover a empresa {deletingCompany?.nome}? Esta ação não pode ser desfeita.
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