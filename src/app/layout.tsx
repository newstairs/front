import Header from "./_components/header/header";
import "./styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}
