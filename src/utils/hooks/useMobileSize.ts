import useWindowSize from './useWindowSize';

function useMobileSize() {
  const { width = 0 } = useWindowSize();

  const isMobile = 600 > width;

  return isMobile;
}

export default useMobileSize;
