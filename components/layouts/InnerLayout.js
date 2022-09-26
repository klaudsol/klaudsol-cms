
import { AppContent, AppSidebar } from '@/components/elements/inner/index';
import ContentManagerSubMenu from '@/components/elements/inner/ContentManagerSubMenu';
import ContentBuilderSubMenu from '@/components/elements/inner/ContentBuilderSubMenu';
import ClientSessionHandler from '@/components/ClientSessionHandler';
const DefaultLayout = ({children, title}) => {
  return (
    <ClientSessionHandler>
    <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
      <AppSidebar />
      {title === 'Content' && <ContentManagerSubMenu title={title} />}
      {title === 'Content-Type Builder' && <ContentBuilderSubMenu title={title} />}
      <div className="wrapper d-flex flex-column min-vh-100 w-100 mx-0 px-0">
      <div className="body flex-grow-1 px-5">
              <AppContent>
                    {children}
              </AppContent>
            </div>
     
      </div>
  </div>
  </ClientSessionHandler>
  )
} 

export default DefaultLayout
