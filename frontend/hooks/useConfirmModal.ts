import { useState, useCallback } from "react";

interface UseConfirmModalProps {
  onConfirm: () => void;
}

const useConfirmModal = ({ onConfirm }: UseConfirmModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const confirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return {
    isOpen,
    onOpenChange,
    confirm,
  };
};

export default useConfirmModal;
