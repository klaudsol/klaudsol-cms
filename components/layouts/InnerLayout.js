
import { AppContent, AppSidebar, AppFooter, ApHeader } from '@/components/elements/inner/index';
const DefaultLayout = ({children}) => {
  
  
  
  return (
    
        <div>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      
            <div className="body flex-grow-1 px-3">
              <AppContent>
                    {children}
              </AppContent>
            </div>
            <AppFooter />
          </div>
        </div>
  
  )
}

export default DefaultLayout
