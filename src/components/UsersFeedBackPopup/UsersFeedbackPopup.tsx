import React, { useState } from 'react';

import { Theme } from '@material-ui/core';

import CloseIcon from '../../images/closeIcon.svg';
import CoolIcon from '../../images/Emoji.svg';
import DialogForm from '../../pages/Wallet/components/DialogForm';
import {
  BlueButton,
  Form,
  Line,
  StyledLabel,
  StyledPaper,
  StyledTextArea,
  SubmitButton,
  TextField,
} from './styles';
import {
  Row,
  RowContainer,
  StyledRadio,
  Title,
  WhiteButton,
} from '../../pages/commonStyles';
import { Text } from './styles';
import { useSnackbar } from 'notistack';
import { encode } from '../../utils/utils';
import useMobileSize from '../../utils/hooks/useMobileSize';

export const FeedbackPopup = ({
  theme,
  onClose,
  open,
}: {
  theme: Theme;
  onClose: () => void;
  open: boolean;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isFeedbackSubmitted, submitFeedback] = useState(false);
  const [isProblemReport, setIsProblemReport] = useState(true);

  const [feedbackWalletData, setFeedbackWalletData] = useState({
    message: '',
    contact: '',
  });

  const isMobile = useMobileSize();

  const setData = ({ fieldName, value }) => {
    return setFeedbackWalletData({ ...feedbackWalletData, [fieldName]: value });
  };

  const handleSubmit = (e) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'walletFeedback',
        ...feedbackWalletData,
      }),
    })
      .then(() => {
        submitFeedback(true);
        console.log('Success!');
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar('Something went wrong, please try again.', {
          variant: 'error',
        });
      });

    e.preventDefault();
  };

  const isDisabled = isProblemReport
    ? feedbackWalletData.message === '' || feedbackWalletData.contact === ''
    : feedbackWalletData.message === '';

  return (
    <DialogForm
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      onEnter={() => {
        submitFeedback(false);
        setFeedbackWalletData({
          message: '',
          contact: '',
        });
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        style={{ marginBottom: '2rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <Title fontSize={'2.8rem'}>
          {isFeedbackSubmitted
            ? 'Feedback Submitted'
            : 'We value your feedback!'}
        </Title>
        <img
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer', display: isMobile ? 'none' : 'auto' }}
          alt={'close'}
          width={'5%'}
          height={'auto'}
        />
      </RowContainer>
      {isFeedbackSubmitted ? (
        <RowContainer
          direction={'column'}
          justify={isMobile ? 'space-around' : 'center'}
        >
          <img
            src={CoolIcon}
            width={isMobile ? '17rem' : '9rem'}
            height={isMobile ? '19rem' : '10rem'}
            style={{ marginTop: isMobile ? '15rem' : '6rem' }}
            alt={'cool'}
          />
          <Text
            style={{
              width: '50%',
              marginTop: isMobile ? '6rem' : '2rem',
              textAlign: 'center',
              whiteSpace: 'normal',
              fontSize: isMobile ? '2rem' : '1.5rem',
              padding: '0 1rem 0 0',
            }}
          >
            {isProblemReport
              ? 'Thank you for your feedback, please allow support team 24 hours to respond.'
              : 'Thank you for your feedback, we will review it shortly and take action.'}
          </Text>
          <BlueButton
            isMobile={isMobile}
            style={{
              width: '100%',
              margin: isMobile ? '15rem 0 0 0' : '6rem 0 0 0',
            }}
            disabled={false}
            theme={theme}
            onClick={() => {
              submitFeedback(false);
              onClose();
            }}
          >
            Ok
          </BlueButton>
        </RowContainer>
      ) : (
        <Form
          onSubmit={handleSubmit}
          name="walletFeedback"
          data-netlify="true"
          method={'post'}
          action="/success"
        >
          <input type="hidden" name="form-name" value="walletFeedback" />
          <RowContainer>
            <Row justify="flex-start" width={'50%'}>
              <StyledRadio
                theme={theme}
                checked={isProblemReport}
                onChange={() => {
                  setIsProblemReport(true);
                }}
                id="problem-report-btn"
                style={{ padding: '1rem 1rem 1rem 0' }}
              />
              <StyledLabel htmlFor="problem-report-btn">
                I want to report a problem.
              </StyledLabel>
            </Row>
            <Row justify="flex-end" width={'50%'}>
              <StyledRadio
                theme={theme}
                checked={!isProblemReport}
                onChange={() => {
                  setIsProblemReport(false);
                }}
                id="idea-suggest-btn"
                style={{ padding: '1rem 1rem 1rem 0' }}
              />
              <StyledLabel htmlFor="idea-suggest-btn">
                I want to suggest an idea.
              </StyledLabel>
            </Row>
          </RowContainer>
          <RowContainer direction={'column'} margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                {isProblemReport
                  ? 'Tell us your problem'
                  : 'Tell us how we can improve'}{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <StyledTextArea
                height={'20rem'}
                type="text"
                name="message"
                id="message"
                autoComplete="off"
                theme={theme}
                placeholder={'Message'}
                value={feedbackWalletData.message}
                onChange={(e) =>
                  setData({
                    fieldName: 'message',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer direction={'column'} margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                {isProblemReport
                  ? 'How we can contact you to help?'
                  : 'Would you like a representative to contact you? (optional)'}{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                type="text"
                name="contact"
                id="contact"
                autoComplete="off"
                theme={theme}
                placeholder={'Specify a way to contact you'}
                value={feedbackWalletData.contact}
                onChange={(e) =>
                  setData({
                    fieldName: 'contact',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer justify={isMobile ? 'space-between' : 'center'}>
            {isMobile ? (
              <WhiteButton
                style={{
                  width: '48%',
                  height: '4.5rem',
                  marginTop: '4rem',
                  fontSize: '1.5rem',
                }}
                theme={theme}
                onClick={onClose}
              >
                Cancel
              </WhiteButton>
            ) : null}
            <SubmitButton
              isDisabled={isDisabled}
              disabled={isDisabled}
              theme={theme}
              type="submit"
            >
              Submit
            </SubmitButton>
          </RowContainer>
        </Form>
      )}
    </DialogForm>
  );
};
