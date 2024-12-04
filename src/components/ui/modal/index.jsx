import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import Button from '../button';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

export default function Modal({ children, title, buttonText }) {
  const ref = useRef();
  const [isModalOpen, setModalOpen] = useState(false);

  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  useOnClickOutside(ref, close);

  return (
    <>
      {(() => {
        if (!isModalOpen) {
          return (
            <Button type='button' size='lg' onClick={open} testId='btn__open__modal'>
              {buttonText}
            </Button>
          );
        }

        return (
          <div>
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
          </div>
        );
      })()}
    </>
  );
}

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};
