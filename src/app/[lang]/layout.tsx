import 'finallyreact/main.css';
import './app.scss';
import Layout from '@/components/Layout';

/**
 * Root layout that applies to all pages
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
