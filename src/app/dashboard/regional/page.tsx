// RegionalPage.tsx
'use client'

import {
    Box,
    Button,
    Text,
    Heading,
    useDisclosure,
    HStack,
    IconButton,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Input,
    Spinner,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
} from '@chakra-ui/react'
import { FiEdit2, FiPlus, FiRefreshCcw, FiTrash } from 'react-icons/fi'
import { SetStateAction, useRef, useState } from 'react'
import useSWR from 'swr'
import { fetchRegionais } from '@/lib/actions/regional/fetchRegional'
import { Regional } from '@/lib/definitions/models/Regional'
import ModalWrapper from '@/lib/components/ModalWrapper'
import RegionalForm from './RegionalForm'
import { deleteRegional } from '@/lib/actions/regional/deleteRegional'

export default function RegionalPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const { data: regionais, isLoading, error, mutate: reload } = useSWR<Regional[]>('/api/regionais', fetchRegionais)
    const [editingRegional, setEditingRegional] = useState<Regional | null>(null)
    const [deletingRegional, setDeletingRegional] = useState<Regional | null>(null)
    const [search, setSearch] = useState('')
    const toast = useToast()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const filteredRegionais = regionais?.filter((regional) =>
        regional.nome.toLowerCase().includes(search.toLowerCase())
    )

    const handleEdit = (regional: Regional) => {
        setEditingRegional(regional)
        onEditOpen()
    }

    const handleDelete = (regional: Regional) => {
        setDeletingRegional(regional)
        onDeleteOpen()
    }

    const confirmDelete = async () => {
        // Aqui você pode fazer uma chamada para deletar a regional via API
        const result = await deleteRegional({ success: true, message: 'Regional removida com sucesso' }, deletingRegional?.id || 0)
        if (result.success) {
            toast({
                title: result.message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            onDeleteClose()
            reload()
        } else {
            toast({
                title: result.message || 'Erro ao deletar regional',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="lg">Regionais</Heading>
            </HStack>

            <Box bg="white" p={6} rounded="lg" shadow="base">
                <HStack justify="space-between" mb={4}>
                    <Input placeholder="Pesquisar regional" onChange={(e: { target: { value: SetStateAction<string> } }) => setSearch(e.target.value)} />

                    <IconButton
                        aria-label="Adicionar Regional"
                        icon={<FiPlus />}
                        onClick={onCreateOpen}
                        colorScheme="blue"
                    >Nova Regional</IconButton>
                    <IconButton
                        aria-label="Atualizar"
                        icon={<FiRefreshCcw />}
                        onClick={() => reload()}
                        colorScheme="gray"
                        isLoading={isLoading}
                    />
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
                            <Th>Empresa</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredRegionais?.map((regional) => (
                            <Tr key={regional.id}>
                                <Td>{regional.nome}</Td>
                                <td>{regional.empresa?.nome}</td>
                                <td>
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FiEdit2 />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(regional)}
                                    />
                                    <IconButton
                                        aria-label="Excluir"
                                        icon={<FiTrash />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleDelete(regional)}
                                    />
                                </td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal de Criação */}
            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Nova Regional">
                <RegionalForm onSuccess={() => {
                    onCreateClose()
                    reload()
                }} regional={null} />
            </ModalWrapper>

            {/* Modal de Edição */}
            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Regional">
                <RegionalForm onSuccess={() => {
                    onEditClose()
                    setEditingRegional(null)
                    reload()
                }} regional={editingRegional} />
            </ModalWrapper>

            {/* Modal de Confirmação de Remoção */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Deletar Regional
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Tem certeza que deseja deletar a regional {deletingRegional?.nome}?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onDeleteClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={confirmDelete}>
                            Deletar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    )
}
