import PropTypes from 'prop-types';
import { useRef } from 'react';
import Button from '../button';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import styles from './css/file-modal.module.css';

export default function FileModal({
  children,
  title,
  buttonChildren,
  activeId,
  modalId,
  setActiveId,
  hasButton,
  modalCustomStyles = '',
  modalCloseButtonCustomStyles = '',
  on = false,
  done = false,
  hasChildModal = false,
  cleanUp = () => {},
}) {
  const ref = useRef();
  const isModalOpen = activeId === modalId;

  const open = () => setActiveId(modalId);
  const close = () => {
    cleanUp(false);
    setActiveId(-1);
  };

  useOnClickOutside(ref, close, done, on, hasChildModal);

  return (
    <>
      {hasButton && (
        <div>
          <Button type='button' size='lg' onClick={open} testId='btn__open__modal'>
            {buttonChildren}
          </Button>
        </div>
      )}

      {isModalOpen && (
        <dialog ref={ref} open={isModalOpen} className={`${modalCustomStyles}`}>
          <div className={`${styles.modal__header}`}>
            <div className={`${styles.btn__container}`}>
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

            <div>
              <h3>{title}</h3>
            </div>
          </div>

          <div>{children}</div>
        </dialog>
      )}
    </>
  );
}

FileModal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  title: PropTypes.string.isRequired,
  buttonChildren: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  activeId: PropTypes.number.isRequired,
  modalId: PropTypes.number.isRequired,
  setActiveId: PropTypes.func.isRequired,
  done: PropTypes.bool,
  on: PropTypes.bool,
  hasChildModal: PropTypes.bool,
  hasButton: PropTypes.bool.isRequired,
  modalCustomStyles: PropTypes.string,
  modalCloseButtonCustomStyles: PropTypes.string,
  cleanUp: PropTypes.func,
};
