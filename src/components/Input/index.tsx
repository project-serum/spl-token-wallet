import React from 'react';
import {
  RowContainer,
  Input,
  TextButton,
  SearchInput,
  Textarea,
  ContainerForIcon,
  Title,
} from '../../pages/commonStyles';
import Eye from '../../images/Eye.svg';
import ClosedEye from '../../images/ClosedEye.svg';
import Loupe from '../../images/Loupe.svg';
import Copy from '../../images/copy.svg';
import { useTheme } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const InputWithComponent = ({
  type,
  value,
  onChange,
  autofocus = false,
  placeholder,
  ComponentToShow,
  style
}: {
  type: string;
  value: string;
  onChange: any;
  autofocus?: boolean,
  placeholder: string;
  ComponentToShow: any;
  style?: any
}) => {
  return (
    <RowContainer style={{ position: 'relative', width: '90%' }}>
      <Input
        type={type}
        value={value}
        autoFocus={autofocus}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
      />
      <div
        style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {ComponentToShow}
      </div>
    </RowContainer>
  );
};

const SearchInputWithLoupe = ({
  type,
  value,
  onChange,
  placeholder,
  ComponentToShow,
}: {
  type: string;
  value: string;
  onChange: any;
  placeholder: string;
  ComponentToShow: any;
}) => {
  return (
    <RowContainer style={{ position: 'relative', width: '100%' }}>
      <SearchInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <div
        style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-40%)',
        }}
      >
        {ComponentToShow}
      </div>
    </RowContainer>
  );
};

const TextareaWithComponent = ({
  type,
  value,
  onChange,
  placeholder,
  ComponentToShow,
  height,
}: {
  type: string;
  value: string;
  onChange: any;
  placeholder: string;
  ComponentToShow: any;
  height: string;
}) => {
  return (
    <RowContainer style={{ position: 'relative', width: '100%' }}>
      <Textarea
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
      />
      <div
        style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <ContainerForIcon>{ComponentToShow}</ContainerForIcon>
      </div>
    </RowContainer>
  );
};

const TextareaWithCopy = ({
  onCopyClick,
  ...props
}: {
  height: string;
  type: string;
  value: string;
  onChange: any;
  placeholder: string;
  onCopyClick: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <TextareaWithComponent
      ComponentToShow={
        <img
          style={{
            padding: '1.6rem 2rem 1.4rem 2rem',
            cursor: 'pointer',
            height: '4.5rem',
          }}
          onClick={() => {
            onCopyClick()
            enqueueSnackbar("Copied!", { variant: 'success' });
          }}
          src={Copy}
          alt="copy"
        />
      }
      {...props}
    />
  );
};

const InputWithEye = ({
  showPassword,
  onEyeClick,
  ...props
}: {
  type: string;
  value: string;
  onChange: any;
  placeholder: string;
  showPassword: boolean;
  onEyeClick: () => void;
  style?: any
}) => {
  return (
    <InputWithComponent
      autofocus={true}
      ComponentToShow={
        <img
          style={{
            padding: '1.6rem 2rem 1.4rem 2rem',
            cursor: 'pointer',
            height: '4.5rem',
          }}
          onClick={onEyeClick}
          src={showPassword ? ClosedEye : Eye}
          alt="eye"
        />
      }
      {...props}
    />
  );
};

const InputWithPaste = ({
  onPasteClick,
  ...props
}: {
  type: string;
  value: string;
  onChange: any;
  placeholder: string;
  onPasteClick: () => void;
  style?: any
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <InputWithComponent
      ComponentToShow={
        <TextButton
          color={theme.customPalette.blue.new}
          onClick={() => {
            onPasteClick()
            enqueueSnackbar("Pasted!", { variant: 'success' });
          }}
          style={{ padding: '1.2rem 2rem' }}
        >
          Paste
        </TextButton>
      }
      {...props}
    />
  );
};

const InputWithMax = ({
  onMaxClick,
  maxText,
  ...props
}: {
  type: string;
  value: string;
  onChange: any;
  maxText: string;
  placeholder: string;
  onMaxClick: () => void;
  style?: any
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <InputWithComponent
      ComponentToShow={
        <>
        <Title fontSize={'1rem'} color={theme.customPalette.grey.dark}>Max:</Title>
        <TextButton
          color={theme.customPalette.blue.new}
          onClick={() => {
            onMaxClick()
            enqueueSnackbar("Set!", { variant: 'success' });
          }}
          style={{ padding: '1.2rem 2rem 1.2rem .5rem', whiteSpace: 'nowrap' }}
        >
          {maxText}
        </TextButton>
        </>
      }
      {...props}
    />
  );
};


const InputWithSearch = ({
  onSearchClick,
  ...props
}: {
  type: string;
  value: string;
  onChange: any;
  placeholder: string;
  onSearchClick: () => void;
}) => {
  return (
    <SearchInputWithLoupe
      ComponentToShow={
        <img
          style={{ padding: '.5rem', cursor: 'pointer' }}
          onClick={onSearchClick}
          src={Loupe}
          alt="search icon"
        />
      }
      {...props}
    />
  );
};

export { InputWithEye, InputWithPaste, InputWithMax, InputWithSearch, TextareaWithCopy };
export default InputWithComponent;
