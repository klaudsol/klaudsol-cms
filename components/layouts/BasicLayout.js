
import { AppContent, AppSidebar } from '@/components/elements/inner/index';
const BasicLayout = ({children}) => {
  return (
    <div>
      <AppSidebar />
      <div class="wrapper d-flex flex-column min-vh-100">
      <div className="body flex-grow-1 px-3">
              <AppContent>
                    {children}
              </AppContent>
            </div>
     
      </div>
  </div>
  )
}

export default BasicLayout
