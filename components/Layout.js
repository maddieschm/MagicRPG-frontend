// components/Layout.js
import Head from 'next/head';

export default function Layout({ children, title = 'Magic RPG Character Creator' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Interactive Character Sheet for Magic RPG" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout-container">
        <header className="main-header">
          <h1 className="site-title">Magic RPG</h1>
        </header>

        <main className="main-content">
          {children}
        </main>

        <footer className="main-footer">
          <p>&copy; {new Date().getFullYear()} Magic RPG. All rights reserved.</p>
        </footer>
      </div>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #1a1a2e;
          color: #e0e0e0;
          background-image: radial-gradient(at 50% 100%, rgba(30, 30, 60, 0.5), rgba(20, 20, 40, 0.8)), 
                            linear-gradient(to bottom, #1a1a2e, #0a0a1a);
          background-attachment: fixed;
          background-size: cover;
        }

        * {
          box-sizing: border-box;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #2a2a4a;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }

        .layout-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .main-header {
          background-color: rgba(30, 30, 50, 0.9);
          color: #e0e0e0;
          padding: 15px 20px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(80, 80, 120, 0.5);
        }
        .site-title {
            font-size: 2.8em;
            margin: 0;
            text-shadow: 0 0 10px rgba(100, 150, 255, 0.6);
            letter-spacing: 2px;
        }

        .main-content {
          flex-grow: 1;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 1;
          position: relative;
        }

        .main-footer {
          background-color: rgba(30, 30, 50, 0.9);
          color: #b0b0b0;
          padding: 15px;
          text-align: center;
          font-size: 0.8em;
          box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.4);
          border-top: 1px solid rgba(80, 80, 120, 0.5);
        }
      `}</style>
    </>
  );
}