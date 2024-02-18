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
            content="KlaudSol CMS is a Headless and Serverless CMS (Content Management System). A great alternative to WordPress and Strapi."
          />
          <meta property="og:title" content="KlaudSol CMS" />
          <meta property="og:description" content="KlaudSol CMS is a Headless and Serverless CMS (Content Management System). A great alternative to WordPress and Strapi." /> 
          <meta property="og:image" content="https://klaudsol.com/assets/img/logo-180x180.png" />
          <meta property="og:url" content="https://github.com/klaudsol/klaudsol-cms" /> 
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
