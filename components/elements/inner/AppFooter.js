import { memo } from 'react'
import { CFooter, CImage } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        
        <span className="ms-1"><CImage className='footer-logo' src='/sme-logo-no-border.png' width={15} align='start'/> SME &copy; 2021 - 2022 <a href="https://klaudsol.com" target="_blank" rel="noopener noreferrer">KlaudSol Apps</a>.</span>
        
      </div>
      {/*
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI for React
        </a>
      </div>
      */}
    </CFooter>
  )
}

export default memo(AppFooter)
