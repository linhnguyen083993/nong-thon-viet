import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      {children}
      <Footer settings={settings} />
    </>
  );
}
