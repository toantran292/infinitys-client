
import React from "react";
import type { FC } from "react";
import { cx } from "../../utils";
import { Dialog } from "@radix-ui/react-dialog";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
  zIndex?: number;
  backdropClassName?: string;
}

export const Modal: FC<ModalProps> = ({
                                        opened,
                                        onClose,
                                        children,
                                        panelClassName,
                                        zIndex = 50,
                                        backdropClassName
                                      }) => {
  return (
    <Dialog
      className="relative"
      onClose={onClose}
      open={opened}
      style={{
        zIndex
      }}
    >
      <div
        aria-hidden="true"
        className={cx("fixed inset-0 bg-alpha-400", backdropClassName)}
      />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel
          className={cx("rounded-lg bg-background-1000", panelClassName)}
        >
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
