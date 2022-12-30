import { AppContent, AppSidebar } from '@/components/elements/inner/index';
import ClientSessionHandler from '@/components/ClientSessionHandler';
import ContentManagerSubMenu from 'components/elements/inner/ContentManagerSubMenu';

export default function InnerSingleLayout ({children}) {
  return (
    <ClientSessionHandler>
        <AppSidebar />

        <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
            <div className="body flex-grow-1 main-container main-container__single">
              <AppContent>
                    {children}
              </AppContent>
        </div>
        </div>
  </ClientSessionHandler>
  )
} 

