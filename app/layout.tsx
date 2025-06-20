import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/utils/siteConfig";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Providers } from "./Providers";
import MindLayout from "@/components/mindLayout/MindLayout";
import { Suspense } from "react";
import { isMainnetio } from "@/sdk/utils";
import dynamic from "next/dynamic";

export const metadata: Metadata = siteConfig;

const VConsoleLoader = dynamic(() => import("@/components/VConsoleLoader"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              hashed: false,
              token: {
                fontFamily: "Montserrat",
                colorPrimary: "#00FFB1",
              },
              components: {
                Table: {
                  headerBorderRadius: 10,
                  headerColor: "#fff",
                },
              },
            }}
          >
            <Providers>
              {isMainnetio() ? <VConsoleLoader /> : null}
              <Suspense>
                <MindLayout>{children}</MindLayout>
              </Suspense>
            </Providers>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
