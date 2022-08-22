import { CBreadcrumb, CBreadcrumbItem, CRow, CCol } from '@coreui/react';
import SMESkeleton from '@sme/SMESkeleton';

const SMEBreadcrumb = ({paths, className, loading}) => {
  
    return (
      <CRow>
        <CCol xs={12} md={6}>
  
          { loading && (
            <SMESkeleton className={className} />
          )}
          {!loading &&
          <CBreadcrumb className="mb-3 ms-2 sme-col">
            {paths.map(([breadcrumbLabel, breadcrumbPath], index) => {
              return (
                <CBreadcrumbItem
                  key={index}
                  {...(paths.length - 1 === index ? {active: true} : {href: `#${breadcrumbPath}`})}
                >
                  {breadcrumbLabel}
                </CBreadcrumbItem>
              )
            })}
          </CBreadcrumb>
          }
      
        </CCol>
      
      </CRow>
    );
};

export default SMEBreadcrumb;