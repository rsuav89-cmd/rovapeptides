import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { CoaViewer } from "@/components/CoaViewer";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Certificate of Analysis Lookup — RovaPeptides",
  description:
    "Look up the third-party Certificate of Analysis for any RovaPeptides batch by entering the batch number printed on your vial.",
};
export default function CoasPage() {
  return (
    <>
    <NoticeBar />
    <Header />
    <CoaViewer />
    <Footer />
    </>
    );
}

  
