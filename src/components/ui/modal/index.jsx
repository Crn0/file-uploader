import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import Button from '../button';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

export default function Modal({
  children,
  title,
  buttonText,
  on,
  done,
  cleanup = () => {},
  shouldOpen = false,
  needButton = true,
  hasChild = false,
  buttonCustomStyles = '',
  dialogCustomStyles = '',
  dialogContainerCustomStyles = '',
  dialogTopCustomStyles = '',
  dialogBottomCustomStyles = '',
  modalButtonContainerCustomStyles = '',
  modalCloseButtonCustomStyles = '',
}) {
  const ref = useRef();
  const [isModalOpen, setModalOpen] = useState(shouldOpen);

  const open = () => setModalOpen(true);
  const close = () => {
    setModalOpen(false);
    cleanup();
  };

  useOnClickOutside(ref, close, on, done, hasChild);
  return (
    <>
      {needButton && (
        <div>
          <Button
            type='button'
            size='lg'
            onClick={open}
            testId='btn__open__modal'
            customStyles={buttonCustomStyles}
          >
            {buttonText}
          </Button>
        </div>
      )}
      {isModalOpen && (
        <div className={`${dialogContainerCustomStyles}`}>
          <dialog className={`${dialogCustomStyles}`} ref={ref} open>
            <div className={`${dialogTopCustomStyles}`}>
              <div>
                <h3>{title}</h3>
              </div>

              <div className={`${modalButtonContainerCustomStyles}`}>
                <Button
                  type='button'
                  size='xxs'
                  onClick={close}
                  testId='btn__close__modal'
                  customStyles={`${modalCloseButtonCustomStyles}`}
                >
                  X
                </Button>
              </div>
            </div>

            <div className={`${dialogBottomCustomStyles}`}>{children}</div>
          </dialog>
        </div>
      )}
    </>
  );
}

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  done: PropTypes.bool,
  on: PropTypes.bool,
  cleanup: PropTypes.func,
  shouldOpen: PropTypes.bool,
  needButton: PropTypes.bool,
  hasChild: PropTypes.bool,
  buttonCustomStyles: PropTypes.string,
  dialogCustomStyles: PropTypes.string,
  dialogContainerCustomStyles: PropTypes.string,
  dialogTopCustomStyles: PropTypes.string,
  dialogBottomCustomStyles: PropTypes.string,
  modalButtonContainerCustomStyles: PropTypes.string,
  modalCloseButtonCustomStyles: PropTypes.string,
};
