
// src/app/dashboard/equipamento/page.tsx
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
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Spinner,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    Input,
} from '@chakra-ui/react'
import { FiEdit2, FiPlus, FiRefreshCcw, FiTrash } from 'react-icons/fi'
import { SetStateAction, useRef, useState } from 'react'
import useSWR from 'swr'
import { fetchEquipamentos } from '@/lib/actions/equipamento/fetchEquipamentos'
import { Equipamento } from '@/lib/definitions/models/Equipamento'
import { deleteEquipamento } from '@/lib/actions/equipamento/deleteEquipamento'
import ModalWrapper from '@/lib/components/ModalWrapper'
import EquipamentoForm from './EquipamentoForm'

export default function EquipamentoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const { data: equipamentos, isLoading, error, mutate: reload } = useSWR<Equipamento[]>('/api/equipamentos', fetchEquipamentos)
    const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null)
    const [deletingEquipamento, setDeletingEquipamento] = useState<Equipamento | null>(null)
    const [search, setSearch] = useState('')
    const toast = useToast()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const filteredEquipamentos = equipamentos?.filter((equipamentos) =>
        equipamentos.nome.toLowerCase().includes(search.toLowerCase())
    )

    const handleEdit = (equipamento: Equipamento) => {
        setEditingEquipamento(equipamento)
        onEditOpen()
    }

    const handleDelete = (equipamento: Equipamento) => {
        setDeletingEquipamento(equipamento)
        onDeleteOpen()
    }

    const confirmDelete = async () => {
        const result = await deleteEquipamento({ success: true, message: 'Equipamento removido com sucesso' }, deletingEquipamento?.id || 0)
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
                title: result.message || 'Erro ao deletar equipamento',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="lg">Equipamentos</Heading>
            </HStack>

            <Box bg="white" p={6} rounded="lg" shadow="base">
                <HStack justify="space-between" mb={4}>
                    <Input placeholder="Pesquisar equipamento" onChange={(e: { target: { value: SetStateAction<string> } }) => setSearch(e.target.value)} />

                    <IconButton
                        aria-label="Adicionar Equipamento"
                        icon={<FiPlus />}
                        onClick={onCreateOpen}
                        colorScheme='blue'
                    />

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
                            <Th>Subestação</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredEquipamentos?.map((equipamento) => (
                            <Tr key={equipamento.id}>
                                <Td>{equipamento.nome}</Td>
                                <Td>{equipamento.subestacao?.nome}</Td>
                                <Td>
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FiEdit2 />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(equipamento)}
                                    />
                                    <IconButton
                                        aria-label="Excluir"
                                        icon={<FiTrash />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleDelete(equipamento)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo Equipamento">
                <EquipamentoForm onSuccess={() => {
                    onCreateClose()
                    reload()
                }} equipamento={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Equipamento">
                <EquipamentoForm onSuccess={() => {
                    onEditClose()
                    setEditingEquipamento(null)
                    reload()
                }} equipamento={editingEquipamento} />
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
                        Deletar Equipamento
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Tem certeza que deseja deletar o equipamento {deletingEquipamento?.nome}?
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