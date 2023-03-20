import { AppContent, AppSidebar } from '@/components/elements/inner/index';
import ClientSessionHandler from '@/components/ClientSessionHandler';
import ContentBuilderSubMenu from 'components/elements/inner/ContentBuilderSubMenu';
const ContentTypeBuilderLayout = ({children, currentTypeSlug}) => {
  return (
    <ClientSessionHandler>
        <AppSidebar />

        <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
        {/* <ContentBuilderSubMenu title='Content-Type Builder' currentTypeSlug={currentTypeSlug} /> */}
            <div className="body flex-grow-1 px-5">
              <AppContent>
                    {children}
              </AppContent>
        </div>
        </div>
  </ClientSessionHandler>
  )
} 

export default ContentTypeBuilderLayout
