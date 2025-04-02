// components/ConfirmDeleteDialog.tsx
import {
    AlertDialog, AlertDialogOverlay, AlertDialogContent,
    AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
    Button
} from '@chakra-ui/react'
import { useRef } from 'react'

interface Props {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    entityName: string
}

export default function ConfirmDeleteDialog({ isOpen, onClose, onConfirm, entityName }: Props) {
    const cancelRef = useRef<HTMLButtonElement>(null)

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>Deletar {entityName}</AlertDialogHeader>
                <AlertDialogBody>Tem certeza que deseja deletar {entityName}?</AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>Cancelar</Button>
                    <Button colorScheme="red" onClick={onConfirm} ml={3}>Deletar</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}