import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { Roboto } from "next/font/google"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../lib/theme"
import SiteHeader from "@/components/SiteHeader"
import { UserProvider } from "@auth0/nextjs-auth0/client"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable} style={{ minHeight: "100vh" }}>
        <UserProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <SiteHeader />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </UserProvider>
      </body>
    </html>
  )
}
