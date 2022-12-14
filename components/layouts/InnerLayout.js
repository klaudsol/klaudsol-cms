import { AppContent, AppSidebar } from '@/components/elements/inner/index';
import ClientSessionHandler from '@/components/ClientSessionHandler';
import ContentManagerSubMenu from 'components/elements/inner/ContentManagerSubMenu';
const DefaultLayout = ({children}) => {
  return (
    <ClientSessionHandler>
        <AppSidebar />

        <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
          <ContentManagerSubMenu title='Content'/>
            <div className="body flex-grow-1 px-3 main-container">
              <AppContent>
                    {children}
              </AppContent>
        </div>
        </div>
  </ClientSessionHandler>
  )
} 

export default DefaultLayout
