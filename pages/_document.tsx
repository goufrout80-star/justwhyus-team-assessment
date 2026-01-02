import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    arabic: ['Noto Kufi Arabic', 'sans-serif'],
                  },
                  colors: {
                    brand: {
                      primary: '#849A92',
                      secondary: '#3F6967',
                      accent: '#28E8B5',
                      dark: '#063738',
                      darker: '#09201E',
                      surface: '#F5F7F6',
                    }
                  },
                  animation: {
                    'fade-in': 'fadeIn 0.5s ease-out',
                  },
                  keyframes: {
                    fadeIn: {
                      '0%': { opacity: '0', transform: 'translateY(10px)' },
                      '100%': { opacity: '1', transform: 'translateY(0)' },
                    }
                  }
                },
              },
            }
          `
        }} />
        <style>{`
          body {
            background-color: #F5F7F6;
            color: #09201E;
            -webkit-font-smoothing: antialiased;
          }
          input, textarea, button { transition: all 0.2s ease-in-out; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #F5F7F6; }
          ::-webkit-scrollbar-thumb { background: #849A92; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #3F6967; }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}