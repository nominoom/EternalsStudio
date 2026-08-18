"use client";

import Script from "next/script";

export default function TawkWidget() {
  return (
    <>
      <div id="tawk_6a83c98f273ff73441178fb6" />
      <Script id="tawk-init" strategy="afterInteractive">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          Tawk_API.embedded='tawk_6a83c98f273ff73441178fb6';
        `}
      </Script>
      <Script
        id="tawk-script"
        src="https://embed.tawk.to/6a83c98f273ff73441178fb6/1k09dlj5s"
        strategy="afterInteractive"
        crossOrigin={"*" as any}
      />
    </>
  );
}
