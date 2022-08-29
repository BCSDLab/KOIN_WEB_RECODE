import { ToastContainer } from 'react-toastify';

const DEFAULT_CSS_FILE = 'react-toastify/dist/ReactToastify.css';
const MINIFIED_CSS_FILE = 'react-toastify/dist/ReactToastify.min.css';

if (process.env.NODE_ENV === 'development') {
  import(DEFAULT_CSS_FILE);
} else {
  import(MINIFIED_CSS_FILE);
}

function Toast() {
  return (
    <ToastContainer />
  );
}

export default Toast;
