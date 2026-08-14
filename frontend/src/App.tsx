import { type FC } from 'react';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes/Routes';

const App: FC = () => {
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 2500,
        }}
      />
      <ScrollToTop />
      <AppRoutes />
    </>
  )
}

export default App
