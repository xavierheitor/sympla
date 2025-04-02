// components/ModalWrapper.tsx
'use client'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

interface ModalWrapperProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export default function ModalWrapper({ isOpen, onClose, title, children }: ModalWrapperProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </Modal>
    )
}