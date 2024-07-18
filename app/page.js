import Image from "next/image";
import VideoUploader from './components/VideoUploader';

export default function Home() {
  return (
    <div className="mt-32 mb-12">
      <VideoUploader />
    </div>
  );
}
