import React from 'react';
import copy from 'clipboard-copy'
import {
  RowContainer,
  Input,
  TextButton,
  SearchInput,
  Textarea,
  ContainerForIcon,
  Title,
} from '../../pages/commonStyles';
import Image from './Image'
import Loupe from '../../images/Loupe.svg';
import Copy from '../../images/copy.svg';
import { useTheme } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const ImagesPath = {
  closedEye: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxOCAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjUgNi41QzExLjUgNy4xNjMwNCAxMS4yMzY2IDcuNzk4OTMgMTAuNzY3OCA4LjI2Nzc3QzEwLjI5ODkgOC43MzY2MSA5LjY2MzA0IDkgOSA5QzguMzM2OTYgOSA3LjcwMTA3IDguNzM2NjEgNy4yMzIyMyA4LjI2Nzc3QzYuNzYzMzkgNy43OTg5MyA2LjUgNy4xNjMwNCA2LjUgNi41QzYuNSA1LjgzNjk2IDYuNzYzMzkgNS4yMDEwNyA3LjIzMjIzIDQuNzMyMjNDNy43MDEwNyA0LjI2MzM5IDguMzM2OTYgNCA5IDRDOS42NjMwNCA0IDEwLjI5ODkgNC4yNjMzOSAxMC43Njc4IDQuNzMyMjNDMTEuMjM2NiA1LjIwMTA3IDExLjUgNS44MzY5NiAxMS41IDYuNVoiIGZpbGw9IiM5Njk5OUMiLz4KPHBhdGggZD0iTTEgNi41QzEgNi41IDQgMSA5IDFDMTQgMSAxNyA2LjUgMTcgNi41QzE3IDYuNSAxNCAxMiA5IDEyQzQgMTIgMSA2LjUgMSA2LjVaTTkgMTBDOS45MjgyNiAxMCAxMC44MTg1IDkuNjMxMjUgMTEuNDc0OSA4Ljk3NDg3QzEyLjEzMTMgOC4zMTg1IDEyLjUgNy40MjgyNiAxMi41IDYuNUMxMi41IDUuNTcxNzQgMTIuMTMxMyA0LjY4MTUgMTEuNDc0OSA0LjAyNTEzQzEwLjgxODUgMy4zNjg3NSA5LjkyODI2IDMgOSAzQzguMDcxNzQgMyA3LjE4MTUgMy4zNjg3NSA2LjUyNTEzIDQuMDI1MTNDNS44Njg3NSA0LjY4MTUgNS41IDUuNTcxNzQgNS41IDYuNUM1LjUgNy40MjgyNiA1Ljg2ODc1IDguMzE4NSA2LjUyNTEzIDguOTc0ODdDNy4xODE1IDkuNjMxMjUgOC4wNzE3NCAxMCA5IDEwWiIgZmlsbD0iIzk2OTk5QyIvPgo8cGF0aCBkPSJNMSAxMkwxNyAxIiBzdHJva2U9IiMzQTQ3NUMiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K",
  eye: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNiAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjUgNS41QzEwLjUgNi4xNjMwNCAxMC4yMzY2IDYuNzk4OTMgOS43Njc3NyA3LjI2Nzc3QzkuMjk4OTMgNy43MzY2MSA4LjY2MzA0IDggOCA4QzcuMzM2OTYgOCA2LjcwMTA3IDcuNzM2NjEgNi4yMzIyMyA3LjI2Nzc3QzUuNzYzMzkgNi43OTg5MyA1LjUgNi4xNjMwNCA1LjUgNS41QzUuNSA0LjgzNjk2IDUuNzYzMzkgNC4yMDEwNyA2LjIzMjIzIDMuNzMyMjNDNi43MDEwNyAzLjI2MzM5IDcuMzM2OTYgMyA4IDNDOC42NjMwNCAzIDkuMjk4OTMgMy4yNjMzOSA5Ljc2Nzc3IDMuNzMyMjNDMTAuMjM2NiA0LjIwMTA3IDEwLjUgNC44MzY5NiAxMC41IDUuNVoiIGZpbGw9IiM5Njk5OUMiLz4KPHBhdGggZD0iTTAgNS41QzAgNS41IDMgMCA4IDBDMTMgMCAxNiA1LjUgMTYgNS41QzE2IDUuNSAxMyAxMSA4IDExQzMgMTEgMCA1LjUgMCA1LjVaTTggOUM4LjkyODI2IDkgOS44MTg1IDguNjMxMjUgMTAuNDc0OSA3Ljk3NDg3QzExLjEzMTMgNy4zMTg1IDExLjUgNi40MjgyNiAxMS41IDUuNUMxMS41IDQuNTcxNzQgMTEuMTMxMyAzLjY4MTUgMTAuNDc0OSAzLjAyNTEzQzkuODE4NSAyLjM2ODc1IDguOTI4MjYgMiA4IDJDNy4wNzE3NCAyIDYuMTgxNSAyLjM2ODc1IDUuNTI1MTMgMy4wMjUxM0M0Ljg2ODc1IDMuNjgxNSA0LjUgNC41NzE3NCA0LjUgNS41QzQuNSA2LjQyODI2IDQuODY4NzUgNy4zMTg1IDUuNTI1MTMgNy45NzQ4N0M2LjE4MTUgOC42MzEyNSA3LjA3MTc0IDkgOCA5WiIgZmlsbD0iIzk2OTk5QyIvPgo8L3N2Zz4K",
}

const InputWithComponent = ({
  type = 'text',
  value,
  onChange,
  autoFocus = false,
  disabled = false,
  placeholder = '',
  ComponentToShow,
  style = {},
  containerStyle,
  autoComplete = "off",
  onKeyDown = () => {}
}: {
  type?: string;
  value: string;
  onChange: any;
  disabled?: boolean;
  autoFocus?: boolean,
  placeholder?: string;
  ComponentToShow: any;
  style?: any
  containerStyle?: any
  autoComplete?: string
  onKeyDown?: (e: any) => void
}) => {
  return (
    <RowContainer style={{ position: 'relative', width: '90%', ...containerStyle }}>
      <Input
        type={type}
        value={value}
        autoFocus={autoFocus}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
        autoComplete={autoComplete}
        disabled={disabled}
        onKeyDown={onKeyDown}
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
  containerStyle?: any
  autoComplete?: string
  onKeyDown?: (e: any) => void
}) => {
  return (
    <InputWithComponent
      autoFocus={true}
      ComponentToShow={
        <Image
          style={{
            padding: '1.6rem 2rem 1.4rem 2rem',
            cursor: 'pointer',
            height: '4.5rem',
          }}
          onClick={onEyeClick}
          src={showPassword ? ImagesPath.closedEye : ImagesPath.eye}
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
  type?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  value: string;
  onChange: any;
  placeholder: string;
  onPasteClick: () => void;
  style?: any
  autoComplete?: string
  containerStyle?: any
  onKeyDown?: (e: any) => void
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
  containerStyle?: any
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

const TextareaWithComponent = ({
  type = 'text',
  value,
  onChange = () => {},
  placeholder = '',
  ComponentToShow,
  height = '6rem',
  style = {}
}: {
  type?: string;
  value: any;
  onChange?: any;
  placeholder?: string;
  ComponentToShow: any;
  height?: string;
  style?: any
}) => {
  return (
    <RowContainer style={{ position: 'relative', width: '100%' }}>
      <Textarea
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
        style={style}
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
  onCopy,
  ...props
}: {
  height?: string;
  type?: string;
  value: any;
  onChange?: any;
  placeholder?: string;
  style?: any
  onCopy?: () => {}
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
            if (!!onCopy) {
              onCopy()
            } else {
              copy(props.value)
            }

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

export { InputWithEye, InputWithPaste, InputWithMax, InputWithSearch, TextareaWithCopy };
export default InputWithComponent;
