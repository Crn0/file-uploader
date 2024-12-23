import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import Fieldset from '../../components/ui/form/Fieldset';
import Label from '../../components/ui/form/Label';
import Input from '../../components/ui/form/Input';
import File from '../../components/ui/form/File';
import Button from '../../components/ui/button';
import styles from './css/resource-form.module.css';

export default function ResourceForm({
  action,
  method,
  intent,
  setState,
  folderId,
  labelName,
  inputFieldId,
  buttonFieldId,
  buttonSize,
  buttonText,
  testId,
  type,
  formCustomStyles = '',
  inputPlaceHolder = '',
  buttonCustomStyles = '',
}) {
  const fetcher = useFetcher();
  const fileRef = useRef();
  const [fileName, setFileName] = useState('');

  const isLoading = fetcher.state === 'submitting';

  const onKeyDown = (e) => {
    if (e.code === 'Enter') fileRef.current.click();
  };

  useEffect(() => {
    if (fetcher.data) {
      setState((prev) => {
        const data = fetcher.data[1];
        const key = Object.keys(data).toLocaleString();
        return [...prev, { ...data[key] }];
      });
    }
  }, [fetcher, setState]);

  if (type === 'folder')
    return (
      <fetcher.Form action={action} method={method} className={formCustomStyles}>
        <Fieldset id={inputFieldId}>
          <Input type='hidden' name='intent' value={intent} autoComplete='off' />
          <Input type='hidden' name='folderId' value={folderId} autoComplete='off' />
          <Label>
            <Input
              type='text'
              name='name'
              autoComplete='off'
              placeholder={inputPlaceHolder}
              uncontrolled
            />
          </Label>
        </Fieldset>
        <Fieldset id={buttonFieldId}>
          {(() => {
            if (isLoading)
              return (
                <Button
                  type='button'
                  size={buttonSize}
                  isLoading={isLoading}
                  disabled={isLoading}
                  testId={testId}
                  customStyles={`${buttonCustomStyles}`}
                >
                  {buttonText}
                </Button>
              );

            return (
              <Button
                type='submit'
                size={buttonSize}
                testId={testId}
                customStyles={`${buttonCustomStyles}`}
              >
                {buttonText}
              </Button>
            );
          })()}
        </Fieldset>
      </fetcher.Form>
    );

  return (
    <fetcher.Form
      action={action}
      method={method}
      encType='multipart/form-data'
      className={formCustomStyles}
    >
      <Fieldset id={inputFieldId}>
        <Input type='hidden' name='intent' value={intent} autoComplete='off' />
        <Input type='hidden' name='folderId' value={folderId} autoComplete='off' />
        <Label name={labelName} onKeyDown={onKeyDown} tab>
          {(() => {
            if (!fileName) return null;

            return <p>{fileName}</p>;
          })()}
          <File
            ref={fileRef}
            name='file'
            filesAccept='.png, .jpeg, .jpg, .webp, .epub'
            customStyles={`${styles.file}`}
            onKeyDown={(e) => setFileName(e.target.files[0].name)}
            onChange={(e) => setFileName(e.target.files[0].name)}
          />
        </Label>
      </Fieldset>
      <Fieldset id={buttonFieldId}>
        {(() => {
          if (isLoading)
            return (
              <Button
                type='button'
                size={buttonSize}
                isLoading={isLoading}
                disabled={isLoading}
                testId={testId}
                customStyles={`${buttonCustomStyles}`}
              >
                {buttonText}
              </Button>
            );

          return (
            <Button
              type='submit'
              size={buttonSize}
              testId={testId}
              customStyles={`${buttonCustomStyles}`}
            >
              {buttonText}
            </Button>
          );
        })()}
      </Fieldset>
    </fetcher.Form>
  );
}

ResourceForm.propTypes = {
  action: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  intent: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  labelName: PropTypes.string,
  inputFieldId: PropTypes.string.isRequired,
  folderId: PropTypes.string.isRequired,
  buttonFieldId: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  buttonSize: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['folder', 'file']).isRequired,
  formCustomStyles: PropTypes.string,
  inputPlaceHolder: PropTypes.string,
  buttonCustomStyles: PropTypes.string,
};
