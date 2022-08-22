import styles from '@/styles/FrontPageLayout.module.scss';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '@/components/elements/inner/index';
import { useContext, useEffect } from 'react';
import ClientSessionHandler from '@/components/ClientSessionHandler';
const DefaultLayout = ({children}) => {
  
  
  
  return (
      <ClientSessionHandler>
        <div>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100 bg-light">
            <AppHeader />
            <div className="body flex-grow-1 px-3">
              <AppContent>
                    {children}
              </AppContent>
            </div>
            <AppFooter />
          </div>
        </div>
      </ClientSessionHandler>
  )
}

export default DefaultLayout
