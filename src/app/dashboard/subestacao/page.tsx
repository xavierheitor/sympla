// SubestacaoPage.tsx
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
import { fetchSubestacoes } from '@/lib/actions/subestacao/fetchSubestacao'
import { Subestacao } from '@/lib/definitions/models/Subestacao'
import ModalWrapper from '@/lib/components/ModalWrapper'
import SubestacaoForm from './SubestacaoForm'
import { deleteSubestacao } from '@/lib/actions/subestacao/deleteSubestacao'

export default function SubestacaoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const { data: subestacoes, isLoading, error, mutate: reload } = useSWR<Subestacao[]>('/api/subestacoes', fetchSubestacoes)
    const [editingSubestacao, setEditingSubestacao] = useState<Subestacao | null>(null)
    const [deletingSubestacao, setDeletingSubestacao] = useState<Subestacao | null>(null)
    const [search, setSearch] = useState('')
    const toast = useToast()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const filteredSubestacoes = subestacoes?.filter((sub) =>
        sub.nome.toLowerCase().includes(search.toLowerCase())
    )

    const handleEdit = (sub: Subestacao) => {
        setEditingSubestacao(sub)
        onEditOpen()
    }

    const handleDelete = (sub: Subestacao) => {
        setDeletingSubestacao(sub)
        onDeleteOpen()
    }

    const confirmDelete = async () => {
        const result = await deleteSubestacao({ success: true, message: '' }, deletingSubestacao?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success', duration: 3000, isClosable: true })
            onDeleteClose()
            reload()
        } else {
            toast({ title: result.message || 'Erro ao deletar subestação', status: 'error', duration: 3000, isClosable: true })
        }
    }

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="lg">Subestações</Heading>
            </HStack>

            <Box bg="white" p={6} rounded="lg" shadow="base">
                <HStack justify="space-between" mb={4}>
                    <Input placeholder="Pesquisar subestação" onChange={(e: { target: { value: SetStateAction<string> } }) => setSearch(e.target.value)} />

                    <IconButton
                        aria-label="Adicionar Subestação"
                        icon={<FiPlus />}
                        onClick={onCreateOpen}
                        colorScheme="blue"
                    >Nova Subestação</IconButton>
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
                            <Th>Sigla</Th>
                            <Th>Regional</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredSubestacoes?.map((sub) => (
                            <Tr key={sub.id}>
                                <Td>{sub.nome}</Td>
                                <Td>{sub.sigla}</Td>
                                <Td>{sub.regional?.nome}</Td>
                                <Td>
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FiEdit2 />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(sub)}
                                    />
                                    <IconButton
                                        aria-label="Excluir"
                                        icon={<FiTrash />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleDelete(sub)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal de Criação */}
            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Nova Subestação">
                <SubestacaoForm onSuccess={() => {
                    onCreateClose()
                    reload()
                }} subestacao={null} />
            </ModalWrapper>

            {/* Modal de Edição */}
            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Subestação">
                <SubestacaoForm onSuccess={() => {
                    onEditClose()
                    setEditingSubestacao(null)
                    reload()
                }} subestacao={editingSubestacao} />
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
                        Deletar Subestação
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Tem certeza que deseja deletar a subestação {deletingSubestacao?.nome}?
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