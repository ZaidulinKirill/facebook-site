/* eslint-disable react/no-danger */
import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  styled,
} from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { FormContext, FormHandlerContext, SiteContext } from '../../../contexts';
import { Components } from '..';

const FormBase = styled(ValidatorForm)({});

const { REACT_APP_API_URL } = process.env;

function findFields(children) {
  return children.map((child) => [
    child,
    ...typeof child.content === 'object' && child.length
      ? findFields(child.content)
      : [],
  ]).flat(Number.MAX_SAFE_INTEGER);
}

const getDefaultExtension = async (mimeType) => {
  const response = await fetch(`/api/mime?mime=${mimeType}`, {
    method: 'get',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const { extension } = await response.json();

  return extension;
};

export const Form = ({ $context: { element, pageVariables }, ...props }) => {
  const { site: { id: siteId, language } } = useContext(SiteContext);
  const formHandler = useContext(FormHandlerContext);
  const [formField] = element.content[0].content;
  const allFields = findFields(pageVariables[formField.ref]);
  const fields = allFields.filter((x) => !!x.name);
  const submitButton = allFields.find((x) => x.type === 'form-submit-button');
  const defaultItem = (formHandler ? formHandler.defaultItem : null) || {};
  const defaultState = Object.assign({}, ...fields.map((field) => ({
    [field.name]: defaultItem[field.name] || field.default || Components[field.type].defaultFieldValue,
  })));

  const [formModuleId] = formField.ref.split('_');
  const requiredFieldMessage = pageVariables[`${formModuleId}_requiredFieldMessage`];

  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [item, setItem] = useState(defaultState);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async () => {
    setIsSaving(true);

    try {
      const itemToSend = { ...item };
      const files = Object.entries(item).filter(([_, value]) => value && value.startsWith && value.startsWith('blob:'));

      await Promise.all(files.map(async ([field, value]) => {
        const blob = await fetch(value).then((r) => r.blob());

        const formData = new FormData();
        const extension = await getDefaultExtension(blob.type);
        formData.append('file', blob, `file.${extension}`);

        const response = await fetch('/api/uploads', {
          body: formData,
          method: 'post',
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();

        if (blob.type.startsWith('audio')) {
          const convertationResponse = await fetch(`/api/recordings/convert/${data.id}`, {
            method: 'post',
          });

          if (!convertationResponse.ok) {
            throw new Error(await convertationResponse.text());
          }

          const { id: fileId } = await convertationResponse.json();

          itemToSend[field] = fileId;
        } else {
          itemToSend[field] = data.id;
        }
      }));

      if (submitButton.isManual) {
        await formHandler?.submit({ ...itemToSend, siteId });
      } else {
        try {
          const response = await fetch(`${REACT_APP_API_URL}/form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form: formField.ref.split('_')[formField.ref.split('_').length - 1],
              data: itemToSend,
              siteId,
              languageId: language.id,
              formModuleId,
            }),
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }

          setIsDialogOpened(true);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }

    setIsSaving(false);
  };

  const setField = (key, value) => {
    setItem({
      ...item,
      [key]: value,
    });
  };

  return (
    <FormContext.Provider value={{ form: { ...formField, id: formModuleId, fields: { requiredFieldMessage } }, item, setField, isSaving }}>
      {submitButton.successMessage && (
        <Dialog
          open={isDialogOpened}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {submitButton.successMessageTitle && (
            <DialogTitle id="alert-dialog-title">
              {submitButton.successMessageTitle}
            </DialogTitle>
          )}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div dangerouslySetInnerHTML={{ __html: submitButton.successMessage }} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => window.location.reload()} autoFocus>
              {submitButton.successMessageButtonText || 'OK'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {errorMessage && (
        <Dialog
          open={!!errorMessage}
          onClose={() => setErrorMessage(null)}
        >
          <DialogTitle id="alert-dialog-title">
            Error
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setErrorMessage(null)} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <FormBase onSubmit={onSubmit} {...props} />
    </FormContext.Provider>
  );
};
