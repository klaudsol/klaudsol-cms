import { AppContent, AppSidebar } from '@/components/elements/inner/index';
import ClientSessionHandler from '@/components/ClientSessionHandler';
const DefaultLayout = ({children}) => {
  return (
    <ClientSessionHandler>

      <AppSidebar />

      <div className="wrapper d-flex flex-column min-vh-100 w-100 mx-0 px-0">
      <div className="body flex-grow-1 px-5">
              <AppContent>
                    {children}
              </AppContent>
            </div>
     
      </div>

  </ClientSessionHandler>
  )
} 

export default DefaultLayout
