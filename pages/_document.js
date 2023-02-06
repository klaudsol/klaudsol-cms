import Document, { Html, Head, Main, NextScript } from 'next/document'
import {GA_TRACKING_ID} from '@/lib/gtag';
class MyDocument extends Document {
  
  render() {
    return (
      
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="SME - Accounting, inventory, procurement, and payroll system specifically tailored for Philippine small and medium-scale businesses. Helping Pinoy small and medium-sized businesses achieve more."
          />
          <meta property="og:title" content="SME" />
          <meta property="og:description" content="SME - Accounting, inventory, procurement, and payroll system specifically tailored for Philippine small and medium-scale businesses." /> 
          <meta property="og:image" content="https://business.klaudsol.com/assets/img/bg/business-klaudsol-banner-1-6002bd50237c924e19744f5a92bea199.png" />
          <meta property="og:url" content="https://sme.klaudsol.app" /> 
          <meta property="og:type" content="website" />
          
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />

        {/* Global Site Tag (gtag.js) - Google Analytics */}   
          <script
             async
             src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
             />
           <script
             dangerouslySetInnerHTML={{
               __html: `
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', '${GA_TRACKING_ID}', {
               page_path: window.location.pathname,
             });
           `,
             }}
           />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="modal-root"></div>
        </body>
      </Html>
    )
  }
}

export default MyDocument