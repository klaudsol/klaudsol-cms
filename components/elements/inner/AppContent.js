import  { Suspense, memo } from 'react';
import { CContainer, CSpinner } from '@coreui/react';

// routes config
//import { staticRoutes } from '../routes'

const AppContent = ({children}) => {
  
  /*
  const [routes, setRoutes] = useState(staticRoutes);
  
  useEffect(() => {
    (async () => {
      setRoutes(await getRoutes());  
    })();
  }, []);
  */
  
  return (
    <CContainer fluid>
      {children}
    </CContainer>
  )
}

export default memo(AppContent)
