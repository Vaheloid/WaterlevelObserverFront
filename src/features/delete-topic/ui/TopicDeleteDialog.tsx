import { Dialog, Portal, Text, Button } from '@chakra-ui/react';
import type { Topic } from '@/shared/types/types';

interface DeleteDialogProps {
    topic: Topic | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const TopicDeleteDialog = ({ topic, onClose, onConfirm }: DeleteDialogProps) => (
    <Dialog.Root 
        open={!!topic} 
        onOpenChange={(e) => { if (!e.open) onClose() }}
        size="lg"
        placement="center"
    >
        <Portal>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
                <Dialog.Content bg={{ base: "rgba(255, 255, 255, 0.9)", _dark: "rgba(0, 0, 0, 0.7)" }} backdropFilter="blur(16px) saturate(180%)" css={{ borderRadius: '12px' }}>
                    <Dialog.Header>
                        <Dialog.Title color={{ base: "black", _dark: "white" }}>Подтверждение удаления</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Text color={{ base: "black", _dark: "white" }}>
                            Вы действительно хотите удалить топик <strong>{topic?.name_topic}</strong>?
                            Это действие необратимо.
                        </Text>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button 
                                bg={{ base: "white", _dark: "whiteAlpha.200" }} 
                                color={{ base: "black", _dark: "white" }} 
                                borderRadius="12px"
                                border="none"
                                _focus={{ boxShadow: 'none' }}
                                _focusVisible={{ boxShadow: 'none', outline: 'none' }}
                                _hover={{ 
                                    bg: { base: "gray.200", _dark: "whiteAlpha.300" } 
                                }}>
                                Отмена
                            </Button>
                        </Dialog.ActionTrigger>
                        <Button 
                            bg={{ base: "red.600", _dark: "red" }} 
                            color={{ base: "white", _dark: "white" }} 
                            onClick={onConfirm} 
                            borderRadius="12px"
                            border="none"
                            _focus={{ boxShadow: 'none' }}
                            _focusVisible={{ boxShadow: 'none', outline: 'none' }}
                            _hover={{ 
                                bg: { base: "red.500", _dark: "red.500" } 
                            }}
                            >
                            Удалить
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog.Root>
);