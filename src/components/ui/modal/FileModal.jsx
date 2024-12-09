import PropTypes from 'prop-types';
import { useRef } from 'react';
import Button from '../button';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

export default function FileModal({
  children,
  title,
  buttonChildren,
  activeId,
  modalId,
  setActiveId,
  done,
  on,
}) {
  const ref = useRef();
  const isModalOpen = activeId === modalId;

  const open = () => setActiveId(modalId);
  const close = () => {
    setActiveId(-1);
  };

  useOnClickOutside(ref, close, done, on);

  return (
    <>
      <div>
        <Button type='button' size='lg' onClick={open} testId='btn__open__modal'>
          {buttonChildren}
        </Button>
      </div>

      <div>
        {isModalOpen && (
          <dialog ref={ref} open={isModalOpen}>
            <div>
              <div>
                <h3>{title}</h3>
              </div>

              <div>
                <Button type='button' size='xxs' onClick={close} testId='btn__close__modal'>
                  X
                </Button>
              </div>
            </div>

            <div>{children}</div>
          </dialog>
        )}
      </div>
    </>
  );
}

FileModal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  title: PropTypes.string.isRequired,
  buttonChildren: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  activeId: PropTypes.number.isRequired,
  modalId: PropTypes.number.isRequired,
  setActiveId: PropTypes.func.isRequired,
  done: PropTypes.bool,
  on: PropTypes.bool,
};
