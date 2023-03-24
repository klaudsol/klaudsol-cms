import { AppContent, AppSidebar } from '@/components/elements/inner/index';
import ClientSessionHandler from '@/components/ClientSessionHandler';
const ContentTypeBuilderLayout = ({children, currentTypeSlug}) => {
  return (
    <ClientSessionHandler>
        <AppSidebar />

        <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
            <div className="body flex-grow-1 px-5 main-container">
              <AppContent>
                    {children}
              </AppContent>
        </div>
        </div>
  </ClientSessionHandler>
  )
} 

export default ContentTypeBuilderLayout
