import Image from "next/image";
import VideoUploader from './components/VideoUploader';

export default function Home() {
  return (
    <div className="mt-14 mb-6 md:mt-32 md:mb-12">
      <VideoUploader />
    </div>
  );
}
