// Public layout — header + footer added in Phase 9
import Script from "next/script";
import { WhatsAppWidget } from "@/components/public/whatsapp-widget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <WhatsAppWidget />
      <Script
        id="mylivechat"
        strategy="lazyOnload"
        src="https://mylivechat.com/chatinline.aspx?hccid=29160935"
        data-cfasync="false"
      />
    </>
  );
}
